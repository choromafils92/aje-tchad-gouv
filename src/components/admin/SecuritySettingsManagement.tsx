import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, Shield, Key, Database, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SecuritySettings {
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    password_expiry_days: number;
    prevent_reuse_count: number;
  };
  two_factor_auth: {
    enabled: boolean;
    required_for_admins: boolean;
    methods: string[];
  };
  rate_limiting: {
    enabled: boolean;
    contact_form_limit: number;
    avis_form_limit: number;
    window_minutes: number;
    global_limit: number;
  };
  backup_settings: {
    auto_backup_enabled: boolean;
    backup_frequency_hours: number;
    retention_days: number;
    last_backup_check: string | null;
    last_restore_test: string | null;
  };
}

export default function SecuritySettingsManagement() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_settings' as any)
        .select('*');

      if (error) throw error;

      const settingsMap: any = {};
      data?.forEach((item: any) => {
        settingsMap[item.setting_key] = item.setting_value;
      });

      setSettings(settingsMap as SecuritySettings);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paramètres de sécurité',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('security_settings' as any)
        .update({ 
          setting_value: value,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;

      // Create audit log
      await supabase.rpc('create_audit_log' as any, {
        p_action: 'security_setting_updated',
        p_resource_type: 'security_settings',
        p_resource_id: key,
        p_new_data: value
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updates = [
        updateSetting('password_policy', settings.password_policy),
        updateSetting('two_factor_auth', settings.two_factor_auth),
        updateSetting('rate_limiting', settings.rate_limiting),
        updateSetting('backup_settings', settings.backup_settings),
      ];

      const results = await Promise.all(updates);
      
      if (results.every(r => r)) {
        toast({
          title: 'Succès',
          description: 'Les paramètres de sécurité ont été mis à jour',
        });
      } else {
        throw new Error('Certaines mises à jour ont échoué');
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePasswordPolicy = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      password_policy: { ...settings.password_policy, [field]: value }
    });
  };

  const updateTwoFactorAuth = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      two_factor_auth: { ...settings.two_factor_auth, [field]: value }
    });
  };

  const updateRateLimiting = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      rate_limiting: { ...settings.rate_limiting, [field]: value }
    });
  };

  if (!isAdmin) {
    return <div>Accès refusé</div>;
  }

  if (loading || !settings) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Paramètres de Sécurité</AlertTitle>
        <AlertDescription>
          Ces paramètres contrôlent la sécurité de l'application. Modifiez-les avec précaution.
        </AlertDescription>
      </Alert>

      {/* Politique de Mots de Passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Politique de Mots de Passe
          </CardTitle>
          <CardDescription>
            Configuration des exigences pour les mots de passe des administrateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_length">Longueur minimale</Label>
              <Input
                id="min_length"
                type="number"
                value={settings.password_policy.min_length}
                onChange={(e) => updatePasswordPolicy('min_length', parseInt(e.target.value))}
                min={8}
                max={32}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_days">Expiration (jours)</Label>
              <Input
                id="expiry_days"
                type="number"
                value={settings.password_policy.password_expiry_days}
                onChange={(e) => updatePasswordPolicy('password_expiry_days', parseInt(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="require_uppercase">Majuscules requises</Label>
              <Switch
                id="require_uppercase"
                checked={settings.password_policy.require_uppercase}
                onCheckedChange={(checked) => updatePasswordPolicy('require_uppercase', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require_lowercase">Minuscules requises</Label>
              <Switch
                id="require_lowercase"
                checked={settings.password_policy.require_lowercase}
                onCheckedChange={(checked) => updatePasswordPolicy('require_lowercase', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require_numbers">Chiffres requis</Label>
              <Switch
                id="require_numbers"
                checked={settings.password_policy.require_numbers}
                onCheckedChange={(checked) => updatePasswordPolicy('require_numbers', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require_special">Caractères spéciaux requis</Label>
              <Switch
                id="require_special"
                checked={settings.password_policy.require_special_chars}
                onCheckedChange={(checked) => updatePasswordPolicy('require_special_chars', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentification à Deux Facteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentification à Deux Facteurs (2FA)
          </CardTitle>
          <CardDescription>
            Configuration de l'authentification multi-facteurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Pour activer le 2FA, rendez-vous dans les paramètres d'authentification Supabase
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa_enabled">2FA activé</Label>
            <Switch
              id="2fa_enabled"
              checked={settings.two_factor_auth.enabled}
              onCheckedChange={(checked) => updateTwoFactorAuth('enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa_required_admins">2FA obligatoire pour les admins</Label>
            <Switch
              id="2fa_required_admins"
              checked={settings.two_factor_auth.required_for_admins}
              onCheckedChange={(checked) => updateTwoFactorAuth('required_for_admins', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Rate Limiting
          </CardTitle>
          <CardDescription>
            Limitation du nombre de requêtes pour prévenir les abus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="rate_limit_enabled">Rate Limiting activé</Label>
            <Switch
              id="rate_limit_enabled"
              checked={settings.rate_limiting.enabled}
              onCheckedChange={(checked) => updateRateLimiting('enabled', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_limit">Limite formulaire contact</Label>
              <Input
                id="contact_limit"
                type="number"
                value={settings.rate_limiting.contact_form_limit}
                onChange={(e) => updateRateLimiting('contact_form_limit', parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avis_limit">Limite formulaire avis</Label>
              <Input
                id="avis_limit"
                type="number"
                value={settings.rate_limiting.avis_form_limit}
                onChange={(e) => updateRateLimiting('avis_form_limit', parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="window_minutes">Fenêtre (minutes)</Label>
              <Input
                id="window_minutes"
                type="number"
                value={settings.rate_limiting.window_minutes}
                onChange={(e) => updateRateLimiting('window_minutes', parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="global_limit">Limite globale</Label>
              <Input
                id="global_limit"
                type="number"
                value={settings.rate_limiting.global_limit}
                onChange={(e) => updateRateLimiting('global_limit', parseInt(e.target.value))}
                min={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegardes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Vérification des Sauvegardes
          </CardTitle>
          <CardDescription>
            Configuration et suivi des sauvegardes automatiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>Sauvegardes Automatiques Supabase</AlertTitle>
            <AlertDescription>
              Les sauvegardes automatiques sont gérées par Supabase. Vérifiez régulièrement leur bon fonctionnement dans le dashboard Supabase.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label>Dernière vérification de sauvegarde</Label>
            <div className="text-sm text-muted-foreground">
              {settings.backup_settings.last_backup_check 
                ? new Date(settings.backup_settings.last_backup_check).toLocaleString('fr-FR')
                : 'Jamais vérifiée'}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Dernier test de restauration</Label>
            <div className="text-sm text-muted-foreground">
              {settings.backup_settings.last_restore_test 
                ? new Date(settings.backup_settings.last_restore_test).toLocaleString('fr-FR')
                : 'Jamais testé'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
}
