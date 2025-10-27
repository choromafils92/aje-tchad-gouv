import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, FileText, AlertCircle, Calendar, Eye, CheckCircle, Download, Printer, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  numero_reference?: string;
  nom?: string;
  prenom?: string;
  nom_complet?: string;
  email: string;
  sujet?: string;
  objet?: string;
  created_at: string;
  lu?: boolean;
  repondu?: boolean;
  statut?: string;
  job_offer_id?: string;
  is_spontaneous?: boolean;
}

export const NotificationsManagement = () => {
  const [contacts, setContacts] = useState<Notification[]>([]);
  const [demandesAvis, setDemandesAvis] = useState<Notification[]>([]);
  const [consultations, setConsultations] = useState<Notification[]>([]);
  const [signalements, setSignalements] = useState<Notification[]>([]);
  const [candidatures, setCandidatures] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [contactsRes, avisRes, consultationsRes, signalementsRes, candidaturesRes] = await Promise.all([
        supabase.from("contacts" as any).select("*").order("created_at", { ascending: false }),
        supabase.from("demandes_avis" as any).select("*").order("created_at", { ascending: false }),
        supabase.from("consultations_juridiques" as any).select("*").order("created_at", { ascending: false }),
        supabase.from("signalements_contentieux" as any).select("*").order("created_at", { ascending: false }),
        supabase.from("job_applications" as any).select("*").order("created_at", { ascending: false }),
      ]);

      if (contactsRes.data) setContacts(contactsRes.data as any);
      if (avisRes.data) setDemandesAvis(avisRes.data as any);
      if (consultationsRes.data) setConsultations(consultationsRes.data as any);
      if (signalementsRes.data) setSignalements(signalementsRes.data as any);
      if (candidaturesRes.data) setCandidatures(candidaturesRes.data as any);

      // Calculer le nombre total de non lus/nouveaux
      const unreadItems = [
        ...(contactsRes.data || []).filter((i: any) => !i.lu),
        ...(avisRes.data || []).filter((i: any) => !i.lu),
        ...(consultationsRes.data || []).filter((i: any) => !i.lu),
        ...(signalementsRes.data || []).filter((i: any) => !i.lu),
        ...(candidaturesRes.data || []).filter((i: any) => i.statut === 'nouveau'),
      ];
      
      setUnreadCount(unreadItems.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (table: string, id: string) => {
    try {
      const { error } = await (supabase as any)
        .from(table)
        .update({ lu: true })
        .eq("id", id);

      if (error) throw error;
      
      fetchNotifications();
      toast.success("Marqué comme lu");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const markAsReplied = async (table: string, id: string) => {
    try {
      const { error } = await (supabase as any)
        .from(table)
        .update({ repondu: true, lu: true })
        .eq("id", id);

      if (error) throw error;
      
      fetchNotifications();
      toast.success("Marqué comme répondu");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getStatusColor = (item: Notification) => {
    if (item.repondu) return "bg-green-100 text-green-800 border-green-200";
    if (item.lu) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusLabel = (item: Notification) => {
    if (item.repondu) return "Répondu";
    if (item.lu) return "Lu";
    return "Nouveau";
  };

  const downloadNotification = (item: Notification, type: string) => {
    const content = `
NOTIFICATION - ${type.toUpperCase()}
${item.numero_reference ? `Référence: ${item.numero_reference}` : ''}
=====================================

Date: ${format(new Date(item.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
Nom: ${item.nom}
Email: ${item.email}
${item.sujet ? `Sujet: ${item.sujet}` : ''}
${item.objet ? `Objet: ${item.objet}` : ''}
Statut: ${getStatusLabel(item)}

Pour traiter cette demande, connectez-vous à l'administration.
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${item.numero_reference || item.id}_${type}.txt`;
    link.click();
  };

  const printNotification = (item: Notification, type: string) => {
    const content = `
      <html>
        <head>
          <title>Notification ${item.numero_reference || item.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>NOTIFICATION - ${type.toUpperCase()}</h1>
          ${item.numero_reference ? `<div class="field"><span class="label">Référence:</span> ${item.numero_reference}</div>` : ''}
          <div class="field"><span class="label">Date:</span> ${format(new Date(item.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}</div>
          <div class="field"><span class="label">Nom:</span> ${item.nom}</div>
          <div class="field"><span class="label">Email:</span> ${item.email}</div>
          ${item.sujet ? `<div class="field"><span class="label">Sujet:</span> ${item.sujet}</div>` : ''}
          ${item.objet ? `<div class="field"><span class="label">Objet:</span> ${item.objet}</div>` : ''}
          <div class="field"><span class="label">Statut:</span> ${getStatusLabel(item)}</div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderNotificationCard = (item: Notification, type: string, table: string) => {
    const displayName = item.nom_complet || item.nom || (item.prenom && item.nom ? `${item.prenom} ${item.nom}` : 'Sans nom');
    const isNew = table === 'job_applications' ? item.statut === 'nouveau' : !item.lu;
    
    return (
    <Card key={item.id} className={`relative ${isNew ? 'border-2 border-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(item)}>{getStatusLabel(item)}</Badge>
              {item.numero_reference && (
                <Badge variant="outline" className="font-mono text-xs">
                  {item.numero_reference}
                </Badge>
              )}
              {item.is_spontaneous && (
                <Badge variant="secondary" className="text-xs">
                  Spontanée
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{displayName}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
              </div>
            </CardDescription>
          </div>
          {!item.lu && (
            <div className="absolute top-4 right-4">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          <div><span className="font-semibold">Email:</span> {item.email}</div>
          {item.sujet && <div><span className="font-semibold">Sujet:</span> {item.sujet}</div>}
          {item.objet && <div><span className="font-semibold">Objet:</span> {item.objet}</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          {!item.lu && (
            <Button size="sm" variant="outline" onClick={() => markAsRead(table, item.id)}>
              <Eye className="h-4 w-4 mr-1" />
              Marquer comme lu
            </Button>
          )}
          {!item.repondu && (
            <Button size="sm" variant="outline" onClick={() => markAsReplied(table, item.id)}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Marquer comme répondu
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => downloadNotification(item, type)}>
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </Button>
          <Button size="sm" variant="outline" onClick={() => printNotification(item, type)}>
            <Printer className="h-4 w-4 mr-1" />
            Imprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Notifications et Alertes</CardTitle>
                <CardDescription>Gestion des demandes soumises en ligne</CardDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contacts" className="relative">
            <Mail className="h-4 w-4 mr-2" />
            Contacts
            {contacts.filter(c => !c.lu).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                {contacts.filter(c => !c.lu).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="avis" className="relative">
            <FileText className="h-4 w-4 mr-2" />
            Avis
            {demandesAvis.filter(d => !d.lu).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                {demandesAvis.filter(d => !d.lu).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="consultations" className="relative">
            <FileText className="h-4 w-4 mr-2" />
            Consultations
            {consultations.filter(c => !c.lu).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                {consultations.filter(c => !c.lu).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="signalements" className="relative">
            <AlertCircle className="h-4 w-4 mr-2" />
            Signalements
            {signalements.filter(s => !s.lu).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                {signalements.filter(s => !s.lu).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="candidatures" className="relative">
            <Users className="h-4 w-4 mr-2" />
            Candidatures
            {candidatures.filter(c => c.statut === 'nouveau').length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                {candidatures.filter(c => c.statut === 'nouveau').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {contacts.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun contact</CardContent></Card>
          ) : (
            contacts.map(item => renderNotificationCard(item, "contact", "contacts"))
          )}
        </TabsContent>

        <TabsContent value="avis" className="space-y-4">
          {demandesAvis.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune demande d'avis</CardContent></Card>
          ) : (
            demandesAvis.map(item => renderNotificationCard(item, "demande-avis", "demandes_avis"))
          )}
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          {consultations.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune consultation</CardContent></Card>
          ) : (
            consultations.map(item => renderNotificationCard(item, "consultation", "consultations_juridiques"))
          )}
        </TabsContent>

        <TabsContent value="signalements" className="space-y-4">
          {signalements.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun signalement</CardContent></Card>
          ) : (
            signalements.map(item => renderNotificationCard(item, "signalement", "signalements_contentieux"))
          )}
        </TabsContent>

        <TabsContent value="candidatures" className="space-y-4">
          {candidatures.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune candidature</CardContent></Card>
          ) : (
            candidatures.map(item => renderNotificationCard(item, "candidature", "job_applications"))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
