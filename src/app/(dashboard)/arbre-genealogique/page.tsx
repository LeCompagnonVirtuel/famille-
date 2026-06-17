"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Search,
  UserPlus,
  Download,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Pencil,
  Eye,
  Venus,
  Mars,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FamilyTree, generateMockData } from "@/components/genealogy/family-tree"
import type { MembreArbreAvecParents } from "@/components/genealogy/family-tree"
import { cn } from "@/lib/utils"

const SEXE_ICON = { homme: <Mars className="h-4 w-4 text-blue-500" />, femme: <Venus className="h-4 w-4 text-pink-500" /> } as const
const SEXE_LABEL = { homme: "Homme", femme: "Femme" } as const

function MemberDetailPanel({
  member,
  onClose,
  onSelectMember,
  isMobile,
}: {
  member: MembreArbreAvecParents
  onClose: () => void
  onSelectMember: (id: string) => void
  isMobile: boolean
}) {
  const infoRow = (icon: React.ReactNode, label: string, value: string | null | undefined) => {
    if (!value) return null
    return (
      <div className="flex items-start gap-3 py-2.5">
        <div className="mt-0.5 text-zinc-400 flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
          <p className="text-sm font-medium text-zinc-800 mt-0.5">{value}</p>
        </div>
      </div>
    )
  }

  const personLink = (m: MembreArbreAvecParents | null | undefined) => {
    if (!m) return null
    return (
      <button
        onClick={() => onSelectMember(m.id)}
        className="inline-flex items-center gap-1.5 rounded-md bg-zinc-50 px-2.5 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
      >
        <span>{m.prenom} {m.nom}</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    )
  }

  const personList = (items: (MembreArbreAvecParents | null | undefined)[] | null | undefined) => {
    if (!items || items.length === 0) return <p className="text-sm text-zinc-400 italic">Aucun</p>
    return (
      <div className="flex flex-wrap gap-2">
        {items.filter(Boolean).map((m) => (
          <div key={m!.id}>{personLink(m)}</div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      key={member.id}
      initial={isMobile ? { y: "100%" } : { x: "100%" }}
      animate={isMobile ? { y: 0 } : { x: 0 }}
      exit={isMobile ? { y: "100%" } : { x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "bg-white shadow-xl",
        isMobile
          ? "fixed inset-x-0 bottom-0 z-50 rounded-t-2xl max-h-[85vh] overflow-hidden"
          : "h-full w-[420px] flex-shrink-0 overflow-hidden border-l border-zinc-200",
      )}
    >
      <div className={cn("flex items-center justify-between border-b border-zinc-100", isMobile ? "p-4" : "p-5")}>
        {isMobile && (
          <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-300" />
        )}
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Détails du membre</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className={isMobile ? "h-[calc(85vh-57px)]" : "h-[calc(100%-57px)]"}>
        <div className={isMobile ? "p-4 pt-2" : "p-6"}>
          {/* Photo + Name */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Avatar className="mb-3 h-28 w-28 ring-4 ring-emerald-100">
              <AvatarImage src={member.photo_url ?? ""} />
              <AvatarFallback className="bg-emerald-800 text-3xl">
                {member.prenom.charAt(0)}
                {member.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-zinc-900">
              {member.prenom} {member.nom}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="gold" className="text-[11px]">
                G{member.generation}
              </Badge>
              <Badge variant={member.statut === "vivant" ? "default" : "destructive"} className="text-[11px]">
                {member.statut === "vivant" ? "Vivant(e)" : "Décédé(e)"}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500">
              {SEXE_ICON[member.sexe]}
              <span>{SEXE_LABEL[member.sexe]}</span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Informations personnelles */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
              Informations personnelles
            </h4>
            <div className="divide-y divide-zinc-100">
              {infoRow(<Calendar className="h-4 w-4" />, "Date de naissance", member.date_naissance)}
              {infoRow(<MapPin className="h-4 w-4" />, "Lieu de naissance", member.lieu_naissance)}
              {infoRow(<Briefcase className="h-4 w-4" />, "Profession", member.profession)}
              {infoRow(<MapPin className="h-4 w-4" />, "Village d&apos;origine", member.village_origine)}
              {member.date_deces && infoRow(<Calendar className="h-4 w-4" />, "Date de décès", member.date_deces)}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Contact */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Contact</h4>
            <div className="divide-y divide-zinc-100">
              {infoRow(<Phone className="h-4 w-4" />, "Téléphone", member.telephone)}
              {infoRow(<Mail className="h-4 w-4" />, "Email", member.email)}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Famille */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Famille</h4>

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">Parents</p>
              {member.pere || member.mere ? (
                <div className="flex flex-wrap gap-2">
                  {personLink(member.pere)}
                  {personLink(member.mere)}
                </div>
              ) : (
                <p className="text-sm italic text-zinc-400">
                  {member.generation === 1 ? "Ancêtre fondateur" : "Non renseigné"}
                </p>
              )}
            </div>

            {member.conjoint && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-zinc-400">Conjoint(e)</p>
                {personLink(member.conjoint)}
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">Enfants</p>
              {personList(member.enfants)}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">Frères et sœurs</p>
              {personList(member.freresSoeurs)}
            </div>
          </div>

          {member.biographie && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Biographie</h4>
                <p className="text-sm leading-relaxed text-zinc-700">{member.biographie}</p>
              </div>
            </>
          )}

          <Separator className="my-4" />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </Button>
            <Button variant="default" size="sm" className="flex-1 gap-1.5" onClick={onClose}>
              <Eye className="h-3.5 w-3.5" />
              Voir dans l&apos;arbre
            </Button>
          </div>

          <div className="mt-3 h-4" />
        </div>
      </ScrollArea>
    </motion.div>
  )
}

export default function ArbreGenealogiquePage() {
  const [data] = useState<MembreArbreAvecParents[]>(() => generateMockData())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGeneration, setFilterGeneration] = useState<number | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const generations = useMemo(() => {
    const set = new Set(data.map((m) => m.generation))
    return Array.from(set).sort((a, b) => a - b)
  }, [data])

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null
    return data.find((m) => m.id === selectedMemberId) ?? null
  }, [data, selectedMemberId])

  const handleMemberClick = useCallback((id: string) => {
    setSelectedMemberId((prev) => (prev === id ? null : id))
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedMemberId(null)
  }, [])

  const handleSelectMemberFromPanel = useCallback((id: string) => {
    setSelectedMemberId(id)
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-hidden p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">Arbre généalogique</h1>
          <p className="mt-1 text-sm text-zinc-500">Descendants de KOUA NANGOIN</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un membre</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/statistiques-genealogiques">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Voir les statistiques</span>
              <span className="sm:hidden">Stats</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            key="all"
            variant={filterGeneration === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterGeneration(null)}
            className="h-8 text-xs"
          >
            Toutes
          </Button>
          {generations.map((gen) => (
            <Button
              key={gen}
              variant={filterGeneration === gen ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterGeneration(gen)}
              className="h-8 text-xs"
            >
              G{gen}
            </Button>
          ))}
        </div>
      </div>

      {/* Tree + Detail Panel */}
      <div className="relative flex min-h-0 flex-1 gap-0">
        <motion.div
          className="flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-white"
          animate={{ marginRight: selectedMember && !isMobile ? 0 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FamilyTree
            members={data}
            onMemberClick={handleMemberClick}
            selectedMemberId={selectedMemberId}
            filterGeneration={filterGeneration}
            searchQuery={searchQuery}
          />
        </motion.div>

        {/* Detail panel - Desktop */}
        {!isMobile && (
          <AnimatePresence mode="wait">
            {selectedMember && (
              <MemberDetailPanel
                key={selectedMember.id}
                member={selectedMember}
                onClose={handleClosePanel}
                onSelectMember={handleSelectMemberFromPanel}
                isMobile={false}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Detail panel - Mobile (bottom sheet overlay) */}
      {isMobile && (
        <AnimatePresence mode="wait">
          {selectedMember && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={handleClosePanel}
              />
              <MemberDetailPanel
                key={selectedMember.id}
                member={selectedMember}
                onClose={handleClosePanel}
                onSelectMember={handleSelectMemberFromPanel}
                isMobile={true}
              />
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
