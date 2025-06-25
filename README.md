# Formulaire d'Enregistrement React
Pour l'évalution : 
Le codecov : https://app.codecov.io/github/Hugogoncalves06/IntegrationContinue
Le back-end : https://github.com/Hugogoncalves06/Integration_continue_backend
Le front-end deployé : https://hugogoncalves06.github.io/
Le back déployé : https://integration-continue-backend.vercel.app

user admin : admin@dev.com - Test1234
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
  - ✓ Code postal invalide (format incorrect)
  - ✓ Email déjà utilisé
  - ✓ Affichage des erreurs pour chaque champ obligatoire
- **Tests d'authentification**
  - ✓ Connexion utilisateur/admin
  - ✓ Déconnexion

###### `src/components/utils/validation.test.js`
- **isOver18**
  - ✓ Âge >= 18 ans
  - ✓ Âge < 18 ans
  - ✓ Date invalide
- **isValidPostalCode**
  - ✓ Code postal français valide
  - ✓ Code postal invalide (trop court, lettres, etc.)
- **isValidName**
  - ✓ Noms valides (lettres, accents, tirets)
  - ✓ Noms invalides (chiffres, symboles, vide)
- **isValidEmail**
  - ✓ Emails valides
  - ✓ Emails invalides
- **areAllFieldsFilled**
  - ✓ Tous les champs remplis
  - ✓ Champ(s) vide(s)
- **validateForm**
  - ✓ Retourne des erreurs pour chaque champ invalide
  - ✓ Retourne un objet vide pour un formulaire valide
  - ✓ Gère les cas limites (champs manquants/null/undefined)

###### `src/components/forms/LoginForm.test.js`
- ✓ Affichage du formulaire de connexion
- ✓ Connexion réussie (admin et utilisateur)
- ✓ Affichage d'une erreur en cas d'échec
- ✓ Gestion des erreurs réseau

###### `src/components/forms/RegistrationForm.test.js`
- ✓ Affichage du formulaire d'inscription
- ✓ Validation dynamique du mot de passe (longueur, majuscule, chiffre)
- ✓ Affichage/masquage du mot de passe
- ✓ Empêche la soumission si le mot de passe ne respecte pas les règles
- ✓ Affichage des erreurs pour chaque champ
- ✓ Soumission réussie

###### `src/components/pages/HomePage.test.js`
- ✓ Affichage du chargement
- ✓ Affichage des infos utilisateur (mode user)
- ✓ Affichage de la liste des utilisateurs (mode admin)
- ✓ Suppression d'utilisateur (admin)
- ✓ Gestion des erreurs API

###### `src/components/forms/AdminCreationForm.test.js`
- ✓ Affichage du formulaire admin
- ✓ Validation dynamique du mot de passe
- ✓ Création d'admin avec mot de passe valide
- ✓ Affichage/masquage du mot de passe

###### `src/components/toastr/Toastr.test.js`
- ✓ Affichage du toast de succès
- ✓ Fermeture automatique et manuelle
- ✓ Nettoyage du timeout

###### E2E Cypress (dossier `cypress/e2e/`)
- ✓ Flow complet utilisateur (inscription, connexion, dashboard)
- ✓ Flow complet admin (connexion, gestion utilisateurs, création admin)
- ✓ Validation dynamique des formulaires
- ✓ Affichage/masquage du mot de passe
- ✓ Empêche la soumission si le mot de passe ne respecte pas les règles
- ✓ Gestion des erreurs et notifications

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