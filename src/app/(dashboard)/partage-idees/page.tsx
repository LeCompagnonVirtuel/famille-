"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Plus, MessageCircle, Users, Calendar, ArrowRight } from "lucide-react"
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
import { formatDate } from "@/lib/utils"

const THEMES = [
  "Éducation",
  "Culture",
  "Solidarité",
  "Projets",
  "Vie quotidienne",
  "Patrimoine",
] as const

type Discussion = {
  id: string
  title: string
  content: string
  theme: string
  author: { name: string; avatar: string; initials: string }
  createdAt: string
  replyCount: number
  lastActivity: string
  lastAuthor: { name: string; initials: string }
}

const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "Comment préserver nos traditions culinaires ?",
    content: "Je propose qu'on organise des ateliers pour transmettre nos recettes familiales aux plus jeunes générations.",
    theme: "Culture",
    author: { name: "Koua Nangoin Marie", avatar: "", initials: "KM" },
    createdAt: "2026-06-01",
    replyCount: 15,
    lastActivity: "2026-06-14T10:30:00",
    lastAuthor: { name: "Koua Nangoin Paul", initials: "KP" },
  },
  {
    id: "2",
    title: "Projet de bourse d'études pour les jeunes",
    content: "Et si nous créions un fonds pour soutenir les études supérieures de nos enfants les plus méritants ?",
    theme: "Solidarité",
    author: { name: "Koua Nangoin Pierre", avatar: "", initials: "KP" },
    createdAt: "2026-05-28",
    replyCount: 23,
    lastActivity: "2026-06-13T18:45:00",
    lastAuthor: { name: "Koua Nangoin Awa", initials: "KA" },
  },
  {
    id: "3",
    title: "Idées pour la prochaine réunion familiale",
    content: "Partagez vos suggestions pour animer notre prochaine assemblée générale.",
    theme: "Projets",
    author: { name: "Koua Nangoin Joseph", avatar: "", initials: "KJ" },
    createdAt: "2026-05-25",
    replyCount: 31,
    lastActivity: "2026-06-12T14:20:00",
    lastAuthor: { name: "Koua Nangoin Rachel", initials: "KR" },
  },
  {
    id: "4",
    title: "Créer un arbre généalogique numérique",
    content: "Je pense qu'il serait utile de numériser notre arbre généalogique et le rendre accessible à tous.",
    theme: "Patrimoine",
    author: { name: "Koua Nangoin David", avatar: "", initials: "KD" },
    createdAt: "2026-05-20",
    replyCount: 8,
    lastActivity: "2026-06-10T09:00:00",
    lastAuthor: { name: "Koua Nangoin Sarah", initials: "KS" },
  },
  {
    id: "5",
    title: "Organisation d'un vide-grenier solidaire",
    content: "Proposons un événement où chacun peut vendre ou donner des objets dont il ne se sert plus.",
    theme: "Solidarité",
    author: { name: "Koua Nangoin Awa", avatar: "", initials: "KA" },
    createdAt: "2026-05-18",
    replyCount: 12,
    lastActivity: "2026-06-08T16:30:00",
    lastAuthor: { name: "Koua Nangoin Jean", initials: "KJ" },
  },
  {
    id: "6",
    title: "Apprendre une langue locale aux enfants",
    content: "Nos enfants grandissent sans parler notre langue maternelle. Comment inverser cette tendance ?",
    theme: "Éducation",
    author: { name: "Koua Nangoin Rachel", avatar: "", initials: "KR" },
    createdAt: "2026-05-15",
    replyCount: 19,
    lastActivity: "2026-06-07T11:15:00",
    lastAuthor: { name: "Koua Nangoin Pierre", initials: "KP" },
  },
  {
    id: "7",
    title: "Covoiturage familial",
    content: "Mettons en place un système de covoiturage pour les trajets entre les membres de la famille.",
    theme: "Vie quotidienne",
    author: { name: "Koua Nangoin Paul", avatar: "", initials: "KP" },
    createdAt: "2026-05-10",
    replyCount: 6,
    lastActivity: "2026-06-05T08:00:00",
    lastAuthor: { name: "Koua Nangoin Marie", initials: "KM" },
  },
  {
    id: "8",
    title: "Créer un calendrier des anniversaires",
    content: "Un calendrier partagé pour ne plus oublier les anniversaires et événements importants.",
    theme: "Vie quotidienne",
    author: { name: "Koua Nangoin Sarah", avatar: "", initials: "KS" },
    createdAt: "2026-05-05",
    replyCount: 10,
    lastActivity: "2026-06-02T15:45:00",
    lastAuthor: { name: "Koua Nangoin David", initials: "KD" },
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

const themeVariant = (theme: string) => {
  switch (theme) {
    case "Éducation":
      return "default"
    case "Culture":
      return "gold"
    case "Solidarité":
      return "secondary"
    case "Projets":
      return "outline"
    default:
      return "outline"
  }
}

export default function PartageIdeesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_DISCUSSIONS
    const q = searchQuery.toLowerCase()
    return MOCK_DISCUSSIONS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.theme.toLowerCase().includes(q) ||
        d.author.name.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-emerald-800">Partage d'idées</h1>
        </div>
        <Button variant="gold">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle discussion
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Rechercher une discussion..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center"
        >
          <MessageCircle className="mb-4 h-12 w-12 text-zinc-300" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-600">
            Aucune discussion
          </h3>
          <p className="mb-6 text-sm text-zinc-500">
            {searchQuery
              ? "Aucune discussion ne correspond à votre recherche."
              : "Lancez la première discussion !"}
          </p>
          <Button variant="gold">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle discussion
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={searchQuery}
          className="space-y-4"
        >
          {filtered.map((discussion) => (
            <motion.div key={discussion.id} variants={itemVariants}>
              <Link href={`/partage-idees/${discussion.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              themeVariant(discussion.theme) as "default" | "secondary" | "outline" | "gold"
                            }
                          >
                            {discussion.theme}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-emerald-800">
                          {discussion.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {discussion.content}
                        </CardDescription>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-amber-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={discussion.author.avatar} />
                          <AvatarFallback className="bg-emerald-800 text-white text-xs">
                            {discussion.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                          <span className="font-medium text-zinc-700">
                            {discussion.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(discussion.createdAt, "dd MMM yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {discussion.replyCount} réponse{discussion.replyCount > 1 ? "s" : ""}
                        </span>
                        <span className="hidden items-center gap-1 sm:flex">
                          <Users className="h-4 w-4" />
                          {discussion.lastAuthor.name}
                        </span>
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
