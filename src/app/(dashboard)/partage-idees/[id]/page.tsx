"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MessageCircle, Send, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

type Reply = {
  id: string
  author: { name: string; avatar: string; initials: string }
  content: string
  createdAt: string
}

type Discussion = {
  id: string
  title: string
  content: string
  theme: string
  author: { name: string; avatar: string; initials: string }
  createdAt: string
  replies: Reply[]
}

const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "Comment préserver nos traditions culinaires ?",
    content:
      "Je propose qu'on organise des ateliers pour transmettre nos recettes familiales aux plus jeunes générations. Nous pourrions nous réunir une fois par mois et chaque membre pourrait partager une recette transmise par ses aînés. Qu'en pensez-vous ?",
    theme: "Culture",
    author: { name: "Koua Nangoin Marie", avatar: "", initials: "KM" },
    createdAt: "2026-06-01T08:00:00",
    replies: [
      {
        id: "r1",
        author: { name: "Koua Nangoin Pierre", avatar: "", initials: "KP" },
        content:
          "Excellente idée ! Ma grand-mère faisait un foutou igname exceptionnel. Je serais ravi d'apprendre et de partager.",
        createdAt: "2026-06-02T10:30:00",
      },
      {
        id: "r2",
        author: { name: "Koua Nangoin Awa", avatar: "", initials: "KA" },
        content:
          "Je peux mettre à disposition ma cuisine et mon terrain pour les légumes frais. On pourrait même filmer les ateliers pour créer une archive numérique.",
        createdAt: "2026-06-03T14:15:00",
      },
      {
        id: "r3",
        author: { name: "Koua Nangoin Paul", avatar: "", initials: "KP" },
        content:
          "Proposition : commençons par recenser les recettes familiales avant de lancer les ateliers. Chacun pourrait envoyer les siennes.",
        createdAt: "2026-06-05T09:45:00",
      },
      {
        id: "r4",
        author: { name: "Koua Nangoin Joseph", avatar: "", initials: "KJ" },
        content:
          "Très bonne initiative. Il faudrait aussi impliquer les enfants dans la préparation, c'est une belle façon de transmettre.",
        createdAt: "2026-06-07T16:00:00",
      },
    ],
  },
  {
    id: "2",
    title: "Projet de bourse d'études pour les jeunes",
    content:
      "Et si nous créions un fonds pour soutenir les études supérieures de nos enfants les plus méritants ? Chaque famille pourrait contribuer selon ses moyens et nous établirions des critères de sélection transparents.",
    theme: "Solidarité",
    author: { name: "Koua Nangoin Pierre", avatar: "", initials: "KP" },
    createdAt: "2026-05-28T09:00:00",
    replies: [
      {
        id: "r5",
        author: { name: "Koua Nangoin Marie", avatar: "", initials: "KM" },
        content:
          "Je suis tout à fait favorable. L'éducation est la clé de l'avenir de nos enfants.",
        createdAt: "2026-05-29T11:20:00",
      },
      {
        id: "r6",
        author: { name: "Koua Nangoin David", avatar: "", initials: "KD" },
        content:
          "Je propose qu'on définisse un montant minimum de cotisation et qu'on crée un comité de gestion.",
        createdAt: "2026-05-30T08:30:00",
      },
    ],
  },
]

function getDiscussionById(id: string) {
  return MOCK_DISCUSSIONS.find((d) => d.id === id) || null
}

export default function DiscussionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [replyText, setReplyText] = useState("")
  const [replies, setReplies] = useState<Reply[]>([])

  const discussion = getDiscussionById(params.id as string)

  if (!discussion) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-2 text-2xl font-bold text-zinc-600">
          Discussion introuvable
        </h2>
        <p className="mb-6 text-zinc-500">
          Cette discussion n'existe pas ou a été supprimée.
        </p>
        <Button asChild variant="gold">
          <Link href="/partage-idees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux discussions
          </Link>
        </Button>
      </div>
    )
  }

  const allReplies = [...discussion.replies, ...replies]

  const handleAddReply = () => {
    if (!replyText.trim()) return
    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: { name: "Koua Nangoin Vous", avatar: "", initials: "KV" },
      content: replyText,
      createdAt: new Date().toISOString(),
    }
    setReplies((prev) => [...prev, newReply])
    setReplyText("")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/partage-idees" className="hover:text-emerald-800">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/partage-idees" className="hover:text-emerald-800">
          Partage d'idées
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="max-w-[300px] truncate text-zinc-900">
          {discussion.title}
        </span>
      </nav>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button variant="ghost" asChild>
          <Link href="/partage-idees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="gold">{discussion.theme}</Badge>
              <h1 className="text-2xl font-bold text-emerald-800">
                {discussion.title}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
              <Avatar>
                <AvatarImage src={discussion.author.avatar} />
                <AvatarFallback className="bg-emerald-800 text-white">
                  {discussion.author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {discussion.author.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(discussion.createdAt, "dd MMM yyyy 'à' HH:mm")}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-zinc max-w-none">
            <p className="leading-relaxed text-zinc-700">{discussion.content}</p>
          </div>
        </article>
      </motion.div>

      <Separator />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-emerald-800">
          Réponses ({allReplies.length})
        </h2>

        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-emerald-800 text-white text-sm">
              KV
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Ajoutez votre réponse..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                variant="gold"
                size="sm"
                onClick={handleAddReply}
                disabled={!replyText.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Répondre
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {allReplies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 rounded-lg border border-zinc-100 bg-white p-4"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={reply.author.avatar} />
                <AvatarFallback className="bg-emerald-800 text-white text-sm">
                  {reply.author.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900">
                    {reply.author.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatDate(reply.createdAt, "dd MMM yyyy 'à' HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-zinc-600">{reply.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
