"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

type Role = "président" | "vice-président" | "secrétaire" | "trésorier" | "conseiller" | "membre"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: "actif" | "inactif"
  photoUrl: string
  initials: string
  registeredAt: string
}

const ROLES: Role[] = ["président", "vice-président", "secrétaire", "trésorier", "conseiller", "membre"]

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Koua Nangoin Pierre", email: "pierre.koua@email.com", phone: "+225 01 02 03 04", role: "président", status: "actif", photoUrl: "", initials: "KP", registeredAt: "2022-01-15" },
  { id: "2", name: "Koua Nangoin Marie", email: "marie.koua@email.com", phone: "+225 05 06 07 08", role: "secrétaire", status: "actif", photoUrl: "", initials: "KM", registeredAt: "2022-01-20" },
  { id: "3", name: "Koua Nangoin Joseph", email: "joseph.koua@email.com", phone: "+225 09 10 11 12", role: "trésorier", status: "actif", photoUrl: "", initials: "KJ", registeredAt: "2022-02-01" },
  { id: "4", name: "Koua Nangoin Paul", email: "paul.koua@email.com", phone: "+225 13 14 15 16", role: "membre", status: "actif", photoUrl: "", initials: "KP", registeredAt: "2022-03-10" },
  { id: "5", name: "Koua Nangoin Awa", email: "awa.koua@email.com", phone: "+225 17 18 19 20", role: "vice-président", status: "actif", photoUrl: "", initials: "KA", registeredAt: "2022-04-05" },
  { id: "6", name: "Koua Nangoin Rachel", email: "rachel.koua@email.com", phone: "+225 21 22 23 24", role: "conseiller", status: "actif", photoUrl: "", initials: "KR", registeredAt: "2022-05-12" },
  { id: "7", name: "Koua Nangoin Michel", email: "michel.koua@email.com", phone: "+225 25 26 27 28", role: "membre", status: "inactif", photoUrl: "", initials: "KM", registeredAt: "2022-06-01" },
  { id: "8", name: "Koua Nangoin Sophie", email: "sophie.koua@email.com", phone: "+225 29 30 31 32", role: "membre", status: "actif", photoUrl: "", initials: "KS", registeredAt: "2022-07-18" },
  { id: "9", name: "Koua Nangoin Jacques", email: "jacques.koua@email.com", phone: "+225 33 34 35 36", role: "membre", status: "inactif", photoUrl: "", initials: "KJ", registeredAt: "2022-08-22" },
  { id: "10", name: "Koua Nangoin Claire", email: "claire.koua@email.com", phone: "+225 37 38 39 40", role: "conseiller", status: "actif", photoUrl: "", initials: "KC", registeredAt: "2022-09-03" },
  { id: "11", name: "Koua Nangoin Luc", email: "luc.koua@email.com", phone: "+225 41 42 43 44", role: "membre", status: "actif", photoUrl: "", initials: "KL", registeredAt: "2023-01-10" },
  { id: "12", name: "Koua Nangoin Emma", email: "emma.koua@email.com", phone: "+225 45 46 47 48", role: "membre", status: "actif", photoUrl: "", initials: "KE", registeredAt: "2023-02-14" },
  { id: "13", name: "Koua Nangoin Thomas", email: "thomas.koua@email.com", phone: "+225 49 50 51 52", role: "membre", status: "inactif", photoUrl: "", initials: "KT", registeredAt: "2023-03-20" },
  { id: "14", name: "Koua Nangoin Hélène", email: "helene.koua@email.com", phone: "+225 53 54 55 56", role: "membre", status: "actif", photoUrl: "", initials: "KH", registeredAt: "2023-04-25" },
  { id: "15", name: "Koua Nangoin Marc", email: "marc.koua@email.com", phone: "+225 57 58 59 60", role: "membre", status: "actif", photoUrl: "", initials: "KM", registeredAt: "2023-05-30" },
]

const roleBadgeVariant: Record<Role, "default" | "secondary" | "destructive" | "outline" | "gold"> = {
  "président": "gold",
  "vice-président": "default",
  "secrétaire": "default",
  "trésorier": "default",
  "conseiller": "secondary",
  "membre": "outline",
}

const PAGE_SIZE = 8

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MembresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("tous")
  const [statusFilter, setStatusFilter] = useState<string>("tous")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = MOCK_MEMBERS

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.includes(q)
      )
    }

    if (roleFilter !== "tous") {
      result = result.filter((m) => m.role === roleFilter)
    }

    if (statusFilter !== "tous") {
      result = result.filter((m) => m.status === statusFilter)
    }

    return result
  }, [searchTerm, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Gestion des membres</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {MOCK_MEMBERS.length} membres inscrits
          </p>
        </div>
        <Button variant="gold" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
            className="h-10 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-400" />
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-40 text-sm">
              <SelectValue placeholder="Tous les rôles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les rôles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-40 text-sm">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold text-zinc-900">
              Membres ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo / Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-zinc-400">
                        Aucun membre trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((member) => (
                      <TableRow
                        key={member.id}
                        className="cursor-pointer"
                        onClick={() => window.location.href = `/membres/${member.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.photoUrl} />
                              <AvatarFallback className="bg-emerald-800 text-white text-xs">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-zinc-900">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-600">{member.email}</TableCell>
                        <TableCell className="text-zinc-600">{member.phone}</TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant[member.role]} className="text-[11px]">
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.status === "actif" ? "default" : "secondary"}
                            className="text-[11px]"
                          >
                            {member.status === "actif" ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {formatDate(member.registeredAt, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); window.location.href = `/membres/${member.id}/edit` }}
                            >
                              <Edit className="h-4 w-4 text-zinc-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={(e) => { e.stopPropagation() }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-sm text-zinc-500">
                  Page {safePage} sur {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === safePage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
