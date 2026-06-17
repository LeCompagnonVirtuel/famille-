"use client"

import { motion } from "framer-motion"
import {
  Users,
  Heart,
  UserPlus,
  Download,
  GitBranch,
  Activity,
  BarChartHorizontal,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const stats = [
  {
    label: "Total membres",
    value: "187",
    icon: Users,
    gradient: "from-emerald-600 to-emerald-800",
  },
  {
    label: "Générations",
    value: "5",
    icon: GitBranch,
    gradient: "from-amber-500 to-amber-700",
  },
  {
    label: "Membres vivants",
    value: "152",
    icon: Heart,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    label: "Générations représentées",
    value: "G1 - G5",
    icon: Activity,
    gradient: "from-purple-500 to-purple-700",
  },
]

const generationalData = [
  { generation: "G1", total: 2, hommes: 1, femmes: 1 },
  { generation: "G2", total: 8, hommes: 4, femmes: 4 },
  { generation: "G3", total: 31, hommes: 15, femmes: 16 },
  { generation: "G4", total: 67, hommes: 32, femmes: 35 },
  { generation: "G5", total: 79, hommes: 38, femmes: 41 },
]

const genderColors = ["#059669", "#34d399"]
const stackedGenderColors = ["#059669", "#34d399"]

const topStats = [
  { label: "Âge moyen", value: "42 ans" },
  { label: "Génération la plus nombreuse", value: "G5 (79 membres)" },
  { label: "Famille la plus représentée", value: "Branche Koua Nangoin Awa" },
  { label: "Nombre de conjoints", value: "24" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

function GenderBar({ label, hommes, femmes, total }: { label: string; hommes: number; femmes: number; total: number }) {
  const hommesPct = total > 0 ? Math.round((hommes / total) * 100) : 0
  const femmesPct = total > 0 ? Math.round((femmes / total) * 100) : 0

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-700">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-600" />
          <span className="w-24 text-sm text-zinc-600">Hommes</span>
          <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${hommesPct}%` }}
            />
          </div>
          <span className="w-20 text-right text-sm font-medium text-zinc-800 tabular-nums">
            {hommes} ({hommesPct}%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 shrink-0 rounded-full bg-amber-500" />
          <span className="w-24 text-sm text-zinc-600">Femmes</span>
          <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${femmesPct}%` }}
            />
          </div>
          <span className="w-20 text-right text-sm font-medium text-zinc-800 tabular-nums">
            {femmes} ({femmesPct}%)
          </span>
        </div>
      </div>
    </div>
  )
}

function StatusBar({ label, alive, deceased }: { label: string; alive: number; deceased: number }) {
  const total = alive + deceased
  const alivePct = total > 0 ? Math.round((alive / total) * 100) : 0
  const deceasedPct = total > 0 ? Math.round((deceased / total) * 100) : 0

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-700">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="w-24 text-sm text-zinc-600">Vivants</span>
          <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${alivePct}%` }}
            />
          </div>
          <span className="w-20 text-right text-sm font-medium text-zinc-800 tabular-nums">
            {alive} ({alivePct}%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-zinc-500 shrink-0" />
          <span className="w-24 text-sm text-zinc-600">Décédés</span>
          <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-zinc-500 to-zinc-300 rounded-full transition-all duration-700"
              style={{ width: `${deceasedPct}%` }}
            />
          </div>
          <span className="w-20 text-right text-sm font-medium text-zinc-800 tabular-nums">
            {deceased} ({deceasedPct}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default function StatistiquesGenealogiquesPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* En-tête */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-emerald-900 sm:text-3xl">
          Statistiques généalogiques
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Vue d&apos;ensemble de la famille KOUA NANGOIN
        </p>
      </motion.div>

      {/* Hero Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${stat.gradient} flex items-center justify-between p-4 text-white sm:p-5 lg:p-6`}
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        {stat.value}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/20 p-2 sm:p-3">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Répartition démographique */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <BarChartHorizontal className="h-5 w-5 text-emerald-600" />
                Répartition Hommes / Femmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GenderBar label="Sur l&apos;ensemble des membres" hommes={90} femmes={97} total={187} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Répartition Vivants / Décédés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBar label="Statut des membres" alive={152} deceased={35} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Par génération - Bar Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-emerald-600" />
              Membres par génération
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generationalData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="generation"
                    tick={{ fontSize: 13, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value) => [value, "Membres"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 13,
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name="Total"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                    fill="#059669"
                    label={{
                      position: "top",
                      fill: "#27272a",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Répartition par sexe et génération - Stacked Bar Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
              Répartition par sexe et génération
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generationalData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="generation"
                    tick={{ fontSize: 13, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 13,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                    formatter={(value) => {
                      if (value === "hommes") return "Hommes"
                      if (value === "femmes") return "Femmes"
                      return value
                    }}
                  />
                  <Bar
                    dataKey="hommes"
                    name="hommes"
                    stackId="sexe"
                    fill="#059669"
                    radius={[0, 0, 0, 0]}
                    barSize={48}
                  />
                  <Bar
                    dataKey="femmes"
                    name="femmes"
                    stackId="sexe"
                    fill="#fbbf24"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Statistiques */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BarChartHorizontal className="h-5 w-5 text-emerald-600" />
              Top statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topStats.map((stat, index) => {
                const icons = [Users, GitBranch, UserPlus, Heart]
                const Icon = icons[index]
                const colors = [
                  "bg-emerald-100 text-emerald-700",
                  "bg-amber-100 text-amber-700",
                  "bg-blue-100 text-blue-700",
                  "bg-purple-100 text-purple-700",
                ]
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4"
                  >
                    <div className={`rounded-lg p-2.5 ${colors[index]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <p className="text-sm font-semibold text-zinc-900">{stat.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator className="my-2" />

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/recensement">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-5 text-xs"
                >
                  <UserPlus className="h-5 w-5 text-emerald-600" />
                  Ajouter un membre
                </Button>
              </Link>
              <Link href="/arbre-genealogique">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-5 text-xs"
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
                  Voir l&apos;arbre
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-2 py-5 text-xs"
                onClick={() => {
                  const csv = [
                    ["Génération", "Hommes", "Femmes", "Total", "Vivants", "Décédés"].join(","),
                    ...generationalData.map(
                      (g) =>
                        `${g.generation},${g.hommes},${g.femmes},${g.total},${Math.round(g.total * 0.81)},${Math.round(g.total * 0.19)}`
                    ),
                  ].join("\n")
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "statistiques_genealogiques.csv"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-5 w-5 text-emerald-600" />
                Exporter les données
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}


