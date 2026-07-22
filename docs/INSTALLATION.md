# Guide d'Installation - DevisAI Desktop

## 📋 Sommaire

1. [Prérequis](#prérequis)
2. [Installation Windows](#installation-windows)
3. [Installation Développeur](#installation-développeur)
4. [Configuration](#configuration)
5. [Vérification](#vérification)
6. [Problèmes courants](#problèmes-courants)

---

## Prérequis

### Pour les utilisateurs

| Élément | Configuration minimale |
|---------|----------------------|
| Système | Windows 10/11 (64 bits) |
| RAM | 4 Go minimum |
| Espace disque | 500 Mo |
| Écran | 1024 x 768 minimum |

### Pour les développeurs

| Logiciel | Version | Lien |
|----------|---------|------|
| Node.js | 18.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 9.x | Inclus avec Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

---

## Installation Windows

### Méthode 1 : Installeur (Recommandé)

#### Étape 1 : Télécharger

Téléchargez le fichier `DevisAI-Desktop-Setup-1.0.0.exe` depuis les releases.

#### Étape 2 : Exécuter

1. Double-cliquez sur le fichier téléchargé
2. Si Windows affiche un avertissement, cliquez sur **"Exécuter quand même"**
3. L'assistant d'installation s'ouvre

#### Étape 3 : Installer

```
┌─────────────────────────────────────────────┐
│     Assistant d'installation                │
│     DevisAI Desktop v1.0.0                  │
├─────────────────────────────────────────────┤
│                                             │
│  Bienvenue dans l'assistant d'installation  │
│  de DevisAI Desktop.                        │
│                                             │
│  Ce programme va installer DevisAI Desktop  │
│  sur votre ordinateur.                      │
│                                             │
│  Cliquez sur Suivant pour continuer.        │
│                                             │
│           [ Suivant > ]                     │
└─────────────────────────────────────────────┘
```

#### Étape 4 : Choisir l'emplacement

Par défaut : `C:\Users\[VotreNom]\AppData\Local\Programs\devisai-desktop`

#### Étape 5 : Terminer

Cochez **"Lancer DevisAI Desktop"** et cliquez sur **Terminer**.

### Méthode 2 : Portable

1. Téléchargez `DevisAI-Desktop-1.0.0-portable.exe`
2. Aucune installation requise
3. Double-cliquez pour lancer

---

## Installation Développeur

### Étape 1 : Installer Node.js

#### Sur Windows

1. Téléchargez Node.js LTS depuis [nodejs.org](https://nodejs.org)
2. Exécutez l'installeur
3. Vérifiez les options :
   - ✅ Node.js runtime
   - ✅ npm package manager
   - ✅ Add to PATH

```bash
# Vérifier l'installation
node --version
# Sortie : v18.17.0 (ou supérieur)

npm --version
# Sortie : 9.6.7 (ou supérieur)
```

#### Sur macOS

```bash
# Avec Homebrew
brew install node@18

# Vérifier
node --version
```

#### Sur Linux (Ubuntu/Debian)

```bash
# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

### Étape 2 : Cloner le projet

```bash
# Avec HTTPS
git clone https://github.com/votre-username/devisai-desktop.git

# Ou avec SSH
git clone git@github.com:votre-username/devisai-desktop.git

# Entrer dans le dossier
cd devisai-desktop
```

### Étape 3 : Installer les dépendances

```bash
# Installation complète
npm install
```

> ⏱️ Cette étape peut prendre 2 à 5 minutes.

#### Dépendances installées

```
├── better-sqlite3      # Base de données SQLite native
├── electron            # Framework desktop
├── jspdf               # Génération PDF
├── react               # Interface utilisateur
├── react-router-dom    # Navigation
└── ... (autres)
```

### Étape 4 : Lancer en développement

```bash
# Démarrer l'application
npm run dev
```

Cette commande :
1. Lance le serveur React (http://localhost:3000)
2. Attend que React soit prêt
3. Démarre Electron

### Étape 5 : Construire pour production

```bash
# Créer l'exécutable
npm run electron-build
```

Les fichiers générés se trouvent dans `dist/` :
- `DevisAI-Desktop-Setup-1.0.0.exe` (Installeur)
- `DevisAI-Desktop-1.0.0-portable.exe` (Portable)
- `win-unpacked/` (Dossier non compressé)

---

## Configuration

### Configuration initiale

#### 1. Premier lancement

Au premier démarrage, l'application :
- Crée la base de données SQLite
- Initialise les tables
- Crée l'utilisateur admin par défaut

#### 2. Identifiants par défaut

```
┌─────────────────────────────────────┐
│  CONNEXION                          │
├─────────────────────────────────────┤
│  Email    : admin@gmail.com         │
│  Password : admin@123               │
└─────────────────────────────────────┘
```

> ⚠️ **Important** : Changez ces identifiants après la première connexion !

### Structure des données

```
Windows:
%APPDATA%\devisai-desktop\
├── devisai.db          # Base de données
├── logs\               # Logs (si activés)
└── backups\            # Sauvegardes automatiques
```

### Variables d'environnement (optionnel)

Créez un fichier `.env` à la racine :

```env
# API OpenRouter (optionnel)
REACT_APP_OPENROUTER_KEY=sk-or-xxxxx

# Mode
NODE_ENV=development
```

---

## Vérification

### Vérifier l'installation

#### 1. Vérifier les fichiers

```bash
# Lister les fichiers principaux
ls -la

# Devriez voir :
# electron/
# src/
# public/
# package.json
# README.md
```

#### 2. Vérifier les dépendances

```bash
# Vérifier les vulnérabilités
npm audit

# Mettre à jour si nécessaire
npm update
```

#### 3. Tester l'application

```bash
# Lancer
npm run dev

# L'application doit :
# ✅ Ouvrir une fenêtre Electron
# ✅ Afficher la page de connexion
# ✅ Accepter les identifiants par défaut
```

### Tests fonctionnels

| Test | Attendu | Résultat |
|------|---------|----------|
| Connexion | Page d'accueil | ✅ / ❌ |
| Créer une entreprise | Formulaire enregistré | ✅ / ❌ |
| Ajouter un client | Client dans la liste | ✅ / ❌ |
| Créer un devis | Devis visible | ✅ / ❌ |
| Exporter PDF | Fichier généré | ✅ / ❌ |

---

## Problèmes courants

### Problème 1 : `npm install` échoue

**Symptôme :**
```
npm ERR! code EACCES
npm ERR! permission denied
```

**Solution :**
```bash
# Sur Windows, lancer le terminal en administrateur
# Ou nettoyer le cache
npm cache clean --force
rm -rf node_modules
npm install
```

### Problème 2 : Electron ne démarre pas

**Symptôme :**
```
Error: Electron failed to install correctly
```

**Solution :**
```bash
# Réinstaller Electron
npm uninstall electron
npm install electron@28.2.0
```

### Problème 3 : `better-sqlite3` erreur

**Symptôme :**
```
Error: Cannot find module 'better-sqlite3'
```

**Solution :**
```bash
# Reconstruire le module natif
npm rebuild better-sqlite3

# Si problème persiste
npm uninstall better-sqlite3
npm install better-sqlite3
```

### Problème 4 : Port 3000 occupé

**Symptôme :**
```
Something is already running on port 3000
```

**Solution :**
```bash
# Windows : Tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou utiliser un autre port
set PORT=3001 && npm start
```

### Problème 5 : Écran blanc

**Symptôme :**
L'application s'ouvre mais affiche un écran blanc.

**Solution :**
1. Ouvrez les outils développeur (F12)
2. Vérifiez la console pour les erreurs
3. Essayez de vider le cache :
   ```bash
   rm -rf build
   npm run dev
   ```

### Problème 6 : Base de données corrompue

**Symptôme :**
```
Error: database disk image is malformed
```

**Solution :**
1. Sauvegardez vos données (export JSON)
2. Supprimez la base :
   ```bash
   # Windows
   del %APPDATA%\devisai-desktop\devisai.db
   ```
3. Relancez l'application (base recréée)
4. Importez vos données

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement (React + Electron) |
| `npm run react-dev` | React seul |
| `npm run electron-dev` | Electron seul |
| `npm run build` | Build React |
| `npm run electron-build` | Build complet + exécutable |
| `npm start` | Lancer la version build |

---

## Mise à jour

### Mettre à jour le code

```bash
# Récupérer les dernières modifications
git pull origin main

# Mettre à jour les dépendances
npm install

# Relancer
npm run dev
```

### Mettre à jour les dépendances

```bash
# Voir les mises à jour disponibles
npm outdated

# Mettre à jour tout
npm update

# Ou mettre à jour une dépendance spécifique
npm install package@latest
```

---

## Désinstallation

### Windows

1. **Panneau de configuration** → **Programmes** → **Désinstaller un programme**
2. Trouvez **DevisAI Desktop**
3. Cliquez sur **Désinstaller**

### Données utilisateur

Pour supprimer toutes les données :

```bash
# Supprimer le dossier de données
rmdir /s %APPDATA%\devisai-desktop
```

---

**Besoin d'aide ?** Consultez la [Documentation complète](DOCUMENTATION.md) ou ouvrez une issue sur GitHub.
