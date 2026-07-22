# DevisAI Desktop

<p align="center">
  <img src="docs/images/logo.png" alt="DevisAI Desktop Logo" width="200">
</p>

<p align="center">
  <strong>Logiciel Desktop de Création de Devis Professionnels avec Intelligence Artificielle</strong>
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-installation-rapide">Installation</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-capture-décran">Captures d'écran</a> •
  <a href="#-licence">Licence</a>
</p>

---

## 🎯 Description

**DevisAI Desktop** est un logiciel de bureau professionnel conçu pour les entreprises, indépendants, PME et artisans de la RD Congo. Il permet de créer des devis et factures professionnels rapidement, avec l'aide d'une intelligence artificielle intégrée.

### Public cible

- 🏢 PME et entreprises
- 💼 Entrepreneurs et freelances
- 🔧 Artisans et techniciens
- 🏪 Commerçants
- 🤝 Associations et ONG

---

## 🚀 Fonctionnalités

### Gestion commerciale

| Fonctionnalité | Description |
|----------------|-------------|
| 📄 **Devis professionnels** | Création en moins de 2 minutes |
| 🧾 **Factures congolaises** | Conversion automatique devis → facture |
| 👥 **Gestion clients** | Base de données clients avec recherche intelligente |
| 📦 **Produits & Services** | Catalogue avec catégories et TVA |
| 🏢 **Multi-entreprises** | Gérez plusieurs entreprises dans une seule app |

### Intelligence Artificielle

| Fonctionnalité | Description |
|----------------|-------------|
| 🤖 **Génération de devis** | Création automatique à partir d'une description |
| 📝 **Rédaction assistée** | Descriptions produits, emails, clauses |
| 💡 **Conseils tarifaires** | Aide à la fixation des prix |
| ✅ **Correction de texte** | Grammaire et orthographe |

### Export & Sauvegarde

| Fonctionnalité | Description |
|----------------|-------------|
| 📥 **Export PDF** | Documents professionnels avec logo |
| 💾 **Sauvegarde** | Export JSON et SQLite |
| 📊 **Statistiques** | Tableau de bord et graphiques |
| 🌓 **Thèmes** | Mode clair et mode sombre |

### Caractéristiques techniques

- ✅ **100% hors ligne** - Fonctionne sans internet
- ✅ **Gratuit** - Aucun abonnement
- ✅ **Données locales** - Confidentialité totale
- ✅ **Multi-devises** - USD, CDF, EUR

---

## ⚡ Installation rapide

### Prérequis

- Node.js 18.x ou supérieur
- npm 9.x ou supérieur
- Windows 10/11 (64 bits)

### Installation développeur

```bash
# Cloner le projet
git clone https://github.com/votre-username/devisai-desktop.git
cd devisai-desktop

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Construction pour production

```bash
# Créer l'exécutable Windows
npm run electron-build
```

> 📥 L'exécutable sera généré dans le dossier `dist/`

---

## 🔐 Identifiants par défaut

| Champ | Valeur |
|-------|--------|
| Email | `admin@gmail.com` |
| Mot de passe | `admin@123` |

> ⚠️ **Conseil** : Changez ces identifiants après la première connexion !

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Documentation technique](docs/DOCUMENTATION.md) | Architecture, base de données, API |
| [Guide d'installation](docs/INSTALLATION.md) | Installation pas à pas |
| [Guide utilisateur](docs/GUIDE-UTILISATEUR.md) | Tutoriel complet d'utilisation |

---

## 📸 Captures d'écran

### Connexion
```
┌─────────────────────────────────────┐
│         DEVISAI DESKTOP             │
│                                     │
│    Email: admin@gmail.com           │
│    Password: ••••••••               │
│                                     │
│         [ SE CONNECTER ]            │
└─────────────────────────────────────┘
```

### Tableau de bord
```
┌─────────────────────────────────────────────────────┐
│  TABLEAU DE BORD                                    │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Devis   │ │ Acceptés│ │ Impayés │ │ Revenus │  │
│  │ 12      │ │ 8       │ │ 3       │ │ 15,000$ │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                     │
│  📄 DEVIS RÉCENTS                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ DEV-2026-00001 │ Client ABC │ 2,500$ │ ✅    │  │
│  │ DEV-2026-00002 │ Client XYZ │ 1,200$ │ ⏳    │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Technologies

| Technologie | Version | Usage |
|-------------|---------|-------|
| Electron | 28.x | Framework desktop |
| React | 18.x | Interface utilisateur |
| SQLite | 9.x | Base de données locale |
| jsPDF | 2.x | Génération PDF |
| OpenRouter | API | Intelligence artificielle |

---

## 📁 Structure du projet

```
devisai-desktop/
├── 📁 electron/           # Backend Electron
│   ├── main.js           # Process principal
│   └── preload.js        # Bridge IPC
├── 📁 src/                # Code source React
│   ├── 📁 components/    # Composants réutilisables
│   ├── 📁 pages/         # Pages de l'application
│   ├── 📁 styles/        # Styles CSS
│   └── 📁 utils/         # Utilitaires (PDF, etc.)
├── 📁 docs/               # Documentation
│   ├── DOCUMENTATION.md  # Doc technique complète
│   ├── INSTALLATION.md   # Guide d'installation
│   └── GUIDE-UTILISATEUR.md # Guide utilisateur
├── 📁 public/             # Fichiers statiques
├── package.json           # Configuration npm
└── README.md              # Ce fichier
```

---

## 🤖 Configuration IA (optionnelle)

Pour activer l'IA avancée :

1. Créez un compte sur [OpenRouter](https://openrouter.ai)
2. Générez une clé API (format: `sk-or-...`)
3. Configurez-la dans **Paramètres → Clé API OpenRouter**

> 💡 L'application fonctionne sans clé API en mode simulé.

---

## 💰 Devises supportées

| Devise | Symbole | Pays |
|--------|---------|------|
| Dollar américain | USD | International |
| Franc congolais | CDF | RD Congo |
| Euro | EUR | Europe |

---

## 🗺️ Roadmap

### Version 1.0 (Actuelle)
- ✅ Création de devis
- ✅ Conversion en facture
- ✅ Gestion clients/produits
- ✅ Assistant IA basique
- ✅ Export PDF

### Version 1.1 (À venir)
- ⏳ Modèles de devis personnalisables
- ⏳ Signature électronique
- ⏳ QR Code sur les documents
- ⏳ Synchronisation cloud

### Version 2.0 (Futur)
- ⏳ Application mobile
- ⏳ Multi-utilisateurs
- ⏳ Tableau de bord avancé
- ⏳ Intégrations comptables

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Poussez (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📝 Licence

Ce projet est sous licence **MIT**.

```
Copyright (c) 2024 DevisAI Desktop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Support

- 📧 Email: support@devisai.cd
- 🐛 Bugs: [GitHub Issues](https://github.com/votre-username/devisai-desktop/issues)
- 📖 Documentation: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)

---

<p align="center">
  <strong>Développé avec ❤️ pour les entrepreneurs congolais et africains.</strong>
</p>

<p align="center">
  <sub>© 2024 DevisAI Desktop. Tous droits réservés.</sub>
</p>
