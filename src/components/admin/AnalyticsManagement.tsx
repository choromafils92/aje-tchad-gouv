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

  const downloadReport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
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

      // Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginLeft = 20;
      let yPosition = 20;

      // Titre
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT D\'ANALYSE DU SITE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      doc.text('AJE TCHAD', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date du rapport: ${reportData.date}`, marginLeft, yPosition);
      yPosition += 15;

      // Section Statistiques
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('STATISTIQUES GÉNÉRALES', marginLeft, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Contacts
      doc.text(`Total des contacts reçus: ${reportData.statistiques['Total des contacts']}`, marginLeft, yPosition);
      yPosition += 7;
      doc.text(`Contacts reçus (7 derniers jours): ${reportData.statistiques['Contacts récents (7 jours)']}`, marginLeft, yPosition);
      yPosition += 10;

      // Documents
      doc.text(`Documents publiés: ${reportData.statistiques['Total des documents']}`, marginLeft, yPosition);
      yPosition += 7;
      doc.text(`Textes juridiques: ${reportData.statistiques['Total des textes juridiques']}`, marginLeft, yPosition);
      yPosition += 7;
      doc.text(`Actualités publiées: ${reportData.statistiques['Total des actualités']}`, marginLeft, yPosition);
      yPosition += 10;

      // Demandes d'avis
      doc.text(`Demandes d'avis juridique: ${reportData.statistiques['Total des demandes d\'avis']}`, marginLeft, yPosition);
      yPosition += 7;
      doc.text(`Demandes récentes (7 jours): ${reportData.statistiques['Demandes d\'avis récentes (7 jours)']}`, marginLeft, yPosition);
      yPosition += 15;

      // Section Observations
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVATIONS', marginLeft, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const observations = [
        'Ce rapport fournit un aperçu des activités du site de l\'Agence Judiciaire',
        'de l\'État. Les données sont extraites directement de la base de données',
        'à la date indiquée.',
        '',
        'Pour plus d\'informations détaillées, veuillez consulter les sections',
        'individuelles du tableau de bord administrateur.'
      ];
      
      observations.forEach(line => {
        doc.text(line, marginLeft, yPosition);
        yPosition += 6;
      });

      // Télécharger
      doc.save(`rapport-analytics-${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: 'Rapport téléchargé',
        description: 'Le rapport d\'analyse a été téléchargé en PDF avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le rapport PDF.',
        variant: 'destructive',
      });
    }
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
