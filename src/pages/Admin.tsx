import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminManagement from '@/components/admin/AdminManagement';
import ActualitesManagement from '@/components/admin/ActualitesManagement';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import FAQManagement from '@/components/admin/FAQManagement';
import TextesJuridiquesManagement from '@/components/admin/TextesJuridiquesManagement';
import SiteSettingsManagement from '@/components/admin/SiteSettingsManagement';
import DemandesAvisManagement from '@/components/admin/DemandesAvisManagement';
import ContactsManagement from '@/components/admin/ContactsManagement';
import AnalyticsManagement from '@/components/admin/AnalyticsManagement';
import JobOffersManagement from '@/components/admin/JobOffersManagement';
import JobApplicationsManagement from '@/components/admin/JobApplicationsManagement';
import MediaPressContactManagement from '@/components/admin/MediaPressContactManagement';
import MediaAccreditationsManagement from '@/components/admin/MediaAccreditationsManagement';
import MediaPressReleasesManagement from '@/components/admin/MediaPressReleasesManagement';
import MediaKitManagement from '@/components/admin/MediaKitManagement';
import MediaGalleryManagement from '@/components/admin/MediaGalleryManagement';
import MediaPressNewsletterManagement from '@/components/admin/MediaPressNewsletterManagement';
import ContactSettingsManagement from '@/components/admin/ContactSettingsManagement';
import FAQAssistanceManagement from '@/components/admin/FAQAssistanceManagement';
import ResourceDocumentsManagement from '@/components/admin/ResourceDocumentsManagement';
import ServicesJuridiquesManagement from '@/components/admin/ServicesJuridiquesManagement';
import DomainesContentieuxManagement from '@/components/admin/DomainesContentieuxManagement';
import StatistiquesContentieuxManagement from '@/components/admin/StatistiquesContentieuxManagement';
import ProceduresContentieuxManagement from '@/components/admin/ProceduresContentieuxManagement';
import JurisprudencesManagement from '@/components/admin/JurisprudencesManagement';
import { NotificationsManagement } from '@/components/admin/NotificationsManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenue dans le panneau d'administration
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1">
            <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
            <TabsTrigger value="actualites">Actualités</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="textes">Textes</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact-settings">Paramètres Contact</TabsTrigger>
            <TabsTrigger value="offres">Offres d'emploi</TabsTrigger>
            <TabsTrigger value="media-contact">Contact Presse</TabsTrigger>
            <TabsTrigger value="accreditations">Accréditations</TabsTrigger>
            <TabsTrigger value="communiques">Communiqués</TabsTrigger>
            <TabsTrigger value="media-kit">Kit Média</TabsTrigger>
            <TabsTrigger value="galerie">Galerie</TabsTrigger>
            <TabsTrigger value="press-newsletter">Newsletter Presse</TabsTrigger>
            <TabsTrigger value="faq-assistance">Assistance FAQ</TabsTrigger>
            <TabsTrigger value="resource-docs">Documents Ressources</TabsTrigger>
            <TabsTrigger value="services-juridiques">Services Juridiques</TabsTrigger>
            <TabsTrigger value="domaines-contentieux">Domaines Contentieux</TabsTrigger>
            <TabsTrigger value="procedures-contentieux">Procédures Contentieux</TabsTrigger>
            <TabsTrigger value="stats-contentieux">Stats Contentieux</TabsTrigger>
            <TabsTrigger value="jurisprudences">Jurisprudences</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-6">
            <NotificationsManagement />
          </TabsContent>

          <TabsContent value="actualites" className="mt-6">
            <ActualitesManagement />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <DocumentsManagement />
          </TabsContent>
          
          <TabsContent value="textes" className="mt-6">
            <TextesJuridiquesManagement />
          </TabsContent>
          
          <TabsContent value="faq" className="mt-6">
            <FAQManagement />
          </TabsContent>
          
          <TabsContent value="offres" className="mt-6">
            <JobOffersManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsManagement />
          </TabsContent>
          
          <TabsContent value="parametres" className="mt-6">
            <SiteSettingsManagement />
          </TabsContent>
          
          <TabsContent value="admins" className="mt-6">
            <AdminManagement />
          </TabsContent>
          
          <TabsContent value="media-contact" className="mt-6">
            <MediaPressContactManagement />
          </TabsContent>
          
          <TabsContent value="accreditations" className="mt-6">
            <MediaAccreditationsManagement />
          </TabsContent>
          
          <TabsContent value="communiques" className="mt-6">
            <MediaPressReleasesManagement />
          </TabsContent>
          
          <TabsContent value="media-kit" className="mt-6">
            <MediaKitManagement />
          </TabsContent>
          
          <TabsContent value="galerie" className="mt-6">
            <MediaGalleryManagement />
          </TabsContent>
          
          <TabsContent value="press-newsletter" className="mt-6">
            <MediaPressNewsletterManagement />
          </TabsContent>

          <TabsContent value="contact-settings" className="mt-6">
            <ContactSettingsManagement />
          </TabsContent>

          <TabsContent value="faq-assistance" className="mt-6">
            <FAQAssistanceManagement />
          </TabsContent>

          <TabsContent value="resource-docs" className="mt-6">
            <ResourceDocumentsManagement />
          </TabsContent>

          <TabsContent value="services-juridiques" className="mt-6">
            <ServicesJuridiquesManagement />
          </TabsContent>

          <TabsContent value="domaines-contentieux" className="mt-6">
            <DomainesContentieuxManagement />
          </TabsContent>

          <TabsContent value="procedures-contentieux" className="mt-6">
            <ProceduresContentieuxManagement />
          </TabsContent>

          <TabsContent value="stats-contentieux" className="mt-6">
            <StatistiquesContentieuxManagement />
          </TabsContent>

          <TabsContent value="jurisprudences" className="mt-6">
            <JurisprudencesManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <NewsletterManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
