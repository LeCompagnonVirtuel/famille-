"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Users,
  PiggyBank,
  FileDown,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

const currentYear = new Date().getFullYear()

type PaymentStatus = "payé" | "en_attente" | "en_retard"

interface Payment {
  id: string
  membre: string
  montant: number
  mois: string
  date: string
  methode: string
  statut: PaymentStatus
}

interface MonthlyData {
  mois: string
  cotisations: number
  anneePrecedente: number
}

const monthlyData: MonthlyData[] = [
  { mois: "Jan", cotisations: 450000, anneePrecedente: 380000 },
  { mois: "Fév", cotisations: 520000, anneePrecedente: 410000 },
  { mois: "Mar", cotisations: 480000, anneePrecedente: 390000 },
  { mois: "Avr", cotisations: 610000, anneePrecedente: 450000 },
  { mois: "Mai", cotisations: 550000, anneePrecedente: 470000 },
  { mois: "Juin", cotisations: 580000, anneePrecedente: 430000 },
  { mois: "Juil", cotisations: 720000, anneePrecedente: 510000 },
  { mois: "Août", cotisations: 490000, anneePrecedente: 360000 },
  { mois: "Sep", cotisations: 630000, anneePrecedente: 480000 },
  { mois: "Oct", cotisations: 0, anneePrecedente: 420000 },
  { mois: "Nov", cotisations: 0, anneePrecedente: 460000 },
  { mois: "Déc", cotisations: 0, anneePrecedente: 550000 },
]

const paymentsData: Payment[] = [
  { id: "1", membre: "Koua Nangoin Jean", montant: 25000, mois: "Janvier", date: "2026-01-10", methode: "Mobile Money", statut: "payé" },
  { id: "2", membre: "Koua Nangoin Marie", montant: 25000, mois: "Janvier", date: "2026-01-12", methode: "Virement bancaire", statut: "payé" },
  { id: "3", membre: "Koua Nangoin Pierre", montant: 25000, mois: "Février", date: "2026-02-05", methode: "Espèces", statut: "payé" },
  { id: "4", membre: "Koua Nangoin Anne", montant: 25000, mois: "Février", date: "2026-02-08", methode: "Mobile Money", statut: "payé" },
  { id: "5", membre: "Koua Nangoin Paul", montant: 25000, mois: "Mars", date: "", methode: "", statut: "en_attente" },
  { id: "6", membre: "Koua Nangoin Claire", montant: 25000, mois: "Mars", date: "2026-03-14", methode: "Carte bancaire", statut: "payé" },
  { id: "7", membre: "Koua Nangoin Jacques", montant: 25000, mois: "Avril", date: "", methode: "", statut: "en_retard" },
  { id: "8", membre: "Koua Nangoin Louise", montant: 25000, mois: "Avril", date: "2026-04-02", methode: "Mobile Money", statut: "payé" },
  { id: "9", membre: "Koua Nangoin Michel", montant: 25000, mois: "Mai", date: "2026-05-11", methode: "Virement bancaire", statut: "payé" },
  { id: "10", membre: "Koua Nangoin Sophie", montant: 25000, mois: "Mai", date: "", methode: "", statut: "en_attente" },
  { id: "11", membre: "Koua Nangoin Joseph", montant: 25000, mois: "Juin", date: "2026-06-07", methode: "Espèces", statut: "payé" },
  { id: "12", membre: "Koua Nangoin Hélène", montant: 25000, mois: "Juin", date: "", methode: "", statut: "en_retard" },
  { id: "13", membre: "Koua Nangoin Marc", montant: 25000, mois: "Juillet", date: "2026-07-03", methode: "Mobile Money", statut: "payé" },
  { id: "14", membre: "Koua Nangoin Julie", montant: 25000, mois: "Juillet", date: "2026-07-15", methode: "Carte bancaire", statut: "payé" },
  { id: "15", membre: "Koua Nangoin Luc", montant: 25000, mois: "Août", date: "", methode: "", statut: "en_attente" },
  { id: "16", membre: "Koua Nangoin Emma", montant: 25000, mois: "Août", date: "2026-08-20", methode: "Virement bancaire", statut: "payé" },
  { id: "17", membre: "Koua Nangoin Thomas", montant: 25000, mois: "Septembre", date: "2026-09-01", methode: "Mobile Money", statut: "payé" },
  { id: "18", membre: "Koua Nangoin Sarah", montant: 25000, mois: "Septembre", date: "2026-09-12", methode: "Espèces", statut: "payé" },
]

const totalCotisations = paymentsData
  .filter((p) => p.statut === "payé")
  .reduce((sum, p) => sum + p.montant, 0)
const totalAttendu = paymentsData.length * 25000
const tauxRecouvrement = Math.round((totalCotisations / totalAttendu) * 100)
const totalMembres = new Set(paymentsData.map((p) => p.membre)).size
const soldeTotal = totalCotisations

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let start = 0
    const duration = 1500
    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  )
}

const statutLabel: Record<PaymentStatus, string> = {
  payé: "Payé",
  en_attente: "En attente",
  en_retard: "En retard",
}

const statutBadgeVariant: Record<PaymentStatus, "default" | "secondary" | "destructive"> = {
  payé: "default",
  en_attente: "secondary",
  en_retard: "destructive",
}

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

export default function TresoreriePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statutFilter, setStatutFilter] = useState<string>("tous")

  const filteredPayments = paymentsData.filter((p) => {
    const matchesSearch = p.membre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatut =
      statutFilter === "tous" || p.statut === statutFilter
    return matchesSearch && matchesStatut
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Trésorerie
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestion des cotisations et suivi financier —{" "}
            <span className="font-semibold text-emerald-800">{currentYear}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Enregistrer un paiement
          </Button>
          <Button variant="outline" className="gap-1.5">
            <FileDown className="h-4 w-4" />
            Exporter PDF
          </Button>
          <Button variant="gold" className="gap-1.5">
            <FileSpreadsheet className="h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-0 bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Banknote className="h-4 w-4" />
              Total cotisations ({currentYear})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={totalCotisations} prefix="CFA " />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <ArrowUpRight className="h-3 w-3" />
              +12% vs année précédente
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/90">
              <PiggyBank className="h-4 w-4" />
              Taux de recouvrement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={tauxRecouvrement} suffix=" %" />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <ArrowUpRight className="h-3 w-3" />
              {totalCotisations.toLocaleString("fr-FR")} CFA encaissés sur{" "}
              {totalAttendu.toLocaleString("fr-FR")} CFA
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Users className="h-4 w-4" />
              Nombre de cotisants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={totalMembres} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <ArrowUpRight className="h-3 w-3" />
              Membres actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-white/90">
              <PiggyBank className="h-4 w-4" />
              Solde total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={soldeTotal} prefix="CFA " />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <ArrowDownRight className="h-3 w-3" />
              Disponible
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900">
              Cotisations mensuelles — {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#71717a" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toLocaleString("fr-FR")} CFA`,
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar
                    dataKey="anneePrecedente"
                    fill="#a1a1aa"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    name={`${currentYear - 1}`}
                  />
                  <Bar
                    dataKey="cotisations"
                    fill="#065f46"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    name={`${currentYear}`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900">
              Paiements récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentsData.slice(0, 6).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white p-3 transition-colors hover:border-zinc-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {payment.membre}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {payment.mois} {currentYear}
                    </p>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-zinc-900">
                      {formatCurrency(payment.montant)}
                    </span>
                    <Badge
                      variant={statutBadgeVariant[payment.statut]}
                      className="text-[10px]"
                    >
                      {statutLabel[payment.statut]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold text-zinc-900">
              Historique des paiements
            </CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full pl-9 text-sm sm:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-400" />
                <Select value={statutFilter} onValueChange={setStatutFilter}>
                  <SelectTrigger className="h-9 w-40 text-sm">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="payé">Payé</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_retard">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Mois</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-sm text-zinc-400"
                      >
                        Aucun paiement trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium text-zinc-900">
                          {payment.membre}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-zinc-900">
                          {formatCurrency(payment.montant)}
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {payment.mois}
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {payment.date
                            ? formatDate(payment.date, "dd MMM yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {payment.methode || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statutBadgeVariant[payment.statut]}
                          >
                            {statutLabel[payment.statut]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
