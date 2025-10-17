import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

interface DemandeAvis {
  id: string;
  nom_complet: string;
  email: string;
  telephone: string | null;
  organisme: string;
  objet: string;
  description: string;
  statut: string;
  reponse: string | null;
  created_at: string;
}

export default function DemandesAvisManagement() {
  const [demandes, setDemandes] = useState<DemandeAvis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState<DemandeAvis | null>(null);
  const [reponse, setReponse] = useState('');
  const [statut, setStatut] = useState('en_attente');
  const { toast } = useToast();

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const { data, error } = await supabase
        .from('demandes_avis' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandes((data as unknown as DemandeAvis[]) || []);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDemande) return;

    try {
      const { error } = await supabase
        .from('demandes_avis' as any)
        .update({
          statut,
          reponse: reponse || null,
        })
        .eq('id', selectedDemande.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Demande mise à jour avec succès',
      });
      
      setSelectedDemande(null);
      setReponse('');
      setStatut('en_attente');
      fetchDemandes();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openDetails = (demande: DemandeAvis) => {
    setSelectedDemande(demande);
    setReponse(demande.reponse || '');
    setStatut(demande.statut);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'text-yellow-600';
      case 'en_cours':
        return 'text-blue-600';
      case 'traite':
        return 'text-green-600';
      case 'rejete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'en_cours':
        return 'En cours';
      case 'traite':
        return 'Traité';
      case 'rejete':
        return 'Rejeté';
      default:
        return statut;
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'avis juridique</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Organisme</TableHead>
                <TableHead>Objet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demandes.map((demande) => (
                <TableRow key={demande.id}>
                  <TableCell>
                    {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{demande.nom_complet}</TableCell>
                  <TableCell>{demande.organisme}</TableCell>
                  <TableCell>{demande.objet}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(demande.statut)}>
                      {getStatusLabel(demande.statut)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(demande)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la demande</DialogTitle>
                        </DialogHeader>
                        {selectedDemande && (
                          <div className="space-y-4">
                            <div>
                              <strong>Nom complet:</strong> {selectedDemande.nom_complet}
                            </div>
                            <div>
                              <strong>Email:</strong> {selectedDemande.email}
                            </div>
                            <div>
                              <strong>Téléphone:</strong> {selectedDemande.telephone || '-'}
                            </div>
                            <div>
                              <strong>Organisme:</strong> {selectedDemande.organisme}
                            </div>
                            <div>
                              <strong>Objet:</strong> {selectedDemande.objet}
                            </div>
                            <div>
                              <strong>Description:</strong>
                              <p className="mt-1 whitespace-pre-wrap">{selectedDemande.description}</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="statut">Statut</Label>
                              <Select value={statut} onValueChange={setStatut}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en_attente">En attente</SelectItem>
                                  <SelectItem value="en_cours">En cours</SelectItem>
                                  <SelectItem value="traite">Traité</SelectItem>
                                  <SelectItem value="rejete">Rejeté</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="reponse">Réponse</Label>
                              <Textarea
                                id="reponse"
                                value={reponse}
                                onChange={(e) => setReponse(e.target.value)}
                                rows={6}
                              />
                            </div>

                            <Button onClick={handleUpdate}>
                              Mettre à jour
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}