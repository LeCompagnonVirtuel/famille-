"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Home,
  Vote,
  UserCheck,
  Loader2,
  BarChart3,
} from "lucide-react"
import {
  format,
  parseISO,
  differenceInDays,
  differenceInHours,
  isAfter,
  isBefore,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type MockOption = {
  id: string
  label: string
  nombre_voix: number
}

type MockVote = {
  id: string
  titre: string
  description: string
  date_debut: string
  date_fin: string
  est_actif: boolean
  participation: number
  total_membres: number
  options: MockOption[]
}

type MockVoteEntry = {
  id: string
  auteur: string
  option: string
  date: string
}

const mockVote: MockVote = {
  id: "1",
  titre: "Élection du président 2026",
  description:
    "Votez pour élire le nouveau président de la famille Koua Nangoin pour l'année 2026. Le mandat est d'une durée d'un an, renouvelable une fois.",
  date_debut: "2026-05-01",
  date_fin: "2026-06-30",
  est_actif: true,
  participation: 34,
  total_membres: 50,
  options: [
    { id: "o1", label: "Koua Jean", nombre_voix: 18 },
    { id: "o2", label: "Koua Marie", nombre_voix: 12 },
    { id: "o3", label: "Nangoin Pierre", nombre_voix: 4 },
  ],
}

const mockVotesList: MockVoteEntry[] = [
  { id: "v1", auteur: "Koua Jean", option: "Koua Jean", date: "2026-06-15T10:30:00" },
  { id: "v2", auteur: "Nangoin Pierre", option: "Koua Marie", date: "2026-06-14T18:45:00" },
  { id: "v3", auteur: "Koua Alice", option: "Koua Jean", date: "2026-06-13T09:12:00" },
  { id: "v4", auteur: "Koua Paul", option: "Nangoin Pierre", date: "2026-06-12T14:20:00" },
  { id: "v5", auteur: "Koua Sophie", option: "Koua Jean", date: "2026-06-11T11:05:00" },
]

const COLORS = ["#065f46", "#d97706", "#6b7280", "#059669", "#f59e0b"]

export default function VoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const vote = mockVote
  const now = new Date()
  const debut = parseISO(vote.date_debut)
  const fin = parseISO(vote.date_fin)
  const totalDuration = differenceInHours(fin, debut)
  const elapsed = differenceInHours(now, debut)
  const timeProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
  const isExpired = isAfter(now, fin) || !vote.est_actif
  const isFuture = isBefore(now, debut)
  const pct = vote.total_membres > 0
    ? Math.round((vote.participation / vote.total_membres) * 100)
    : 0

  const chartData = vote.options.map((o) => ({
    name: o.label,
    votes: o.nombre_voix,
  }))

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return
    setIsVoting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setHasVoted(true)
    setIsVoting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/votes" className="hover:text-emerald-800">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/votes" className="hover:text-emerald-800">
          Votes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="max-w-[200px] truncate text-zinc-900">{vote.titre}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl font-bold text-emerald-800">
                    {vote.titre}
                  </CardTitle>
                  <Badge
                    variant={
                      isExpired ? "secondary" : isFuture ? "gold" : "default"
                    }
                  >
                    {isExpired ? "Terminé" : isFuture ? "À venir" : "En cours"}
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-base">
                  {vote.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-zinc-600">
                <Clock className="h-4 w-4 text-emerald-800" />
                <span>
                  Début :{" "}
                  <span className="font-medium text-zinc-900">
                    {format(debut, "dd MMMM yyyy", { locale: fr })}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>
                  Fin :{" "}
                  <span className="font-medium text-zinc-900">
                    {format(fin, "dd MMMM yyyy", { locale: fr })}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Temps restant</span>
                {!isFuture && !isExpired && (
                  <span className="font-medium text-amber-600">
                    {differenceInDays(fin, now)} jour
                    {differenceInDays(fin, now) > 1 ? "s" : ""} restant
                    {differenceInDays(fin, now) > 1 ? "s" : ""}
                  </span>
                )}
                {isExpired && (
                  <span className="text-zinc-400">Scrutin terminé</span>
                )}
                {isFuture && (
                  <span className="text-zinc-400">Pas encore commencé</span>
                )}
              </div>
              <Progress
                value={isFuture ? 0 : isExpired ? 100 : timeProgress}
                variant="gold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Participation</span>
                <span className="font-medium text-zinc-800">
                  {vote.participation}/{vote.total_membres} ({pct}%)
                </span>
              </div>
              <Progress value={vote.participation} max={vote.total_membres} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
                <Vote className="h-5 w-5" />
                Participer
              </CardTitle>
              <CardDescription>
                {isExpired
                  ? "Ce scrutin est terminé"
                  : isFuture
                  ? "Ce scrutin n'a pas encore commencé"
                  : hasVoted
                  ? "Vous avez déjà voté"
                  : "Choisissez une option"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isExpired ? (
                <div className="flex flex-col items-center gap-3 py-6 text-zinc-400">
                  <CheckCircle2 className="h-12 w-12" />
                  <p className="text-sm">Scrutin clôturé</p>
                </div>
              ) : isFuture ? (
                <div className="flex flex-col items-center gap-3 py-6 text-zinc-400">
                  <Clock className="h-12 w-12" />
                  <p className="text-sm">
                    Débute le{" "}
                    {format(debut, "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              ) : hasVoted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-emerald-800">
                  <UserCheck className="h-12 w-12" />
                  <p className="text-sm font-medium">Votre vote a été enregistré</p>
                </div>
              ) : (
                <>
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    {vote.options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Label
                          htmlFor={option.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:border-emerald-800 ${
                            selectedOption === option.id
                              ? "border-emerald-800 bg-emerald-50"
                              : "border-zinc-200"
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <span className="font-medium text-zinc-900">
                            {option.label}
                          </span>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>

                  <Button
                    variant="gold"
                    className="w-full"
                    disabled={!selectedOption || isVoting}
                    onClick={handleVote}
                  >
                    {isVoting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Vote en cours...
                      </>
                    ) : (
                      <>
                        <Vote className="mr-2 h-4 w-4" />
                        Voter
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
                <BarChart3 className="h-5 w-5" />
                Résultats
              </CardTitle>
              <CardDescription>
                {vote.participation} vote{vote.participation > 1 ? "s" : ""} exprimé
               {vote.participation > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.every((d) => d.votes === 0) ? (
                <div className="flex flex-col items-center gap-3 py-6 text-zinc-400">
                  <BarChart3 className="h-12 w-12" />
                  <p className="text-sm">Aucun vote pour le moment</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e4e4e7",
                        }}
                        formatter={(value) => [`${value} voix`, "Votes"]}
                      />
                      <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={24}>
                        {chartData.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                {vote.options.map((option, index) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-zinc-700">{option.label}</span>
                    </div>
                    <span className="font-medium tabular-nums text-zinc-900">
                      {option.nombre_voix} voix
                      {vote.participation > 0
                        ? ` (${Math.round((option.nombre_voix / vote.participation) * 100)}%)`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
              <UserCheck className="h-5 w-5" />
              Derniers votes
            </CardTitle>
            <CardDescription>
              Les {mockVotesList.length} votes les plus récents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVotesList.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-800 text-xs text-white">
                        {entry.auteur
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {entry.auteur}
                      </p>
                      <p className="text-xs text-zinc-500">
                        A voté pour{" "}
                        <span className="font-medium text-emerald-800">
                          {entry.option}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {format(parseISO(entry.date), "dd MMM, HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
