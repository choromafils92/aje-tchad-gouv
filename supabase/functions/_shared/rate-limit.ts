import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
  endpoint: string;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get rate limiting settings
  const { data: settings } = await supabase
    .from('security_settings')
    .select('setting_value')
    .eq('setting_key', 'rate_limiting')
    .single();

  if (!settings?.setting_value?.enabled) {
    return { allowed: true, remaining: config.maxRequests, resetAt: new Date() };
  }

  const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

  // Get or create rate limit tracking
  const { data: existing, error: fetchError } = await supabase
    .from('rate_limit_tracking')
    .select('*')
    .eq('identifier', identifier)
    .eq('endpoint', config.endpoint)
    .gte('window_start', windowStart.toISOString())
    .maybeSingle();

  if (fetchError) {
    console.error('Rate limit fetch error:', fetchError);
    // Fail open in case of error
    return { allowed: true, remaining: config.maxRequests, resetAt: new Date() };
  }

  if (!existing) {
    // Create new tracking entry
    await supabase
      .from('rate_limit_tracking')
      .insert({
        identifier,
        endpoint: config.endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000)
    };
  }

  // Check if limit exceeded
  if (existing.request_count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMinutes * 60 * 1000)
    };
  }

  // Increment counter
  await supabase
    .from('rate_limit_tracking')
    .update({
      request_count: existing.request_count + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', existing.id);

  return {
    allowed: true,
    remaining: config.maxRequests - existing.request_count - 1,
    resetAt: new Date(new Date(existing.window_start).getTime() + config.windowMinutes * 60 * 1000)
  };
}

export function getRateLimitHeaders(result: { remaining: number; resetAt: Date }) {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
    'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString()
  };
}
