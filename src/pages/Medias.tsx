import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Image, Video, Newspaper, Phone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Medias() {
  const [loading, setLoading] = useState(false);
  const [pressContact, setPressContact] = useState<any>(null);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [mediaKit, setMediaKit] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [accreditationOpen, setAccreditationOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [accreditationForm, setAccreditationForm] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    media_organisation: '',
    fonction: '',
    type_accreditation: 'permanente',
    motif: '',
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch press contact
      const { data: contact } = await (supabase as any)
        .from('media_press_contacts')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (contact) setPressContact(contact);

      // Fetch press releases
      const { data: releases } = await (supabase as any)
        .from('media_press_releases')
        .select('*')
        .eq('published', true)
        .order('date_publication', { ascending: false });
      setPressReleases(releases || []);

      // Fetch media kit
      const { data: kit } = await (supabase as any)
        .from('media_kit_items')
        .select('*')
        .eq('published', true)
        .order('ordre', { ascending: true });
      setMediaKit(kit || []);

      // Fetch gallery items
      const { data: gallery } = await (supabase as any)
        .from('media_gallery_items')
        .select('*')
        .eq('published', true)
        .order('ordre', { ascending: true });
      setGalleryItems(gallery || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, filename: string) => {
    // Créer un élément temporaire pour forcer le téléchargement
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAccreditationSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('media_accreditations')
        .insert([accreditationForm]);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Votre demande d\'accréditation a été envoyée',
      });
      setAccreditationOpen(false);
      setAccreditationForm({
        nom_complet: '',
        email: '',
        telephone: '',
        media_organisation: '',
        fonction: '',
        type_accreditation: 'permanente',
        motif: '',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer votre email',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('media_press_newsletter')
        .insert([{ email: newsletterEmail }]);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Vous êtes abonné à la newsletter presse',
      });
      setNewsletterOpen(false);
      setNewsletterEmail('');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-background to-accent/5">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Espace Médias</h1>
              <p className="text-lg opacity-90">
                Ressources et informations pour les professionnels des médias
              </p>
            </div>
          </div>
        </section>

        {/* Contact Presse */}
        <section className="py-12 bg-accent/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Contact Presse
                    </h3>
                    {pressContact ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>{pressContact.service_name}</strong></p>
                        <p>Email: {pressContact.email}</p>
                        <p>Téléphone: {pressContact.phone}</p>
                        <p className="text-muted-foreground mt-4">
                          {pressContact.availability_hours}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p><strong>Service Communication</strong></p>
                        <p>Email: presse@aje.td</p>
                        <p>Téléphone: +235 XX XX XX XX</p>
                        <p className="text-muted-foreground mt-4">
                          Disponible du lundi au vendredi de 8h à 17h
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <Button size="lg" onClick={() => setAccreditationOpen(true)}>
                      Demander une accréditation presse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="communiques" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="communiques">Communiqués</TabsTrigger>
                <TabsTrigger value="kit">Kit Média</TabsTrigger>
                <TabsTrigger value="galerie">Galerie</TabsTrigger>
              </TabsList>

              <TabsContent value="communiques" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Communiqués de presse</h2>
                  <p className="text-muted-foreground">
                    Retrouvez tous nos communiqués et rapports officiels
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : pressReleases.length > 0 ? (
                  pressReleases.map((release) => (
                    <Card key={release.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{release.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(release.date_publication).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                            <CardDescription>{release.excerpt}</CardDescription>
                          </div>
                          {release.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(release.file_url, release.title + '.pdf')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun communiqué disponible
                  </p>
                )}
              </TabsContent>

              <TabsContent value="kit" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Kit Média</h2>
                  <p className="text-muted-foreground">
                    Téléchargez nos logos, visuels et documents institutionnels
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {mediaKit.length > 0 ? (
                      mediaKit.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.type} • {(item.file_size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(item.file_url, item.name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8 col-span-2">
                        Aucun élément disponible
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="galerie" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Galerie Photos & Vidéos</h2>
                  <p className="text-muted-foreground">
                    Images et vidéos libres de droits pour usage médiatique
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Documents PDF en haut */}
                    {galleryItems.filter(item => item.type === 'pdf').length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Documents PDF
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {galleryItems
                            .filter(item => item.type === 'pdf')
                            .map((item) => (
                              <Card key={item.id}>
                                <CardContent className="pt-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="h-6 w-6 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-semibold">{item.title}</p>
                                        {item.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {item.description}
                                          </p>
                                        )}
                                        {item.file_size && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {(item.file_size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownload(item.file_url, item.title + '.pdf')}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Photos et vidéos */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Image className="h-5 w-5 text-primary" />
                        Photos et Vidéos
                      </h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {galleryItems.filter(item => item.type !== 'pdf').length > 0 ? (
                          galleryItems
                            .filter(item => item.type !== 'pdf')
                            .map((item) => (
                              <Card key={item.id} className="overflow-hidden group cursor-pointer">
                                <div className="aspect-video bg-muted relative">
                                  {item.type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <Video className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                  ) : (
                                    <img
                                      src={item.thumbnail_url}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleDownload(item.file_url, item.title)}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Télécharger
                                    </Button>
                                  </div>
                                </div>
                                <CardContent className="pt-4">
                                  <p className="text-sm font-medium">{item.title}</p>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.resolution && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {item.resolution}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8 col-span-3">
                            Aucune photo ou vidéo disponible
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto bg-primary-foreground text-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-6 w-6" />
                  Newsletter Presse
                </CardTitle>
                <CardDescription>
                  Recevez nos communiqués de presse directement dans votre boîte mail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setNewsletterOpen(true)}>
                  S'abonner à la newsletter presse
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />

      {/* Accreditation Dialog */}
      <Dialog open={accreditationOpen} onOpenChange={setAccreditationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Demande d'Accréditation Presse</DialogTitle>
            <DialogDescription>
              Remplissez ce formulaire pour demander une accréditation presse
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  value={accreditationForm.nom_complet}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, nom_complet: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={accreditationForm.email}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={accreditationForm.telephone}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, telephone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="organisation">Organisation média</Label>
                <Input
                  id="organisation"
                  value={accreditationForm.media_organisation}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, media_organisation: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="fonction">Fonction</Label>
                <Input
                  id="fonction"
                  value={accreditationForm.fonction}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, fonction: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type">Type d'accréditation</Label>
                <Select
                  value={accreditationForm.type_accreditation}
                  onValueChange={(value) =>
                    setAccreditationForm({ ...accreditationForm, type_accreditation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanente">Permanente</SelectItem>
                    <SelectItem value="temporaire">Temporaire</SelectItem>
                    <SelectItem value="evenement">Événement spécifique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="motif">Motif de la demande</Label>
              <Textarea
                id="motif"
                value={accreditationForm.motif}
                onChange={(e) =>
                  setAccreditationForm({ ...accreditationForm, motif: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAccreditationSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
              <Button variant="outline" onClick={() => setAccreditationOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Newsletter Dialog */}
      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>S'abonner à la Newsletter Presse</DialogTitle>
            <DialogDescription>
              Recevez nos communiqués de presse directement par email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newsletter-email">Email</Label>
              <Input
                id="newsletter-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNewsletterSubscribe} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Abonnement...
                  </>
                ) : (
                  'S\'abonner'
                )}
              </Button>
              <Button variant="outline" onClick={() => setNewsletterOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
