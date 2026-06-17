"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Mars,
  Venus,
  FileSpreadsheet,
  FileText,
  FileDown,
  User,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Hash,
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
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { formatDate as fmtDate, generateId } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type Sexe = "homme" | "femme"
type Statut = "vivant" | "decede"
type Validation = "approuve" | "en_attente" | "rejete"

interface FamilyMember {
  id: string
  nom: string
  prenoms: string
  sexe: Sexe
  dateNaissance: string
  lieuNaissance: string
  telephone: string
  email: string
  photoUrl: string
  profession: string
  village: string
  pereId: string | null
  mereId: string | null
  conjointId: string | null
  statut: Statut
  dateDeces: string | null
  biographie: string
  generation: number
  validation: Validation
  dateAjout: string
}

const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    nom: "KOUA NANGOIN",
    prenoms: "",
    sexe: "homme",
    dateNaissance: "1900-01-01",
    lieuNaissance: "Korhogo",
    telephone: "",
    email: "",
    photoUrl: "",
    profession: "Chef de famille",
    village: "Korhogo",
    pereId: null,
    mereId: null,
    conjointId: null,
    statut: "decede",
    dateDeces: "1975-06-15",
    biographie: "Ancêtre fondateur de la famille KOUA NANGOIN.",
    generation: 1,
    validation: "approuve",
    dateAjout: "2022-01-01",
  },
  {
    id: "2",
    nom: "KOUA NANGOIN",
    prenoms: "Pierre",
    sexe: "homme",
    dateNaissance: "1945-03-12",
    lieuNaissance: "Korhogo",
    telephone: "+225 01 02 03 04",
    email: "pierre.koua@email.com",
    photoUrl: "",
    profession: "Agriculteur",
    village: "Yamoussoukro",
    pereId: "1",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fils aîné de KOUA NANGOIN.",
    generation: 2,
    validation: "approuve",
    dateAjout: "2022-01-15",
  },
  {
    id: "3",
    nom: "KOUA NANGOIN",
    prenoms: "Marie",
    sexe: "femme",
    dateNaissance: "1948-07-22",
    lieuNaissance: "Korhogo",
    telephone: "+225 05 06 07 08",
    email: "marie.koua@email.com",
    photoUrl: "",
    profession: "Ménagère",
    village: "Abidjan",
    pereId: "1",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fille de KOUA NANGOIN.",
    generation: 2,
    validation: "approuve",
    dateAjout: "2022-01-20",
  },
  {
    id: "4",
    nom: "KOUA NANGOIN",
    prenoms: "Joseph",
    sexe: "homme",
    dateNaissance: "1950-11-05",
    lieuNaissance: "Korhogo",
    telephone: "",
    email: "",
    photoUrl: "",
    profession: "Enseignant",
    village: "Bouaké",
    pereId: "1",
    mereId: null,
    conjointId: null,
    statut: "decede",
    dateDeces: "2020-03-20",
    biographie: "Fils cadet de KOUA NANGOIN.",
    generation: 2,
    validation: "approuve",
    dateAjout: "2022-02-01",
  },
  {
    id: "5",
    nom: "KOUA NANGOIN",
    prenoms: "Paul",
    sexe: "homme",
    dateNaissance: "1972-09-18",
    lieuNaissance: "Yamoussoukro",
    telephone: "+225 13 14 15 16",
    email: "paul.koua@email.com",
    photoUrl: "",
    profession: "Commerçant",
    village: "Abidjan",
    pereId: "2",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fils de Pierre.",
    generation: 3,
    validation: "approuve",
    dateAjout: "2022-03-10",
  },
  {
    id: "6",
    nom: "KOUA NANGOIN",
    prenoms: "Awa",
    sexe: "femme",
    dateNaissance: "1975-04-25",
    lieuNaissance: "Yamoussoukro",
    telephone: "+225 17 18 19 20",
    email: "awa.koua@email.com",
    photoUrl: "",
    profession: "Infirmière",
    village: "San Pedro",
    pereId: "2",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fille de Pierre.",
    generation: 3,
    validation: "approuve",
    dateAjout: "2022-04-05",
  },
  {
    id: "7",
    nom: "KOUA NANGOIN",
    prenoms: "Michel",
    sexe: "homme",
    dateNaissance: "1978-01-30",
    lieuNaissance: "Abidjan",
    telephone: "+225 25 26 27 28",
    email: "michel.koua@email.com",
    photoUrl: "",
    profession: "Ingénieur",
    village: "Abidjan",
    pereId: "3",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fils de Marie.",
    generation: 3,
    validation: "approuve",
    dateAjout: "2022-06-01",
  },
  {
    id: "8",
    nom: "KOUA NANGOIN",
    prenoms: "Sophie",
    sexe: "femme",
    dateNaissance: "1981-12-12",
    lieuNaissance: "Abidjan",
    telephone: "+225 29 30 31 32",
    email: "sophie.koua@email.com",
    photoUrl: "",
    profession: "Avocate",
    village: "Abidjan",
    pereId: "3",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fille de Marie.",
    generation: 3,
    validation: "approuve",
    dateAjout: "2022-07-18",
  },
  {
    id: "9",
    nom: "KOUA NANGOIN",
    prenoms: "Luc",
    sexe: "homme",
    dateNaissance: "2000-06-05",
    lieuNaissance: "Abidjan",
    telephone: "+225 41 42 43 44",
    email: "luc.koua@email.com",
    photoUrl: "",
    profession: "Étudiant",
    village: "Abidjan",
    pereId: "5",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fils de Paul.",
    generation: 4,
    validation: "approuve",
    dateAjout: "2023-01-10",
  },
  {
    id: "10",
    nom: "KOUA NANGOIN",
    prenoms: "Emma",
    sexe: "femme",
    dateNaissance: "2003-02-14",
    lieuNaissance: "Abidjan",
    telephone: "+225 45 46 47 48",
    email: "emma.koua@email.com",
    photoUrl: "",
    profession: "Étudiante",
    village: "Abidjan",
    pereId: "5",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fille de Paul.",
    generation: 4,
    validation: "en_attente",
    dateAjout: "2023-02-14",
  },
  {
    id: "11",
    nom: "KOUA NANGOIN",
    prenoms: "Jacques",
    sexe: "homme",
    dateNaissance: "2005-09-20",
    lieuNaissance: "Abidjan",
    telephone: "+225 49 50 51 52",
    email: "jacques.koua@email.com",
    photoUrl: "",
    profession: "Étudiant",
    village: "Abidjan",
    pereId: "7",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fils de Michel.",
    generation: 4,
    validation: "approuve",
    dateAjout: "2023-03-20",
  },
  {
    id: "12",
    nom: "KOUA NANGOIN",
    prenoms: "Claire",
    sexe: "femme",
    dateNaissance: "2007-11-08",
    lieuNaissance: "Abidjan",
    telephone: "+225 53 54 55 56",
    email: "claire.koua@email.com",
    photoUrl: "",
    profession: "Élève",
    village: "Abidjan",
    pereId: "7",
    mereId: null,
    conjointId: null,
    statut: "vivant",
    dateDeces: null,
    biographie: "Fille de Michel.",
    generation: 4,
    validation: "rejete",
    dateAjout: "2023-04-25",
  },
]

const FORM_SCHEMA = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenoms: z.string().min(1, "Les prénoms sont requis"),
  sexe: z.enum(["homme", "femme"]),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  lieuNaissance: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  photoUrl: z.string().optional(),
  profession: z.string().optional(),
  village: z.string().optional(),
  pereId: z.string().optional(),
  mereId: z.string().optional(),
  conjointId: z.string().optional(),
  statut: z.enum(["vivant", "decede"]),
  dateDeces: z.string().optional(),
  biographie: z.string().optional(),
}).refine(
  (data) => data.statut !== "decede" || (data.dateDeces && data.dateDeces.length > 0),
  { message: "La date de décès est requise", path: ["dateDeces"] }
)

type FormData = z.input<typeof FORM_SCHEMA>

const PAGE_SIZE = 10

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
}

function getInitials(member: FamilyMember): string {
  const parts = [member.nom, member.prenoms].filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function getGenerationLabel(g: number): string {
  return `G${g}`
}

const validationConfig: Record<Validation, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "gold"; icon: React.ElementType }> = {
  approuve: { label: "Approuvé", variant: "default", icon: CheckCircle2 },
  en_attente: { label: "En attente", variant: "gold", icon: Clock },
  rejete: { label: "Rejeté", variant: "destructive", icon: X },
}

export default function RecensementPage() {
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_MEMBERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [sexeFilter, setSexeFilter] = useState<string>("tous")
  const [statutFilter, setStatutFilter] = useState<string>("tous")
  const [generationFilter, setGenerationFilter] = useState<string>("tous")
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<Record<string, string>[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const generations = useMemo(() => {
    const gs = new Set<number>()
    members.forEach((m) => gs.add(m.generation))
    return Array.from(gs).sort()
  }, [members])

  const form = useForm<FormData>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      nom: "",
      prenoms: "",
      sexe: "homme",
      dateNaissance: "",
      lieuNaissance: "",
      telephone: "",
      email: "",
      photoUrl: "",
      profession: "",
      village: "",
      pereId: "",
      mereId: "",
      conjointId: "",
      statut: "vivant",
      dateDeces: "",
      biographie: "",
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const statutValue = form.watch("statut")

  const filtered = useMemo(() => {
    let result = members

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (m) =>
          `${m.nom} ${m.prenoms}`.toLowerCase().includes(q) ||
          m.telephone.includes(q) ||
          m.profession.toLowerCase().includes(q) ||
          m.village.toLowerCase().includes(q)
      )
    }

    if (sexeFilter !== "tous") {
      result = result.filter((m) => m.sexe === sexeFilter)
    }

    if (statutFilter !== "tous") {
      result = result.filter((m) => m.statut === statutFilter)
    }

    if (generationFilter !== "tous") {
      result = result.filter((m) => m.generation === Number(generationFilter))
    }

    return result
  }, [members, searchTerm, sexeFilter, statutFilter, generationFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const stats = useMemo(() => ({
    total: members.length,
    hommes: members.filter((m) => m.sexe === "homme").length,
    femmes: members.filter((m) => m.sexe === "femme").length,
    vivants: members.filter((m) => m.statut === "vivant").length,
    generations: generations.length,
  }), [members, generations])

  const parentsOptions = useMemo(
    () => members.filter((m) => m.statut === "vivant" || m.generation > 1),
    [members]
  )

  function openAddDialog() {
    setEditingMember(null)
    form.reset({
      nom: "",
      prenoms: "",
      sexe: "homme",
      dateNaissance: "",
      lieuNaissance: "",
      telephone: "",
      email: "",
      photoUrl: "",
      profession: "",
      village: "",
      pereId: "",
      mereId: "",
      conjointId: "",
      statut: "vivant",
      dateDeces: "",
      biographie: "",
    })
    setDialogOpen(true)
  }

  function openEditDialog(member: FamilyMember) {
    setEditingMember(member)
    form.reset({
      nom: member.nom,
      prenoms: member.prenoms,
      sexe: member.sexe,
      dateNaissance: member.dateNaissance,
      lieuNaissance: member.lieuNaissance,
      telephone: member.telephone,
      email: member.email,
      photoUrl: member.photoUrl,
      profession: member.profession,
      village: member.village,
      pereId: member.pereId ?? "",
      mereId: member.mereId ?? "",
      conjointId: member.conjointId ?? "",
      statut: member.statut,
      dateDeces: member.dateDeces ?? "",
      biographie: member.biographie,
    })
    setDialogOpen(true)
  }

  function onSubmit(raw: FormData) {
    const data = {
      nom: raw.nom,
      prenoms: raw.prenoms,
      sexe: raw.sexe,
      dateNaissance: raw.dateNaissance,
      lieuNaissance: raw.lieuNaissance ?? "",
      telephone: raw.telephone ?? "",
      email: raw.email ?? "",
      photoUrl: raw.photoUrl ?? "",
      profession: raw.profession ?? "",
      village: raw.village ?? "",
      pereId: raw.pereId ?? "",
      mereId: raw.mereId ?? "",
      conjointId: raw.conjointId ?? "",
      statut: raw.statut,
      dateDeces: raw.dateDeces ?? "",
      biographie: raw.biographie ?? "",
    }

    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                ...data,
                pereId: data.pereId || null,
                mereId: data.mereId || null,
                conjointId: data.conjointId || null,
                dateDeces: data.dateDeces || null,
              }
            : m
        )
      )
    } else {
      const parentIds = [data.pereId, data.mereId].filter(Boolean)
      const gen = parentIds.length > 0
        ? Math.max(...parentIds.map((id) => {
            const p = members.find((m) => m.id === id)
            return p ? p.generation + 1 : 1
          }))
        : 1

      const newMember: FamilyMember = {
        id: generateId(),
        ...data,
        pereId: data.pereId || null,
        mereId: data.mereId || null,
        conjointId: data.conjointId || null,
        dateDeces: data.dateDeces || null,
        generation: gen,
        validation: "en_attente",
        dateAjout: new Date().toISOString().split("T")[0],
      }
      setMembers((prev) => [...prev, newMember])
    }
    setDialogOpen(false)
    setEditingMember(null)
  }

  function deleteMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirmId(null)
  }

  function handleExport(type: "pdf" | "excel" | "csv") {
    const dataToExport = filtered.length > 0 ? filtered : members

    if (type === "csv") {
      const headers = ["Nom", "Prénoms", "Sexe", "Génération", "Date naissance", "Téléphone", "Email", "Profession", "Village", "Statut", "Validation"]
      const rows = dataToExport.map((m) => [
        m.nom, m.prenoms, m.sexe, `G${m.generation}`, m.dateNaissance,
        m.telephone, m.email, m.profession, m.village,
        m.statut === "vivant" ? "Vivant" : "Décédé",
        validationConfig[m.validation].label,
      ])
      const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `recensement_familial_${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      return
    }

    if (type === "excel") {
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.json_to_sheet(
          dataToExport.map((m) => ({
            Nom: m.nom,
            Prénoms: m.prenoms,
            Sexe: m.sexe === "homme" ? "Homme" : "Femme",
            Génération: `G${m.generation}`,
            "Date naissance": m.dateNaissance,
            Téléphone: m.telephone,
            Email: m.email,
            Profession: m.profession,
            Village: m.village,
            Statut: m.statut === "vivant" ? "Vivant" : "Décédé",
            Validation: validationConfig[m.validation].label,
          }))
        )
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Recensement")
        XLSX.writeFile(wb, `recensement_familial_${new Date().toISOString().split("T")[0]}.xlsx`)
      })
      return
    }

    if (type === "pdf") {
      import("jspdf").then(({ default: jsPDF }) => {
        const doc = new jsPDF()
        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)
        doc.text("Recensement familial - KOUA NANGOIN", 14, 20)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Généré le ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`, 14, 28)
        const tableHeaders = [["Nom", "Prénoms", "Sexe", "Gén.", "Né(e) le", "Statut"]]
        const tableData = dataToExport.map((m) => [
          m.nom,
          m.prenoms,
          m.sexe === "homme" ? "M" : "F",
          `G${m.generation}`,
          fmtDate(m.dateNaissance, "dd/MM/yyyy"),
          m.statut === "vivant" ? "Vivant" : "Décédé",
        ])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(doc as any).autoTable({
          head: tableHeaders,
          body: tableData,
          startY: 34,
          theme: "grid",
          styles: { fontSize: 8 },
          headStyles: { fillColor: [6, 95, 70] },
        })
        doc.save(`recensement_familial_${new Date().toISOString().split("T")[0]}.pdf`)
      })
    }
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setImportErrors([])
    setImportPreview([])
    setImportFile(file)

    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!["csv", "xlsx", "xls"].includes(ext ?? "")) {
      setImportErrors(["Format de fichier non supporté. Utilisez CSV ou Excel."])
      return
    }

    try {
      const XLSX = await import("xlsx")
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: "array" })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" })
      if (data.length === 0) {
        setImportErrors(["Le fichier est vide."])
        return
      }
      setImportPreview(data.slice(0, 5))
    } catch {
      setImportErrors(["Impossible de lire le fichier. Vérifiez son contenu."])
    }
  }, [])

  function doImport() {
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setImportOpen(false)
      setImportFile(null)
      setImportPreview([])
    }, 800)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Recensement familial</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {members.length} membres référencés dans l&apos;arbre généalogique
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="gold" className="gap-1.5" onClick={openAddDialog}>
            <Plus className="h-4 w-4" />
            Ajouter un membre
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importer Excel/CSV</span>
            <span className="sm:hidden">Importer</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4 text-zinc-500" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileDown className="mr-2 h-4 w-4 text-zinc-500" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total membres", value: stats.total, icon: Users, color: "emerald" },
          { label: "Hommes", value: stats.hommes, icon: Mars, color: "blue" },
          { label: "Femmes", value: stats.femmes, icon: Venus, color: "pink" },
          { label: "Vivants", value: stats.vivants, icon: User, color: "emerald" },
          { label: "Générations", value: stats.generations, icon: Hash, color: "amber" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{stat.value}</p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      stat.color === "emerald"
                        ? "bg-emerald-100 text-emerald-700"
                        : stat.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : stat.color === "pink"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher par nom, téléphone, profession ou village..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
            className="h-10 pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <Filter className="h-4 w-4 shrink-0 text-zinc-400" />
          <Select value={sexeFilter} onValueChange={(v) => { setSexeFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-36 shrink-0 text-sm">
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous</SelectItem>
              <SelectItem value="homme">Homme</SelectItem>
              <SelectItem value="femme">Femme</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statutFilter} onValueChange={(v) => { setStatutFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-36 shrink-0 text-sm">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous</SelectItem>
              <SelectItem value="vivant">Vivant</SelectItem>
              <SelectItem value="decede">Décédé</SelectItem>
            </SelectContent>
          </Select>
          <Select value={generationFilter} onValueChange={(v) => { setGenerationFilter(v); setPage(1) }}>
            <SelectTrigger className="h-10 w-36 shrink-0 text-sm">
              <SelectValue placeholder="Génération" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes</SelectItem>
              {generations.map((g) => (
                <SelectItem key={g} value={String(g)}>G{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table (desktop) + Card list (mobile) */}
      <motion.div variants={itemVariants}>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-0 sm:p-0">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Photo</TableHead>
                    <TableHead>Nom &amp; Prénoms</TableHead>
                    <TableHead className="w-16">Sexe</TableHead>
                    <TableHead className="w-20">Génération</TableHead>
                    <TableHead className="w-32">Date naissance</TableHead>
                    <TableHead className="w-24">Statut</TableHead>
                    <TableHead className="w-28">Validation</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center">
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((member) => (
                      <TableRow key={member.id} className="group">
                        <TableCell>
                          <Avatar className="h-9 w-9">
                            {member.photoUrl ? (
                              <AvatarImage src={member.photoUrl} alt={`${member.nom} ${member.prenoms}`} />
                            ) : null}
                            <AvatarFallback className="bg-emerald-800 text-white text-xs">
                              {getInitials(member)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-zinc-900">
                              {member.nom} {member.prenoms}
                            </p>
                            {member.profession && (
                              <p className="text-xs text-zinc-400">{member.profession}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-lg">
                            {member.sexe === "homme" ? (
                              <Mars className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Venus className="h-4 w-4 text-pink-500" />
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[11px] font-mono">
                            {getGenerationLabel(member.generation)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-600">
                          {fmtDate(member.dateNaissance, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.statut === "vivant" ? "default" : "secondary"}
                            className="text-[11px]"
                          >
                            {member.statut === "vivant" ? "Vivant" : "Décédé"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const cfg = validationConfig[member.validation]
                              return (
                                <Badge variant={cfg.variant} className="text-[11px]">
                                  <cfg.icon className="mr-0.5 h-3 w-3" />
                                  {cfg.label}
                                </Badge>
                              )
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(member)}
                            >
                              <Edit className="h-4 w-4 text-zinc-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => setDeleteConfirmId(member.id)}
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

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-zinc-100">
              {paginated.length === 0 ? (
                <div className="py-16">
                  <EmptyState />
                </div>
              ) : (
                paginated.map((member) => (
                  <div key={member.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        {member.photoUrl ? (
                          <AvatarImage src={member.photoUrl} alt={`${member.nom} ${member.prenoms}`} />
                        ) : null}
                        <AvatarFallback className="bg-emerald-800 text-white text-xs">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900">
                              {member.nom} {member.prenoms}
                            </p>
                            {member.profession && (
                              <p className="text-xs text-zinc-400">{member.profession}</p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(member)}
                            >
                              <Edit className="h-3.5 w-3.5 text-zinc-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => setDeleteConfirmId(member.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            {member.sexe === "homme" ? (
                              <Mars className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Venus className="h-3 w-3 text-pink-500" />
                            )}
                            {member.sexe === "homme" ? "Homme" : "Femme"}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {getGenerationLabel(member.generation)}
                          </Badge>
                          <Badge
                            variant={member.statut === "vivant" ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {member.statut === "vivant" ? "Vivant" : "Décédé"}
                          </Badge>
                          {(() => {
                            const cfg = validationConfig[member.validation]
                            return (
                              <Badge variant={cfg.variant} className="text-[10px]">
                                <cfg.icon className="mr-0.5 h-2.5 w-2.5" />
                                {cfg.label}
                              </Badge>
                            )
                          })()}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          Né(e) le {fmtDate(member.dateNaissance, "dd MMM yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3">
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

      {/* Add/Edit member dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto max-sm:fixed max-sm:inset-0 max-sm:rounded-none max-sm:max-w-none max-sm:h-full max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:top-0 max-sm:left-0">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Modifier le membre" : "Ajouter un membre"}</DialogTitle>
            <DialogDescription>
              Remplissez les informations du membre de la famille KOUA NANGOIN.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" {...form.register("nom")} placeholder="KOUA NANGOIN" />
                {form.formState.errors.nom && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.nom.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="prenoms">Prénoms *</Label>
                <Input id="prenoms" {...form.register("prenoms")} placeholder="Pierre" />
                {form.formState.errors.prenoms && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.prenoms.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="sexe">Sexe *</Label>
                <Select
                  value={form.watch("sexe")}
                  onValueChange={(v) => form.setValue("sexe", v as "homme" | "femme")}
                >
                  <SelectTrigger id="sexe" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input id="dateNaissance" type="date" {...form.register("dateNaissance")} />
                {form.formState.errors.dateNaissance && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.dateNaissance.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
                <Input id="lieuNaissance" {...form.register("lieuNaissance")} placeholder="Korhogo" />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" {...form.register("telephone")} placeholder="+225 01 02 03 04" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="pierre@email.com" />
              </div>
              <div>
                <Label htmlFor="photoUrl">Photo (URL)</Label>
                <Input id="photoUrl" {...form.register("photoUrl")} placeholder="https://..." />
                {form.watch("photoUrl") && (
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={form.watch("photoUrl")} />
                      <AvatarFallback className="bg-emerald-800 text-white text-[10px]">PH</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-zinc-400">Aperçu</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" {...form.register("profession")} placeholder="Agriculteur" />
              </div>
              <div>
                <Label htmlFor="village">Village</Label>
                <Input id="village" {...form.register("village")} placeholder="Yamoussoukro" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="pereId">Père</Label>
                <Select
                  value={form.watch("pereId")}
                  onValueChange={(v) => form.setValue("pereId", v)}
                >
                  <SelectTrigger id="pereId" className="h-10">
                    <SelectValue placeholder="Aucun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {parentsOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nom} {p.prenoms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mereId">Mère</Label>
                <Select
                  value={form.watch("mereId")}
                  onValueChange={(v) => form.setValue("mereId", v)}
                >
                  <SelectTrigger id="mereId" className="h-10">
                    <SelectValue placeholder="Aucune" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune</SelectItem>
                    {parentsOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nom} {p.prenoms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="conjointId">Conjoint(e)</Label>
                <Select
                  value={form.watch("conjointId")}
                  onValueChange={(v) => form.setValue("conjointId", v)}
                >
                  <SelectTrigger id="conjointId" className="h-10">
                    <SelectValue placeholder="Aucun(e)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun(e)</SelectItem>
                    {members.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nom} {p.prenoms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={form.watch("statut")}
                  onValueChange={(v) => form.setValue("statut", v as "vivant" | "decede")}
                >
                  <SelectTrigger id="statut" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vivant">Vivant</SelectItem>
                    <SelectItem value="decede">Décédé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {statutValue === "decede" && (
                <div>
                  <Label htmlFor="dateDeces">Date de décès *</Label>
                  <Input id="dateDeces" type="date" {...form.register("dateDeces")} />
                  {form.formState.errors.dateDeces && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.dateDeces.message}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="biographie">Biographie</Label>
              <Textarea id="biographie" {...form.register("biographie")} placeholder="Histoire du membre..." rows={3} />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" variant="default">
                {editingMember ? "Enregistrer les modifications" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(o) => { if (!o) setDeleteConfirmId(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce membre du recensement ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Le membre sera définitivement retiré de l&apos;arbre généalogique.</span>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMember(deleteConfirmId)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-xl sm:max-h-[90vh] overflow-y-auto max-sm:fixed max-sm:inset-0 max-sm:rounded-none max-sm:max-w-none max-sm:h-full max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:top-0 max-sm:left-0">
          <DialogHeader>
            <DialogTitle>Importer des membres</DialogTitle>
            <DialogDescription>
              Importez un fichier Excel (.xlsx) ou CSV contenant les membres de la famille.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mb-3 h-10 w-10 text-zinc-300" />
              <p className="text-sm font-medium text-zinc-600">
                {importFile ? importFile.name : "Cliquez pour sélectionner un fichier"}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Formats acceptés : .xlsx, .xls, .csv
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </div>

            {importErrors.length > 0 && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {importErrors.map((err, i) => (
                  <p key={i} className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            {importPreview.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Aperçu ({importPreview.length} ligne(s))
                </p>
                <div className="overflow-x-auto rounded-md border border-zinc-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-50">
                        {Object.keys(importPreview[0]).map((key) => (
                          <th key={key} className="px-3 py-2 font-medium text-zinc-600 whitespace-nowrap">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row, i) => (
                        <tr key={i} className="border-t border-zinc-100">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-3 py-2 text-zinc-700 whitespace-nowrap">
                              {val || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              <Button
                variant="gold"
                disabled={!importFile || importErrors.length > 0 || importing}
                onClick={doImport}
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importation...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <User className="mb-3 h-12 w-12 text-zinc-200" />
      <h3 className="text-base font-semibold text-zinc-500">Aucun membre trouvé</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Aucun membre ne correspond à vos critères de recherche.
      </p>
    </div>
  )
}
