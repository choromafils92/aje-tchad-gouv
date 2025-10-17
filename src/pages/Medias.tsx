import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Image, Video, Newspaper, Phone } from 'lucide-react';

const pressReleases = [
  {
    id: 1,
    title: 'Nouvelle réforme du contentieux administratif',
    date: '15 Janvier 2025',
    category: 'Communiqué',
    excerpt: 'L\'AJE annonce une modernisation des procédures de contentieux administratif...',
  },
  {
    id: 2,
    title: 'Rapport annuel 2024',
    date: '10 Janvier 2025',
    category: 'Rapport',
    excerpt: 'Le rapport d\'activité 2024 de l\'AJE est désormais disponible...',
  },
];

const mediaKit = [
  {
    name: 'Logo AJE (PNG)',
    type: 'Image',
    size: '2.3 MB',
    icon: Image,
  },
  {
    name: 'Logo AJE (SVG)',
    type: 'Image',
    size: '45 KB',
    icon: Image,
  },
  {
    name: 'Plaquette institutionnelle',
    type: 'PDF',
    size: '5.8 MB',
    icon: FileText,
  },
];

export default function Medias() {
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
                    <div className="space-y-2 text-sm">
                      <p><strong>Service Communication</strong></p>
                      <p>Email: presse@aje.td</p>
                      <p>Téléphone: +235 XX XX XX XX</p>
                      <p className="text-muted-foreground mt-4">
                        Disponible du lundi au vendredi de 8h à 17h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button size="lg">
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

                {pressReleases.map((release) => (
                  <Card key={release.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{release.category}</Badge>
                            <span className="text-sm text-muted-foreground">{release.date}</span>
                          </div>
                          <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                          <CardDescription>{release.excerpt}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="kit" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Kit Média</h2>
                  <p className="text-muted-foreground">
                    Téléchargez nos logos, visuels et documents institutionnels
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {mediaKit.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.type} • {item.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="galerie" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Galerie Photos & Vidéos</h2>
                  <p className="text-muted-foreground">
                    Images et vidéos libres de droits pour usage médiatique
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden group cursor-pointer">
                      <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-sm font-medium">Photo {item}</p>
                        <p className="text-xs text-muted-foreground">Haute résolution</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                <Button className="w-full">S'abonner à la newsletter presse</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
