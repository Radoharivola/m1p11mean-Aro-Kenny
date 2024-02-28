# m1p11mean-Aro-Kenny
### Documents: https://docs.google.com/presentation/d/19U0XLSGR6kUkgc7Fx0ORLVyy_8EF8YVwGrl_ZtqBMjw/edit?usp=sharing

profil manager: karen, mdp: aZ12345678
profil employé: paul, mdp: bZ12345678
profil client: luc, mdp: aZ12345678

## installation
* ### Nodejs express server:
Go to the directory
```bash
cd m1p11mean-Aro-Kenny
```
Install all the packages
```bash
npm install
```
* ### front-office:
Go to the angular directory
```bash
cd m1p11mean-Aro-Kenny/Angular_front
```
Install all the packages
```bash
npm install
```
use `npm start` to start the project instead of `ng serve`: 
- the angular template we used doesn't support recent node versions, by using `npm start`, the project will use an older node version included in the node_modules packages.

* ### Back-office:
Go to the angular directory
```bash
cd m1p11mean-Aro-Kenny/Angular_front_BO
```
Install all the packages
```bash
npm install
```
use `npm start` to start the project

## Fonctionnalités:
### Pour le client
* S’inscrire
* Prise de rendez-vous en ligne, avec les services demandés (chaque service a un délai
et un prix prédéfini)
* Historique des rendez-vous
* Gestion des préférences (service et employé préféré, etc..)
* Rappel des rendez-vous
* Notifications offres spéciales
* Paiement en ligne (à simuler)
### Pour l’employé
* Affichage des rendez-vous
* Gestion de profil et horaire de travail
* Suivi des tâches effectués et du montant de commission pour la journée (en % par
rapport au prix des services)

### Pour le manager
* Gestion du personnel
* Gestion des services (nom, prix, durée, commission)
* Avoir des statistiques
  * Temps moyen de travail pour chaque employé
  * Le nombre de réservation par jour, par mois
  * Chiffre d’affaires par jour, par mois
  * Avoir le bénéfice par mois en entrant les dépenses
    * Salaire
    * Loyer
    * Achat pièce
    * Autres dépenses
