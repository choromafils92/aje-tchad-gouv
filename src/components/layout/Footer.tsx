import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Rss } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/src/assets/logo-aje.svg" 
                alt="Logo AJE"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-semibold text-sm">Agence Judiciaire de l'État</h3>
                <p className="text-xs opacity-90">République du Tchad</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 opacity-75" />
                <div>
                  <p>BP 1024, N'Djamena</p>
                  <p>République du Tchad</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 opacity-75" />
                <p>+235 22 XX XX XX</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-75" />
                <p>contact@aje.gouv.td</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:opacity-75 transition-opacity">Accueil</a></li>
              <li><a href="/missions" className="hover:opacity-75 transition-opacity">Missions & Rôle</a></li>
              <li><a href="/textes" className="hover:opacity-75 transition-opacity">Textes & Références</a></li>
              <li><a href="/actualites" className="hover:opacity-75 transition-opacity">Actualités & Notes</a></li>
              <li><a href="/services" className="hover:opacity-75 transition-opacity">Services aux administrations</a></li>
              <li><a href="/contentieux" className="hover:opacity-75 transition-opacity">Dossiers & Contentieux</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services/demande-avis" className="hover:opacity-75 transition-opacity">Demander un avis juridique</a></li>
              <li><a href="/services/modeles" className="hover:opacity-75 transition-opacity">Modèles et guides</a></li>
              <li><a href="/contact/rendez-vous" className="hover:opacity-75 transition-opacity">Prendre rendez-vous</a></li>
              <li><a href="/carrieres" className="hover:opacity-75 transition-opacity">Carrières</a></li>
              <li><a href="/medias" className="hover:opacity-75 transition-opacity">Espace Médias</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Newsletter</h4>
            <p className="text-xs opacity-90">
              Recevez les dernières actualités et notes officielles de l'AJE
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="bg-primary-foreground text-primary"
              />
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => alert('Inscription à la newsletter confirmée ! Vous recevrez nos prochaines publications.')}
              >
                S'abonner
              </Button>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-3 pt-2">
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Rss className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-xs">
                <a href="/mentions-legales" className="hover:opacity-75 transition-opacity">
                  Mentions légales
                </a>
                <a href="/donnees-personnelles" className="hover:opacity-75 transition-opacity">
                  Données personnelles
                </a>
                <a href="/accessibilite" className="hover:opacity-75 transition-opacity">
                  Accessibilité
                </a>
                <a href="/plan-du-site" className="hover:opacity-75 transition-opacity">
                  Plan du site
                </a>
                <a href="/rss" className="hover:opacity-75 transition-opacity">
                  Flux RSS
                </a>
              </div>
            <p className="text-xs opacity-75">
              © {new Date().getFullYear()} Agence Judiciaire de l'État - République du Tchad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;