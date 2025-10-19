import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
}

const AdminManagement = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (userRoles && userRoles.length > 0) {
        const userIds = userRoles.map(r => r.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;
        setAdmins(profiles || []);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des administrateurs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir l\'email et le mot de passe.',
        variant: 'destructive',
      });
      return;
    }

    setAddingAdmin(true);
    try {
      // Create new user with auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            full_name: newAdminName || '',
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer l\'utilisateur.',
          variant: 'destructive',
        });
        return;
      }

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: authData.user.id, role: 'admin' });

      if (roleError) throw roleError;

      toast({
        title: 'Utilisateur créé',
        description: 'Le nouvel administrateur a été créé avec succès.',
      });

      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminName('');
      setShowAddForm(false);
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'administrateur.',
        variant: 'destructive',
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: 'Administrateur retiré',
        description: 'Le rôle d\'administrateur a été retiré.',
      });

      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de retirer le rôle d\'administrateur.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter utilisateur</CardTitle>
          <CardDescription>
            Créer un nouveau compte utilisateur avec droits d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter utilisateur
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-name">Nom complet (optionnel)</Label>
                <Input
                  id="admin-name"
                  type="text"
                  placeholder="Nom complet"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="email@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Mot de passe</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={addAdmin} 
                  disabled={addingAdmin || !newAdminEmail || !newAdminPassword}
                  className="flex-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {addingAdmin ? 'Enregistrement...' : 'Enregistrer l\'utilisateur'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAdminEmail('');
                    setNewAdminPassword('');
                    setNewAdminName('');
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des administrateurs</CardTitle>
          <CardDescription>
            {admins.length} administrateur{admins.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.full_name || '-'}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdmin(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
