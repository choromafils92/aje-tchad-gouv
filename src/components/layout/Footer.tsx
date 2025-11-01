import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Rss, Loader2, Youtube, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoAje from "@/assets/logo-arrondi-vf.png";
import carteTchad from "@/assets/carte-tchad-coloree.png";

const Footer = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    address: "Avenue Félix Éboué, Quartier administratif\nN'Djamena, République du Tchad",
    phone: "+235 22 XX XX XX",
    email: "contact@aje.td",
    hours: "Lundi au Jeudi : 7h30 - 15h30\nVendredi : 7h30 - 12h30\nWeekend : Fermé"
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
    rss: ""
  });
  const [devise, setDevise] = useState("Conseiller-Défendre-Protéger");

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "contact_address", 
          "contact_phone", 
          "contact_email", 
          "contact_hours",
          "social_facebook",
          "social_twitter",
          "social_linkedin",
          "social_youtube",
          "social_whatsapp",
          "social_rss",
          "aje_devise"
        ]);

      if (error) throw error;

      const newInfo = { ...contactInfo };
      const newSocial = { ...socialLinks };
      
      data?.forEach((setting: any) => {
        switch (setting.key) {
          case "contact_address":
            newInfo.address = setting.value as string;
            break;
          case "contact_phone":
            newInfo.phone = setting.value as string;
            break;
          case "contact_email":
            newInfo.email = setting.value as string;
            break;
          case "contact_hours":
            newInfo.hours = setting.value as string;
            break;
          case "social_facebook":
            newSocial.facebook = setting.value as string;
            break;
          case "social_twitter":
            newSocial.twitter = setting.value as string;
            break;
          case "social_linkedin":
            newSocial.linkedin = setting.value as string;
            break;
          case "social_youtube":
            newSocial.youtube = setting.value as string;
            break;
          case "social_whatsapp":
            newSocial.whatsapp = setting.value as string;
            break;
          case "social_rss":
            newSocial.rss = setting.value as string;
            break;
          case "aje_devise":
            setDevise(setting.value as string);
            break;
        }
      });
      setContactInfo(newInfo);
      setSocialLinks(newSocial);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setSubscribing(true);
    try {
      const { error } = await (supabase as any)
        .from("newsletter_subscriptions")
        .insert({ email: newsletterEmail.toLowerCase().trim() });

      if (error) {
        if (error.code === "23505") {
          toast.error("Cette adresse email est déjà inscrite à la newsletter");
        } else {
          throw error;
        }
      } else {
        toast.success("Inscription réussie ! Vous recevrez nos prochaines publications.");
        setNewsletterEmail("");
      }
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setSubscribing(false);
    }
  };
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo, Devise et Coordonnées */}
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={logoAje} 
                alt="Logo AJE"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-bold text-sm text-white">{t("header.title")}</h3>
                <p className="text-xs opacity-90">{devise}</p>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <h4 className="font-bold text-sm text-white">Coordonnées</h4>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 text-sm text-left inline-block">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 opacity-75 flex-shrink-0" />
                    <div>
                      <p className="whitespace-pre-line">{contactInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 opacity-75 flex-shrink-0" />
                    <p>{contactInfo.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 opacity-75 flex-shrink-0" />
                    <p className="break-all">{contactInfo.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* République du Tchad */}
          <div className="space-y-4 flex flex-col items-center text-center">
            <h4 className="font-bold text-sm text-white">République du Tchad</h4>
            <img 
              src={carteTchad} 
              alt="Carte du Tchad"
              className="w-32 h-auto object-contain"
            />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:opacity-75 transition-opacity">{t("header.nav.home")}</a></li>
              <li><a href="/missions" className="hover:opacity-75 transition-opacity">{t("header.nav.missions")}</a></li>
              <li><a href="/textes" className="hover:opacity-75 transition-opacity">{t("header.nav.texts")}</a></li>
              <li><a href="/actualites" className="hover:opacity-75 transition-opacity">{t("header.nav.news")}</a></li>
              <li><a href="/services" className="hover:opacity-75 transition-opacity">{t("header.nav.services")}</a></li>
              <li><a href="/contentieux" className="hover:opacity-75 transition-opacity">{t("header.nav.litigation")}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services/demande-avis" className="hover:opacity-75 transition-opacity">Demander un avis juridique</a></li>
              <li><a href="/modeles" className="hover:opacity-75 transition-opacity">Modèles et guides</a></li>
              <li><a href="/contact/rendez-vous" className="hover:opacity-75 transition-opacity">Prendre rendez-vous</a></li>
              <li><a href="/carrieres" className="hover:opacity-75 transition-opacity">Carrières</a></li>
              <li><a href="/medias" className="hover:opacity-75 transition-opacity">Espace Médias</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white">{t("footer.newsletter")}</h4>
            <p className="text-xs opacity-90">
              {t("footer.newsletterText")}
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="bg-primary-foreground text-primary"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNewsletterSubscribe();
                  }
                }}
              />
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={handleNewsletterSubscribe}
                disabled={subscribing}
              >
                {subscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  t("footer.subscribe")
                )}
              </Button>
            </div>
            
            {/* Social Media */}
            <div className="pt-2">
              <h5 className="font-bold text-xs mb-3 text-white">{t("footer.followUs")}</h5>
              <div className="flex flex-wrap gap-2">
                {socialLinks.facebook && socialLinks.facebook.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="Facebook"
                    onClick={() => window.open(socialLinks.facebook, '_blank')}
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                )}
                {socialLinks.twitter && socialLinks.twitter.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="Twitter"
                    onClick={() => window.open(socialLinks.twitter, '_blank')}
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                )}
                {socialLinks.linkedin && socialLinks.linkedin.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="LinkedIn"
                    onClick={() => window.open(socialLinks.linkedin, '_blank')}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                )}
                {socialLinks.youtube && socialLinks.youtube.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="YouTube"
                    onClick={() => window.open(socialLinks.youtube, '_blank')}
                  >
                    <Youtube className="h-5 w-5" />
                  </Button>
                )}
                {socialLinks.whatsapp && socialLinks.whatsapp.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="WhatsApp"
                    onClick={() => window.open(socialLinks.whatsapp, '_blank')}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                )}
                {socialLinks.rss && socialLinks.rss.trim() !== "" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="p-2 h-auto hover:scale-110 transition-transform" 
                    aria-label="RSS"
                    onClick={() => window.open(socialLinks.rss, '_blank')}
                  >
                    <Rss className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-xs">
                <a href="/mentions-legales" className="hover:opacity-75 transition-opacity">
                  {t("footer.legal")}
                </a>
                <a href="/donnees-personnelles" className="hover:opacity-75 transition-opacity">
                  {t("footer.privacy")}
                </a>
                <a href="/accessibilite" className="hover:opacity-75 transition-opacity">
                  {t("footer.accessibility")}
                </a>
                <a href="/plan-du-site" className="hover:opacity-75 transition-opacity">
                  {t("footer.sitemap")}
                </a>
                <a href="/rss" className="hover:opacity-75 transition-opacity">
                  {t("footer.rss")}
                </a>
              </div>
            <div className="text-xs opacity-75 text-center">
              <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
              <p className="mt-1">Développé par <span className="font-semibold">zenasys-technology</span></p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;