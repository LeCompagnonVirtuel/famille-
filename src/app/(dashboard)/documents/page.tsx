"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  FileSpreadsheet,
  File,
  Download,
  Search,
  Upload,
  FolderOpen,
  FileSignature,
  ScrollText,
  Gavel,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Document } from "@/lib/types"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
} as const

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
} as const

type DocType = Document["type"]

interface DocWithSize extends Document {
  taille: string
}

const mockDocuments: DocWithSize[] = [
  {
    id: "1",
    titre: "PV Réunion Générale 2026",
    description: "Procès-verbal de la réunion générale du 15 janvier 2026",
    type: "proces_verbal",
    fichier_url: "/documents/pv-2026-01.pdf",
    uploader_id: "u1",
    created_at: "2026-01-20",
    taille: "2.4 Mo",
  },
  {
    id: "2",
    titre: "PV Réunion du Bureau",
    description: "Procès-verbal de la réunion du bureau exécutif",
    type: "proces_verbal",
    fichier_url: "/documents/pv-bureau.pdf",
    uploader_id: "u1",
    created_at: "2026-03-10",
    taille: "1.8 Mo",
  },
  {
    id: "3",
    titre: "Compte Rendu Réunion Famille",
    description: "Compte rendu de la réunion familiale du 5 février 2026",
    type: "compte_rendu",
    fichier_url: "/documents/cr-famille.pdf",
    uploader_id: "u2",
    created_at: "2026-02-08",
    taille: "1.2 Mo",
  },
  {
    id: "4",
    titre: "Compte Rendu Commission",
    description: "Compte rendu des travaux de la commission d'organisation",
    type: "compte_rendu",
    fichier_url: "/documents/cr-commission.pdf",
    uploader_id: "u3",
    created_at: "2026-04-15",
    taille: "0.9 Mo",
  },
  {
    id: "5",
    titre: "Règlement Intérieur",
    description: "Règlement intérieur de l'association familiale",
    type: "reglement",
    fichier_url: "/documents/reglement-interieur.pdf",
    uploader_id: "u1",
    created_at: "2025-12-01",
    taille: "3.1 Mo",
  },
  {
    id: "6",
    titre: "Charte de l'Association",
    description: "Charte des valeurs et principes de la famille",
    type: "reglement",
    fichier_url: "/documents/charte.pdf",
    uploader_id: "u2",
    created_at: "2025-11-15",
    taille: "1.5 Mo",
  },
  {
    id: "7",
    titre: "Annuaire des Membres 2026",
    description: "Annuaire complet des membres de la famille",
    type: "autre",
    fichier_url: "/documents/annuaire-2026.pdf",
    uploader_id: "u1",
    created_at: "2026-01-10",
    taille: "4.2 Mo",
  },
  {
    id: "8",
    titre: "Budget Prévisionnel 2026",
    description: "Budget prévisionnel voté en assemblée générale",
    type: "autre",
    fichier_url: "/documents/budget-2026.xlsx",
    uploader_id: "u3",
    created_at: "2026-01-25",
    taille: "0.6 Mo",
  },
  {
    id: "9",
    titre: "Calendrier des Événements",
    description: "Calendrier des événements familiaux 2026",
    type: "autre",
    fichier_url: "/documents/calendrier-2026.pdf",
    uploader_id: "u2",
    created_at: "2026-01-05",
    taille: "0.8 Mo",
  },
]

type Category = {
  type: DocType
  label: string
  icon: typeof FileText
}

const categories: Category[] = [
  { type: "proces_verbal", label: "Procès-verbaux", icon: ScrollText },
  { type: "compte_rendu", label: "Comptes rendus", icon: FileSignature },
  { type: "reglement", label: "Règlements", icon: Gavel },
  { type: "autre", label: "Autres", icon: File },
]

const fileIconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
}

function getFileIcon(url: string) {
  const ext = url.split(".").pop()?.toLowerCase() ?? ""
  return fileIconMap[ext] ?? File
}

function formatSize(size: string) {
  return size
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<DocType | "all">("all")

  const filtered = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.titre.toLowerCase().includes(search.toLowerCase()) ||
        (doc.description ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === "all" || doc.type === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const grouped = useMemo(() => {
    const map = new Map<DocType, DocWithSize[]>()
    for (const doc of filtered) {
      const list = map.get(doc.type)
      if (list) list.push(doc)
      else map.set(doc.type, [doc])
    }
    return map
  }, [filtered])

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
            Documents
          </h2>
          <p className="text-sm text-zinc-500">
            Bibliothèque de documents familiaux
          </p>
        </div>
        <Button variant="gold" className="gap-2">
          <Upload className="h-4 w-4" />
          Télécharger un document
        </Button>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher un document..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="gap-1"
          >
            <FolderOpen className="h-4 w-4" />
            Tous
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.type}
              variant={activeCategory === cat.type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.type)}
              className="gap-1"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <File className="mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-lg font-medium text-zinc-900">
            Aucun document trouvé
          </p>
          <p className="text-sm text-zinc-500">
            Essayez de modifier votre recherche ou vos filtres.
          </p>
        </motion.div>
      ) : (
        categories.map((cat) => {
          const docs = grouped.get(cat.type)
          if (!docs || docs.length === 0) return null
          return (
            <motion.div key={cat.type} variants={item}>
              <div className="mb-3 flex items-center gap-2">
                <cat.icon className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-zinc-900">
                  {cat.label}
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {docs.length}
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {docs.map((doc) => {
                  const FileIcon = getFileIcon(doc.fichier_url)
                  return (
                    <Card
                      key={doc.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                          <FileIcon className="h-5 w-5 text-emerald-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">
                            {doc.titre}
                          </p>
                          {doc.description && (
                            <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                              {doc.description}
                            </p>
                          )}
                          <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
                            <span>{formatDate(doc.created_at)}</span>
                            <span>{doc.taille}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-zinc-400 hover:text-emerald-800"
                          aria-label={`Télécharger ${doc.titre}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          )
        })
      )}
    </motion.div>
  )
}
