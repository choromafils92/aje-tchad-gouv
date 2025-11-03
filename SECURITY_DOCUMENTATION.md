# Documentation de Sécurité - Site AJE

## Vue d'ensemble

Ce document décrit les mesures de sécurité implémentées dans l'application web de l'Agence Judiciaire de l'État (AJE) du Tchad.

## 1. Politique de Mots de Passe

### Exigences

Les administrateurs doivent respecter les critères suivants pour leurs mots de passe :

- **Longueur minimale** : 8 caractères (configurable)
- **Complexité requise** :
  - Au moins une lettre majuscule
  - Au moins une lettre minuscule
  - Au moins un chiffre
  - Au moins un caractère spécial (@, #, $, %, etc.)
- **Expiration** : 90 jours (configurable)
- **Réutilisation** : Les 5 derniers mots de passe ne peuvent pas être réutilisés

### Bonnes Pratiques

1. **Utilisez des phrases de passe** : Plus longues et plus faciles à retenir
   - Exemple : `Tchad@2025!AJE-Securite`

2. **Ne partagez jamais vos mots de passe** : Chaque administrateur doit avoir ses propres identifiants

3. **Utilisez un gestionnaire de mots de passe** : Considérez l'utilisation d'outils comme:
   - 1Password
   - Bitwarden
   - LastPass

4. **Changez immédiatement** votre mot de passe si :
   - Vous suspectez une compromission
   - Après avoir utilisé un ordinateur public
   - Si vous avez partagé accidentellement vos identifiants

## 2. Authentification à Deux Facteurs (2FA)

### Configuration Obligatoire pour les Administrateurs

Tous les comptes administrateurs **DOIVENT** activer l'authentification à deux facteurs.

### Comment Activer le 2FA

1. Connectez-vous à votre compte administrateur
2. Accédez aux **Paramètres de Sécurité**
3. Dans la section Supabase Auth Settings:
   - Activez "Phone Auth" ou "TOTP"
4. Suivez les instructions pour configurer votre application d'authentification

### Applications d'Authentification Recommandées

- **Google Authenticator** (iOS/Android)
- **Microsoft Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)

### Codes de Récupération

⚠️ **IMPORTANT** : Lorsque vous activez le 2FA, sauvegardez vos codes de récupération dans un endroit sûr :
- Imprimez-les et stockez-les dans un coffre
- Sauvegardez-les dans un gestionnaire de mots de passe
- Ne les partagez avec personne

## 3. Rate Limiting (Limitation de Taux)

### Objectif

Protéger l'application contre :
- Les attaques par force brute
- Les tentatives de spam
- L'abus des ressources serveur

### Limites Configurées

Par défaut, les limites suivantes sont appliquées :

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| Formulaire de Contact | 5 requêtes | 60 minutes |
| Demande d'Avis Juridique | 3 requêtes | 60 minutes |
| Signalement Contentieux | 3 requêtes | 60 minutes |
| Global (tous endpoints) | 100 requêtes | 60 minutes |

### Que se passe-t-il en cas de dépassement ?

- L'utilisateur reçoit une erreur HTTP 429 (Too Many Requests)
- Un message indique quand il pourra réessayer
- Les en-têtes HTTP incluent :
  - `X-RateLimit-Remaining` : Requêtes restantes
  - `X-RateLimit-Reset` : Date/heure de réinitialisation
  - `Retry-After` : Secondes avant de pouvoir réessayer

### Configuration

Les administrateurs peuvent ajuster ces limites dans :
**Admin → Sécurité → Rate Limiting**

## 4. Audit Logging (Journalisation d'Audit)

### Actions Tracées

Le système enregistre automatiquement :

1. **Gestion des Utilisateurs**
   - Attribution/Révocation de rôles d'administrateur
   - Création/Suppression de comptes

2. **Modifications de Contenu**
   - Ajout/Modification/Suppression d'actualités
   - Gestion des documents juridiques
   - Modifications des FAQs

3. **Paramètres de Sécurité**
   - Changements de politique de mots de passe
   - Activation/Désactivation du 2FA
   - Modifications des limites de taux

4. **Accès aux Données Sensibles**
   - Consultation des contacts
   - Accès aux demandes d'avis juridiques

### Informations Enregistrées

Chaque événement d'audit contient :
- Date et heure exacte
- Utilisateur ayant effectué l'action
- Type d'action effectuée
- Ressource affectée (type et ID)
- Anciennes et nouvelles valeurs (si applicable)
- Statut (succès/erreur/avertissement)
- Message d'erreur (si applicable)

### Consultation des Logs

Les administrateurs peuvent consulter les logs d'audit via :
**Admin → Audit → Logs d'Audit**

Fonctionnalités disponibles :
- Recherche par utilisateur, action ou ressource
- Filtrage par type d'action
- Filtrage par statut
- Export CSV pour analyse approfondie

### Rétention des Logs

- **Durée de conservation** : 1 an
- **Nettoyage automatique** : Les logs de plus d'un an sont supprimés automatiquement
- **Archivage** : Pour une conservation plus longue, exportez régulièrement les logs

## 5. Sauvegardes et Récupération

### Sauvegardes Automatiques Supabase

Supabase effectue automatiquement des sauvegardes de la base de données :

- **Fréquence** : Toutes les 24 heures
- **Rétention** : 7 jours (plan gratuit) / 30 jours (plan payant)
- **Type** : Sauvegarde complète de la base de données

### Accès aux Sauvegardes

1. Connectez-vous au [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet AJE
3. Allez dans **Database → Backups**
4. Consultez la liste des sauvegardes disponibles

### Tests de Restauration

⚠️ **CRITIQUE** : Testez régulièrement la restauration des sauvegardes

**Planning recommandé** :
- **Test de restauration** : Une fois par trimestre
- **Vérification des sauvegardes** : Chaque mois

**Procédure de test** :

1. Créez un projet Supabase de test
2. Restaurez une sauvegarde dans ce projet
3. Vérifiez que :
   - Toutes les tables sont présentes
   - Les données sont intègres
   - Les relations sont correctes
   - Les RLS policies fonctionnent

4. Documentez les résultats dans :
   **Admin → Sécurité → Vérification des Sauvegardes**

### En Cas de Sinistre

Si vous devez restaurer la production :

1. **Évaluez l'étendue des dégâts**
   - Quelles données sont affectées ?
   - Quelle est la dernière bonne sauvegarde ?

2. **Contactez l'équipe technique**
   - Email : support@aje.td (à configurer)
   - Téléphone : +235 XXX XXX XXX (à configurer)

3. **Suivez la procédure de restauration**
   - Créez un nouveau projet Supabase
   - Restaurez la sauvegarde
   - Mettez à jour les configurations
   - Testez en profondeur avant de basculer

4. **Post-mortem**
   - Documentez l'incident
   - Identifiez la cause
   - Mettez en place des mesures préventives

## 6. Row Level Security (RLS)

### Principes

Toutes les tables sensibles ont des policies RLS activées :

- **Principe du moindre privilège** : Accès minimal nécessaire
- **Séparation des rôles** : Admin vs Utilisateur standard
- **Validation côté serveur** : Jamais uniquement côté client

### Tables Protégées

| Table | Protection | Politique |
|-------|-----------|-----------|
| `user_roles` | Admin only | Seuls les admins peuvent modifier |
| `demandes_avis` | User isolation | Chaque utilisateur voit ses propres demandes |
| `contacts` | Admin read | Seuls les admins peuvent lire |
| `site_settings` | Public/Private | Certains paramètres publics, d'autres admin only |
| `audit_logs` | Admin only | Seuls les admins peuvent consulter |
| `security_settings` | Admin only | Seuls les admins peuvent gérer |

### Vérification RLS

Pour vérifier que RLS est activé sur toutes les tables critiques :

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Toutes les tables sensibles doivent avoir `rowsecurity = true`.

## 7. Sécurité des Edge Functions

### Authentification

- **JWT Verification** : Activée par défaut
- **Public endpoints** : Explicitement marqués dans `config.toml`
- **Service Role Key** : Utilisée uniquement pour les opérations privilégiées

### Input Validation

Toutes les entrées utilisateur sont validées :

1. **Type checking** : Validation des types de données
2. **Sanitization** : Nettoyage des entrées dangereuses
3. **Length limits** : Limites de taille pour prévenir les DoS
4. **Whitelist approach** : Seules les valeurs attendues sont acceptées

### CORS

Les headers CORS sont configurés pour :
- Autoriser uniquement les domaines légitimes
- Limiter les méthodes HTTP autorisées
- Protéger contre les requêtes cross-origin malveillantes

## 8. Sécurité du Stockage

### Buckets Publics vs Privés

| Bucket | Visibilité | Usage |
|--------|-----------|-------|
| `documents-files` | Public | Documents juridiques publics |
| `actualites-media` | Public | Photos/vidéos d'actualités |
| `director-photos` | Public | Photos du directeur |
| `media-files` | Public | Galerie média |
| `textes-juridiques-files` | Public | Textes juridiques officiels |

### Policies de Stockage

- **Upload** : Réservé aux administrateurs authentifiés
- **Delete** : Réservé aux administrateurs authentifiés
- **Read** : Public pour les buckets publics, authentifié pour les privés

## 9. Conformité et Réglementation

### Protection des Données Personnelles

L'application respecte les principes de :

1. **Minimisation des données** : Collecte uniquement des données nécessaires
2. **Limitation de la finalité** : Usage strictement défini
3. **Exactitude** : Mise à jour régulière des données
4. **Limitation de conservation** : Suppression après usage
5. **Intégrité et confidentialité** : Mesures de sécurité appropriées

### Données Sensibles

Les informations suivantes sont considérées sensibles et protégées spécialement :

- Adresses email des utilisateurs
- Mots de passe (hashés avec bcrypt)
- Demandes d'avis juridiques
- Informations de contact des citoyens
- Logs d'audit contenant des actions utilisateur

### Droits des Utilisateurs

Les utilisateurs ont le droit de :

1. **Accès** : Consulter leurs données
2. **Rectification** : Corriger leurs données
3. **Suppression** : Demander la suppression de leurs données
4. **Portabilité** : Exporter leurs données
5. **Opposition** : S'opposer au traitement

Pour exercer ces droits, contacter : dpo@aje.td (à configurer)

## 10. Incidents de Sécurité

### Procédure en Cas d'Incident

1. **Détection**
   - Monitoring automatique
   - Alerte manuelle
   - Rapport utilisateur

2. **Confinement**
   - Isoler le système affecté
   - Préserver les preuves
   - Limiter la propagation

3. **Analyse**
   - Identifier la cause
   - Évaluer l'impact
   - Déterminer l'étendue

4. **Éradication**
   - Corriger la vulnérabilité
   - Supprimer l'accès malveillant
   - Mettre à jour les systèmes

5. **Récupération**
   - Restaurer les services
   - Vérifier l'intégrité
   - Surveiller la stabilité

6. **Leçons Apprises**
   - Documenter l'incident
   - Améliorer les procédures
   - Former l'équipe

### Contact d'Urgence

En cas d'incident de sécurité critique :

- **Email** : security@aje.td (à configurer)
- **Téléphone** : +235 XXX XXX XXX (à configurer)
- **Disponibilité** : 24/7

### Signalement de Vulnérabilité

Si vous découvrez une vulnérabilité :

1. **Ne la divulguez pas publiquement**
2. Contactez : security@aje.td
3. Fournissez :
   - Description détaillée
   - Étapes de reproduction
   - Impact potentiel
   - Preuve de concept (si possible)

## 11. Checklist de Sécurité Mensuelle

### Pour les Administrateurs

- [ ] Vérifier les logs d'audit pour activités suspectes
- [ ] Revoir les accès administrateurs (principe du moindre privilège)
- [ ] Vérifier que les sauvegardes automatiques fonctionnent
- [ ] Surveiller les métriques de rate limiting
- [ ] Mettre à jour la liste des contacts d'urgence

### Pour les Super-Administrateurs

- [ ] Effectuer un test de restauration de sauvegarde (trimestriel)
- [ ] Revoir et mettre à jour la politique de sécurité
- [ ] Analyser les tendances des incidents de sécurité
- [ ] Vérifier la conformité RLS sur toutes les tables
- [ ] Audit des permissions utilisateurs
- [ ] Mise à jour de la documentation de sécurité

## 12. Ressources et Formation

### Documentation Technique

- [Supabase Security](https://supabase.com/docs/guides/security)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Security](https://supabase.com/docs/guides/functions/security)

### Formation Recommandée

1. **Sécurité Web Basique**
   - OWASP Top 10
   - Principes de sécurité
   - Gestion des mots de passe

2. **Supabase Spécifique**
   - RLS policies
   - Edge functions
   - Authentication

3. **Conformité**
   - Protection des données personnelles
   - Droits des utilisateurs
   - Obligations légales

### Support

Pour toute question relative à la sécurité :
- **Documentation** : Consultez ce document
- **Support Technique** : support@aje.td (à configurer)
- **Formation** : Demandez une session de formation

---

**Version** : 1.0  
**Dernière mise à jour** : 2025  
**Prochaine révision** : Trimestrielle  
**Contact** : dpo@aje.td (à configurer)
