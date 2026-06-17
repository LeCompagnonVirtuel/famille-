"use client"

import { motion } from "framer-motion"
import {
  Users,
  Wallet,
  Calendar,
  Megaphone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Vote,
  MessageSquare,
  FileText,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const monthlyData = [
  { month: "Jan", cotisations: 450000, prevu: 500000 },
  { month: "Fév", cotisations: 480000, prevu: 500000 },
  { month: "Mar", cotisations: 500000, prevu: 500000 },
  { month: "Avr", cotisations: 470000, prevu: 500000 },
  { month: "Mai", cotisations: 520000, prevu: 500000 },
  { month: "Juin", cotisations: 490000, prevu: 500000 },
]

const stats = [
  {
    label: "Total membres",
    value: "156",
    icon: Users,
    trend: "+12",
    trendUp: true,
    gradient: "from-emerald-600 to-emerald-800",
  },
  {
    label: "Cotisations du mois",
    value: "490 000 CFA",
    icon: Wallet,
    trend: "+8%",
    trendUp: true,
    gradient: "from-amber-500 to-amber-700",
  },
  {
    label: "Événements à venir",
    value: "5",
    icon: Calendar,
    trend: "+2",
    trendUp: true,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    label: "Annonces récentes",
    value: "12",
    icon: Megaphone,
    trend: "-3",
    trendUp: false,
    gradient: "from-purple-500 to-purple-700",
  },
]

const recentAnnonces = [
  {
    id: "1",
    title: "Réunion familiale du 30 juin",
    excerpt: "Convocation à la réunion trimestrielle...",
    author: "Koua Nangoin Jean",
    authorInitials: "KN",
    date: "15 juin 2026",
    comments: 8,
  },
  {
    id: "2",
    title: "Cotisation annuelle 2026",
    excerpt: "Rappel pour le paiement des cotisations...",
    author: "Koua Nangoin Marie",
    authorInitials: "KM",
    date: "10 juin 2026",
    comments: 5,
  },
  {
    id: "3",
    title: "Mariage de Koua Anne",
    excerpt: "Nous avons l'honneur de vous annoncer...",
    author: "Koua Nangoin Paul",
    authorInitials: "KP",
    date: "5 juin 2026",
    comments: 12,
  },
]

const upcomingEvents = [
  {
    title: "Réunion trimestrielle",
    date: "30 juin 2026",
    type: "Réunion",
    typeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Baptême de Koua Luc",
    date: "15 juillet 2026",
    type: "Baptême",
    typeColor: "bg-blue-100 text-blue-800",
  },
  {
    title: "Anniversaire de grand-mère",
    date: "20 juillet 2026",
    type: "Anniversaire",
    typeColor: "bg-amber-100 text-amber-800",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export default function DashboardPage() {
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
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Bienvenue sur la plateforme de la Famille KOUA NANGOIN
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${stat.gradient} flex items-center justify-between p-4 text-white sm:p-5 lg:p-6`}>
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold sm:text-2xl lg:text-3xl">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-medium text-white/90">
                        {stat.trendUp ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {stat.trend} vs mois dernier
                      </div>
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

      {/* Graphique et Annonces récentes */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Graphique des cotisations */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base sm:text-lg">
                Cotisations mensuelles
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Reçu
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  Prévu
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e4e4e7"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#71717a" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#71717a" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) =>
                        `${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toLocaleString("fr-FR")} CFA`,
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e4e4e7",
                        fontSize: 13,
                      }}
                    />
                    <Bar
                      dataKey="prevu"
                      fill="#fbbf24"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                    <Bar
                      dataKey="cotisations"
                      fill="#065f46"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Annonces récentes */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg">
                Annonces récentes
              </CardTitle>
              <Link href="/annonces">
                <Button variant="ghost" size="sm" className="text-xs">
                  Voir tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnonces.map((annonce) => (
                <Link
                  key={annonce.id}
                  href={`/annonces/${annonce.id}`}
                  className="group block"
                >
                  <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-stone-50 -mx-2">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs">
                        {annonce.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {annonce.title}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {annonce.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span>{annonce.author}</span>
                        <span>{annonce.date}</span>
                        <span>{annonce.comments} commentaires</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Événements et Actions rapides */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Événements à venir */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg">
                Événements à venir
              </CardTitle>
              <Link href="/evenements">
                <Button variant="ghost" size="sm" className="text-xs">
                  Voir tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className="flex flex-col gap-2 rounded-lg border border-stone-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-stone-900">
                      {event.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`border-0 text-xs ${event.typeColor}`}
                      >
                        {event.type}
                      </Badge>
                      <span className="text-xs text-stone-500">
                        {event.date}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:shrink-0">
                    Participer
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/annonces/new">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-4 text-xs"
                >
                  <Megaphone className="h-5 w-5 text-emerald-600" />
                  Nouvelle annonce
                </Button>
              </Link>
              <Link href="/membres">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-4 text-xs"
                >
                  <UserPlus className="h-5 w-5 text-emerald-600" />
                  Ajouter membre
                </Button>
              </Link>
              <Link href="/votes/new">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-4 text-xs"
                >
                  <Vote className="h-5 w-5 text-emerald-600" />
                  Nouveau vote
                </Button>
              </Link>
              <Link href="/communicateur">
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 py-4 text-xs"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  Publier actualité
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
