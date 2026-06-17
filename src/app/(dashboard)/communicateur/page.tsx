"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  Newspaper,
  Bell,
  Send,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
} as const

const officielMessages = [
  {
    id: "1",
    titre: "Réunion Générale Annuelle",
    date: "2026-06-01",
    priorite: "haute" as const,
    contenu:
      "Convocation à la réunion générale annuelle prévue le 15 juillet 2026 à 10h.",
  },
  {
    id: "2",
    titre: "Mise à jour du Règlement Intérieur",
    date: "2026-05-20",
    priorite: "moyenne" as const,
    contenu:
      "Veuillez prendre connaissance des modifications apportées au règlement intérieur.",
  },
  {
    id: "3",
    titre: "Appel à Cotisations",
    date: "2026-05-10",
    priorite: "haute" as const,
    contenu:
      "Les cotisations du second trimestre 2026 sont dues avant le 30 juin.",
  },
  {
    id: "4",
    titre: "Calendrier des Événements",
    date: "2026-04-28",
    priorite: "basse" as const,
    contenu:
      "Le calendrier des événements familiaux pour le second semestre est disponible.",
  },
]

const actualites = [
  {
    id: "1",
    titre: "Inauguration du nouveau siège familial",
    date: "2026-06-10",
    auteur: "Kouassi Nango",
  },
  {
    id: "2",
    titre: "Résultats de la collecte de fonds",
    date: "2026-06-05",
    auteur: "Ama Kouakou",
  },
  {
    id: "3",
    titre: "Bienvenue aux nouveaux membres",
    date: "2026-05-28",
    auteur: "Marie Nango",
  },
  {
    id: "4",
    titre: "Projet d'entraide scolaire",
    date: "2026-05-15",
    auteur: "Jean Koua",
  },
  {
    id: "5",
    titre: "Remerciements pour le mariage Nango",
    date: "2026-05-08",
    auteur: "Paul Nango",
  },
]

const priorityColor = {
  haute: "destructive" as const,
  moyenne: "gold" as const,
  basse: "secondary" as const,
}

const priorityLabel = { haute: "Haute", moyenne: "Moyenne", basse: "Basse" }

export default function CommunicateurPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Communicateur
          </h2>
          <p className="text-sm text-zinc-500">
            Hub de communication de la famille
          </p>
        </div>
        <Button variant="gold" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Nouveau message
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-amber-600" />
                  Messages officiels
                </CardTitle>
                <CardDescription>
                  Communications officielles de la direction
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Tout voir
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className="divide-y divide-zinc-100 p-0">
              {officielMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 p-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-zinc-900 truncate">
                        {msg.titre}
                      </span>
                      <Badge variant={priorityColor[msg.priorite]} className="shrink-0">
                        {priorityLabel[msg.priorite]}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-1">
                      {msg.contenu}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDate(msg.date)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5 text-amber-600" />
                  Actualités récentes
                </CardTitle>
                <CardDescription>
                  Les dernières nouvelles de la famille
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Tout voir
              </Button>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {actualites.map((actu, i) => (
                <div
                  key={actu.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {actu.titre}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Publié par {actu.auteur} &middot;{" "}
                      {formatDate(actu.date)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 ml-4">
                    Lire
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                Statistiques
              </CardTitle>
              <CardDescription>
                Indicateurs de communication
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Send className="h-5 w-5 text-emerald-800" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">147</p>
                  <p className="text-xs text-zinc-500">
                    Messages envoyés
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Eye className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">82%</p>
                  <p className="text-xs text-zinc-500">
                    Taux d'ouverture
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <TrendingUp className="h-5 w-5 text-emerald-800" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">+23%</p>
                  <p className="text-xs text-zinc-500">
                    Engagement vs. mois dernier
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Users className="h-5 w-5 text-emerald-800" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">56</p>
                  <p className="text-xs text-zinc-500">
                    Membres actifs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full gap-2" variant="gold">
              <Newspaper className="h-4 w-4" />
              Publier une actualité
            </Button>
            <Button className="w-full gap-2" variant="default">
              <Bell className="h-4 w-4" />
              Envoyer une notification
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </CardTitle>
              <CardDescription>
                Gérez vos contenus
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2 pt-6">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Messages en attente
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Brouillons
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Messages programmés
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Historique
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
