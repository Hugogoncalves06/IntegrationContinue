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