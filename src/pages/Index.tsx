import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import MissionCards from "@/components/home/MissionCards";
import LatestNews from "@/components/home/LatestNews";
import QuickAccess from "@/components/home/QuickAccess";
import DirectorMessage from "@/components/home/DirectorMessage";
import SubDirectors from "@/components/home/SubDirectors";
import StatsDashboard from "@/components/home/StatsDashboard";
import NewsletterSubscription from "@/components/home/NewsletterSubscription";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <DirectorMessage />
        <MissionCards />
        <QuickAccess />
        <StatsDashboard />
        <LatestNews />
        <SubDirectors />
        <NewsletterSubscription />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
