export type Role = 'president' | 'secretaire_general' | 'tresorier' | 'communicateur' | 'membre'

export interface Profile {
  id: string
  email: string
  phone: string | null
  role: Role
  nom: string
  prenom: string
  date_naissance: string | null
  photo_url: string | null
  adresse: string | null
  profession: string | null
  telephone_whatsapp: string | null
  est_actif: boolean
  est_admin_valide: boolean
  created_at: string
  updated_at: string
}

export type StatutDemande = 'en_attente' | 'approuve' | 'rejete' | 'information_demandee'

export interface DemandeAdhesion {
  id: string
  nom: string
  prenom: string
  email: string | null
  telephone: string
  date_naissance: string
  lien_parente: string
  village_origine: string
  photo_url: string | null
  parrain_id: string | null
  parrain?: Profile
  statut: StatutDemande
  traitee_par: string | null
  traitee_par_profile?: Profile
  commentaire_admin: string | null
  created_at: string
  updated_at: string
}

export interface HistoriqueValidation {
  id: string
  demande_id: string
  action: 'approuve' | 'rejete' | 'mis_en_attente' | 'information_demandee'
  auteur_id: string
  commentaire: string | null
  created_at: string
}

export interface Annonce {
  id: string
  titre: string
  contenu: string
  image_url: string | null
  document_url: string | null
  auteur_id: string
  auteur?: Profile
  est_publie: boolean
  est_valide: boolean
  created_at: string
  updated_at: string
  commentaires?: Commentaire[]
}

export interface Commentaire {
  id: string
  contenu: string
  auteur_id: string
  auteur?: Profile
  annonce_id: string
  created_at: string
}

export interface Evenement {
  id: string
  titre: string
  description: string | null
  type: 'reunion' | 'mariage' | 'bapteme' | 'funerailles' | 'anniversaire' | 'autre'
  date_debut: string
  date_fin: string | null
  lieu: string | null
  createur_id: string
  created_at: string
}

export interface Suggestion {
  id: string
  titre: string
  description: string
  categorie: string
  auteur_id: string
  auteur?: Profile
  est_valide: boolean
  votes_pour: number
  votes_contre: number
  created_at: string
}

export interface Discussion {
  id: string
  titre: string
  contenu: string
  theme: string
  auteur_id: string
  auteur?: Profile
  created_at: string
  reponses?: ReponseDiscussion[]
}

export interface ReponseDiscussion {
  id: string
  contenu: string
  auteur_id: string
  auteur?: Profile
  discussion_id: string
  created_at: string
}

export interface Cotisation {
  id: string
  membre_id: string
  montant: number
  mois: number
  annee: number
  date_paiement: string
  methode_paiement: 'especes' | 'orange_money' | 'mtn_money' | 'moov_money' | 'virement'
  statut: 'paye' | 'en_attente' | 'impaye'
  reference_paiement: string | null
  recu_url: string | null
  created_at: string
}

export interface Paiement {
  id: string
  membre_id: string
  type: 'cotisation' | 'don' | 'autre'
  montant: number
  methode: 'orange_money' | 'mtn_money' | 'moov_money' | 'especes' | 'virement'
  statut: 'reussi' | 'echoue' | 'en_attente'
  reference: string | null
  description: string | null
  created_at: string
}

export interface Vote {
  id: string
  titre: string
  description: string | null
  date_debut: string
  date_fin: string
  est_actif: boolean
  createur_id: string
  created_at: string
  options?: OptionVote[]
}

export interface OptionVote {
  id: string
  vote_id: string
  label: string
  nombre_voix: number
}

export interface Document {
  id: string
  titre: string
  description: string | null
  type: 'proces_verbal' | 'compte_rendu' | 'reglement' | 'autre'
  fichier_url: string
  uploader_id: string
  created_at: string
}

export interface Notification {
  id: string
  destinataire_id: string
  titre: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  est_lu: boolean
  created_at: string
}

export interface MembreRelation {
  id: string
  membre_id_1: string
  membre_id_2: string
  type_relation: 'conjoint' | 'enfant' | 'parent' | 'frere_soeur' | 'cousin' | 'oncle_tante' | 'grand_parent' | 'autre'
}

export interface Album {
  id: string
  titre: string
  description: string | null
  couverture_url: string | null
  createur_id: string
  created_at: string
}

export interface Media {
  id: string
  album_id: string
  url: string
  type: 'image' | 'video'
  description: string | null
  uploaded_by: string
  created_at: string
}
