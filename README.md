# Formulaire d'Enregistrement React

Ce projet est une application React qui implémente un formulaire d'enregistrement avec validation des champs et affichage de notifications.

## Fonctionnalités

- Validation des champs en temps réel
- Vérification de l'âge (18 ans minimum)
- Validation du format email
- Validation du code postal français
- Notification de succès après soumission
- Tests unitaires et d'intégration

## Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`

Lance l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour la voir dans votre navigateur.

### `npm test`

Lance les tests en mode interactif.\
Les tests incluent :
- Validation des champs
- Gestion des erreurs
- Tests des composants React
- Tests d'intégration

#### Documentation des Tests

##### Tests Unitaires et d'Intégration

###### `src/App.test.js`
- **Tests de Succès**
  - ✓ Rendu du composant Toastr lors d'une inscription réussie
  - ✓ Absence du composant Toastr à l'initialisation

- **Tests de Validation**
  - ✓ Prénom invalide (caractères numériques)
  - ✓ Nom invalide (caractères numériques)
  - ✓ Email invalide (format incorrect)
  - ✓ Date de naissance invalide (âge < 18 ans)
  - ✓ Ville invalide (champ vide)
  - ✓ Code postal invalide (format incorrect)

###### `src/components/utils/validation.test.js`
- **Tests isOver18**
  - ✓ Validation pour âge ≥ 18 ans
  - ✓ Rejet pour âge < 18 ans
  - ✓ Calcul correct avec anniversaire à venir
  - ✓ Calcul précis pour même mois

- **Tests isValidPostalCode**
  - ✓ Accepte : "75000"
  - ✓ Rejette : "abc", "1234", "123456", caractères spéciaux

- **Tests isValidName**
  - ✓ Accepte : "John", "Jean-Pierre", "Éléonore"
  - ✓ Rejette : "123", champ vide, "John123", caractères spéciaux

- **Tests isValidEmail**
  - ✓ Accepte : "test@example.com"
  - ✓ Rejette : "invalid-email", "test@.com", "test@com"

- **Tests areAllFieldsFilled**
  - ✓ Validation formulaire complet
  - ✓ Détection champs manquants

###### `src/components/toastr/Toastr.test.js`
- **Tests Composant Toast**
  - ✓ Affichage correct du toast
  - ✓ Gestion de la fermeture

###### `src/module.test.js`
- **Tests calculateAge**
  - ✓ Calcul correct de l'âge
  - ✓ Gestion des erreurs :
    - Arguments manquants
    - Type d'argument incorrect
    - Absence de date de naissance
    - Format de date invalide

###### `server/app.test.js`
- **Tests Serveur**
  - ✓ Route GET /users
  - ✓ Format JSON des réponses
  - ✓ Gestion base de données vide

### Couverture des Tests

Pour générer le rapport de couverture :
```bash
npm run test:coverage
```

Les tests couvrent :
- Validation des données
- Logique métier
- Composants React
- Intégration API
- Interface utilisateur
- Gestion des erreurs

// ...existing code...
### `npm run test:coverage`

Lance les tests avec génération du rapport de couverture.

### `npm run build`

Compile l'application pour la production dans le dossier `build`.

## Intégration Continue

Le projet utilise GitHub Actions pour :
- Exécuter les tests automatiquement
- Vérifier la couverture de code
- Déployer automatiquement sur GitHub Pages

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur la branche master.
URL de production : [https://Hugogoncalves06.github.io/IntegrationContinue/](https://Hugogoncalves06.github.io/IntegrationContinue/)

## Versions Tags

### Script de Gestion des Versions

Ce projet inclut un script Bash pour automatiser la gestion des versions dans le fichier `package.json` et le déploiement des nouvelles versions via Git.

#### Fonctionnalités du Script

- Vérifie l'existence du fichier `package.json`.
- Extrait la version actuelle du fichier `package.json`.
- Incrémente automatiquement la version de patch (dernier chiffre dans `x.x.x`).
- Met à jour la version dans `package.json`.
- Crée un commit Git avec la nouvelle version.
- Ajoute un tag Git correspondant à la nouvelle version.
- Pousse le tag vers le dépôt distant.

#### Utilisation

1. Assurez-vous que le script est exécutable :
  ```bash
  chmod +x scripts/deploy_new_version.sh
  ```

2. Exécutez le script :
  ```bash
  ./scripts/deploy_new_version.sh
  ```

#### Exemple de Sortie

```bash
Current version: 1.0.0
Updated version: 1.0.1
pushing the new version to git
```

#### Prérequis

- Un fichier `package.json` valide avec un champ `version`.
- Git configuré et connecté à un dépôt distant.
- Droits d'accès pour pousser des tags sur le dépôt distant.

#### Localisation du Script

Le script est situé dans le chemin suivant :
```
scripts/deploy_new_version.sh
```

#### Notes

- Le script incrémente uniquement la version de patch. Pour modifier la version majeure ou mineure, effectuez les changements manuellement dans `package.json` avant d'exécuter le script.
- Assurez-vous que votre dépôt Git est propre (aucune modification non commitée) avant d'exécuter le script.
- Le script utilise des tags Git pour versionner. Vérifiez que votre dépôt distant accepte les tags.


## Technologies Utilisées

- React 18.2.0
- Jest pour les tests
- GitHub Actions pour CI/CD
- GitHub Pages pour l'hébergement