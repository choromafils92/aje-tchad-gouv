import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    // Fetch the HTML file
    const baseUrl = req.headers.get('origin') || 'https://c741ce1c-fb18-4c82-ab7a-9b6164f8d5f9.lovableproject.com';
    const htmlUrl = `${baseUrl}${htmlPath}`;
    
    const htmlResponse = await fetch(htmlUrl);
    if (!htmlResponse.ok) {
      throw new Error('Failed to fetch HTML file');
    }

    const htmlContent = await htmlResponse.text();

    // Use chrome-aws-lambda for PDF generation
    // Import dynamically to reduce cold start time
    const puppeteerCore = await import('https://deno.land/x/puppeteer@16.2.0/mod.ts');
    
    // Launch browser with minimal options for Deno Deploy
    const browser = await puppeteerCore.default.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      await browser.close();

      // Return PDF
      return new Response(pdfBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}.pdf"`,
        },
      });
    } catch (error) {
      await browser.close();
      throw error;
    }

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
