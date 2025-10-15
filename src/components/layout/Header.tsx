import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, ShieldCheck, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoAje from "@/assets/logo-aje.svg";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navigationItems = [
    { href: "/", label: t("header.nav.home") },
    { href: "/missions", label: t("header.nav.missions") },
    { href: "/textes", label: t("header.nav.texts") },
    { href: "/actualites", label: t("header.nav.news") },
    { href: "/services", label: t("header.nav.services") },
    { href: "/contentieux", label: t("header.nav.litigation") },
    { href: "/contact", label: t("header.nav.contact") },
  ];

  const authItem = isAdmin 
    ? { href: "/admin", label: t("header.nav.admin"), icon: ShieldCheck }
    : { href: "/auth", label: t("header.nav.login"), icon: LogIn };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Optional alert banner */}
      <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm">
        {t("header.banner")}
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
        <div className="lg:w-16 h-16 flex items-center justify-center">
          <img 
            src={logoAje} 
            alt="Logo AJE - Agence Judiciaire de l'État du Tchad"
            className="w-16 h-16 object-contain"
          />
        </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-primary">
                  {t("header.title")}
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("header.tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium flex items-center gap-1"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={authItem.href}
              className="text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <authItem.icon className="h-4 w-4" />
              {authItem.label}
            </Link>
          </nav>

          {/* Search and Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="search"
                    placeholder={t("header.search")}
                    className="w-64"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex items-center space-x-1 text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className={language === 'fr' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                onClick={() => setLanguage('fr')}
              >
                FR
              </Button>
              <span className="text-muted-foreground">|</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className={language === 'ar' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                onClick={() => setLanguage('ar')}
              >
                AR
              </Button>
              <span className="text-muted-foreground">|</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className={language === 'en' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder={t("header.search")}
                      className="w-full"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="px-4 py-3 text-foreground hover:bg-secondary rounded-md transition-colors flex items-center gap-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      to={authItem.href}
                      className="px-4 py-3 text-foreground hover:bg-secondary rounded-md transition-colors flex items-center gap-2"
                    >
                      <authItem.icon className="h-4 w-4" />
                      {authItem.label}
                    </Link>
                  </nav>

                  <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={language === 'fr' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                      onClick={() => setLanguage('fr')}
                    >
                      FR
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={language === 'ar' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                      onClick={() => setLanguage('ar')}
                    >
                      AR
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={language === 'en' ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"}
                      onClick={() => setLanguage('en')}
                    >
                      EN
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;