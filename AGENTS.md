<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Validation des inscriptions

* Toute nouvelle inscription reste en statut **"En attente de validation"**.
* Aucun nouvel utilisateur ne peut accéder à la plateforme avant validation.
* Le Président et les Administrateurs désignés sont les seuls habilités à approuver ou rejeter une demande d'inscription.
* Lors de l'inscription, le demandeur doit fournir :

  * Nom et Prénoms
  * Téléphone
  * Email (optionnel)
  * Date de naissance
  * Lien de parenté avec la famille KOUA NANGOIN
  * Village ou localité d'origine
  * Photo de profil (optionnelle)

### Interface de validation

Module **"Demandes d'adhésion"** accessible uniquement aux Présidents et Administrateurs.

Pour chaque demande afficher :

* Informations complètes du demandeur
* Date d'inscription
* Statut de la demande

Actions possibles :

* ✅ Approuver
* ❌ Rejeter
* ⏳ Mettre en attente
* 💬 Demander des informations complémentaires

### Sécurité anti-intrusion

* Seuls les membres validés peuvent accéder aux fonctionnalités.
* Les comptes rejetés sont automatiquement bloqués.
* Historique de toutes les validations et rejets.
* Notification automatique après décision.
* Possibilité pour le Président de suspendre ou supprimer un compte déjà validé.

### Vérification familiale

Avant validation, vérifier :

* Le lien de parenté déclaré.
* Les informations personnelles fournies.
* Les recommandations d'autres membres déjà enregistrés.

### Système de parrainage

* Un nouveau membre peut être recommandé par un membre déjà validé.
* Le nom du parrain apparaît dans la demande d'inscription.
