"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Paperclip,
  Edit,
  Trash2,
  CheckCircle,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Réunion familiale annuelle 2026",
    content:
      "Chers membres de la famille, nous avons le plaisir de vous convier à la grande réunion familiale annuelle. Cette année, les festivités se dérouleront au village du 15 au 20 août 2026. Au programme : assemblée générale, activités culturelles, repas communautaire et bien plus encore. Nous comptons sur votre présence pour faire de cet événement un moment mémorable.\n\nLe programme détaillé sera communiqué ultérieurement. Veuillez confirmer votre présence avant le 31 juillet 2026 auprès du secrétaire général.\n\nPour toute information complémentaire, contactez le président au 01 02 03 04 05.",
    author: {
      name: "Koua Nangoin Pierre",
      avatar: "",
      initials: "KP",
      role: "Président",
    },
    status: "publiée",
    createdAt: "2026-05-15",
    commentCount: 12,
    hasAttachment: true,
    attachments: ["Programme_Réunion_2026.pdf", "Liste_ participants.xlsx"],
    image: "",
  },
]

const MOCK_COMMENTS = [
  {
    id: "c1",
    author: { name: "Koua Nangoin Marie", avatar: "", initials: "KM" },
    content:
      "Excellente initiative ! Je serai présente avec toute ma famille. Pouvons-nous apporter des plats traditionnels ?",
    createdAt: "2026-05-16T08:30:00",
  },
  {
    id: "c2",
    author: { name: "Koua Nangoin Joseph", avatar: "", initials: "KJ" },
    content:
      "Merci pour l'organisation. Je propose qu'on ajoute une séance de contes pour les enfants le soir.",
    createdAt: "2026-05-16T10:15:00",
  },
  {
    id: "c3",
    author: { name: "Koua Nangoin Awa", avatar: "", initials: "KA" },
    content:
      "Très belle nouvelle ! Je peux aider pour l'organisation des activités culturelles si besoin.",
    createdAt: "2026-05-17T14:45:00",
  },
  {
    id: "c4",
    author: { name: "Koua Nangoin Paul", avatar: "", initials: "KP" },
    content:
      "Serait-il possible d'avoir une visioconférence pour ceux qui ne pourront pas se déplacer ?",
    createdAt: "2026-05-18T09:00:00",
  },
]

function getAnnouncementById(id: string) {
  return MOCK_ANNOUNCEMENTS.find((a) => a.id === id) || null
}

export default function AnnonceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(MOCK_COMMENTS)

  const annonce = getAnnouncementById(params.id as string)

  if (!annonce) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-2 text-2xl font-bold text-zinc-600">
          Annonce introuvable
        </h2>
        <p className="mb-6 text-zinc-500">
          Cette annonce n'existe pas ou a été supprimée.
        </p>
        <Button asChild variant="gold">
          <Link href="/annonces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux annonces
          </Link>
        </Button>
      </div>
    )
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: `c${Date.now()}`,
      author: { name: "Koua Nangoin Vous", avatar: "", initials: "KV" },
      content: commentText,
      createdAt: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newComment])
    setCommentText("")
  }

  const handleDelete = () => {
    router.push("/annonces")
  }

  const handleValidate = () => {
    router.push("/annonces")
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/annonces" className="hover:text-emerald-800">
            Annonces
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-zinc-900">{annonce.title}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <Button variant="ghost" asChild>
          <Link href="/annonces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          {annonce.status === "en attente" && (
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-700"
              onClick={handleValidate}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-zinc-900">
                  {annonce.title}
                </h1>
                <Badge
                  variant={
                    annonce.status === "publiée" ? "default" : "secondary"
                  }
                >
                  {annonce.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(annonce.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {comments.length} commentaires
                </span>
                {annonce.hasAttachment && (
                  <span className="flex items-center gap-1">
                    <Paperclip className="h-4 w-4" />
                    Pièces jointes
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
              <Avatar>
                <AvatarImage src={annonce.author.avatar} />
                <AvatarFallback className="bg-emerald-800 text-white">
                  {annonce.author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {annonce.author.name}
                </p>
                {"role" in annonce.author && annonce.author.role && (
                  <p className="text-xs text-zinc-500">
                    {annonce.author.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          {annonce.image && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={annonce.image}
                alt={annonce.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-zinc max-w-none">
            {annonce.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed text-zinc-700">
                {paragraph}
              </p>
            ))}
          </div>

          {annonce.attachments && annonce.attachments.length > 0 && (
            <div className="mt-8 rounded-lg bg-zinc-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-zinc-700">
                Pièces jointes
              </h3>
              <div className="space-y-2">
                {annonce.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md bg-white px-4 py-2 shadow-sm"
                  >
                    <Paperclip className="h-4 w-4 text-emerald-800" />
                    <span className="text-sm text-zinc-600">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          Commentaires ({comments.length})
        </h2>

        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-emerald-800 text-white text-sm">
              KV
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Ajoutez votre commentaire..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                variant="gold"
                size="sm"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 rounded-lg border border-zinc-100 bg-white p-4"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-emerald-800 text-white text-sm">
                  {comment.author.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatDate(comment.createdAt, "dd MMM yyyy 'à' HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-zinc-600">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
