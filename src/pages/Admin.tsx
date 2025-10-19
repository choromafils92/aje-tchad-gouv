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

        <Tabs defaultValue="actualites" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="actualites">Actualités</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="textes">Textes</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="avis">Avis</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          
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
          
          <TabsContent value="avis" className="mt-6">
            <DemandesAvisManagement />
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-6">
            <ContactsManagement />
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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
