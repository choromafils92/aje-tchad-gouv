import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MediaAccreditationsManagement() {
  const [loading, setLoading] = useState(false);
  const [accreditations, setAccreditations] = useState<any[]>([]);
  const [selectedAccreditation, setSelectedAccreditation] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const fetchAccreditations = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('media_accreditations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccreditations(data || []);
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

  const handleUpdateStatus = async (id: string, statut: string, notes?: string) => {
    try {
      const updateData: any = { statut };
      if (notes !== undefined) {
        updateData.notes_internes = notes;
      }

      const { error } = await (supabase as any)
        .from('media_accreditations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Statut mis à jour',
      });
      fetchAccreditations();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejete':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'Accréditation Presse</CardTitle>
          <CardDescription>
            Gérez les demandes d'accréditation des journalistes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accreditations.map((accred) => (
                <TableRow key={accred.id}>
                  <TableCell>{accred.nom_complet}</TableCell>
                  <TableCell>{accred.media_organisation}</TableCell>
                  <TableCell>{accred.type_accreditation}</TableCell>
                  <TableCell>
                    {new Date(accred.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(accred.statut)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAccreditation(accred);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Examinez et traitez la demande d'accréditation
            </DialogDescription>
          </DialogHeader>
          {selectedAccreditation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom complet</Label>
                  <p className="text-sm">{selectedAccreditation.nom_complet}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedAccreditation.email}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="text-sm">{selectedAccreditation.telephone}</p>
                </div>
                <div>
                  <Label>Organisation</Label>
                  <p className="text-sm">{selectedAccreditation.media_organisation}</p>
                </div>
                <div>
                  <Label>Fonction</Label>
                  <p className="text-sm">{selectedAccreditation.fonction}</p>
                </div>
                <div>
                  <Label>Type d'accréditation</Label>
                  <p className="text-sm">{selectedAccreditation.type_accreditation}</p>
                </div>
              </div>
              <div>
                <Label>Motif</Label>
                <p className="text-sm">{selectedAccreditation.motif}</p>
              </div>
              <div>
                <Label>Notes internes</Label>
                <Textarea
                  value={selectedAccreditation.notes_internes || ''}
                  onChange={(e) =>
                    setSelectedAccreditation({
                      ...selectedAccreditation,
                      notes_internes: e.target.value,
                    })
                  }
                  placeholder="Ajoutez des notes..."
                />
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={selectedAccreditation.statut}
                  onValueChange={(value) =>
                    setSelectedAccreditation({
                      ...selectedAccreditation,
                      statut: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="approuve">Approuvé</SelectItem>
                    <SelectItem value="rejete">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedAccreditation.id,
                      selectedAccreditation.statut,
                      selectedAccreditation.notes_internes
                    )
                  }
                >
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
