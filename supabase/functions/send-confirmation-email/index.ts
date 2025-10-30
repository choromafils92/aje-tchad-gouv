import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'contact' | 'avis' | 'consultation' | 'signalement';
  email: string;
  nom: string;
  reference: string;
  data?: any;
}

const getEmailContent = (type: string, nom: string, reference: string, data?: any) => {
  const baseContent = {
    from: "AJE Tchad <onboarding@resend.dev>",
    subject: "",
    html: "",
  };

  switch (type) {
    case 'contact':
      return {
        ...baseContent,
        subject: `Confirmation de réception - ${reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a5490;">Agence Judiciaire de l'État</h1>
            <p>Bonjour ${nom},</p>
            <p>Nous avons bien reçu votre message de contact.</p>
            <p><strong>Numéro de référence :</strong> ${reference}</p>
            <p>Notre équipe traitera votre demande dans les plus brefs délais.</p>
            <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Ceci est un message automatique, merci de ne pas y répondre.<br>
              Agence Judiciaire de l'État - N'Djamena, Tchad
            </p>
          </div>
        `,
      };

    case 'avis':
      return {
        ...baseContent,
        subject: `Demande d'avis juridique enregistrée - ${reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a5490;">Agence Judiciaire de l'État</h1>
            <p>Bonjour ${nom},</p>
            <p>Votre demande d'avis juridique a été enregistrée avec succès.</p>
            <p><strong>Numéro de référence :</strong> ${reference}</p>
            <p><strong>Organisme :</strong> ${data?.organisme || 'Non spécifié'}</p>
            <p>Vous pouvez utiliser ce numéro de référence pour suivre l'état de votre demande.</p>
            <p>Notre service juridique étudiera votre dossier et vous répondra selon les délais suivants :</p>
            <ul>
              <li>Urgence absolue : 24h</li>
              <li>Urgence normale : 7 jours</li>
              <li>Standard : 15 jours</li>
            </ul>
            <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Ceci est un message automatique, merci de ne pas y répondre.<br>
              Agence Judiciaire de l'État - N'Djamena, Tchad
            </p>
          </div>
        `,
      };

    case 'consultation':
      return {
        ...baseContent,
        subject: `Demande de consultation enregistrée - ${reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a5490;">Agence Judiciaire de l'État</h1>
            <p>Bonjour ${nom},</p>
            <p>Votre demande de consultation juridique a été enregistrée.</p>
            <p><strong>Numéro de référence :</strong> ${reference}</p>
            <p>Un conseiller juridique vous contactera prochainement pour analyser votre situation.</p>
            <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Ceci est un message automatique, merci de ne pas y répondre.<br>
              Agence Judiciaire de l'État - N'Djamena, Tchad
            </p>
          </div>
        `,
      };

    case 'signalement':
      return {
        ...baseContent,
        subject: `Signalement contentieux enregistré - ${reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a5490;">Agence Judiciaire de l'État</h1>
            <p>Bonjour ${nom},</p>
            <p>Votre signalement de contentieux a été enregistré avec priorité <strong>URGENTE</strong>.</p>
            <p><strong>Numéro de dossier :</strong> ${reference}</p>
            <p>Notre service contentieux traitera votre dossier en priorité.</p>
            <p>Vous serez contacté dans les 24 heures.</p>
            <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Ceci est un message automatique, merci de ne pas y répondre.<br>
              Agence Judiciaire de l'État - N'Djamena, Tchad
            </p>
          </div>
        `,
      };

    default:
      return baseContent;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, nom, reference, data }: EmailRequest = await req.json();

    // Log sans PII - uniquement les infos opérationnelles
    const referenceId = reference.split('/').pop() || reference;
    console.log("Sending confirmation email", { type, referenceId });

    const emailContent = getEmailContent(type, nom, reference, data);

    const emailResponse = await resend.emails.send({
      ...emailContent,
      to: [email],
    });

    console.log("Email sent successfully", { messageId: emailResponse.id });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email (no PII logged)");
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
