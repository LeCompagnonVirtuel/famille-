"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Download,
  User,
  Inbox,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    contenu:
      "L'assemblée générale annuelle s'est tenue le 15 mai 2026 à 10h00 à la maison familiale. Étaient présents : 45 membres. Ordre du jour : bilan moral, bilan financier, élection du nouveau bureau, projets à venir.",
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
    contenu:
      "Réunion du bureau exécutif du 3 juin 2026. Décisions : validation du budget 2026, organisation de la journée culturelle, suivi des travaux de rénovation.",
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
    contenu:
      "Le présent règlement intérieur a pour objet de définir les règles de fonctionnement de la famille Koua Nangoin. Il s'applique à tous les membres. Titre I : Dispositions générales. Titre II : Droits et devoirs. Titre III : Organisation.",
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
    contenu:
      "Conseil de famille extraordinaire réuni pour discuter de l'acquisition d'un nouveau terrain. Après délibération, le conseil approuve à l'unanimité le projet d'achat.",
  },
  {
    id: "5",
    titre: "Compte rendu réunion des anciens",
    description:
      "Synthèse des échanges avec le conseil des sages sur les traditions et l'histoire familiale.",
    type: "compte_rendu",
    date: "2026-05-28",
    auteur: "Koua Nangoin Paul",
    auteurInitiales: "KP",
    contenu:
      "Réunion avec le conseil des sages le 28 mai 2026. Thèmes abordés : transmission des traditions orales, organisation de la cérémonie des ancêtres, tenue du registre familial.",
  },
  {
    id: "6",
    titre: "Acte de donation terrain",
    description:
      "Document officiel concernant la donation du terrain familial à la communauté.",
    type: "autre",
    date: "2026-03-15",
    auteur: "Koua Nangoin Rachel",
    auteurInitiales: "KR",
    contenu:
      "Acte de donation du terrain situé au village d'une superficie de 2 hectares, consenti par la famille au profit de l'association communautaire.",
  },
  {
    id: "7",
    titre: "Procès-verbal élection bureau 2026",
    description:
      "Procès-verbal officiel des élections du nouveau bureau exécutif de la famille.",
    type: "proces_verbal",
    date: "2026-05-01",
    auteur: "Koua Nangoin Marie",
    auteurInitiales: "KM",
    contenu:
      "Élection du nouveau bureau exécutif. Résultats : Président - Koua Nangoin Pierre (45 voix), Vice-président - Koua Nangoin Joseph (42 voix), Secrétaire - Koua Nangoin Marie (44 voix), Trésorier - Koua Nangoin Paul (40 voix).",
  },
  {
    id: "8",
    titre: "Compte rendu ateliers culturels",
    description:
      "Bilan des ateliers de danse, musique et artisanat organisés au premier semestre.",
    type: "compte_rendu",
    date: "2026-06-10",
    auteur: "Koua Nangoin Awa",
    auteurInitiales: "KA",
    contenu:
      "Bilan des ateliers culturels du premier semestre 2026. 15 séances organisées, 30 participants réguliers. Ateliers de danse traditionnelle, initiation au tam-tam, tissage et vannerie.",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function SecretariatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("tous")

  const filtered = useMemo(() => {
    let items = MOCK_DOCUMENTS

    if (activeTab === "proces_verbal") {
      items = items.filter((d) => d.type === "proces_verbal")
    } else if (activeTab === "compte_rendu") {
      items = items.filter((d) => d.type === "compte_rendu")
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (d) =>
          d.titre.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      )
    }

    return items
  }, [searchQuery, activeTab])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">
          Secrétariat Général
        </h1>
        <Button asChild variant="gold">
          <Link href="/secretariat/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau document
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tous">Tous les documents</TabsTrigger>
            <TabsTrigger value="proces_verbal">Procès-verbaux</TabsTrigger>
            <TabsTrigger value="compte_rendu">Comptes rendus</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center"
        >
          <Inbox className="mb-4 h-12 w-12 text-zinc-300" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-600">
            Aucun document
          </h3>
          <p className="mb-6 text-sm text-zinc-500">
            {searchQuery
              ? "Aucun document ne correspond à votre recherche."
              : "Commencez par créer un nouveau document."}
          </p>
          {!searchQuery && (
            <Button asChild variant="gold">
              <Link href="/secretariat/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau document
              </Link>
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeTab}-${searchQuery}`}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((doc) => (
            <motion.div key={doc.id} variants={itemVariants}>
              <Link href={`/secretariat/${doc.id}`}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-800 shrink-0" />
                        <CardTitle className="line-clamp-2 text-lg">
                          {doc.titre}
                        </CardTitle>
                      </div>
                      <Badge
                        variant={typeVariants[doc.type]}
                        className="shrink-0"
                      >
                        {typeLabels[doc.type]}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-medium text-white">
                          {doc.auteurInitiales}
                        </div>
                        <span className="text-sm text-zinc-600">
                          {doc.auteur}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(doc.date, "dd MMM yyyy")}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
