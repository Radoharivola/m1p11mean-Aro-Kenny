# m1p11mean-Aro-Kenny

## installation
* ### back:
Go to the directory
```bash
cd m1p11mean-Aro-Kenny
```
Install all the packages
```bash
npm install
```
* ### front:
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
