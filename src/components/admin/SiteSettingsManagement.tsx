import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  label: string;
  description?: string;
}

const SiteSettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: Record<string, any> = {};
      data?.forEach((setting: SiteSetting) => {
        settingsMap[setting.key] = setting.value;
      });
      setSettings(settingsMap);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("key", key);

      if (error) throw error;

      setSettings({ ...settings, [key]: value });
      toast({
        title: "Succès",
        description: "Paramètre mis à jour avec succès",
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("director-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("director-photos")
        .getPublicUrl(filePath);

      await updateSetting("director_photo", data.publicUrl);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateDirectorMessage = (index: number, value: string) => {
    const messages = [...(settings.director_message || [])];
    messages[index] = value;
    setSettings({ ...settings, director_message: messages });
  };

  const addDirectorMessageParagraph = () => {
    const messages = [...(settings.director_message || []), ""];
    setSettings({ ...settings, director_message: messages });
  };

  const removeDirectorMessageParagraph = (index: number) => {
    const messages = [...(settings.director_message || [])];
    messages.splice(index, 1);
    setSettings({ ...settings, director_message: messages });
  };

  const updateSubdirection = (index: number, field: string, value: string) => {
    const subdirections = [...(settings.subdirections || [])];
    subdirections[index] = { ...subdirections[index], [field]: value };
    setSettings({ ...settings, subdirections });
  };

  const addSubdirection = () => {
    const subdirections = [
      ...(settings.subdirections || []),
      { name: "", responsable: "", phone: "", email: "" },
    ];
    setSettings({ ...settings, subdirections });
  };

  const removeSubdirection = (index: number) => {
    const subdirections = [...(settings.subdirections || [])];
    subdirections.splice(index, 1);
    setSettings({ ...settings, subdirections });
  };

  const updateContentieuxDomain = (index: number, field: string, value: string) => {
    const domains = [...(settings.contentieux_domains || [])];
    domains[index] = { ...domains[index], [field]: value };
    setSettings({ ...settings, contentieux_domains: domains });
  };

  const addContentieuxDomain = () => {
    const domains = [
      ...(settings.contentieux_domains || []),
      { title: "", description: "" },
    ];
    setSettings({ ...settings, contentieux_domains: domains });
  };

  const removeContentieuxDomain = (index: number) => {
    const domains = [...(settings.contentieux_domains || [])];
    domains.splice(index, 1);
    setSettings({ ...settings, contentieux_domains: domains });
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
      <Tabs defaultValue="director" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="director">Directeur</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contentieux">Contentieux</TabsTrigger>
        </TabsList>

        <TabsContent value="director">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Directeur</CardTitle>
              <CardDescription>Gérer les informations et le message du directeur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Photo du Directeur</Label>
                {settings.director_photo && (
                  <img
                    src={settings.director_photo}
                    alt="Directeur"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </div>

              <div className="space-y-2">
                <Label>Nom du Directeur</Label>
                <Input
                  value={settings.director_name || ""}
                  onChange={(e) => setSettings({ ...settings, director_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Titre du Directeur</Label>
                <Input
                  value={settings.director_title || ""}
                  onChange={(e) => setSettings({ ...settings, director_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Grade du Directeur</Label>
                <Input
                  value={settings.director_grade || ""}
                  onChange={(e) => setSettings({ ...settings, director_grade: e.target.value })}
                  placeholder="Ex: MAGISTRAT"
                />
              </div>

              <div className="space-y-2">
                <Label>Message du Directeur</Label>
                {(settings.director_message || []).map((paragraph: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => updateDirectorMessage(index, e.target.value)}
                      placeholder={`Paragraphe ${index + 1}`}
                      rows={3}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDirectorMessageParagraph(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addDirectorMessageParagraph}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter un paragraphe
                </Button>
              </div>

              <Button onClick={() => {
                updateSetting("director_name", settings.director_name);
                updateSetting("director_title", settings.director_title);
                updateSetting("director_grade", settings.director_grade);
                updateSetting("director_message", settings.director_message);
              }} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
              <CardDescription>Gérer les coordonnées et les sous-directions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Textarea
                    value={settings.contact_address || ""}
                    onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={settings.contact_phone || ""}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Horaires d'ouverture</Label>
                  <Textarea
                    value={settings.contact_hours || ""}
                    onChange={(e) => setSettings({ ...settings, contact_hours: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Sous-Directions</Label>
                {(settings.subdirections || []).map((sub: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Sous-Direction {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSubdirection(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input
                          value={sub.name || ""}
                          onChange={(e) => updateSubdirection(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Responsable</Label>
                        <Input
                          value={sub.responsable || ""}
                          onChange={(e) => updateSubdirection(index, "responsable", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                          value={sub.phone || ""}
                          onChange={(e) => updateSubdirection(index, "phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={sub.email || ""}
                          onChange={(e) => updateSubdirection(index, "email", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addSubdirection}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une sous-direction
                </Button>
              </div>

              <Button onClick={() => {
                updateSetting("contact_address", settings.contact_address);
                updateSetting("contact_phone", settings.contact_phone);
                updateSetting("contact_email", settings.contact_email);
                updateSetting("contact_hours", settings.contact_hours);
                updateSetting("subdirections", settings.subdirections);
              }} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Section Services</CardTitle>
              <CardDescription>Gérer le texte d'introduction des services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Texte d'introduction</Label>
                <Textarea
                  value={settings.services_intro || ""}
                  onChange={(e) => setSettings({ ...settings, services_intro: e.target.value })}
                  rows={4}
                />
              </div>

              <Button onClick={() => updateSetting("services_intro", settings.services_intro)} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contentieux">
          <Card>
            <CardHeader>
              <CardTitle>Domaines de Contentieux</CardTitle>
              <CardDescription>Gérer les domaines de contentieux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(settings.contentieux_domains || []).map((domain: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Domaine {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeContentieuxDomain(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Titre</Label>
                      <Input
                        value={domain.title || ""}
                        onChange={(e) => updateContentieuxDomain(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={domain.description || ""}
                        onChange={(e) => updateContentieuxDomain(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addContentieuxDomain}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter un domaine
              </Button>

              <Button onClick={() => updateSetting("contentieux_domains", settings.contentieux_domains)} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsManagement;
