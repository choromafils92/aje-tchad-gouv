import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

interface Contact {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  statut: string;
  created_at: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts((data as unknown as Contact[]) || []);
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

  const updateStatus = async (id: string, statut: string) => {
    try {
      const { error } = await supabase
        .from('contacts' as any)
        .update({ statut })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Statut mis à jour avec succès',
      });
      
      fetchContacts();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'nouveau':
        return 'text-blue-600';
      case 'lu':
        return 'text-yellow-600';
      case 'traite':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'nouveau':
        return 'Nouveau';
      case 'lu':
        return 'Lu';
      case 'traite':
        return 'Traité';
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
          <CardTitle>Messages de contact</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{contact.nom}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.sujet}</TableCell>
                  <TableCell>
                    <Select
                      value={contact.statut}
                      onValueChange={(value) => updateStatus(contact.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nouveau">Nouveau</SelectItem>
                        <SelectItem value="lu">Lu</SelectItem>
                        <SelectItem value="traite">Traité</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails du message</DialogTitle>
                        </DialogHeader>
                        {selectedContact && (
                          <div className="space-y-4">
                            <div>
                              <strong>Nom:</strong> {selectedContact.nom}
                            </div>
                            <div>
                              <strong>Email:</strong> {selectedContact.email}
                            </div>
                            <div>
                              <strong>Téléphone:</strong> {selectedContact.telephone || '-'}
                            </div>
                            <div>
                              <strong>Sujet:</strong> {selectedContact.sujet}
                            </div>
                            <div>
                              <strong>Message:</strong>
                              <p className="mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>
                            <div>
                              <strong>Date:</strong> {new Date(selectedContact.created_at).toLocaleString('fr-FR')}
                            </div>
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