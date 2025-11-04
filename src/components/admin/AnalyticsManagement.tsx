import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Users, FileText, Eye, Calendar, TrendingUp, Mail, Briefcase, Scale, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';

interface AnalyticsData {
  totalContacts: number;
  totalDocuments: number;
  totalTextes: number;
  totalActualites: number;
  totalDemandesAvis: number;
  recentContacts: number;
  recentDemandesAvis: number;
  totalSignalements: number;
  totalConsultations: number;
  totalJobApplications: number;
  totalJobOffers: number;
  totalNewsletterSubs: number;
  totalMediaAccreditations: number;
  totalJurisprudences: number;
  totalFAQ: number;
  monthlyData: Array<{
    month: string;
    contacts: number;
    demandes: number;
    actualites: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

const AnalyticsManagement = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalContacts: 0,
    totalDocuments: 0,
    totalTextes: 0,
    totalActualites: 0,
    totalDemandesAvis: 0,
    recentContacts: 0,
    recentDemandesAvis: 0,
    totalSignalements: 0,
    totalConsultations: 0,
    totalJobApplications: 0,
    totalJobOffers: 0,
    totalNewsletterSubs: 0,
    totalMediaAccreditations: 0,
    totalJurisprudences: 0,
    totalFAQ: 0,
    monthlyData: [],
    statusData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all counts
      const [
        contactsResult,
        documentsResult,
        textesResult,
        actualitesResult,
        demandesResult,
        signalementsResult,
        consultationsResult,
        jobAppsResult,
        jobOffersResult,
        newsletterResult,
        accreditationsResult,
        jurisprudencesResult,
        faqResult,
      ] = await Promise.all([
        (supabase as any).from('contacts').select('*', { count: 'exact', head: true }),
        (supabase as any).from('documents').select('*', { count: 'exact', head: true }),
        (supabase as any).from('textes_juridiques').select('*', { count: 'exact', head: true }),
        (supabase as any).from('actualites').select('*', { count: 'exact', head: true }),
        (supabase as any).from('demandes_avis').select('*', { count: 'exact', head: true }),
        (supabase as any).from('signalements_contentieux').select('*', { count: 'exact', head: true }),
        (supabase as any).from('consultations_juridiques').select('*', { count: 'exact', head: true }),
        (supabase as any).from('job_applications').select('*', { count: 'exact', head: true }),
        (supabase as any).from('job_offers').select('*', { count: 'exact', head: true }),
        (supabase as any).from('newsletter_subscriptions').select('*', { count: 'exact', head: true }),
        (supabase as any).from('media_accreditations').select('*', { count: 'exact', head: true }),
        (supabase as any).from('jurisprudences').select('*', { count: 'exact', head: true }),
        (supabase as any).from('faq').select('*', { count: 'exact', head: true }),
      ]);

      // Get recent activity
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

      // Get monthly data for last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const [contacts, demandes, actualites] = await Promise.all([
          (supabase as any).from('contacts').select('*', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lte('created_at', monthEnd.toISOString()),
          (supabase as any).from('demandes_avis').select('*', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lte('created_at', monthEnd.toISOString()),
          (supabase as any).from('actualites').select('*', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lte('created_at', monthEnd.toISOString()),
        ]);

        monthlyData.push({
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          contacts: contacts.count || 0,
          demandes: demandes.count || 0,
          actualites: actualites.count || 0,
        });
      }

      // Status data for pie chart
      const statusData = [
        { name: 'Contacts', value: contactsResult.count || 0 },
        { name: 'Demandes', value: demandesResult.count || 0 },
        { name: 'Signalements', value: signalementsResult.count || 0 },
        { name: 'Consultations', value: consultationsResult.count || 0 },
        { name: 'Candidatures', value: jobAppsResult.count || 0 },
      ];

      setAnalytics({
        totalContacts: contactsResult.count || 0,
        totalDocuments: documentsResult.count || 0,
        totalTextes: textesResult.count || 0,
        totalActualites: actualitesResult.count || 0,
        totalDemandesAvis: demandesResult.count || 0,
        recentContacts: recentContactsResult.count || 0,
        recentDemandesAvis: recentDemandesResult.count || 0,
        totalSignalements: signalementsResult.count || 0,
        totalConsultations: consultationsResult.count || 0,
        totalJobApplications: jobAppsResult.count || 0,
        totalJobOffers: jobOffersResult.count || 0,
        totalNewsletterSubs: newsletterResult.count || 0,
        totalMediaAccreditations: accreditationsResult.count || 0,
        totalJurisprudences: jurisprudencesResult.count || 0,
        totalFAQ: faqResult.count || 0,
        monthlyData,
        statusData,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: t('common.error'),
        description: t('admin.analytics.errorLoading'),
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
    return <p>{t('common.loading')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.analytics.title')}</h2>
          <p className="text-muted-foreground">{t('admin.analytics.subtitle')}</p>
        </div>
        <Button onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          {t('admin.analytics.downloadReport')}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.totalContacts')}</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.totalContacts}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{analytics.recentContacts} {t('admin.analytics.last7Days')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.legalRequests')}</CardTitle>
            <FileText className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.totalDemandesAvis}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{analytics.recentDemandesAvis} {t('admin.analytics.last7Days')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.litigationReports')}</CardTitle>
            <Scale className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{analytics.totalSignalements}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.totalReported')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.consultations')}</CardTitle>
            <Briefcase className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{analytics.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.legalConsultations')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.documents')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.legalTexts')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTextes}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.published')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.news')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalActualites}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.articles')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.jobApplications')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalJobApplications}</div>
            <p className="text-xs text-muted-foreground">{analytics.totalJobOffers} {t('admin.analytics.openPositions')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.analytics.newsletter')}</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalNewsletterSubs}</div>
            <p className="text-xs text-muted-foreground">{t('admin.analytics.subscribers')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.monthlyActivity')}</CardTitle>
            <CardDescription>{t('admin.analytics.last6Months')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.monthlyData}>
                <defs>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="contacts" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorContacts)" name="Contacts" />
                <Area type="monotone" dataKey="demandes" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorDemandes)" name="Demandes" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.activityDistribution')}</CardTitle>
            <CardDescription>{t('admin.analytics.byCategory')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.monthlyComparison')}</CardTitle>
            <CardDescription>{t('admin.analytics.contactsVsRequests')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="contacts" fill="hsl(var(--chart-1))" name="Contacts" radius={[8, 8, 0, 0]} />
                <Bar dataKey="demandes" fill="hsl(var(--chart-2))" name="Demandes" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.contentTrend')}</CardTitle>
            <CardDescription>{t('admin.analytics.newsPublications')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actualites" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  name="Actualités"
                  dot={{ fill: 'hsl(var(--chart-3))', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              {t('admin.analytics.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {analytics.recentContacts} {t('admin.analytics.newContacts')}
            </p>
            <p className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {analytics.recentDemandesAvis} {t('admin.analytics.newRequests')}
            </p>
            <p className="text-xs text-muted-foreground mt-3">{t('admin.analytics.last7Days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {t('admin.analytics.contentLibrary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{analytics.totalDocuments} {t('admin.analytics.documents')}</p>
            <p className="text-sm">{analytics.totalTextes} {t('admin.analytics.legalTexts')}</p>
            <p className="text-sm">{analytics.totalActualites} {t('admin.analytics.newsArticles')}</p>
            <p className="text-sm">{analytics.totalJurisprudences} {t('admin.analytics.jurisprudences')}</p>
            <p className="text-sm">{analytics.totalFAQ} {t('admin.analytics.faqItems')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              {t('admin.analytics.recommendations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• {t('admin.analytics.recommendation1')}</p>
            <p className="text-sm">• {t('admin.analytics.recommendation2')}</p>
            <p className="text-sm">• {t('admin.analytics.recommendation3')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
