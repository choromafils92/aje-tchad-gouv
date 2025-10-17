import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Users, Award, TrendingUp } from 'lucide-react';

const jobOffers = [
  {
    id: 1,
    title: 'Juriste Conseil',
    department: 'Département Juridique',
    location: 'N\'Djamena, Tchad',
    type: 'CDI',
    experience: '3-5 ans',
    description: 'Nous recherchons un juriste conseil expérimenté pour rejoindre notre équipe.',
  },
  {
    id: 2,
    title: 'Avocat Contentieux',
    department: 'Contentieux',
    location: 'N\'Djamena, Tchad',
    type: 'CDI',
    experience: '5+ ans',
    description: 'Poste d\'avocat spécialisé en contentieux administratif et droit public.',
  },
  {
    id: 3,
    title: 'Assistant Juridique',
    department: 'Administration',
    location: 'N\'Djamena, Tchad',
    type: 'CDD',
    experience: '1-2 ans',
    description: 'Assistant(e) juridique pour soutenir l\'équipe dans les tâches administratives.',
  },
];

export default function Carrieres() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-background to-accent/5">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Carrières à l'AJE</h1>
              <p className="text-lg opacity-90">
                Rejoignez une équipe passionnée au service de l'État tchadien
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous rejoindre ?</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">Équipe d'excellence</h3>
                  <p className="text-muted-foreground">
                    Travaillez avec des professionnels reconnus dans leur domaine
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">Formation continue</h3>
                  <p className="text-muted-foreground">
                    Développez vos compétences avec nos programmes de formation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">Évolution de carrière</h3>
                  <p className="text-muted-foreground">
                    Progressez dans votre carrière au sein d'une institution prestigieuse
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Job Offers Section */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Postes disponibles</h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {jobOffers.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-muted-foreground">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Expérience: {job.experience}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button>Postuler</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Candidature Spontanée */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Candidature spontanée</CardTitle>
                <CardDescription>
                  Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre candidature spontanée.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Nous sommes toujours à la recherche de talents exceptionnels. Envoyez votre CV et lettre de motivation à :
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Email: recrutement@aje.td</p>
                  <p className="text-sm text-muted-foreground">
                    Objet: Candidature spontanée - [Votre nom]
                  </p>
                </div>
                <Button className="mt-6">Envoyer ma candidature</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
