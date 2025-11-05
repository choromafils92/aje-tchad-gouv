import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsletterSubscription = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto p-8 bg-secondary rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">
            {t("newsletter.title")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("newsletter.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" asChild>
              <Link to="/rss">{t("newsletter.subscribeBtn")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/rss">{t("newsletter.rssBtn")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
