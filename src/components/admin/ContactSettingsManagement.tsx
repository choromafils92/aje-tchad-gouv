import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SubDirection {
  nom: string;
  responsable: string;
  telephone: string;
  email: string;
}

export default function ContactSettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [subdirections, setSubdirections] = useState<SubDirection[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "contact_address",
          "contact_phone",
          "contact_email",
          "contact_hours",
          "contact_subdirections"
        ]);

      if (error) throw error;

      data?.forEach((setting: any) => {
        switch (setting.key) {
          case "contact_address":
            setAddress(setting.value || "");
            break;
          case "contact_phone":
            setPhone(setting.value || "");
            break;
          case "contact_email":
            setEmail(setting.value || "");
            break;
          case "contact_hours":
            setHours(setting.value || "");
            break;
          case "contact_subdirections":
            setSubdirections(setting.value || []);
            break;
        }
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        {
          key: "contact_address",
          category: "contact",
          label: "Adresse",
          value: address,
        },
        {
          key: "contact_phone",
          category: "contact",
          label: "Téléphone",
          value: phone,
        },
        {
          key: "contact_email",
          category: "contact",
          label: "Email",
          value: email,
        },
        {
          key: "contact_hours",
          category: "contact",
          label: "Horaires",
          value: hours,
        },
        {
          key: "contact_subdirections",
          category: "contact",
          label: "Sous-directions",
          value: subdirections,
        },
      ];

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from("site_settings")
          .upsert({
            ...update,
            description: `Information de contact: ${update.label}`,
          }, { onConflict: 'key' });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Les paramètres de contact ont été enregistrés",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSubdirection = () => {
    setSubdirections([
      ...subdirections,
      { nom: "", responsable: "", telephone: "", email: "" },
    ]);
  };

  const removeSubdirection = (index: number) => {
    setSubdirections(subdirections.filter((_, i) => i !== index));
  };

  const updateSubdirection = (index: number, field: keyof SubDirection, value: string) => {
    const updated = [...subdirections];
    updated[index] = { ...updated[index], [field]: value };
    setSubdirections(updated);
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordonnées Générales
          </CardTitle>
          <CardDescription>
            Gérez les informations de contact principales affichées sur la page Contact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Avenue Félix Éboué, Quartier administratif&#10;N'Djamena, République du Tchad"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+235 22 XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@aje.td"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horaires d'ouverture
            </Label>
            <Textarea
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Lundi au Jeudi : 7h30 - 15h30&#10;Vendredi : 7h30 - 12h30&#10;Weekend : Fermé"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sous-Directions</CardTitle>
              <CardDescription>
                Gérez les contacts des différentes sous-directions
              </CardDescription>
            </div>
            <Button onClick={addSubdirection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {subdirections.map((subdirection, index) => (
            <div key={index}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Sous-direction #{index + 1}
                  </h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSubdirection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de la sous-direction</Label>
                    <Input
                      value={subdirection.nom}
                      onChange={(e) => updateSubdirection(index, "nom", e.target.value)}
                      placeholder="Sous-Direction du Contentieux Judiciaire"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Responsable</Label>
                    <Input
                      value={subdirection.responsable}
                      onChange={(e) => updateSubdirection(index, "responsable", e.target.value)}
                      placeholder="Sous-Directeur du Contentieux Judiciaire"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={subdirection.telephone}
                      onChange={(e) => updateSubdirection(index, "telephone", e.target.value)}
                      placeholder="+235 22 XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={subdirection.email}
                      onChange={(e) => updateSubdirection(index, "email", e.target.value)}
                      placeholder="contentieux.judiciaire@aje.td"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {subdirections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune sous-direction ajoutée. Cliquez sur "Ajouter" pour commencer.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Enregistrement..." : "Enregistrer tout"}
        </Button>
      </div>
    </div>
  );
}
