"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Users, Clock, CheckCircle2, XCircle, MessageSquare, UserCheck } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StatutDemande = "en_attente" | "approuve" | "rejete" | "information_demandee"

type DemandeAdhesion = {
  id: string
  nom: string
  prenom: string
  telephone: string
  email?: string
  dateNaissance: string
  lienParente: string
  village: string
  photoUrl?: string
  statut: StatutDemande
  dateDemande: string
  parrain?: {
    nom: string
    prenom: string
  }
}

const mockDemandes: DemandeAdhesion[] = [
  {
    id: "1",
    nom: "Koua",
    prenom: "Alice",
    telephone: "+225 07 08 09 10",
    email: "alice.koua@email.com",
    dateNaissance: "1995-03-12",
    lienParente: "Fille de Koua Nangoin Pierre",
    village: "Yamoussoukro",
    statut: "en_attente",
    dateDemande: "2026-06-10T14:30:00",
    parrain: { nom: "Koua Nangoin", prenom: "Marie" },
  },
  {
    id: "2",
    nom: "Koua",
    prenom: "Benjamin",
    telephone: "+225 01 23 45 67",
    email: "benjamin.koua@email.com",
    dateNaissance: "1988-07-22",
    lienParente: "Fils de Koua Nangoin Joseph",
    village: "Abidjan",
    photoUrl: "",
    statut: "approuve",
    dateDemande: "2026-05-28T09:15:00",
    parrain: { nom: "Koua Nangoin", prenom: "Paul" },
  },
  {
    id: "3",
    nom: "Nangoin",
    prenom: "Célestin",
    telephone: "+225 05 55 66 77",
    dateNaissance: "1972-11-05",
    lienParente: "Cousin germain de Koua Nangoin Pierre",
    village: "Bouaké",
    statut: "rejete",
    dateDemande: "2026-06-01T11:00:00",
  },
  {
    id: "4",
    nom: "Koua",
    prenom: "Diane",
    telephone: "+225 02 34 56 78",
    email: "diane.koua@email.com",
    dateNaissance: "2001-09-18",
    lienParente: "Nièce de Koua Nangoin Marie",
    village: "San Pedro",
    statut: "en_attente",
    dateDemande: "2026-06-12T16:45:00",
    parrain: { nom: "Koua Nangoin", prenom: "Marie" },
  },
  {
    id: "5",
    nom: "Koua",
    prenom: "Emile",
    telephone: "+225 08 87 65 43",
    dateNaissance: "1965-02-28",
    lienParente: "Frère de Koua Nangoin Pierre",
    village: "Daloa",
    statut: "approuve",
    dateDemande: "2026-04-20T08:30:00",
    parrain: { nom: "Koua Nangoin", prenom: "Pierre" },
  },
  {
    id: "6",
    nom: "Nangoin",
    prenom: "Fatima",
    telephone: "+225 03 45 67 89",
    email: "fatima.nangoin@email.com",
    dateNaissance: "1990-12-01",
    lienParente: "Fille de Nangoin Adam",
    village: "Korhogo",
    statut: "information_demandee",
    dateDemande: "2026-06-08T10:00:00",
    parrain: { nom: "Koua Nangoin", prenom: "Pierre" },
  },
  {
    id: "7",
    nom: "Koua",
    prenom: "Georges",
    telephone: "+225 09 87 65 43",
    dateNaissance: "1982-06-14",
    lienParente: "Fils de Koua Nangoin Paul",
    village: "Abengourou",
    statut: "en_attente",
    dateDemande: "2026-06-15T07:20:00",
  },
  {
    id: "8",
    nom: "Koua",
    prenom: "Hélène",
    telephone: "+225 04 56 78 90",
    email: "helene.koua@email.com",
    dateNaissance: "1998-04-30",
    lienParente: "Petite-fille de Koua Nangoin Joseph",
    village: "Man",
    statut: "approuve",
    dateDemande: "2026-03-15T13:00:00",
    parrain: { nom: "Koua Nangoin", prenom: "Marie" },
  },
]

const statutConfig: Record<StatutDemande, { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" | "gold"; cardColor: string }> = {
  en_attente: { label: "En attente", icon: Clock, variant: "gold", cardColor: "border-l-amber-500" },
  approuve: { label: "Approuvée", icon: CheckCircle2, variant: "default", cardColor: "border-l-emerald-500" },
  rejete: { label: "Rejetée", icon: XCircle, variant: "destructive", cardColor: "border-l-red-500" },
  information_demandee: { label: "Infos demandées", icon: MessageSquare, variant: "secondary", cardColor: "border-l-blue-500" },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DemandesAdhesionPage() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return mockDemandes.filter(
      (d) =>
        `${d.nom} ${d.prenom}`.toLowerCase().includes(q) ||
        d.telephone.includes(q) ||
        d.lienParente.toLowerCase().includes(q) ||
        d.village.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => ({
    toutes: filtered,
    en_attente: filtered.filter((d) => d.statut === "en_attente"),
    approuvees: filtered.filter((d) => d.statut === "approuve"),
    rejetees: filtered.filter((d) => d.statut === "rejete" || d.statut === "information_demandee"),
  }), [filtered])

  const stats = useMemo(() => ({
    total: mockDemandes.length,
    enAttente: mockDemandes.filter((d) => d.statut === "en_attente").length,
    approuvees: mockDemandes.filter((d) => d.statut === "approuve").length,
    rejetees: mockDemandes.filter((d) => d.statut === "rejete").length,
  }), [])

  function renderCard(demande: DemandeAdhesion) {
    const config = statutConfig[demande.statut]
    const initials = `${demande.prenom[0]}${demande.nom[0]}`

    return (
      <motion.div key={demande.id} variants={item}>
        <Link href={`/demandes-adhesion/${demande.id}`}>
          <Card className={`cursor-pointer border-l-4 ${config.cardColor} transition-shadow hover:shadow-md`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={demande.photoUrl} />
                  <AvatarFallback className="bg-emerald-800 text-sm text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {demande.nom} {demande.prenom}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {demande.telephone}
                      </p>
                    </div>
                    <Badge variant={config.variant} className="shrink-0 text-[10px]">
                      <config.icon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-600">
                    <span className="truncate">
                      <span className="text-zinc-400">Parenté : </span>
                      {demande.lienParente}
                    </span>
                    <span className="truncate">
                      <span className="text-zinc-400">Village : </span>
                      {demande.village}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>
                      Demande du{" "}
                      {format(parseISO(demande.dateDemande), "dd MMM yyyy", { locale: fr })}
                    </span>
                    {demande.parrain && (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <UserCheck className="h-3 w-3" />
                        Recommandé par {demande.parrain.prenom} {demande.parrain.nom}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    )
  }

  const tabs = [
    { value: "toutes", label: "Toutes", count: grouped.toutes.length },
    { value: "en_attente", label: "En attente", count: grouped.en_attente.length },
    { value: "approuvees", label: "Approuvées", count: grouped.approuvees.length },
    { value: "rejetees", label: "Rejetées", count: grouped.rejetees.length },
  ]

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
            Demandes d&apos;adhésion
          </h1>
          <p className="text-sm text-zinc-500">
            Gérez les demandes d&apos;inscription des nouveaux membres
          </p>
        </div>
        <Badge variant="gold" className="self-start px-3 py-1 text-sm sm:self-auto">
          <Users className="mr-1.5 h-4 w-4" />
          {stats.total} demande{stats.total > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-800">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-800">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.enAttente}</p>
            <p className="text-xs text-zinc-500">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.approuvees}</p>
            <p className="text-xs text-zinc-500">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejetees}</p>
            <p className="text-xs text-zinc-500">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Rechercher par nom, téléphone, parenté ou village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="toutes">
        <TabsList className="w-full sm:w-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {tab.label}
              <span className="ml-1 rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium tabular-nums">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {(["toutes", "en_attente", "approuvees", "rejetees"] as const).map((key) => (
          <TabsContent key={key} value={key}>
            {grouped[key].length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-400">
                Aucune demande trouvée
              </p>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2"
              >
                {grouped[key].map(renderCard)}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  )
}
