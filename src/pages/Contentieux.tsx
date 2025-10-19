import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SignalerContentieuxDialog } from "@/components/SignalerContentieuxDialog";
import { DemanderConsultationDialog } from "@/components/DemanderConsultationDialog";
import { 
  Scale, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Download
} from "lucide-react";

const Contentieux = () => {
  const [proceduresDb, setProceduresDb] = useState<any[]>([]);
  const [jurisprudencesDb, setJurisprudencesDb] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [proceduresRes, jurisprudencesRes] = await Promise.all([
        supabase.from("procedures_contentieux" as any).select("*").eq("published", true).order("ordre"),
        supabase.from("jurisprudences" as any).select("*").eq("published", true).order("date", { ascending: false }).limit(3)
      ]);

      if (proceduresRes.data) setProceduresDb(proceduresRes.data);
      if (jurisprudencesRes.data) setJurisprudencesDb(jurisprudencesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };


  const statistiques = [
    {
      titre: "Dossiers traités (2024)",
      valeur: "2,847",
      evolution: "+15%",
      icon: FileText,
      couleur: "text-blue-600"
    },
    {
      titre: "Taux de succès",
      valeur: "89%",
      evolution: "+3%",
      icon: TrendingUp,
      couleur: "text-green-600"
    },
    {
      titre: "Délai moyen de traitement",
      valeur: "45 jours",
      evolution: "-8 jours",
      icon: Clock,
      couleur: "text-orange-600"
    },
    {
      titre: "Affaires en cours",
      valeur: "156",
      evolution: "Stable",
      icon: Scale,
      couleur: "text-purple-600"
    }
  ];

  const typesContentieux = [
    {
      categorie: "Contentieux Administratif",
      description: "Litiges impliquant l'administration publique",
      affaires: [
        "Marchés publics",
        "Fonction publique", 
        "Urbanisme et domaine public",
        "Fiscalité et douanes"
      ],
      statistiques: "67% des dossiers"
    },
    {
      categorie: "Contentieux Civil",
      description: "Litiges de droit privé impliquant l'État",
      affaires: [
        "Responsabilité civile de l'État",
        "Contrats de droit privé",
        "Propriété et biens publics",
        "Assurances et indemnisations"
      ],
      statistiques: "23% des dossiers"
    },
    {
      categorie: "Contentieux Commercial", 
      description: "Litiges économiques et commerciaux",
      affaires: [
        "Partenariats public-privé",
        "Concessions et délégations",
        "Investissements publics",
        "Commerce international"
      ],
      statistiques: "10% des dossiers"
    },
    {
      categorie: "Contentieux Pénal",
      description: "Défense des intérêts de l'État dans les affaires pénales",
      affaires: [
        "Constitution de partie civile",
        "Infractions contre les biens publics",
        "Blanchiment et fraude fiscale",
        "Crimes économiques et financiers"
      ],
      statistiques: "5% des dossiers"
    },
    {
      categorie: "Contentieux Social",
      description: "Litiges relatifs au droit du travail et de la sécurité sociale",
      affaires: [
        "Agents de l'État et fonctionnaires",
        "Accidents de service",
        "Sécurité sociale et pensions",
        "Conflits collectifs du travail"
      ],
      statistiques: "8% des dossiers"
    }
  ];

  const procedures = [
    {
      etape: "1. Saisine",
      description: "Réception et analyse de la demande",
      delai: "2-5 jours",
      documents: ["Dossier complet", "Pièces justificatives"]
    },
    {
      etape: "2. Instruction",
      description: "Étude approfondie du dossier",
      delai: "15-30 jours", 
      documents: ["Analyses juridiques", "Consultations"]
    },
    {
      etape: "3. Stratégie",
      description: "Définition de la stratégie contentieuse",
      delai: "5-10 jours",
      documents: ["Plan d'action", "Recommandations"]
    },
    {
      etape: "4. Action",
      description: "Mise en œuvre et suivi",
      delai: "Variable",
      documents: ["Actes de procédure", "Rapports de suivi"]
    }
  ];

  const jurisprudences = [
    {
      date: "15 Mars 2024",
      juridiction: "Cour Suprême du Tchad",
      affaire: "État du Tchad c. Société ALPHA",
      domaine: "Marchés Publics",
      resultat: "Favorable",
      resume: "Annulation pour vice de procédure - Économie de 2,4 milliards FCFA"
    },
    {
      date: "08 Février 2024", 
      juridiction: "Tribunal Administratif de N'Djaména",
      affaire: "Ministère des Finances c. Contribuable X",
      domaine: "Fiscal",
      resultat: "Favorable",
      resume: "Confirmation du redressement fiscal - Recouvrement de 850 millions FCFA"
    },
    {
      date: "22 Janvier 2024",
      juridiction: "Cour d'Appel de N'Djaména", 
      affaire: "État c. Société de Construction Y",
      domaine: "Responsabilité",
      resultat: "Transactionnel",
      resume: "Accord amiable - Réduction de 60% de l'indemnisation demandée"
    }
  ];

  const defaultProcedures = [
    {
      etape: "1. Saisine",
      description: "Réception et analyse de la demande",
      delai: "2-5 jours",
      documents: '["Dossier complet", "Pièces justificatives"]'
    },
    {
      etape: "2. Instruction",
      description: "Étude approfondie du dossier",
      delai: "15-30 jours",
      documents: '["Analyses juridiques", "Consultations"]'
    },
    {
      etape: "3. Stratégie",
      description: "Définition de la stratégie contentieuse",
      delai: "5-10 jours",
      documents: '["Plan d\'action", "Recommandations"]'
    },
    {
      etape: "4. Action",
      description: "Mise en œuvre et suivi",
      delai: "Variable",
      documents: '["Actes de procédure", "Rapports de suivi"]'
    }
  ];

  const defaultJurisprudences = [
    {
      date: "2024-03-15",
      juridiction: "Cour Suprême du Tchad",
      affaire: "État du Tchad c. Société ALPHA",
      domaine: "Marchés Publics",
      resultat: "Favorable",
      resume: "Annulation pour vice de procédure - Économie de 2,4 milliards FCFA"
    },
    {
      date: "2024-02-08",
      juridiction: "Tribunal Administratif de N'Djaména",
      affaire: "Ministère des Finances c. Contribuable X",
      domaine: "Fiscal",
      resultat: "Favorable",
      resume: "Confirmation du redressement fiscal - Recouvrement de 850 millions FCFA"
    },
    {
      date: "2024-01-22",
      juridiction: "Cour d'Appel de N'Djaména",
      affaire: "État c. Société de Construction Y",
      domaine: "Responsabilité",
      resultat: "Transactionnel",
      resume: "Accord amiable - Réduction de 60% de l'indemnisation demandée"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Gestion du Contentieux
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Défense stratégique des intérêts de l'État du Tchad dans tous les domaines juridictionnels
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Scale className="w-4 h-4 mr-2" />
                  Justice Administrative
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Contentieux Civil
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Contentieux Commercial
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Statistiques 2024</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statistiques.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-3">
                      <stat.icon className={`w-8 h-8 ${stat.couleur}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{stat.valeur}</CardTitle>
                    <CardDescription>{stat.titre}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-green-600">
                      {stat.evolution}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Types de Contentieux */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Domaines d'Intervention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {typesContentieux.map((type, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {type.categorie}
                      <Badge variant="secondary">{type.statistiques}</Badge>
                    </CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.affaires.map((affaire, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm">{affaire}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Procédures et Jurisprudences */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="procedures" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="procedures">Procédures</TabsTrigger>
                <TabsTrigger value="jurisprudences">Jurisprudences Récentes</TabsTrigger>
              </TabsList>

              <TabsContent value="procedures" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Processus de Traitement du Contentieux</CardTitle>
                    <CardDescription>
                      Étapes standardisées pour la gestion efficace des dossiers contentieux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {(proceduresDb.length > 0 ? proceduresDb : defaultProcedures).map((proc: any, index: number) => (
                        <div key={index} className="text-center">
                          <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold mb-2">{proc.etape}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{proc.description}</p>
                          <Badge variant="outline" className="mb-3">
                            <Clock className="w-3 h-3 mr-1" />
                            {proc.delai}
                          </Badge>
                          <ul className="text-xs text-left space-y-1">
                            {(Array.isArray(proc.documents) ? proc.documents : JSON.parse(proc.documents || '[]')).map((doc: string, i: number) => (
                              <li key={i} className="flex items-center">
                                <FileText className="w-3 h-3 mr-1 text-muted-foreground" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jurisprudences" className="mt-8">
                <div className="space-y-4">
                  {(jurisprudencesDb.length > 0 ? jurisprudencesDb : defaultJurisprudences).map((jurisp: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{jurisp.affaire}</CardTitle>
                            <CardDescription>{jurisp.juridiction} - {jurisp.date}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{jurisp.domaine}</Badge>
                            <Badge 
                              variant={jurisp.resultat === "Favorable" ? "default" : "secondary"}
                              className={jurisp.resultat === "Favorable" ? "bg-green-600" : ""}
                            >
                              {jurisp.resultat}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{jurisp.resume}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Actions et Contact */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Besoin d'Assistance Contentieuse ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                  <CardTitle className="text-white">Urgence Contentieuse</CardTitle>
                  <CardDescription className="text-white/80">
                    Signalement immédiat d'une procédure contre l'État
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignalerContentieuxDialog />
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <Calendar className="w-8 h-8 mx-auto mb-4" />
                  <CardTitle className="text-white">Consultation Juridique</CardTitle>
                  <CardDescription className="text-white/80">
                    Demande d'analyse préventive pour éviter le contentieux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DemanderConsultationDialog />
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <p className="text-lg mb-4">Contact Direct - Service Contentieux</p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
                <span>📞 +235 22 51 44 19 (Urgences)</span>
                <span>✉️ contentieux@aje.td</span>
                <span>🕒 24h/24 pour les urgences</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contentieux;