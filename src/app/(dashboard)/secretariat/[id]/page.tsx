"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Download,
  Printer,
  FileText,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

const MOCK_DOCUMENTS = [
  {
    id: "1",
    titre: "Procès-verbal de l'assemblée générale 2026",
    description:
      "Compte rendu détaillé des discussions et résolutions adoptées lors de l'assemblée générale annuelle.",
    type: "proces_verbal",
    date: "2026-05-15",
    auteur: "Koua Nangoin Marie",
    auteurInitiales: "KM",
    auteurRole: "Secrétaire général",
    contenu:
      "L'assemblée générale annuelle de la famille Koua Nangoin s'est tenue le 15 mai 2026 à 10h00 à la maison familiale.\n\nÉtaient présents : 45 membres sur les 60 que compte la famille. Le président Koua Nangoin Pierre a ouvert la séance en remerciant les participants.\n\nOrdre du jour :\n1. Bilan moral de l'année écoulée\n2. Bilan financier\n3. Élection du nouveau bureau exécutif\n4. Projets pour l'année 2026-2027\n5. Questions diverses\n\nLe bilan moral présenté par le président a été approuvé à l'unanimité. Le trésorier a présenté le bilan financier faisant état d'un solde positif de 1 250 000 FCFA.\n\nL'élection du nouveau bureau a donné les résultats suivants :\n- Président : Koua Nangoin Pierre (45 voix)\n- Vice-président : Koua Nangoin Joseph (42 voix)\n- Secrétaire général : Koua Nangoin Marie (44 voix)\n- Trésorier : Koua Nangoin Paul (40 voix)\n\nLa séance a été levée à 16h30.",
    fichier: "PV_AG_2026.pdf",
  },
  {
    id: "2",
    titre: "Compte rendu réunion du bureau exécutif",
    description:
      "Résumé des décisions prises lors de la réunion du bureau exécutif du mois de juin.",
    type: "compte_rendu",
    date: "2026-06-03",
    auteur: "Koua Nangoin Joseph",
    auteurInitiales: "KJ",
    auteurRole: "Vice-président",
    contenu:
      "Réunion du bureau exécutif tenue le 3 juin 2026 à 15h00.\n\nMembres présents : Pierre, Joseph, Marie, Paul, Awa.\n\nDécisions prises :\n1. Validation du budget prévisionnel 2026 d'un montant de 3 000 000 FCFA\n2. Organisation de la journée culturelle familiale prévue le 15 août 2026\n3. Suivi des travaux de rénovation de la maison familiale - toiture terminée, clôture en cours\n4. Mise en place d'une commission pour la bibliothèque communautaire\n5. Prochaine réunion fixée au 1er juillet 2026",
    fichier: "CR_Bureau_Juin2026.pdf",
  },
  {
    id: "3",
    titre: "Règlement intérieur de la famille",
    description:
      "Document officiel définissant les règles de fonctionnement et les droits et devoirs des membres.",
    type: "reglement",
    date: "2026-01-10",
    auteur: "Koua Nangoin Pierre",
    auteurInitiales: "KP",
    auteurRole: "Président",
    contenu:
      "RÈGLEMENT INTÉRIEUR DE LA FAMILLE KOUA NANGOIN\n\nTITRE I : DISPOSITIONS GÉNÉRALES\nArticle 1 : Le présent règlement intérieur a pour objet de définir les règles de fonctionnement de la famille.\nArticle 2 : Il s'applique à tous les membres de la famille.\n\nTITRE II : DROITS ET DEVOIRS\nArticle 3 : Chaque membre a le droit de participer aux assemblées et aux activités familiales.\nArticle 4 : Chaque membre doit contribuer aux cotisations annuelles.\n\nTITRE III : ORGANISATION\nArticle 5 : La famille est dirigée par un bureau exécutif élu pour 3 ans.\nArticle 6 : Le bureau est composé d'un président, d'un vice-président, d'un secrétaire général et d'un trésorier.",
    fichier: "Reglement_Interieur.pdf",
  },
  {
    id: "4",
    titre: "Procès-verbal conseil de famille",
    description:
      "Relevé des délibérations du conseil de famille extraordinaire du 20 avril 2026.",
    type: "proces_verbal",
    date: "2026-04-20",
    auteur: "Koua Nangoin Awa",
    auteurInitiales: "KA",
    auteurRole: "Conseillère",
    contenu:
      "Conseil de famille extraordinaire du 20 avril 2026.\n\nObjet : Acquisition d'un nouveau terrain agricole.\n\nLe conseil s'est réuni en urgence pour examiner la proposition d'achat d'un terrain de 3 hectares situé à proximité du village.\n\nAprès délibération, le conseil approuve à l'unanimité le projet d'achat au prix de 5 000 000 FCFA. Le trésorier est chargé de mobiliser les fonds.",
    fichier: "PV_Conseil_Avril2026.pdf",
  },
]

const typeLabels: Record<string, string> = {
  proces_verbal: "Procès-verbal",
  compte_rendu: "Compte rendu",
  reglement: "Règlement",
  autre: "Autre",
}

const typeVariants: Record<string, "default" | "gold" | "secondary" | "outline"> = {
  proces_verbal: "default",
  compte_rendu: "gold",
  reglement: "secondary",
  autre: "outline",
}

function getDocumentById(id: string) {
  return MOCK_DOCUMENTS.find((d) => d.id === id) || null
}

export default function DocumentDetailPage() {
  const params = useParams()

  const doc = getDocumentById(params.id as string)

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-2 text-2xl font-bold text-zinc-600">
          Document introuvable
        </h2>
        <p className="mb-6 text-zinc-500">
          Ce document n'existe pas ou a été supprimé.
        </p>
        <Button asChild variant="gold">
          <Link href="/secretariat">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux documents
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/secretariat" className="hover:text-emerald-800">
            Secrétariat Général
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-zinc-900">{doc.titre}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <Button variant="ghost" asChild>
          <Link href="/secretariat">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-800" />
                <h1 className="text-3xl font-bold text-zinc-900">
                  {doc.titre}
                </h1>
                <Badge variant={typeVariants[doc.type]}>
                  {typeLabels[doc.type]}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(doc.date)}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {doc.fichier}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 text-sm font-medium text-white">
                {doc.auteurInitiales}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {doc.auteur}
                </p>
                <p className="text-xs text-zinc-500">{doc.auteurRole}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="prose prose-zinc max-w-none">
            {doc.contenu.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed text-zinc-700">
                {paragraph}
              </p>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-emerald-800" />
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  {doc.fichier}
                </p>
                <p className="text-xs text-zinc-400">Document PDF</p>
              </div>
            </div>
            <Button variant="gold" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </article>
      </motion.div>
    </div>
  )
}
