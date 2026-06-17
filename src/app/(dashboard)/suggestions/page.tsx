"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, ThumbsUp, ThumbsDown, CheckCircle, Lightbulb, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"

const CATEGORIES = [
  { value: "toutes", label: "Toutes" },
  { value: "Finances", label: "Finances" },
  { value: "Organisation", label: "Organisation" },
  { value: "Événements", label: "Événements" },
  { value: "Vie familiale", label: "Vie familiale" },
  { value: "Autre", label: "Autre" },
] as const

type Suggestion = {
  id: string
  title: string
  description: string
  category: string
  author: { name: string; avatar: string; initials: string }
  createdAt: string
  votesPour: number
  votesContre: number
  status: "en attente" | "validée" | "refusée"
  commentCount: number
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    title: "Créer une caisse de solidarité familiale",
    description: "Mettre en place une caisse commune alimentée par des cotisations mensuelles pour aider les membres en cas d'urgence ou d'événements importants.",
    category: "Finances",
    author: { name: "Koua Nangoin Pierre", avatar: "", initials: "KP" },
    createdAt: "2026-05-10",
    votesPour: 18,
    votesContre: 3,
    status: "en attente",
    commentCount: 7,
  },
  {
    id: "2",
    title: "Organiser un séminaire annuel de développement familial",
    description: "Proposer un weekend de réflexion sur les valeurs familiales, l'éducation des enfants et le développement économique de la famille.",
    category: "Organisation",
    author: { name: "Koua Nangoin Marie", avatar: "", initials: "KM" },
    createdAt: "2026-05-08",
    votesPour: 22,
    votesContre: 1,
    status: "validée",
    commentCount: 12,
  },
  {
    id: "3",
    title: "Fête de fin d'année pour les enfants",
    description: "Organiser une fête avec des jeux, un goûter et des cadeaux pour les enfants de la famille à l'occasion des fêtes de fin d'année.",
    category: "Événements",
    author: { name: "Koua Nangoin Awa", avatar: "", initials: "KA" },
    createdAt: "2026-05-05",
    votesPour: 25,
    votesContre: 0,
    status: "validée",
    commentCount: 15,
  },
  {
    id: "4",
    title: "Créer un groupe WhatsApp pour les jeunes",
    description: "Mettre en place un espace d'échange dédié aux jeunes de la famille pour partager leurs idées, projets et préoccupations.",
    category: "Organisation",
    author: { name: "Koua Nangoin Paul", avatar: "", initials: "KP" },
    createdAt: "2026-04-28",
    votesPour: 14,
    votesContre: 5,
    status: "validée",
    commentCount: 9,
  },
  {
    id: "5",
    title: "Investir dans un terrain agricole",
    description: "Acheter un terrain cultivable pour y développer des activités agricoles génératrices de revenus pour la famille.",
    category: "Finances",
    author: { name: "Koua Nangoin Joseph", avatar: "", initials: "KJ" },
    createdAt: "2026-04-20",
    votesPour: 10,
    votesContre: 8,
    status: "refusée",
    commentCount: 6,
  },
  {
    id: "6",
    title: "Visite trimestrielle aux aînés",
    description: "Organiser des visites régulières chez les grands-parents et les membres âgés de la famille pour maintenir le lien et leur apporter du soutien.",
    category: "Vie familiale",
    author: { name: "Koua Nangoin Rachel", avatar: "", initials: "KR" },
    createdAt: "2026-04-15",
    votesPour: 28,
    votesContre: 0,
    status: "validée",
    commentCount: 11,
  },
  {
    id: "7",
    title: "Créer une bibliothèque familiale numérique",
    description: "Constituer une collection de livres numériques et de ressources éducatives accessibles à tous les membres de la famille.",
    category: "Autre",
    author: { name: "Koua Nangoin David", avatar: "", initials: "KD" },
    createdAt: "2026-04-10",
    votesPour: 16,
    votesContre: 4,
    status: "en attente",
    commentCount: 8,
  },
  {
    id: "8",
    title: "Atelier de cuisine traditionnelle",
    description: "Organiser des ateliers mensuels de cuisine pour transmettre les recettes familiales et les techniques culinaires aux plus jeunes.",
    category: "Vie familiale",
    author: { name: "Koua Nangoin Sarah", avatar: "", initials: "KS" },
    createdAt: "2026-04-05",
    votesPour: 20,
    votesContre: 2,
    status: "en attente",
    commentCount: 14,
  },
  {
    id: "9",
    title: "Journée sportive intergénérationnelle",
    description: "Organiser une journée de compétitions sportives et de jeux de société réunissant petits et grands autour de valeurs de partage.",
    category: "Événements",
    author: { name: "Koua Nangoin Jean", avatar: "", initials: "KJ" },
    createdAt: "2026-03-28",
    votesPour: 19,
    votesContre: 3,
    status: "validée",
    commentCount: 10,
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

const categoryVariant = (cat: string) => {
  switch (cat) {
    case "Finances":
      return "default"
    case "Organisation":
      return "secondary"
    case "Événements":
      return "gold"
    default:
      return "outline"
  }
}

export default function SuggestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("toutes")
  const [votes, setVotes] = useState<Record<string, "pour" | "contre" | null>>({})

  const filtered = useMemo(() => {
    let items = MOCK_SUGGESTIONS

    if (activeTab !== "toutes") {
      items = items.filter((s) => s.category === activeTab)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    }

    return items
  }, [searchQuery, activeTab])

  const handleVote = (id: string, type: "pour" | "contre") => {
    setVotes((prev) => {
      if (prev[id] === type) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: type }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-emerald-800">Suggestions</h1>
        </div>
        <Button variant="gold">
          <Plus className="mr-2 h-4 w-4" />
          Soumettre une idée
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher une suggestion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center"
        >
          <Lightbulb className="mb-4 h-12 w-12 text-zinc-300" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-600">
            Aucune suggestion
          </h3>
          <p className="mb-6 text-sm text-zinc-500">
            {searchQuery
              ? "Aucune suggestion ne correspond à votre recherche."
              : "Soyez le premier à partager une idée !"}
          </p>
          <Button variant="gold">
            <Plus className="mr-2 h-4 w-4" />
            Soumettre une idée
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeTab}-${searchQuery}`}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((suggestion) => (
            <motion.div key={suggestion.id} variants={itemVariants}>
              <Card className="group h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={
                        categoryVariant(suggestion.category) as "default" | "secondary" | "outline" | "gold"
                      }
                      className="shrink-0"
                    >
                      {suggestion.category}
                    </Badge>
                    <Badge
                      variant={
                        suggestion.status === "validée"
                          ? "default"
                          : suggestion.status === "refusée"
                          ? "destructive"
                          : "secondary"
                      }
                      className="shrink-0"
                    >
                      {suggestion.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 line-clamp-2 text-lg">
                    {suggestion.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {suggestion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={suggestion.author.avatar} />
                        <AvatarFallback className="bg-emerald-800 text-white text-xs">
                          {suggestion.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-zinc-600">
                        {suggestion.author.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{suggestion.commentCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 px-2 ${
                          votes[suggestion.id] === "pour"
                            ? "text-emerald-800"
                            : "text-zinc-500"
                        }`}
                        onClick={() => handleVote(suggestion.id, "pour")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-xs font-medium tabular-nums">
                          {suggestion.votesPour + (votes[suggestion.id] === "pour" ? 1 : 0) - (votes[suggestion.id] === "contre" ? 0 : 0)}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 px-2 ${
                          votes[suggestion.id] === "contre"
                            ? "text-red-600"
                            : "text-zinc-500"
                        }`}
                        onClick={() => handleVote(suggestion.id, "contre")}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span className="text-xs font-medium tabular-nums">
                          {suggestion.votesContre + (votes[suggestion.id] === "contre" ? 1 : 0) - (votes[suggestion.id] === "pour" ? 0 : 0)}
                        </span>
                      </Button>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {formatDate(suggestion.createdAt, "dd MMM yyyy")}
                    </span>
                  </div>

                  {suggestion.status === "en attente" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-emerald-800 hover:bg-emerald-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Valider
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
