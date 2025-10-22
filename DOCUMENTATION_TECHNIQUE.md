# Documentation Technique - Site Web AJE Tchad

## 1. PRÉSENTATION DU PROJET

### 1.1 Description
Site web officiel de l'Agence Judiciaire de l'État du Tchad, plateforme complète pour la gestion des services juridiques, du contentieux, et de la communication institutionnelle.

### 1.2 URL de Production
- **Domaine principal**: https://ajetchadgouv.com
- **Hébergement**: Vercel

---

## 2. TECHNOLOGIES UTILISÉES

### 2.1 Frontend

#### Framework et Langage
- **React 18.3.1** - Bibliothèque JavaScript pour interfaces utilisateur
- **TypeScript** - Superset typé de JavaScript
- **Vite** - Build tool moderne et rapide

#### Styles et Interface Utilisateur
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Composants UI réutilisables et accessibles
- **Radix UI** - Primitives UI accessibles (accordéon, dialog, dropdown, etc.)
- **Lucide React 0.462.0** - Bibliothèque d'icônes
- **tailwindcss-animate** - Animations CSS
- **class-variance-authority** - Gestion des variantes de composants
- **next-themes** - Gestion du thème clair/sombre

#### Routing et Navigation
- **React Router DOM 6.30.1** - Gestion du routage côté client

#### Gestion d'État et Données
- **TanStack React Query 5.83.0** - Gestion des requêtes et cache
- **React Hook Form 7.61.1** - Gestion des formulaires
- **Zod 3.25.76** - Validation de schémas TypeScript

#### Cartes et Géolocalisation
- **Mapbox GL 3.15.0** - Cartes interactives

#### Génération de Documents
- **jsPDF 3.0.3** - Génération de PDF côté client
- **DOMPurify 3.3.0** - Nettoyage HTML pour sécurité

#### Visualisation de Données
- **Recharts 2.15.4** - Graphiques et tableaux de bord

#### Autres Bibliothèques Frontend
- **date-fns 3.6.0** - Manipulation de dates
- **embla-carousel-react 8.6.0** - Carrousels
- **sonner 1.7.4** - Notifications toast
- **cmdk 1.1.1** - Command palette
- **vaul 0.9.9** - Drawer component
- **input-otp 1.4.2** - Champs OTP

### 2.2 Backend

#### Infrastructure
- **Supabase** - Backend as a Service (BaaS)
  - Base de données PostgreSQL
  - Authentification utilisateurs
  - Stockage de fichiers (Storage)
  - Edge Functions (Deno)
  - API REST auto-générée

#### Edge Functions (Serverless)
- **Deno** - Runtime JavaScript/TypeScript
- **convert-html-to-pdf** - Conversion de documents
- **setup-backend** - Configuration backend

### 2.3 Base de Données

#### Système
- **PostgreSQL** (via Supabase)

#### Tables Principales
- `actualites` - Actualités et communiqués
- `textes_juridiques` - Textes de loi
- `jurisprudences` - Décisions de justice
- `services_juridiques` - Services offerts
- `documents` - Documents officiels
- `resource_documents` - Modèles de formulaires
- `faq` - Questions fréquentes
- `faq_assistance` - FAQ assistance
- `domaines_contentieux` - Domaines juridiques
- `procedures_contentieux` - Procédures contentieuses
- `statistiques_contentieux` - Statistiques
- `demandes_avis` - Demandes d'avis juridiques
- `brouillons_avis` - Brouillons de demandes
- `contacts` - Messages de contact
- `job_offers` - Offres d'emploi
- `job_applications` - Candidatures
- `media_press_releases` - Communiqués de presse
- `media_gallery` - Galerie média
- `media_accreditations` - Accréditations presse
- `media_press_contacts` - Contacts presse
- `media_kits` - Kits média
- `newsletter_subscriptions` - Abonnements newsletter
- `site_settings` - Paramètres du site
- `profiles` - Profils utilisateurs
- `user_roles` - Rôles utilisateurs

#### Fonctionnalités Base de Données
- Row Level Security (RLS) activé
- Triggers automatiques
- Fonctions personnalisées
- Politique de sécurité stricte

### 2.4 Stockage de Fichiers

#### Buckets Supabase Storage
- `actualites-media` - Médias des actualités (public)
- `director-photos` - Photos des directeurs (public)
- `documents-files` - Documents officiels (public)
- `textes-juridiques-files` - Fichiers de textes juridiques (public)
- `media-files` - Fichiers média (public)
- `make-e892ec19-listings` - Listings (privé)

### 2.5 Authentification

- **Supabase Auth** - Système d'authentification
- Email/Password
- Gestion des sessions
- Système de rôles (admin, utilisateur)

### 2.6 Déploiement et Hébergement

- **Vercel** - Plateforme de déploiement
- **GitHub** - Contrôle de version (optionnel)
- CI/CD automatique
- SSL/HTTPS automatique
- Domaine personnalisé: ajetchadgouv.com

---

## 3. ARCHITECTURE DE L'APPLICATION

### 3.1 Structure des Dossiers

```
/
├── public/                    # Fichiers statiques
│   ├── documents/            # Documents PDF et HTML
│   └── lovable-uploads/      # Uploads
├── src/
│   ├── assets/               # Images et logos
│   ├── components/           # Composants React
│   │   ├── admin/           # Composants administration
│   │   ├── home/            # Composants page d'accueil
│   │   ├── layout/          # Layout (Header, Footer)
│   │   └── ui/              # Composants UI Shadcn
│   ├── contexts/            # Contexts React (Auth, Language)
│   ├── hooks/               # Custom hooks
│   ├── integrations/        # Intégrations externes
│   │   └── supabase/        # Configuration Supabase
│   ├── lib/                 # Utilitaires
│   ├── locales/             # Traductions (FR, AR, EN)
│   ├── pages/               # Pages de l'application
│   ├── App.tsx              # Composant principal
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── supabase/
│   ├── functions/           # Edge Functions
│   ├── migrations/          # Migrations SQL
│   └── config.toml          # Configuration Supabase
├── vercel.json              # Configuration Vercel
└── *.sql                    # Scripts SQL

```

### 3.2 Pages Principales

1. **Accueil** (`/`) - Page d'accueil avec Hero, actualités, statistiques
2. **Actualités** (`/actualites`) - Liste et détails des actualités
3. **Textes Juridiques** (`/textes`) - Bibliothèque de textes de loi
4. **Services** (`/services`) - Services juridiques offerts
5. **Contentieux** (`/contentieux`) - Gestion du contentieux
6. **Demande d'Avis** (`/demande-avis`) - Formulaire de demande
7. **Modèles** (`/modeles`) - Téléchargement de formulaires
8. **FAQ** (`/faq`) - Questions fréquentes
9. **Contact** (`/contact`) - Formulaire de contact
10. **Carrières** (`/carrieres`) - Offres d'emploi
11. **Médias** (`/medias`) - Espace presse
12. **Admin** (`/admin`) - Panneau d'administration
13. **Recherche** (`/recherche`) - Moteur de recherche global

### 3.3 Fonctionnalités Clés

#### Fonctionnalités Publiques
- Navigation multilingue (Français, Arabe, Anglais)
- Moteur de recherche global
- Consultation des actualités et textes juridiques
- Téléchargement de documents et formulaires
- Demande d'avis juridique en ligne
- Candidature aux offres d'emploi
- Abonnement newsletter
- Géolocalisation (Mapbox)
- Mode sombre/clair
- Responsive design

#### Fonctionnalités Administrateur
- Gestion du contenu (CRUD)
- Publication/dépublication
- Gestion des utilisateurs
- Statistiques et analytics
- Gestion des demandes d'avis
- Modération des contacts
- Gestion des candidatures
- Configuration du site

---

## 4. SÉCURITÉ

### 4.1 Mesures Implémentées

- **Row Level Security (RLS)** - Sécurité au niveau des lignes
- **Authentification sécurisée** - Via Supabase Auth
- **Validation des formulaires** - Avec Zod
- **Sanitization HTML** - Avec DOMPurify
- **HTTPS/SSL** - Certificat automatique via Vercel
- **Variables d'environnement** - Secrets Supabase
- **CORS** - Configuration appropriée

### 4.2 Rôles et Permissions

- **Public** - Lecture des contenus publiés
- **Admin** - Gestion complète du contenu et des utilisateurs
- Validation des emails pour admin initial

---

## 5. PERFORMANCES

### 5.1 Optimisations

- **React Query** - Mise en cache des requêtes
- **Code splitting** - Chargement lazy des composants
- **Vite** - Build ultra-rapide
- **Vercel Edge Network** - CDN global
- **Optimisation images** - Compression automatique
- **Prefetching** - Préchargement des routes

### 5.2 Métriques

- Temps de chargement initial: < 3s
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

---

## 6. MAINTENANCE ET SUPPORT

### 6.1 Logs et Monitoring

- **Supabase Dashboard** - Logs backend
- **Vercel Analytics** - Analytics frontend
- **Edge Function Logs** - Logs serverless

### 6.2 Backup

- Base de données: Backup automatique quotidien (Supabase)
- Code source: GitHub (si connecté)
- Historique des versions: Lovable version history

---

## 7. DÉVELOPPEMENT

### 7.1 Environnement Local

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### 7.2 Variables d'Environnement

```env
VITE_SUPABASE_URL=https://aupfurarzgbdocgtdomy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[clé publique]
VITE_SUPABASE_PROJECT_ID=aupfurarzgbdocgtdomy
```

### 7.3 Scripts SQL Disponibles

- `backend-setup.sql` - Configuration initiale
- `EXECUTE_THIS_SCRIPT.sql` - Script principal
- `fix_all_security_issues.sql` - Corrections sécurité
- `cleanup_*.sql` - Scripts de nettoyage
- `create_*.sql` - Création de tables
- Plusieurs autres scripts de maintenance

---

## 8. SUPPORT TECHNIQUE

### 8.1 Contacts

- **Équipe de développement**: Lovable AI
- **Email technique**: bechirmc90@gmail.com
- **Backend**: Supabase
- **Hébergement**: Vercel

### 8.2 Ressources

- Documentation React: https://react.dev
- Documentation Supabase: https://supabase.com/docs
- Documentation Tailwind: https://tailwindcss.com
- Documentation Vercel: https://vercel.com/docs

---

## 9. ÉVOLUTIONS FUTURES

### 9.1 Fonctionnalités Planifiées

- Notifications push
- Espace client personnalisé
- Signature électronique
- Chat en direct
- Application mobile (PWA)

### 9.2 Améliorations Techniques

- Tests automatisés (Jest, Cypress)
- Monitoring avancé (Sentry)
- Cache Redis
- Optimisation SEO avancée

---

## 10. LICENCE ET PROPRIÉTÉ

**Propriétaire**: Agence Judiciaire de l'État du Tchad  
**Développement**: Lovable AI Platform  
**Date de mise en production**: 2025  
**Version**: 1.0.0

---

*Document généré le: 2025-10-22*  
*Dernière mise à jour: 2025-10-22*
