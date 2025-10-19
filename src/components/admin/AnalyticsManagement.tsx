import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Users, FileText, Eye, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalContacts: number;
  totalDocuments: number;
  totalTextes: number;
  totalActualites: number;
  totalDemandesAvis: number;
  recentContacts: number;
  recentDemandesAvis: number;
}

const AnalyticsManagement = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalContacts: 0,
    totalDocuments: 0,
    totalTextes: 0,
    totalActualites: 0,
    totalDemandesAvis: 0,
    recentContacts: 0,
    recentDemandesAvis: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total counts
      const [
        contactsResult,
        documentsResult,
        textesResult,
        actualitesResult,
        demandesResult,
      ] = await Promise.all([
        (supabase as any).from('contacts').select('*', { count: 'exact', head: true }),
        (supabase as any).from('documents').select('*', { count: 'exact', head: true }),
        (supabase as any).from('textes_juridiques').select('*', { count: 'exact', head: true }),
        (supabase as any).from('actualites').select('*', { count: 'exact', head: true }),
        (supabase as any).from('demandes_avis').select('*', { count: 'exact', head: true }),
      ]);

      // Get recent contacts (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const [recentContactsResult, recentDemandesResult] = await Promise.all([
        (supabase as any)
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString()),
        (supabase as any)
          .from('demandes_avis')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString()),
      ]);

      setAnalytics({
        totalContacts: contactsResult.count || 0,
        totalDocuments: documentsResult.count || 0,
        totalTextes: textesResult.count || 0,
        totalActualites: actualitesResult.count || 0,
        totalDemandesAvis: demandesResult.count || 0,
        recentContacts: recentContactsResult.count || 0,
        recentDemandesAvis: recentDemandesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString('fr-FR'),
      statistiques: {
        'Total des contacts': analytics.totalContacts,
        'Contacts récents (7 jours)': analytics.recentContacts,
        'Total des documents': analytics.totalDocuments,
        'Total des textes juridiques': analytics.totalTextes,
        'Total des actualités': analytics.totalActualites,
        'Total des demandes d\'avis': analytics.totalDemandesAvis,
        'Demandes d\'avis récentes (7 jours)': analytics.recentDemandesAvis,
      },
    };

    const reportText = `
===========================================
RAPPORT D'ANALYSE DU SITE - AJE TCHAD
===========================================

Date du rapport: ${reportData.date}

-------------------------------------------
STATISTIQUES GÉNÉRALES
-------------------------------------------

Total des contacts reçus: ${reportData.statistiques['Total des contacts']}
Contacts reçus (7 derniers jours): ${reportData.statistiques['Contacts récents (7 jours)']}

Documents publiés: ${reportData.statistiques['Total des documents']}
Textes juridiques: ${reportData.statistiques['Total des textes juridiques']}
Actualités publiées: ${reportData.statistiques['Total des actualités']}

Demandes d'avis juridique: ${reportData.statistiques['Total des demandes d\'avis']}
Demandes récentes (7 jours): ${reportData.statistiques['Demandes d\'avis récentes (7 jours)']}

-------------------------------------------
OBSERVATIONS
-------------------------------------------

Ce rapport fournit un aperçu des activités du site de l'Agence Judiciaire de l'État.
Les données sont extraites directement de la base de données à la date indiquée.

Pour plus d'informations détaillées, veuillez consulter les sections individuelles du tableau de bord administrateur.

===========================================
Fin du rapport
===========================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-analytics-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Rapport téléchargé',
      description: 'Le rapport d\'analyse a été téléchargé avec succès.',
    });
  };

  if (loading) {
    return <p>Chargement des statistiques...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Statistiques du site</h2>
          <p className="text-muted-foreground">Vue d'ensemble des activités</p>
        </div>
        <Button onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger le rapport
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.recentContacts} ces 7 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes d'Avis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDemandesAvis}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.recentDemandesAvis} ces 7 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Documents disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Textes Juridiques</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTextes}</div>
            <p className="text-xs text-muted-foreground">Textes publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actualités</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalActualites}</div>
            <p className="text-xs text-muted-foreground">Articles publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière mise à jour</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleDateString('fr-FR')}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes importantes</CardTitle>
          <CardDescription>Informations pour le décideur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Activité récente :</strong> {analytics.recentContacts} nouveaux contacts et{' '}
            {analytics.recentDemandesAvis} nouvelles demandes d'avis juridique dans les 7 derniers jours.
          </p>
          <p className="text-sm">
            <strong>Contenu publié :</strong> Le site contient actuellement {analytics.totalDocuments}{' '}
            documents, {analytics.totalTextes} textes juridiques et {analytics.totalActualites} actualités.
          </p>
          <p className="text-sm text-muted-foreground">
            Note: Les statistiques de visiteurs nécessitent l'intégration d'un service d'analyse externe (ex: Google Analytics).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsManagement;
