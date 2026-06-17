"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  MessageCircle,
  Paperclip,
  Calendar,
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Réunion familiale annuelle 2026",
    excerpt:
      "Nous avons le plaisir de vous convier à la grande réunion familiale qui se tiendra cette année au village.",
    content:
      "Chers membres de la famille, nous avons le plaisir de vous convier à la grande réunion familiale annuelle. Cette année, les festivités se dérouleront au village du 15 au 20 août 2026. Au programme : assemblée générale, activités culturelles, repas communautaire et bien plus encore. Nous comptons sur votre présence pour faire de cet événement un moment mémorable.",
    author: {
      name: "Koua Nangoin Pierre",
      avatar: "",
      initials: "KP",
    },
    status: "publiée",
    createdAt: "2026-05-15",
    commentCount: 12,
    hasAttachment: true,
    image: "",
  },
  {
    id: "2",
    title: "Célébration des 90 ans de Tonton Koua",
    excerpt:
      "Préparatifs pour l'anniversaire exceptionnel de notre doyen. Tous les membres sont invités à participer.",
    content:
      "Notre cher doyen, Tonton Koua, célèbrera ses 90 ans le 3 juillet prochain. Une grande fête est organisée à la salle des fêtes de la mairie. Nous sollicitons la participation de tous pour les préparatifs et les animations de cette journée exceptionnelle.",
    author: {
      name: "Koua Nangoin Marie",
      avatar: "",
      initials: "KM",
    },
    status: "publiée",
    createdAt: "2026-06-01",
    commentCount: 8,
    hasAttachment: false,
    image: "",
  },
  {
    id: "3",
    title: "Appel aux cotisations 2026",
    excerpt:
      "Rappel concernant les cotisations annuelles pour l'entretien des biens familiaux.",
    content:
      "Chers tous, nous vous rappelons que les cotisations annuelles pour l'année 2026 sont dues avant le 30 juin. Les fonds collectés serviront à l'entretien de la maison familiale, du terrain agricole et au financement des projets communautaires.",
    author: {
      name: "Koua Nangoin Joseph",
      avatar: "",
      initials: "KJ",
    },
    status: "publiée",
    createdAt: "2026-04-20",
    commentCount: 5,
    hasAttachment: true,
    image: "",
  },
  {
    id: "4",
    title: "Inscriptions aux ateliers culturels",
    excerpt:
      "Les inscriptions pour les ateliers de danse, musique et artisanat sont ouvertes.",
    content:
      "Nous lançons les inscriptions pour les ateliers culturels de la saison. Au programme : danses traditionnelles, initiation au tam-tam, tissage et vannerie. Les ateliers auront lieu chaque samedi de 14h à 17h à la maison de la culture.",
    author: {
      name: "Koua Nangoin Awa",
      avatar: "",
      initials: "KA",
    },
    status: "en attente",
    createdAt: "2026-06-10",
    commentCount: 3,
    hasAttachment: false,
    image: "",
  },
  {
    id: "5",
    title: "Projet de construction d'une bibliothèque",
    excerpt:
      "Présentation du projet de bibliothèque communautaire et appel aux dons de livres.",
    content:
      "Le conseil de famille propose la construction d'une bibliothèque communautaire au village. Ce projet vise à promouvoir la lecture et l'éducation auprès des plus jeunes. Nous faisons appel aux dons de livres, de matériel et de fonds pour sa réalisation.",
    author: {
      name: "Koua Nangoin Paul",
      avatar: "",
      initials: "KP",
    },
    status: "en attente",
    createdAt: "2026-06-08",
    commentCount: 15,
    hasAttachment: true,
    image: "",
  },
  {
    id: "6",
    title: "Résultats du concours de dictée",
    excerpt:
      "Découvrez les gagnants du concours de dictée organisé pour les enfants de la famille.",
    content:
      "Félicitations à tous les participants du concours de dictée ! Les gagnants sont : 1er prix : Koua Nangoin Sarah (CM2), 2e prix : Koua Nangoin David (CE2), 3e prix : Koua Nangoin Esther (CP). La remise des prix aura lieu lors de la prochaine réunion familiale.",
    author: {
      name: "Koua Nangoin Rachel",
      avatar: "",
      initials: "KR",
    },
    status: "publiée",
    createdAt: "2026-05-28",
    commentCount: 10,
    hasAttachment: false,
    image: "",
  },
  {
    id: "7",
    title: "Travaux de rénovation du patrimoine",
    excerpt:
      "Programme des travaux de rénovation des biens familiaux pour l'année 2026.",
    content:
      "Le comité de gestion du patrimoine familial a établi le programme des travaux de rénovation pour 2026. Les travaux concernent la toiture de la maison principale, la clôture du terrain et la réhabilitation du puits collectif.",
    author: {
      name: "Koua Nangoin Pierre",
      avatar: "",
      initials: "KP",
    },
    status: "publiée",
    createdAt: "2026-04-15",
    commentCount: 7,
    hasAttachment: true,
    image: "",
  },
  {
    id: "8",
    title: "Nouveaux membres du bureau",
    excerpt:
      "Annonce des résultats des élections du nouveau bureau exécutif de la famille.",
    content:
      "À l'issue de l'assemblée générale du 1er mai 2026, les nouveaux membres du bureau exécutif ont été élus. Président : Koua Nangoin Pierre, Vice-président : Koua Nangoin Joseph, Secrétaire : Koua Nangoin Marie, Trésorier : Koua Nangoin Paul.",
    author: {
      name: "Koua Nangoin Marie",
      avatar: "",
      initials: "KM",
    },
    status: "publiée",
    createdAt: "2026-05-02",
    commentCount: 20,
    hasAttachment: false,
    image: "",
  },
  {
    id: "9",
    title: "Journée de nettoyage du village",
    excerpt:
      "Mobilisation générale pour la journée de salubrité publique organisée par la famille.",
    content:
      "Nous organisons une journée de nettoyage du village le samedi 22 juin 2026. Rendez-vous à 7h devant la maison familiale. Prévoyez des tenues de travail et du matériel de nettoyage. Un déjeuner sera offert à tous les participants.",
    author: {
      name: "Koua Nangoin Joseph",
      avatar: "",
      initials: "KJ",
    },
    status: "publiée",
    createdAt: "2026-06-05",
    commentCount: 9,
    hasAttachment: false,
    image: "",
  },
  {
    id: "10",
    title: "Bourse d'études 2026-2027",
    excerpt:
      "Candidatures ouvertes pour la bourse d'études destinée aux jeunes de la famille.",
    content:
      "La fondation familiale lance l'appel à candidatures pour sa bourse d'études annuelle. Les jeunes membres de la famille inscrits dans l'enseignement supérieur peuvent postuler. Les dossiers sont à déposer avant le 31 juillet 2026.",
    author: {
      name: "Koua Nangoin Awa",
      avatar: "",
      initials: "KA",
    },
    status: "en attente",
    createdAt: "2026-06-12",
    commentCount: 4,
    hasAttachment: true,
    image: "",
  },
  {
    id: "11",
    title: "Commémoration des ancêtres",
    excerpt:
      "Cérémonie traditionnelle en hommage à nos ancêtres prévue pour le mois d'août.",
    content:
      "La cérémonie annuelle de commémoration des ancêtres aura lieu le dimanche 4 août 2026. Tous les membres de la famille sont invités à y participer. Les préparatifs débuteront dès le mois de juillet.",
    author: {
      name: "Koua Nangoin Paul",
      avatar: "",
      initials: "KP",
    },
    status: "publiée",
    createdAt: "2026-06-14",
    commentCount: 6,
    hasAttachment: false,
    image: "",
  },
  {
    id: "12",
    title: "Vente de produits agricoles",
    excerpt:
      "Mise en vente des produits de la saison issus du champ familial.",
    content:
      "La récolte de cette saison est disponible à la vente. Igname, manioc, banane plantain et légumes variés sont proposés aux membres de la famille à prix préférentiels. Les commandes sont à passer avant le 20 juin.",
    author: {
      name: "Koua Nangoin Rachel",
      avatar: "",
      initials: "KR",
    },
    status: "en attente",
    createdAt: "2026-06-13",
    commentCount: 11,
    hasAttachment: false,
    image: "",
  },
]

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

export default function AnnoncesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("toutes")
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered = useMemo(() => {
    let items = MOCK_ANNOUNCEMENTS

    if (activeTab === "publiees") {
      items = items.filter((a) => a.status === "publiée")
    } else if (activeTab === "en-attente") {
      items = items.filter((a) => a.status === "en attente")
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      )
    }

    return items
  }, [searchQuery, activeTab])

  const visibleAnnouncements = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">Annonces</h1>
        <Button asChild variant="gold">
          <Link href="/annonces/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher une annonce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="toutes">Toutes</TabsTrigger>
            <TabsTrigger value="publiees">Publiées</TabsTrigger>
            <TabsTrigger value="en-attente">
              En attente de validation
            </TabsTrigger>
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
            Aucune annonce
          </h3>
          <p className="mb-6 text-sm text-zinc-500">
            {searchQuery
              ? "Aucune annonce ne correspond à votre recherche."
              : "Commencez par créer une nouvelle annonce."}
          </p>
          {!searchQuery && (
            <Button asChild variant="gold">
              <Link href="/annonces/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle annonce
              </Link>
            </Button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${activeTab}-${searchQuery}`}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleAnnouncements.map((annonce) => (
              <motion.div key={annonce.id} variants={itemVariants}>
                <Link href={`/annonces/${annonce.id}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-md">
                    {annonce.image && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={annonce.image}
                          alt={annonce.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg">
                          {annonce.title}
                        </CardTitle>
                        <Badge
                          variant={
                            annonce.status === "publiée"
                              ? "default"
                              : "secondary"
                          }
                          className="shrink-0"
                        >
                          {annonce.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {annonce.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={annonce.author.avatar} />
                            <AvatarFallback className="bg-emerald-800 text-white text-xs">
                              {annonce.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-zinc-600">
                            {annonce.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(annonce.createdAt, "dd MMM yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {annonce.commentCount}
                          </span>
                          {annonce.hasAttachment && (
                            <Paperclip className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                Voir plus
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
