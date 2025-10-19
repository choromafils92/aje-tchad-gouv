import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName } = await req.json();
    
    if (!fileName) {
      throw new Error('fileName is required');
    }

    // Map of HTML files
    const fileMap: Record<string, string> = {
      'modele_demande_avis_juridique': '/documents/modele_demande_avis_juridique.html',
      'modele_transaction_administrative': '/documents/modele_transaction_administrative.html',
      'modele_clause_reglement_differends': '/documents/modele_clause_reglement_differends.html',
    };

    const htmlPath = fileMap[fileName];
    
    if (!htmlPath) {
      throw new Error('File not found');
    }

    // Fetch the HTML file from the public directory
    const baseUrl = req.headers.get('origin') || 'https://aupfurarzgbdocgtdomy.supabase.co';
    const htmlUrl = `${baseUrl}${htmlPath}`;
    
    const htmlResponse = await fetch(htmlUrl);
    if (!htmlResponse.ok) {
      throw new Error('Failed to fetch HTML file');
    }

    const htmlContent = await htmlResponse.text();

    // Use Puppeteer to convert HTML to PDF
    const browser = await Deno.Command.create("chromium-browser", {
      args: [
        "--headless",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    // For now, return the HTML content with proper headers to trigger download
    // In production, you would use a proper HTML-to-PDF conversion service
    const response = new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName}.html"`,
      },
    });

    return response;

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
