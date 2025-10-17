import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function RendezVous() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    organisme: '',
    motif: '',
    date_souhaitee: '',
    heure_souhaitee: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contacts' as any)
        .insert([{
          nom: `${formData.prenom} ${formData.nom}`,
          email: formData.email,
          telephone: formData.telephone,
          sujet: `Demande de rendez-vous - ${formData.motif}`,
          message: `Organisme: ${formData.organisme}\nDate souhaitée: ${formData.date_souhaitee}\nHeure souhaitée: ${formData.heure_souhaitee}\n\nMessage:\n${formData.message}`,
          statut: 'nouveau'
        }]);

      if (error) throw error;

      toast({
        title: 'Demande envoyée',
        description: 'Votre demande de rendez-vous a été envoyée avec succès. Nous vous recontacterons dans les plus brefs délais.',
      });

      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        organisme: '',
        motif: '',
        date_souhaitee: '',
        heure_souhaitee: '',
        message: '',
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de l\'envoi de votre demande.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Prendre Rendez-vous</h1>
              <p className="text-muted-foreground text-lg">
                Demandez un rendez-vous avec nos experts juridiques
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Planifiez facilement</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez la date et l'heure qui vous conviennent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Réponse rapide</h3>
                  <p className="text-sm text-muted-foreground">
                    Confirmation sous 48 heures ouvrées
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Conseil personnalisé</h3>
                  <p className="text-sm text-muted-foreground">
                    Entretien adapté à vos besoins
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulaire de demande de rendez-vous</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous contacterons pour confirmer votre rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organisme">Organisme / Entreprise</Label>
                    <Input
                      id="organisme"
                      value={formData.organisme}
                      onChange={(e) => setFormData({ ...formData, organisme: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motif">Motif du rendez-vous *</Label>
                    <Select
                      value={formData.motif}
                      onValueChange={(value) => setFormData({ ...formData, motif: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un motif" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation juridique</SelectItem>
                        <SelectItem value="avis">Demande d'avis</SelectItem>
                        <SelectItem value="contentieux">Contentieux</SelectItem>
                        <SelectItem value="redaction">Rédaction de contrat</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_souhaitee">Date souhaitée *</Label>
                      <Input
                        id="date_souhaitee"
                        type="date"
                        value={formData.date_souhaitee}
                        onChange={(e) => setFormData({ ...formData, date_souhaitee: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heure_souhaitee">Heure souhaitée *</Label>
                      <Select
                        value={formData.heure_souhaitee}
                        onValueChange={(value) => setFormData({ ...formData, heure_souhaitee: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message complémentaire</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      placeholder="Précisez les détails de votre demande..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
