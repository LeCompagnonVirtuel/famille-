"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Download, ChevronDown, ChevronUp, Mail, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

type Role = "président" | "vice-président" | "secrétaire" | "trésorier" | "conseiller" | "membre"

interface Contact {
  id: string
  name: string
  role: Role
  phone: string
  email: string
  photoUrl: string
  initials: string
  details?: string
}

const roleBadgeVariant: Record<Role, "default" | "secondary" | "destructive" | "outline" | "gold"> = {
  "président": "gold",
  "vice-président": "default",
  "secrétaire": "default",
  "trésorier": "default",
  "conseiller": "secondary",
  "membre": "outline",
}

const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "Koua Nangoin Awa", role: "vice-président", phone: "+225 17 18 19 20", email: "awa.koua@email.com", photoUrl: "", initials: "KA" },
  { id: "2", name: "Koua Nangoin Claire", role: "conseiller", phone: "+225 37 38 39 40", email: "claire.koua@email.com", photoUrl: "", initials: "KC" },
  { id: "3", name: "Koua Nangoin David", role: "membre", phone: "+225 61 62 63 64", email: "david.koua@email.com", photoUrl: "", initials: "KD" },
  { id: "4", name: "Koua Nangoin Emma", role: "membre", phone: "+225 45 46 47 48", email: "emma.koua@email.com", photoUrl: "", initials: "KE" },
  { id: "5", name: "Koua Nangoin Esther", role: "membre", phone: "+225 65 66 67 68", email: "esther.koua@email.com", photoUrl: "", initials: "KE" },
  { id: "6", name: "Koua Nangoin Hélène", role: "membre", phone: "+225 53 54 55 56", email: "helene.koua@email.com", photoUrl: "", initials: "KH" },
  { id: "7", name: "Koua Nangoin Jacques", role: "membre", phone: "+225 33 34 35 36", email: "jacques.koua@email.com", photoUrl: "", initials: "KJ" },
  { id: "8", name: "Koua Nangoin Joseph", role: "trésorier", phone: "+225 09 10 11 12", email: "joseph.koua@email.com", photoUrl: "", initials: "KJ" },
  { id: "9", name: "Koua Nangoin Julie", role: "membre", phone: "+225 69 70 71 72", email: "julie.koua@email.com", photoUrl: "", initials: "KJ" },
  { id: "10", name: "Koua Nangoin Louise", role: "membre", phone: "+225 73 74 75 76", email: "louise.koua@email.com", photoUrl: "", initials: "KL" },
  { id: "11", name: "Koua Nangoin Luc", role: "membre", phone: "+225 41 42 43 44", email: "luc.koua@email.com", photoUrl: "", initials: "KL" },
  { id: "12", name: "Koua Nangoin Marc", role: "membre", phone: "+225 57 58 59 60", email: "marc.koua@email.com", photoUrl: "", initials: "KM" },
  { id: "13", name: "Koua Nangoin Marie", role: "secrétaire", phone: "+225 05 06 07 08", email: "marie.koua@email.com", photoUrl: "", initials: "KM" },
  { id: "14", name: "Koua Nangoin Michel", role: "membre", phone: "+225 25 26 27 28", email: "michel.koua@email.com", photoUrl: "", initials: "KM" },
  { id: "15", name: "Koua Nangoin Paul", role: "membre", phone: "+225 13 14 15 16", email: "paul.koua@email.com", photoUrl: "", initials: "KP" },
  { id: "16", name: "Koua Nangoin Pierre", role: "président", phone: "+225 01 02 03 04", email: "pierre.koua@email.com", photoUrl: "", initials: "KP" },
  { id: "17", name: "Koua Nangoin Rachel", role: "conseiller", phone: "+225 21 22 23 24", email: "rachel.koua@email.com", photoUrl: "", initials: "KR" },
  { id: "18", name: "Koua Nangoin Sarah", role: "membre", phone: "+225 77 78 79 80", email: "sarah.koua@email.com", photoUrl: "", initials: "KS" },
  { id: "19", name: "Koua Nangoin Sophie", role: "membre", phone: "+225 29 30 31 32", email: "sophie.koua@email.com", photoUrl: "", initials: "KS" },
  { id: "20", name: "Koua Nangoin Thomas", role: "membre", phone: "+225 49 50 51 52", email: "thomas.koua@email.com", photoUrl: "", initials: "KT" },
]

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function AnnuairePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CONTACTS
    const q = searchQuery.toLowerCase()
    return MOCK_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.role.includes(q)
    )
  }, [searchQuery])

  const grouped = useMemo(() => {
    const map: Record<string, Contact[]> = {}
    for (const contact of filtered) {
      const letter = contact.name.charAt(0).toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(contact)
    }
    for (const letter of LETTERS) {
      if (!map[letter]) map[letter] = []
    }
    return map
  }, [filtered])

  const availableLetters = LETTERS.filter((l) => grouped[l].length > 0)

  const handleExport = () => {
    const csv = [
      ["Nom", "Rôle", "Email", "Téléphone"].join(","),
      ...MOCK_CONTACTS.map((c) =>
        [c.name, c.role, c.email, c.phone].map((v) => `"${v}"`).join(",")
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "annuaire_familial.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Annuaire familial</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {MOCK_CONTACTS.length} membres de la famille
          </p>
        </div>
        <Button variant="gold" className="gap-1.5" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exporter les contacts
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {availableLetters.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-wrap gap-1">
          {availableLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              {letter}
            </a>
          ))}
        </motion.div>
      )}

      {filtered.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center"
        >
          <User className="mb-4 h-12 w-12 text-zinc-300" />
          <h3 className="mb-2 text-lg font-semibold text-zinc-600">Aucun résultat</h3>
          <p className="text-sm text-zinc-500">Aucun membre ne correspond à votre recherche.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-8">
          {LETTERS.map((letter) => {
            const contacts = grouped[letter]
            if (contacts.length === 0) return null
            return (
              <section key={letter} id={`letter-${letter}`}>
                <div className="sticky top-0 mb-3 rounded-lg bg-emerald-800 px-4 py-2 shadow-sm">
                  <h2 className="text-lg font-bold text-white">{letter}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => {
                    const isExpanded = expandedId === contact.id
                    return (
                      <motion.div key={contact.id} layout>
                        <Card
                          className="cursor-pointer border-zinc-200 transition-shadow hover:shadow-md"
                          onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 shrink-0">
                                <AvatarImage src={contact.photoUrl} />
                                <AvatarFallback className="bg-emerald-800 text-white text-sm">
                                  {contact.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-zinc-900">
                                  {contact.name}
                                </p>
                                <Badge
                                  variant={roleBadgeVariant[contact.role]}
                                  className="mt-1 text-[10px]"
                                >
                                  {contact.role}
                                </Badge>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                              )}
                            </div>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 space-y-2 border-t border-zinc-100 pt-4"
                              >
                                <div className="flex items-center gap-3 text-sm">
                                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                                  <a
                                    href={`tel:${contact.phone}`}
                                    className="text-zinc-600 hover:text-emerald-800"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {contact.phone}
                                  </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="truncate text-zinc-600 hover:text-emerald-800"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {contact.email}
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
