import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NewsletterSubscription = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto p-8 bg-secondary rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Restez informé des dernières actualités
          </h3>
          <p className="text-muted-foreground mb-6">
            Abonnez-vous à notre newsletter ou suivez notre flux RSS pour ne manquer aucune publication officielle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" asChild>
              <Link to="/rss">S'abonner à la newsletter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/rss">Flux RSS</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
