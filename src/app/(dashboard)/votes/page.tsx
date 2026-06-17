"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Search, Clock, CheckCircle2, CalendarClock } from "lucide-react"
import { format, parseISO, isAfter, isBefore, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MockVote = {
  id: string
  titre: string
  description: string
  date_debut: string
  date_fin: string
  participation: number
  total_membres: number
  est_actif: boolean
}

const mockVotes: MockVote[] = [
  {
    id: "1",
    titre: "Élection du président 2026",
    description: "Vote pour élire le nouveau président de la famille",
    date_debut: "2026-05-01",
    date_fin: "2026-06-30",
    participation: 34,
    total_membres: 50,
    est_actif: true,
  },
  {
    id: "2",
    titre: "Organisation de la fête annuelle",
    description: "Choisir la date de la fête annuelle 2026",
    date_debut: "2026-04-15",
    date_fin: "2026-05-15",
    participation: 28,
    total_membres: 50,
    est_actif: true,
  },
  {
    id: "3",
    titre: "Budget des activités 2025",
    description: "Approbation du budget des activités familiales",
    date_debut: "2025-03-01",
    date_fin: "2025-03-30",
    participation: 45,
    total_membres: 50,
    est_actif: false,
  },
  {
    id: "4",
    titre: "Projet de construction",
    description: "Vote sur le projet de construction du domicile familial",
    date_debut: "2025-06-01",
    date_fin: "2025-07-15",
    participation: 40,
    total_membres: 50,
    est_actif: false,
  },
  {
    id: "5",
    titre: "Règlement intérieur",
    description: "Adoption du nouveau règlement intérieur",
    date_debut: "2026-07-01",
    date_fin: "2026-08-15",
    participation: 0,
    total_membres: 50,
    est_actif: false,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function getVoteStatus(date_debut: string, date_fin: string, est_actif: boolean) {
  const now = new Date()
  const debut = parseISO(date_debut)
  const fin = parseISO(date_fin)

  if (isAfter(now, fin) || (!est_actif && isAfter(now, debut))) return "termine"
  if (isBefore(now, debut)) return "a_venir"
  return "en_cours"
}

export default function VotesPage() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return mockVotes.filter(
      (v) =>
        v.titre.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    )
  }, [search])

  const enCours = filtered.filter(
    (v) => getVoteStatus(v.date_debut, v.date_fin, v.est_actif) === "en_cours"
  )
  const termines = filtered.filter(
    (v) => getVoteStatus(v.date_debut, v.date_fin, v.est_actif) === "termine"
  )
  const aVenir = filtered.filter(
    (v) => getVoteStatus(v.date_debut, v.date_fin, v.est_actif) === "a_venir"
  )

  const tabs = [
    { value: "en_cours", label: "En cours", count: enCours.length, icon: Clock },
    { value: "termines", label: "Terminés", count: termines.length, icon: CheckCircle2 },
    { value: "a_venir", label: "À venir", count: aVenir.length, icon: CalendarClock },
  ]

  function renderVoteCard(vote: MockVote) {
    const status = getVoteStatus(vote.date_debut, vote.date_fin, vote.est_actif)
    const pct = vote.total_membres > 0 ? Math.round((vote.participation / vote.total_membres) * 100) : 0
    const daysLeft = status === "en_cours"
      ? differenceInDays(parseISO(vote.date_fin), new Date())
      : 0

    return (
      <motion.div key={vote.id} variants={item}>
        <Link href={`/votes/${vote.id}`}>
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-emerald-800">
                    {vote.titre}
                  </CardTitle>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                    {vote.description}
                  </p>
                </div>
                <Badge
                  variant={
                    status === "en_cours"
                      ? "default"
                      : status === "termine"
                      ? "secondary"
                      : "gold"
                  }
                >
                  {status === "en_cours"
                    ? "En cours"
                    : status === "termine"
                    ? "Terminé"
                    : "À venir"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-4 text-xs text-zinc-500">
                <span>
                  Début :{" "}
                  {format(parseISO(vote.date_debut), "dd MMM yyyy", { locale: fr })}
                </span>
                <span>
                  Fin :{" "}
                  {format(parseISO(vote.date_fin), "dd MMM yyyy", { locale: fr })}
                </span>
                {status === "en_cours" && daysLeft >= 0 && (
                  <span className="font-medium text-amber-600">
                    {daysLeft === 0
                      ? "Dernier jour !"
                      : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Participation</span>
                  <span className="font-medium text-zinc-800">
                    {vote.participation}/{vote.total_membres} ({pct}%)
                  </span>
                </div>
                <Progress value={vote.participation} max={vote.total_membres} />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-800">
            Votes
          </h1>
          <p className="text-sm text-zinc-500">
            Gérez les scrutins et participez aux décisions familiales
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/votes/new">
            <Plus className="mr-2 h-4 w-4" />
            Créer un scrutin
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Rechercher un scrutin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="en_cours">
        <TabsList className="w-full sm:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="ml-1 rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium tabular-nums">
                  {tab.count}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="en_cours">
          {enCours.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-400">
              Aucun scrutin en cours
            </p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {enCours.map(renderVoteCard)}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="termines">
          {termines.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-400">
              Aucun scrutin terminé
            </p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {termines.map(renderVoteCard)}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="a_venir">
          {aVenir.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-400">
              Aucun scrutin à venir
            </p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {aVenir.map(renderVoteCard)}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
