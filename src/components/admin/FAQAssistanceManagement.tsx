import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, Plus, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AssistanceContact {
  id: string;
  service_name: string;
  contact_label: string;
  contact_value: string;
  additional_info: string | null;
  ordre: number;
}

const FAQAssistanceManagement = () => {
  const [contacts, setContacts] = useState<AssistanceContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service_name: "",
    contact_label: "",
    contact_value: "",
    additional_info: "",
    ordre: 0
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("faq_assistance_contacts" as any)
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setContacts(data as any || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts d'assistance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("faq_assistance_contacts" as any)
          .update({
            service_name: formData.service_name,
            contact_label: formData.contact_label,
            contact_value: formData.contact_value,
            additional_info: formData.additional_info,
            ordre: formData.ordre,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Contact d'assistance modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from("faq_assistance_contacts" as any)
          .insert([{
            ...formData,
            created_by: user.id
          }]);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Contact d'assistance ajouté avec succès",
        });
      }

      setFormData({
        service_name: "",
        contact_label: "",
        contact_value: "",
        additional_info: "",
        ordre: 0
      });
      setEditingId(null);
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: AssistanceContact) => {
    setEditingId(contact.id);
    setFormData({
      service_name: contact.service_name,
      contact_label: contact.contact_label,
      contact_value: contact.contact_value,
      additional_info: contact.additional_info || "",
      ordre: contact.ordre
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return;

    try {
      const { error } = await supabase
        .from("faq_assistance_contacts" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Contact d'assistance supprimé",
      });
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier" : "Ajouter"} un contact d'assistance</CardTitle>
          <CardDescription>
            Gérez les informations de contact affichées sur la page FAQ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_name">Nom du service *</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  placeholder="Ex: Par téléphone"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_label">Label du contact *</Label>
                <Input
                  id="contact_label"
                  value={formData.contact_label}
                  onChange={(e) => setFormData({ ...formData, contact_label: e.target.value })}
                  placeholder="Ex: Service client AJE"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_value">Valeur du contact *</Label>
                <Input
                  id="contact_value"
                  value={formData.contact_value}
                  onChange={(e) => setFormData({ ...formData, contact_value: e.target.value })}
                  placeholder="Ex: +235 22 XX XX XX ou email@aje.td"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordre">Ordre d'affichage</Label>
                <Input
                  id="ordre"
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info">Informations complémentaires</Label>
              <Textarea
                id="additional_info"
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                placeholder="Ex: Lun-Jeu : 7h30-15h30, Ven : 7h30-12h30"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Modifier" : "Ajouter"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      service_name: "",
                      contact_label: "",
                      contact_value: "",
                      additional_info: "",
                      ordre: 0
                    });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacts d'assistance existants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun contact d'assistance configuré
              </p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{contact.service_name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.contact_label}</p>
                    <p className="font-medium mt-1">{contact.contact_value}</p>
                    {contact.additional_info && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {contact.additional_info}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Ordre: {contact.ordre}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQAssistanceManagement;
