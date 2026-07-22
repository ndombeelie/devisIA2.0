# 📚 Documentation Complète - DevisAI Desktop

> Logiciel de Création de Devis Professionnels avec Intelligence Artificielle

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Installation](#installation)
4. [Guide d'utilisation](#guide-dutilisation)
5. [Fonctionnalités détaillées](#fonctionnalités-détaillées)
6. [Base de données](#base-de-données)
7. [API & Communication](#api--communication)
8. [Assistant IA](#assistant-ia)
9. [FAQ & Dépannage](#faq--dépannage)

---

## Vue d'ensemble

### Qu'est-ce que DevisAI Desktop ?

**DevisAI Desktop** est un logiciel de bureau professionnel conçu pour les entreprises, indépendants, PME, freelances et artisans de la RD Congo et d'ailleurs. Il permet de créer des devis et factures professionnels rapidement, avec l'aide d'une intelligence artificielle intégrée.

### Objectifs principaux

| Objectif | Description |
|----------|-------------|
| 📄 Création de devis | Génération de devis professionnels en moins de 2 minutes |
| 🧾 Facturation | Conversion automatique devis → facture |
| 🤖 Assistance IA | Aide à la rédaction et conseils tarifaires |
| 💾 Hors ligne | Fonctionnement complet sans connexion internet |
| 💰 Gratuit | Aucun abonnement requis |

### Public cible

- **PME** - Petites et moyennes entreprises
- **Entrepreneurs** - Créateurs d'entreprise
- **Freelances** - Travailleurs indépendants
- **Artisans** - Métiers manuels et services
- **Commerçants** - Vendeurs et distributeurs
- **Agences** - Cabinets de conseil et services
- **Associations** - Organisations à but non lucratif
- **Techniciens** - Professionnels techniques

---

## Architecture technique

### Stack technologique

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVISAI DESKTOP                          │
├─────────────────────────────────────────────────────────────┤
│  INTERFACE UTILISATEUR (React 18)                          │
│  ├── Pages (12 composants)                                  │
│  ├── Composants réutilisables                               │
│  └── Styles CSS modernes                                    │
├─────────────────────────────────────────────────────────────┤
│  BRIDGE (Preload.js)                                        │
│  └── Communication sécurisée via IPC                        │
├─────────────────────────────────────────────────────────────┤
│  BACKEND (Electron + Node.js)                              │
│  ├── Gestion des fenêtres                                   │
│  ├── Base de données SQLite                                 │
│  └── Export PDF (jsPDF)                                     │
├─────────────────────────────────────────────────────────────┤
│  SERVICES EXTERNES                                          │
│  └── OpenRouter API (IA - optionnel)                        │
└─────────────────────────────────────────────────────────────┘
```

### Structure des dossiers

```
devisai-desktop/
│
├── 📁 electron/                    # Backend Electron
│   ├── main.js                     # Process principal
│   └── preload.js                  # Bridge de communication
│
├── 📁 public/                       # Fichiers statiques
│   ├── index.html                  # Point d'entrée HTML
│   └── icon.ico                    # Icône application
│
├── 📁 src/                          # Code source React
│   │
│   ├── 📁 components/              # Composants réutilisables
│   │   └── Layout.js               # Layout principal avec sidebar
│   │
│   ├── 📁 pages/                   # Pages de l'application
│   │   ├── Login.js                # Page de connexion
│   │   ├── Companies.js            # Sélection entreprise
│   │   ├── Dashboard.js            # Tableau de bord
│   │   ├── Clients.js              # Gestion clients
│   │   ├── Products.js             # Produits/Services
│   │   ├── Quotes.js               # Liste devis
│   │   ├── QuoteForm.js            # Formulaire devis
│   │   ├── Invoices.js             # Liste factures
│   │   ├── InvoiceForm.js          # Détails facture
│   │   ├── Statistics.js           # Statistiques
│   │   ├── Settings.js             # Paramètres
│   │   ├── Backups.js              # Sauvegardes
│   │   └── AIAssistant.js          # Assistant IA
│   │
│   ├── 📁 styles/                  # Feuilles de style
│   │   └── index.css               # Styles globaux
│   │
│   ├── 📁 utils/                   # Utilitaires
│   │   └── pdf.js                  # Génération PDF
│   │
│   ├── App.js                      # Composant racine
│   └── index.js                    # Point d'entrée React
│
├── 📁 docs/                         # Documentation
│   └── DOCUMENTATION.md            # Ce fichier
│
├── package.json                     # Configuration projet
├── README.md                        # Readme GitHub
└── .gitignore                       # Fichiers ignorés
```

### Flux de données

```
┌──────────────┐     IPC      ┌──────────────┐
│              │ ◄──────────► │              │
│   React UI   │              │   Electron   │
│              │              │   Backend    │
└──────────────┘              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   SQLite     │
                              │  Database    │
                              └──────────────┘
```

---

## Installation

### Prérequis

| Logiciel | Version minimale | Lien de téléchargement |
|----------|------------------|------------------------|
| Node.js | 18.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 9.x | Inclus avec Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

### Vérification des prérequis

Ouvrez un terminal et exécutez :

```bash
# Vérifier Node.js
node --version
# Résultat attendu : v18.x.x ou supérieur

# Vérifier npm
npm --version
# Résultat attendu : 9.x.x ou supérieur

# Vérifier Git
git --version
# Résultat attendu : git version 2.x.x
```

### Installation pas à pas

#### 1. Téléchargement du projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/devisai-desktop.git

# Ou télécharger le ZIP et extraire
# Puis ouvrir le dossier
cd devisai-desktop
```

#### 2. Installation des dépendances

```bash
# Installer toutes les dépendances
npm install
```

> ⚠️ **Note** : L'installation peut prendre 2-5 minutes selon votre connexion.

#### 3. Lancement en développement

```bash
# Démarrer l'application
npm run dev
```

Cette commande lance :
- Le serveur React (port 3000)
- L'application Electron en mode développement

#### 4. Construction pour production

```bash
# Construire l'exécutable
npm run electron-build
```

L'exécutable sera généré dans le dossier `dist/`.

### Installation sur Windows

1. Téléchargez le fichier `.exe` depuis le dossier `dist/`
2. Double-cliquez sur le fichier
3. Suivez l'assistant d'installation
4. Lancez "DevisAI Desktop" depuis le menu Démarrer

### Structure des dépendances

```json
{
  "dependencies": {
    "better-sqlite3": "^9.4.3",      // Base de données SQLite
    "electron-is-dev": "^3.0.1",     // Détection mode dev
    "jspdf": "^2.5.1",               // Génération PDF
    "jspdf-autotable": "^3.8.1",     // Tableaux PDF
    "qrcode": "^1.5.3",              // Génération QR codes
    "react": "^18.2.0",              // Framework UI
    "react-dom": "^18.2.0",          // DOM React
    "react-router-dom": "^6.22.0",   // Routage
    "react-scripts": "5.0.1",        // Scripts React
    "serve": "^14.2.1",              // Serveur statique
    "uuid": "^9.0.1",                // Génération d'IDs
    "pdfmake": "^0.2.9"              // Alternative PDF
  },
  "devDependencies": {
    "concurrently": "^8.2.2",        // Exécution parallèle
    "electron": "^28.2.0",           // Framework desktop
    "electron-builder": "^24.9.1",   // Builder
    "wait-on": "^7.2.0"              // Attente serveur
  }
}
```

---

## Guide d'utilisation

### Premier démarrage

#### Étape 1 : Connexion

Au premier lancement, l'écran de connexion apparaît :

| Champ | Valeur par défaut |
|-------|-------------------|
| Email | `admin@gmail.com` |
| Mot de passe | `admin@123` |

> 🔒 **Sécurité** : Changez ces identifiants après la première connexion.

#### Étape 2 : Création de l'entreprise

Après connexion, créez votre entreprise :

```
┌─────────────────────────────────────────┐
│        CRÉER VOTRE ENTREPRISE           │
├─────────────────────────────────────────┤
│ Nom de l'entreprise * : ______________  │
│ Adresse : ___________________________   │
│ Téléphone : _________________________   │
│ Email : _____________________________   │
│ RCCM : _____________________________    │
│ ID National : _______________________   │
│ N° Impôt : _________________________    │
│ TVA : [ ] Assujetti                     │
│                                         │
│           [ CRÉER ]                     │
└─────────────────────────────────────────┘
```

#### Étape 3 : Navigation

L'interface principale comprend :

```
┌──────────────────────────────────────────────────────────┐
│  ╔════════╗  ████████████████████████████████████████   │
│  ║ Menu   ║  │        Zone de travail                  │ │
│  ║        ║  │                                          │ │
│  ║ 🏠 Acc ║  │   Votre contenu s'affiche ici           │ │
│  ║ 📄 Dev ║  │                                          │ │
│  ║ 🧾 Fac ║  │                                          │ │
│  ║ 👥 Cli ║  │                                          │ │
│  ║ 📦 Pro ║  │                                          │ │
│  ║ 🤖 IA  ║  │                                          │ │
│  ║ 📊 Sta ║  │                                          │ │
│  ║ 📁 Sav ║  │                                          │ │
│  ║ ⚙️ Par ║  │                                          │ │
│  ╚════════╝  ████████████████████████████████████████   │
└──────────────────────────────────────────────────────────┘
```

### Créer un client

#### Via la page Clients

1. Cliquez sur **👥 Clients** dans le menu
2. Cliquez sur **+ Nouveau client**
3. Remplissez le formulaire :

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| Prénom | Prénom du client | Non |
| Nom | Nom de famille | Non |
| Entreprise | Nom de l'entreprise cliente | Non |
| Email | Adresse email | Non |
| Téléphone | Numéro de téléphone | Non |
| Adresse | Adresse postale | Non |
| Pays | Pays (défaut: RD Congo) | Non |
| Ville | Ville (défaut: Kinshasa) | Non |
| Notes | Notes internes | Non |

4. Cliquez sur **Créer**

#### Via la recherche intelligente

La barre de recherche permet de trouver un client par :
- Nom ou prénom
- Nom d'entreprise
- Email
- Téléphone

### Créer un produit ou service

#### Étape 1 : Créer des catégories (optionnel)

1. Allez dans **📦 Produits**
2. Cliquez sur **📁 Catégories**
3. Ajoutez vos catégories (ex: "Services Web", "Consultation", "Vente")

#### Étape 2 : Ajouter un produit

1. Cliquez sur **+ Nouveau produit**
2. Remplissez les informations :

| Champ | Description | Exemple |
|-------|-------------|---------|
| Nom * | Nom du produit | "Création site web" |
| Type | Produit ou Service | Service |
| Catégorie | Catégorie associée | "Services Web" |
| Description | Description détaillée | "Site vitrine 5 pages" |
| Prix HT * | Prix hors taxes | 500.00 |
| TVA (%) | Taux de TVA | 16 |
| Unité | Unité de mesure | Forfait |
| Stock | Quantité en stock | Illimité si vide |

3. Cliquez sur **Créer**

### Créer un devis

#### Méthode rapide

1. Allez dans **📄 Devis**
2. Cliquez sur **+ Nouveau devis**
3. Le numéro est généré automatiquement (ex: DEV-2026-00001)

#### Remplissage du devis

```
┌─────────────────────────────────────────────────────────┐
│ NOUVEAU DEVIS                                    DEV-2026-00001 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Client * : [ Sélectionner un client ▼ ]               │
│                                                         │
│ Date : 18/07/2026          Échéance : ___________      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ LIGNES DU DEVIS                           [+ Ajouter]   │
├─────────────────────────────────────────────────────────┤
│ Produit │ Description │ Qté │ Prix │ TVA │ Remise │ Total│
│ [▼]     │ __________ │ 1   │ 0.00 │ 0%  │ 0.00  │ 0.00 │
│ [▼]     │ __________ │ 1   │ 0.00 │ 0%  │ 0.00  │ 0.00 │
└─────────────────────────────────────────────────────────┘
```

#### Calcul automatique

Les totaux sont calculés automatiquement :

```
Sous-total HT  : Somme des lignes
TVA           : Calcul selon taux de chaque ligne
Remise globale: Remise totale (optionnel)
────────────────────────────────────────
Total TTC     : Sous-total + TVA - Remise
```

#### Enregistrement

1. Vérifiez les informations
2. Cliquez sur **💾 Enregistrer le devis**
3. Le devis apparaît dans la liste

### Convertir un devis en facture

#### Condition préalable

Le devis doit avoir le statut **"Accepté"**.

#### Procédure

1. Allez dans **📄 Devis**
2. Trouvez le devis accepté
3. Cliquez sur le bouton vert **Facturer**
4. La facture est créée automatiquement

### Enregistrer un paiement

1. Allez dans **🧾 Factures**
2. Cliquez sur **Détails** d'une facture
3. Cliquez sur **+ Ajouter un paiement**
4. Remplissez :

| Champ | Description |
|-------|-------------|
| Montant | Somme versée |
| Date | Date du paiement |
| Méthode | Espèces, Virement, Chèque, Mobile money |
| Référence | N° de chèque, réf. virement |
| Notes | Commentaires |

### Exporter en PDF

#### Devis

1. Ouvrez un devis
2. Cliquez sur **Exporter PDF**
3. Choisissez l'emplacement
4. Le PDF est généré avec :
   - Logo de l'entreprise
   - Coordonnées complètes
   - Tableau des articles
   - Totaux
   - Conditions générales

#### Facture

Même procédure, avec format facture congolais.

### Utiliser l'Assistant IA

#### Accès

Cliquez sur **🤖 IA Assistant** dans le menu.

#### Sans clé API (mode simulé)

L'IA répond avec des modèles prédéfinis pour :
- Création de devis
- Conseils tarifaires
- Email de relance
- Corrections de textes

#### Avec clé API OpenRouter

1. Allez dans **⚙️ Paramètres**
2. Entrez votre clé API OpenRouter
3. L'IA utilise GPT-4o-mini pour des réponses personnalisées

#### Exemples de commandes

```
"Fais-moi un devis pour la création d'un site web e-commerce"
"Quel prix pour une journée de consultation ?"
"Écris un email de relance pour un devis en attente"
"Corrige ce texte : [votre texte]"
"Donne-moi des clauses commerciales pour un contrat"
```

### Sauvegarder les données

#### Export automatique

Les données sont stockées localement dans :
- Windows : `%APPDATA%/devisai-desktop/devisai.db`

#### Export manuel

1. Allez dans **📁 Sauvegardes**
2. Choisissez le format :
   - **JSON** : Universel, lisible
   - **SQLite** : Copie exacte de la base
3. Sélectionnez l'emplacement
4. Cliquez sur **Exporter**

#### Import

1. Allez dans **📁 Sauvegardes**
2. Cliquez sur **Sélectionner un fichier**
3. Choisissez votre sauvegarde JSON
4. Les données sont restaurées

---

## Fonctionnalités détaillées

### 1. Tableau de bord

#### Informations affichées

| Widget | Description |
|--------|-------------|
| Devis ce mois | Nombre de devis créés ce mois |
| Devis acceptés | Total des devis acceptés |
| Factures impayées | Nombre de factures en attente |
| Revenus du mois | Chiffre d'affaires mensuel |
| Clients total | Nombre de clients |
| Devis récents | Liste des 5 derniers devis |

#### Actions rapides

- **Nouveau devis** : Créer directement un devis
- **Nouvelle facture** : Créer directement une facture

### 2. Gestion des entreprises

#### Multi-entreprises

Une seule installation peut gérer plusieurs entreprises.

#### Champs disponibles

```
├── Informations de base
│   ├── Nom de l'entreprise *
│   ├── Logo (optionnel)
│   ├── Adresse
│   ├── Téléphone
│   └── Email
│
├── Informations légales (Congo)
│   ├── RCCM (Registre du Commerce)
│   ├── ID National
│   └── Numéro d'impôt
│
└── Configuration TVA
    ├── Assujetti ou non
    ├── Signature (image)
    └── Cachet (image)
```

### 3. Gestion des clients

#### Recherche intelligente

Recherche multi-critères :
- Nom / Prénom
- Entreprise
- Email
- Téléphone

#### Historique

Chaque client conserve :
- Liste de ses devis
- Liste de ses factures
- Historique des paiements

### 4. Produits et Services

#### Types

| Type | Utilisation |
|------|-------------|
| Produit | Marchandises, objets |
| Service | Prestations intellectuelles |

#### Unités disponibles

- Unité
- Heure
- Jour
- Mètre carré (m²)
- Mètre (m)
- Kilogramme (kg)
- Forfait

#### Gestion du stock

- Champ optionnel
- Alertes de stock bas (à venir)

### 5. Devis

#### Numérotation automatique

Format : `DEV-AAAA-XXXXX`

Exemple :
- DEV-2026-00001
- DEV-2026-00002
- DEV-2026-00003

#### Statuts

| Statut | Couleur | Signification |
|--------|---------|---------------|
| Brouillon | Bleu | En cours de création |
| Envoyé | Orange | Envoyé au client |
| Accepté | Vert | Validé par le client |
| Refusé | Rouge | Rejeté par le client |
| Expiré | Rouge | Date d'échéance dépassée |

#### Calculs automatiques

```
Total ligne = (Quantité × Prix unitaire) - Remise
Sous-total = Somme des totaux lignes
TVA = Σ (Total ligne × Taux TVA / 100)
Total TTC = Sous-total + TVA - Remise globale + Frais supplémentaires
```

### 6. Factures

#### Modèle congolais

Les factures incluent :
- RCCM de l'entreprise
- ID National
- Numéro d'impôt
- TVA détaillée

#### Numérotation

Format : `FAC-AAAA-XXXXX`

#### Suivi des paiements

| État | Description |
|------|-------------|
| En attente | Aucun paiement reçu |
| Partielle | Paiement partiel |
| Payée | Intégralement réglée |
| Annulée | Facture annulée |

### 7. Statistiques

#### Métriques disponibles

- Taux de conversion devis → factures
- Revenus mensuels
- Factures impayées
- Devis refusés
- Clients actifs

#### Conseils IA

L'assistant analyse vos performances et suggère des améliorations.

### 8. Paramètres

#### Configuration disponible

| Paramètre | Options |
|-----------|---------|
| Devise | USD, CDF, EUR |
| Thème | Clair, Sombre |
| Préfixe devis | Personnalisable |
| Préfixe facture | Personnalisable |
| Clé API IA | OpenRouter |

---

## Base de données

### Schéma SQLite

```sql
-- Tables principales
├── users           -- Utilisateurs
├── companies       -- Entreprises
├── clients         -- Clients
├── categories      -- Catégories produits
├── products        -- Produits et services
├── quotes          -- Devis
├── quote_items     -- Lignes de devis
├── invoices        -- Factures
├── invoice_items   -- Lignes de facture
├── payments        -- Paiements
├── history         -- Historique
└── settings        -- Paramètres
```

### Table : companies

```sql
CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  rccm TEXT,
  id_national TEXT,
  tax_number TEXT,
  tva_enabled INTEGER DEFAULT 0,
  signature TEXT,
  stamp TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table : quotes

```sql
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  client_id INTEGER,
  quote_number TEXT UNIQUE NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATETIME,
  status TEXT DEFAULT 'draft',
  subtotal REAL DEFAULT 0,
  tva_amount REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  additional_fees REAL DEFAULT 0,
  total REAL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  signature TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

### Emplacement de la base

| OS | Chemin |
|----|--------|
| Windows | `%APPDATA%/devisai-desktop/devisai.db` |
| macOS | `~/Library/Application Support/devisai-desktop/devisai.db` |
| Linux | `~/.config/devisai-desktop/devisai.db` |

---

## API & Communication

### IPC (Inter-Process Communication)

#### Format des appels

```javascript
// Depuis React (renderer)
const result = await window.electronAPI.nomDeLaMethode(parametres);
```

#### API complète

##### Authentification

```javascript
// Connexion
window.electronAPI.login({ email, password })
// Retour: { success: boolean, user?: object, error?: string }
```

##### Entreprises

```javascript
// Récupérer toutes les entreprises
window.electronAPI.getCompanies()

// Récupérer une entreprise
window.electronAPI.getCompany(id)

// Créer une entreprise
window.electronAPI.createCompany(data)

// Mettre à jour
window.electronAPI.updateCompany(data)

// Supprimer
window.electronAPI.deleteCompany(id)
```

##### Clients

```javascript
// Liste des clients
window.electronAPI.getClients(companyId)

// Recherche
window.electronAPI.searchClients({ companyId, query })

// CRUD
window.electronAPI.getClient(id)
window.electronAPI.createClient(data)
window.electronAPI.updateClient(data)
window.electronAPI.deleteClient(id)
```

##### Produits

```javascript
window.electronAPI.getProducts(companyId)
window.electronAPI.getProduct(id)
window.electronAPI.createProduct(data)
window.electronAPI.updateProduct(data)
window.electronAPI.deleteProduct(id)
```

##### Devis

```javascript
window.electronAPI.getQuotes(companyId)
window.electronAPI.getQuote(id)
window.electronAPI.createQuote({ quote, items })
window.electronAPI.updateQuote({ quote, items })
window.electronAPI.deleteQuote(id)
window.electronAPI.generateQuoteNumber(companyId)
```

##### Factures

```javascript
window.electronAPI.getInvoices(companyId)
window.electronAPI.getInvoice(id)
window.electronAPI.createInvoice({ invoice, items })
window.electronAPI.convertQuoteToInvoice(quoteId)
```

##### Paiements

```javascript
window.electronAPI.addPayment(data)
```

##### Statistiques

```javascript
window.electronAPI.getDashboardStats(companyId)
```

##### Sauvegarde

```javascript
window.electronAPI.exportBackup({ format, companyId })
window.electronAPI.importBackup()
```

---

## Assistant IA

### Configuration OpenRouter

#### Obtenir une clé API

1. Créez un compte sur [openrouter.ai](https://openrouter.ai)
2. Allez dans **Keys** → **Create Key**
3. Copiez la clé (format: `sk-or-...`)

#### Configurer dans l'application

1. Allez dans **⚙️ Paramètres**
2. Entrez la clé dans le champ dédié
3. Sauvegardez

### Modèle utilisé

- **Modèle** : `openai/gpt-4o-mini`
- **Coût** : ~$0.15 / 1M tokens input, ~$0.60 / 1M tokens output

### Fonctionnalités IA

| Fonction | Description |
|----------|-------------|
| Génération de devis | Création automatique à partir d'une description |
| Descriptions produits | Rédaction professionnelle |
| Email de relance | Génération d'emails commerciaux |
| Conseils tarifaires | Aide à la fixation des prix |
| Correction de texte | Grammaire et orthographe |
| Clauses commerciales | Génération de clauses légales |

### Exemples d'utilisation

```
Utilisateur: "Fais-moi un devis pour un site web e-commerce avec paiement mobile"

IA: Voici les lignes suggérées pour votre devis :

1. Design et maquette du site - 800 USD
   - Design responsive
   - 5 maquettes
   
2. Développement e-commerce - 2500 USD
   - Catalogue produits
   - Panier
   - Paiement Mobile Money (M-Pesa, Airtel)
   
3. Intégration paiement - 500 USD
   - Configuration API
   - Tests
   
4. Formation - 200 USD
   - 4 heures de formation
   
Total estimé : 4000 USD
```

---

## FAQ & Dépannage

### Questions fréquentes

#### ❓ Comment réinitialiser mon mot de passe ?

Pour le moment, il n'y a pas de fonction de récupération. Vous devez :
1. Ouvrir la base SQLite avec un outil comme DB Browser for SQLite
2. Modifier la table `users`
3. Remplacer le mot de passe

#### ❓ L'application ne démarre pas

**Solutions :**
1. Vérifiez que Node.js est installé (`node --version`)
2. Supprimez `node_modules` et refaites `npm install`
3. Vérifiez les logs dans la console

#### ❓ Les PDF ne s'exportent pas

**Solutions :**
1. Vérifiez que le chemin d'export est accessible
2. Essayez un autre emplacement
3. Vérifiez l'espace disque

#### ❓ L'IA ne répond pas

**Solutions :**
1. Vérifiez votre connexion internet
2. Vérifiez votre clé API OpenRouter
3. Essayez le mode simulé (sans clé API)

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot find module` | Module manquant | `npm install` |
| `Database locked` | Base ouverte ailleurs | Fermez les autres instances |
| `EACCES permission` | Droits insuffisants | Lancez en admin |
| `Port 3000 in use` | Port occupé | Tuez le processus ou changez le port |

### Logs et débogage

#### Activer les logs développeur

```bash
# Mode développement avec logs
npm run dev
```

#### Consulter les logs

- **Windows** : `%APPDATA%/devisai-desktop/logs/`
- **macOS** : `~/Library/Logs/devisai-desktop/`
- **Linux** : `~/.local/share/devisai-desktop/logs/`

---

## Contact & Support

### Signaler un bug

Ouvrez une issue sur GitHub avec :
- Description du problème
- Étapes pour reproduire
- Capture d'écran
- Version de l'application

### Contribuer

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## Licence

Ce projet est sous licence **MIT**.

```
Copyright (c) 2024 DevisAI Desktop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

**Développé avec ❤️ pour les entrepreneurs congolais et africains.**

*Document mis à jour : Juillet 2026*
