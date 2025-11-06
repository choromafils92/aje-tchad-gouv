import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Save, X, Scale, Users, FileText } from "lucide-react";
import type { MissionPrincipale } from "@/types/missions";

const iconOptions = [
  { value: 'Scale', label: 'Balance (Scale)', icon: Scale },
  { value: 'Users', label: 'Utilisateurs (Users)', icon: Users },
  { value: 'FileText', label: 'Document (FileText)', icon: FileText }
];

const colorOptions = [
  { value: 'bg-primary/10 text-primary', label: 'Primaire' },
  { value: 'bg-accent/10 text-accent', label: 'Accent' },
  { value: 'bg-secondary/50 text-foreground', label: 'Secondaire' }
];

const MissionsPrincipalesManagement = () => {
  const [missions, setMissions] = useState<MissionPrincipale[]>([]);
  const [editingMission, setEditingMission] = useState<MissionPrincipale | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<'fr' | 'ar' | 'en'>('fr');

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions_principales' as any)
        .select('*')
        .order('ordre');

      if (error) throw error;
      setMissions((data || []) as any);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des missions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMission({
      id: '',
      code: '',
      title_fr: '',
      title_ar: '',
      title_en: '',
      description_fr: '',
      description_ar: '',
      description_en: '',
      content_fr: '',
      content_ar: '',
      content_en: '',
      details_fr: [''],
      details_ar: [''],
      details_en: [''],
      icon_name: 'Scale',
      color_class: 'bg-primary/10 text-primary',
      ordre: missions.length + 1,
      published: true,
      created_by: '',
      created_at: '',
      updated_at: ''
    } as any);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingMission) return;

    try {
      const missionData = {
        code: editingMission.code,
        title_fr: editingMission.title_fr,
        title_ar: editingMission.title_ar,
        title_en: editingMission.title_en,
        description_fr: editingMission.description_fr,
        description_ar: editingMission.description_ar,
        description_en: editingMission.description_en,
        content_fr: editingMission.content_fr,
        content_ar: editingMission.content_ar,
        content_en: editingMission.content_en,
        details_fr: editingMission.details_fr.filter(d => d.trim()),
        details_ar: editingMission.details_ar.filter(d => d.trim()),
        details_en: editingMission.details_en.filter(d => d.trim()),
        icon_name: editingMission.icon_name,
        color_class: editingMission.color_class,
        ordre: editingMission.ordre,
        published: editingMission.published
      };

      if (isCreating) {
        const { error } = await supabase
          .from('missions_principales' as any)
          .insert([{ ...missionData, created_by: (await supabase.auth.getUser()).data.user?.id }]);
        
        if (error) throw error;
        toast.success("Mission créée avec succès");
      } else {
        const { error } = await supabase
          .from('missions_principales' as any)
          .update(missionData)
          .eq('id', editingMission.id);
        
        if (error) throw error;
        toast.success("Mission mise à jour avec succès");
      }

      setEditingMission(null);
      setIsCreating(false);
      fetchMissions();
    } catch (error: any) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) return;

    try {
      const { error } = await supabase
        .from('missions_principales' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Mission supprimée avec succès");
      fetchMissions();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const addDetail = (lang: 'fr' | 'ar' | 'en') => {
    if (!editingMission) return;
    setEditingMission({
      ...editingMission,
      [`details_${lang}`]: [...editingMission[`details_${lang}`], '']
    });
  };

  const updateDetail = (lang: 'fr' | 'ar' | 'en', index: number, value: string) => {
    if (!editingMission) return;
    const details = [...editingMission[`details_${lang}`]];
    details[index] = value;
    setEditingMission({
      ...editingMission,
      [`details_${lang}`]: details
    });
  };

  const removeDetail = (lang: 'fr' | 'ar' | 'en', index: number) => {
    if (!editingMission) return;
    const details = editingMission[`details_${lang}`].filter((_, i) => i !== index);
    setEditingMission({
      ...editingMission,
      [`details_${lang}`]: details
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Missions Principales</h2>
          <p className="text-muted-foreground">Gérez les trois missions principales de l'AJE (multilingue)</p>
        </div>
        <Button onClick={handleCreate} disabled={missions.length >= 3}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Mission
        </Button>
      </div>

      {editingMission ? (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Nouvelle Mission" : "Modifier la Mission"}</CardTitle>
            <CardDescription>Support multilingue: Français, Arabe, Anglais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code unique *</Label>
                <Input
                  value={editingMission.code}
                  onChange={(e) => setEditingMission({ ...editingMission, code: e.target.value })}
                  placeholder="ex: representation"
                  disabled={!isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label>Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={editingMission.ordre}
                  onChange={(e) => setEditingMission({ ...editingMission, ordre: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icône</Label>
                <Select value={editingMission.icon_name} onValueChange={(value) => setEditingMission({ ...editingMission, icon_name: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Couleur</Label>
                <Select value={editingMission.color_class} onValueChange={(value) => setEditingMission({ ...editingMission, color_class: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingMission.published}
                onCheckedChange={(checked) => setEditingMission({ ...editingMission, published: checked })}
              />
              <Label>Publié</Label>
            </div>

            <Tabs value={currentLang} onValueChange={(v) => setCurrentLang(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              {(['fr', 'ar', 'en'] as const).map(lang => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titre ({lang.toUpperCase()}) *</Label>
                    <Input
                      value={editingMission[`title_${lang}`]}
                      onChange={(e) => setEditingMission({ ...editingMission, [`title_${lang}`]: e.target.value })}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description courte ({lang.toUpperCase()}) *</Label>
                    <Textarea
                      value={editingMission[`description_${lang}`]}
                      onChange={(e) => setEditingMission({ ...editingMission, [`description_${lang}`]: e.target.value })}
                      rows={3}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenu détaillé ({lang.toUpperCase()}) - HTML supporté</Label>
                    <Textarea
                      value={editingMission[`content_${lang}`]}
                      onChange={(e) => setEditingMission({ ...editingMission, [`content_${lang}`]: e.target.value })}
                      rows={8}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Points d'intervention ({lang.toUpperCase()})</Label>
                      <Button type="button" size="sm" variant="outline" onClick={() => addDetail(lang)}>
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                      </Button>
                    </div>
                    {editingMission[`details_${lang}`].map((detail, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={detail}
                          onChange={(e) => updateDetail(lang, index, e.target.value)}
                          placeholder={`Point ${index + 1}`}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeDetail(lang, index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setEditingMission(null); setIsCreating(false); }}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {missions.map((mission) => {
            const IconComponent = iconOptions.find(opt => opt.value === mission.icon_name)?.icon || Scale;
            return (
              <Card key={mission.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${mission.color_class}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{mission.title_fr}</h3>
                          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                            {mission.code}
                          </span>
                          {!mission.published && (
                            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                              Non publié
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{mission.description_fr}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>🇫🇷 FR • 🇸🇦 AR • 🇬🇧 EN</span>
                          <span>Ordre: {mission.ordre}</span>
                          <span>{mission.details_fr.length} points d'intervention</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingMission(mission)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(mission.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MissionsPrincipalesManagement;
