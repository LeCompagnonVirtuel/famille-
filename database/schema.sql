-- ============================================================
-- SCHEMA SUPABASE — Association Famille KOUA NANGOIN
-- ============================================================

-- 0. ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'president', 'secretaire_general', 'tresorier', 'communicateur', 'membre', 'admin'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE statut_demande AS ENUM (
    'en_attente', 'approuve', 'rejete', 'information_demandee'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE action_validation AS ENUM (
    'approuve', 'rejete', 'mis_en_attente', 'information_demandee'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE statut_cotisation AS ENUM (
    'paye', 'en_attente', 'impaye'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE statut_paiement AS ENUM (
    'reussi', 'echoue', 'en_attente'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE type_evenement AS ENUM (
    'reunion', 'mariage', 'bapteme', 'funerailles', 'anniversaire', 'autre'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE type_document AS ENUM (
    'proces_verbal', 'compte_rendu', 'reglement', 'autre'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE type_notification AS ENUM (
    'info', 'warning', 'success', 'error'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE type_media AS ENUM (
    'image', 'video'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 1.1 UPDATED_AT trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 1.2 profiles
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  phone           text,
  role            user_role NOT NULL DEFAULT 'membre',
  nom             text,
  prenom          text,
  date_naissance  date,
  photo_url       text,
  adresse         text,
  profession      text,
  telephone_whatsapp text,
  est_actif       boolean NOT NULL DEFAULT true,
  est_admin_valide boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1.3 demandes_adhesion
CREATE TABLE IF NOT EXISTS demandes_adhesion (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom               text NOT NULL,
  prenom            text NOT NULL,
  email             text,
  telephone         text NOT NULL,
  date_naissance    date NOT NULL,
  lien_parente      text NOT NULL,
  village_origine   text NOT NULL,
  photo_url         text,
  parrain_id        uuid REFERENCES profiles(id) ON DELETE SET NULL,
  statut            statut_demande NOT NULL DEFAULT 'en_attente',
  traitee_par       uuid REFERENCES profiles(id) ON DELETE SET NULL,
  commentaire_admin text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demandes_statut ON demandes_adhesion(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_created ON demandes_adhesion(created_at);

CREATE TRIGGER trg_demandes_adhesion_updated_at
  BEFORE UPDATE ON demandes_adhesion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1.4 historique_validations
CREATE TABLE IF NOT EXISTS historique_validations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demande_id  uuid NOT NULL REFERENCES demandes_adhesion(id) ON DELETE CASCADE,
  action      action_validation NOT NULL,
  auteur_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  commentaire text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_histo_demande ON historique_validations(demande_id);

-- 1.5 annonces
CREATE TABLE IF NOT EXISTS annonces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  contenu     text NOT NULL,
  image_url   text,
  document_url text,
  auteur_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  est_publie  boolean NOT NULL DEFAULT false,
  est_valide  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_annonces_auteur ON annonces(auteur_id);
CREATE INDEX IF NOT EXISTS idx_annonces_date ON annonces(created_at DESC);

CREATE TRIGGER trg_annonces_updated_at
  BEFORE UPDATE ON annonces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1.4 commentaires
CREATE TABLE IF NOT EXISTS commentaires (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu     text NOT NULL,
  auteur_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  annonce_id  uuid NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commentaires_annonce ON commentaires(annonce_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_auteur ON commentaires(auteur_id);

-- 1.5 evenements
CREATE TABLE IF NOT EXISTS evenements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  description text,
  type        type_evenement NOT NULL DEFAULT 'autre',
  date_debut  timestamptz NOT NULL,
  date_fin    timestamptz,
  lieu        text,
  createur_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evenements_date ON evenements(date_debut);
CREATE INDEX IF NOT EXISTS idx_evenements_createur ON evenements(createur_id);

-- 1.6 suggestions
CREATE TABLE IF NOT EXISTS suggestions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  description text NOT NULL,
  categorie   text,
  auteur_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  est_valide  boolean NOT NULL DEFAULT false,
  votes_pour  integer NOT NULL DEFAULT 0,
  votes_contre integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suggestions_auteur ON suggestions(auteur_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_date ON suggestions(created_at DESC);

-- 1.7 discussions
CREATE TABLE IF NOT EXISTS discussions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre      text NOT NULL,
  contenu    text NOT NULL,
  theme      text,
  auteur_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discussions_auteur ON discussions(auteur_id);
CREATE INDEX IF NOT EXISTS idx_discussions_date ON discussions(created_at DESC);

-- 1.8 reponses_discussion
CREATE TABLE IF NOT EXISTS reponses_discussion (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu        text NOT NULL,
  auteur_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  discussion_id  uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reponses_discussion ON reponses_discussion(discussion_id);
CREATE INDEX IF NOT EXISTS idx_reponses_auteur ON reponses_discussion(auteur_id);

-- 1.9 cotisations
CREATE TABLE IF NOT EXISTS cotisations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  montant          numeric(10,2) NOT NULL CHECK (montant > 0),
  mois             integer NOT NULL CHECK (mois BETWEEN 1 AND 12),
  annee            integer NOT NULL CHECK (annee >= 2020),
  date_paiement    timestamptz NOT NULL DEFAULT now(),
  methode_paiement text NOT NULL CHECK (methode_paiement IN ('especes', 'orange_money', 'mtn_money', 'moov_money', 'virement')),
  statut           statut_cotisation NOT NULL DEFAULT 'en_attente',
  reference_paiement text,
  recu_url         text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cotisations_membre ON cotisations(membre_id);
CREATE INDEX IF NOT EXISTS idx_cotisations_periode ON cotisations(annee, mois);
CREATE INDEX IF NOT EXISTS idx_cotisations_statut ON cotisations(statut);

-- 1.10 paiements
CREATE TABLE IF NOT EXISTS paiements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('cotisation', 'don', 'autre')),
  montant     numeric(10,2) NOT NULL CHECK (montant > 0),
  methode     text NOT NULL CHECK (methode IN ('especes', 'orange_money', 'mtn_money', 'moov_money', 'virement', 'carte_bancaire')),
  statut      statut_paiement NOT NULL DEFAULT 'en_attente',
  reference   text,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paiements_membre ON paiements(membre_id);
CREATE INDEX IF NOT EXISTS idx_paiements_type ON paiements(type);
CREATE INDEX IF NOT EXISTS idx_paiements_statut ON paiements(statut);

-- 1.11 votes
CREATE TABLE IF NOT EXISTS votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  description text,
  date_debut  timestamptz NOT NULL,
  date_fin    timestamptz NOT NULL,
  est_actif   boolean NOT NULL DEFAULT true,
  createur_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_votes_dates CHECK (date_fin > date_debut)
);

CREATE INDEX IF NOT EXISTS idx_votes_actif ON votes(est_actif) WHERE est_actif = true;
CREATE INDEX IF NOT EXISTS idx_votes_createur ON votes(createur_id);

-- 1.12 options_vote
CREATE TABLE IF NOT EXISTS options_vote (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id     uuid NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  label       text NOT NULL,
  nombre_voix integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_options_vote ON options_vote(vote_id);

-- 1.13 votes_utilisateurs
CREATE TABLE IF NOT EXISTS votes_utilisateurs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id        uuid NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  option_id      uuid NOT NULL REFERENCES options_vote(id) ON DELETE CASCADE,
  utilisateur_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vote_id, utilisateur_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_utilisateurs_vote ON votes_utilisateurs(vote_id);
CREATE INDEX IF NOT EXISTS idx_votes_utilisateurs_user ON votes_utilisateurs(utilisateur_id);

-- 1.14 documents
CREATE TABLE IF NOT EXISTS documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  description text,
  type        type_document NOT NULL DEFAULT 'autre',
  fichier_url text NOT NULL,
  uploader_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploader ON documents(uploader_id);

-- 1.15 notifications
CREATE TABLE IF NOT EXISTS notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destinataire_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titre           text NOT NULL,
  message         text NOT NULL,
  type            type_notification NOT NULL DEFAULT 'info',
  est_lu          boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_destinataire ON notifications(destinataire_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lu ON notifications(destinataire_id, est_lu);

-- 1.16 relations_familiales
CREATE TABLE IF NOT EXISTS relations_familiales (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id_1   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  membre_id_2   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type_relation text NOT NULL CHECK (type_relation IN ('conjoint', 'enfant', 'parent', 'frere_soeur', 'oncle_tante', 'cousin', 'grand_parent', 'tuteur', 'autre')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_relations_different CHECK (membre_id_1 <> membre_id_2)
);

CREATE INDEX IF NOT EXISTS idx_relations_membre1 ON relations_familiales(membre_id_1);
CREATE INDEX IF NOT EXISTS idx_relations_membre2 ON relations_familiales(membre_id_2);

-- 1.17 albums
CREATE TABLE IF NOT EXISTS albums (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre         text NOT NULL,
  description   text,
  couverture_url text,
  createur_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_albums_createur ON albums(createur_id);

-- 1.18 medias
CREATE TABLE IF NOT EXISTS medias (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  url         text NOT NULL,
  type        type_media NOT NULL,
  description text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medias_album ON medias(album_id);
CREATE INDEX IF NOT EXISTS idx_medias_type ON medias(type);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

-- Helper: get current user's role (bypasses RLS on profiles)
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Enable RLS on all tables
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces              ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaires          ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements            ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reponses_discussion   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotisations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements             ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE options_vote          ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes_utilisateurs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE relations_familiales  ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums                ENABLE ROW LEVEL SECURITY;
ALTER TABLE medias                ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. POLICIES
-- ============================================================

-- 3.0 Admin (president) — full access to every table
DO $$ DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'annonces', 'commentaires', 'evenements', 'suggestions',
      'discussions', 'reponses_discussion', 'cotisations', 'paiements',
      'votes', 'options_vote', 'votes_utilisateurs', 'documents',
      'notifications', 'relations_familiales', 'albums', 'medias'
    ])
  LOOP
    EXECUTE format(
      'CREATE POLICY admin_all ON %I FOR ALL USING (auth.current_user_role() = ''president'') WITH CHECK (auth.current_user_role() = ''president'')',
      tbl
    );
  END LOOP;
END $$;

-- 3.1 profiles — everyone can read, users can update own
CREATE POLICY profiles_select_all ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_insert_on_signup ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3.2 annonces — communicateur CRUD, membres lecture seule (publiees + validees)
CREATE POLICY annonces_communicateur_all ON annonces
  FOR ALL USING (auth.current_user_role() IN ('communicateur', 'president'))
  WITH CHECK (auth.current_user_role() IN ('communicateur', 'president'));

CREATE POLICY annonces_membre_select ON annonces
  FOR SELECT USING (
    est_publie = true AND est_valide = true
    AND auth.role() = 'authenticated'
  );

-- 3.3 commentaires — any authenticated user can read, any can create, own can delete
CREATE POLICY commentaires_select ON commentaires
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM annonces a WHERE a.id = annonce_id AND a.est_publie AND a.est_valide)
    OR auteur_id = auth.uid()
    OR auth.current_user_role() = 'president'
  );

CREATE POLICY commentaires_insert ON commentaires
  FOR INSERT WITH CHECK (
    auteur_id = auth.uid()
    AND EXISTS (SELECT 1 FROM annonces a WHERE a.id = annonce_id AND a.est_publie AND a.est_valide)
  );

CREATE POLICY commentaires_delete_own ON commentaires
  FOR DELETE USING (auteur_id = auth.uid());

-- 3.4 evenements — any authenticated can read, creator can update/delete
CREATE POLICY evenements_select ON evenements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY evenements_insert ON evenements
  FOR INSERT WITH CHECK (createur_id = auth.uid());

CREATE POLICY evenements_update_own ON evenements
  FOR UPDATE USING (createur_id = auth.uid())
  WITH CHECK (createur_id = auth.uid());

CREATE POLICY evenements_delete_own ON evenements
  FOR DELETE USING (createur_id = auth.uid());

-- 3.5 suggestions — any authenticated can read, create; own can update/delete
CREATE POLICY suggestions_select ON suggestions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY suggestions_insert ON suggestions
  FOR INSERT WITH CHECK (auteur_id = auth.uid());

CREATE POLICY suggestions_update_own ON suggestions
  FOR UPDATE USING (auteur_id = auth.uid())
  WITH CHECK (auteur_id = auth.uid());

CREATE POLICY suggestions_delete_own ON suggestions
  FOR DELETE USING (auteur_id = auth.uid());

-- 3.6 discussions — any authenticated can read, create; own can update/delete
CREATE POLICY discussions_select ON discussions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY discussions_insert ON discussions
  FOR INSERT WITH CHECK (auteur_id = auth.uid());

CREATE POLICY discussions_update_own ON discussions
  FOR UPDATE USING (auteur_id = auth.uid())
  WITH CHECK (auteur_id = auth.uid());

CREATE POLICY discussions_delete_own ON discussions
  FOR DELETE USING (auteur_id = auth.uid());

-- 3.7 reponses_discussion — any authenticated can read, create; own can delete
CREATE POLICY reponses_discussion_select ON reponses_discussion
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY reponses_discussion_insert ON reponses_discussion
  FOR INSERT WITH CHECK (auteur_id = auth.uid());

CREATE POLICY reponses_discussion_delete_own ON reponses_discussion
  FOR DELETE USING (auteur_id = auth.uid());

-- 3.8 cotisations — tresorier CRUD, member reads own
CREATE POLICY cotisations_tresorier_all ON cotisations
  FOR ALL USING (auth.current_user_role() IN ('tresorier', 'president'))
  WITH CHECK (auth.current_user_role() IN ('tresorier', 'president'));

CREATE POLICY cotisations_membre_select ON cotisations
  FOR SELECT USING (membre_id = auth.uid());

-- 3.9 paiements — tresorier CRUD, member reads own
CREATE POLICY paiements_tresorier_all ON paiements
  FOR ALL USING (auth.current_user_role() IN ('tresorier', 'president'))
  WITH CHECK (auth.current_user_role() IN ('tresorier', 'president'));

CREATE POLICY paiements_membre_select ON paiements
  FOR SELECT USING (membre_id = auth.uid());

-- 3.10 votes / options_vote / votes_utilisateurs — any authenticated can read, vote
CREATE POLICY votes_select ON votes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY votes_insert ON votes
  FOR INSERT WITH CHECK (createur_id = auth.uid());

CREATE POLICY votes_update_own ON votes
  FOR UPDATE USING (createur_id = auth.uid())
  WITH CHECK (createur_id = auth.uid());

-- options_vote
CREATE POLICY options_vote_select ON options_vote
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY options_vote_insert ON options_vote
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM votes v WHERE v.id = vote_id AND v.createur_id = auth.uid())
    OR auth.current_user_role() = 'president'
  );

-- votes_utilisateurs
CREATE POLICY votes_utilisateurs_select ON votes_utilisateurs
  FOR SELECT USING (
    utilisateur_id = auth.uid()
    OR auth.current_user_role() = 'president'
  );

CREATE POLICY votes_utilisateurs_insert ON votes_utilisateurs
  FOR INSERT WITH CHECK (
    utilisateur_id = auth.uid()
    AND EXISTS (SELECT 1 FROM votes v WHERE v.id = vote_id AND v.est_actif = true AND v.date_fin > now())
  );

-- 3.11 documents — secretaire_general CRUD, any authenticated can read
CREATE POLICY documents_secretaire_all ON documents
  FOR ALL USING (auth.current_user_role() IN ('secretaire_general', 'president'))
  WITH CHECK (auth.current_user_role() IN ('secretaire_general', 'president'));

CREATE POLICY documents_select ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- 3.12 notifications — user reads own, can mark as read
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (destinataire_id = auth.uid());

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (destinataire_id = auth.uid())
  WITH CHECK (destinataire_id = auth.uid());

-- 3.13 relations_familiales — any authenticated can read
CREATE POLICY relations_familiales_select ON relations_familiales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY relations_familiales_insert ON relations_familiales
  FOR INSERT WITH CHECK (
    membre_id_1 = auth.uid() OR membre_id_2 = auth.uid()
    OR auth.current_user_role() = 'president'
  );

-- 3.14 albums — any authenticated can read, creator can update/delete
CREATE POLICY albums_select ON albums
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY albums_insert ON albums
  FOR INSERT WITH CHECK (createur_id = auth.uid());

CREATE POLICY albums_update_own ON albums
  FOR UPDATE USING (createur_id = auth.uid())
  WITH CHECK (createur_id = auth.uid());

CREATE POLICY albums_delete_own ON albums
  FOR DELETE USING (createur_id = auth.uid());

-- 3.15 medias — any authenticated can read, uploader can update/delete
CREATE POLICY medias_select ON medias
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY medias_insert ON medias
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY medias_delete_own ON medias
  FOR DELETE USING (uploaded_by = auth.uid());

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

-- 4.1 Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, nom, prenom, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data ->> 'nom', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'prenom', ''),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::user_role,
      'membre'::user_role
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists; silently ignore
    RETURN NEW;
END;
$$;

-- 4.2 Cotisation statistics per month for a given year
CREATE OR REPLACE FUNCTION public.calculate_cotisation_stats(annee integer)
RETURNS TABLE(mois integer, total numeric(10,2), nombre_paiements bigint)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.mois,
    COALESCE(SUM(c.montant), 0)::numeric(10,2) AS total,
    COUNT(*)::bigint AS nombre_paiements
  FROM cotisations c
  WHERE c.annee = calculate_cotisation_stats.annee
    AND c.statut = 'paye'
  GROUP BY c.mois
  ORDER BY c.mois;
END;
$$;

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. STORAGE BUCKETS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documents') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('documents', 'documents', false, 52428800, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'photos', 'photos', true, 10485760,
      ARRAY['image/png'::text, 'image/jpeg'::text, 'image/gif'::text, 'image/webp'::text]
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'annonces') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('annonces', 'annonces', false, 52428800, NULL);
  END IF;
END $$;
