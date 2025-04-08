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

## Versions

Version actuelle : 0.1.2

## Technologies Utilisées

- React 18.2.0
- Jest pour les tests
- GitHub Actions pour CI/CD
- GitHub Pages pour l'hébergement