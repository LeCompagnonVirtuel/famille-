"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ChevronRight,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  UserCheck,
  ShieldCheck,
  UserX,
  Info,
  Send,
  Loader2,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type StatutDemande = "en_attente" | "approuve" | "rejete" | "information_demandee"

type ActionType = "approuve" | "rejete" | "mis_en_attente" | "information_demandee"

type ActionHistorique = {
  id: string
  action: ActionType
  date: string
  admin: string
  commentaire?: string
}

type DemandeDetail = {
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
  historique: ActionHistorique[]
}

const mockDemande: DemandeDetail = {
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
  historique: [
    {
      id: "h1",
      action: "information_demandee",
      date: "2026-06-11T09:00:00",
      admin: "Koua Nangoin Marie",
      commentaire: "Merci de nous fournir un justificatif de votre lien de parenté.",
    },
  ],
}

const statutConfig: Record<StatutDemande, { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" | "gold"; color: string }> = {
  en_attente: { label: "En attente", icon: Clock, variant: "gold", color: "text-amber-600" },
  approuve: { label: "Approuvée", icon: CheckCircle2, variant: "default", color: "text-emerald-600" },
  rejete: { label: "Rejetée", icon: XCircle, variant: "destructive", color: "text-red-600" },
  information_demandee: { label: "Infos demandées", icon: MessageSquare, variant: "secondary", color: "text-blue-600" },
}

const actionConfig: Record<ActionType, { label: string; dialogTitle: string; icon: React.ElementType; buttonVariant: "default" | "destructive" | "outline" | "secondary"; buttonClass: string }> = {
  approuve: {
    label: "Approuver",
    dialogTitle: "Approuver la demande",
    icon: CheckCircle2,
    buttonVariant: "default",
    buttonClass: "bg-emerald-600 hover:bg-emerald-500",
  },
  rejete: {
    label: "Rejeter",
    dialogTitle: "Rejeter la demande",
    icon: XCircle,
    buttonVariant: "destructive",
    buttonClass: "",
  },
  mis_en_attente: {
    label: "Mettre en attente",
    dialogTitle: "Mettre en attente",
    icon: Clock,
    buttonVariant: "outline",
    buttonClass: "border-amber-500 text-amber-700 hover:bg-amber-50",
  },
  information_demandee: {
    label: "Demander des informations",
    dialogTitle: "Demander des informations complémentaires",
    icon: MessageSquare,
    buttonVariant: "secondary",
    buttonClass: "border-blue-500 text-blue-700 hover:bg-blue-50",
  },
}

const historiqueConfig: Record<ActionType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  approuve: { label: "Approbation", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  rejete: { label: "Rejet", icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  mis_en_attente: { label: "Mis en attente", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  information_demandee: { label: "Information demandée", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
}

const container = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DemandeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const demande = mockDemande

  const [actionLoading, setActionLoading] = useState<ActionType | null>(null)
  const [comment, setComment] = useState("")
  const [openDialog, setOpenDialog] = useState<ActionType | null>(null)

  const statut = statutConfig[demande.statut]
  const initials = `${demande.prenom[0]}${demande.nom[0]}`

  const isPending = demande.statut === "en_attente" || demande.statut === "information_demandee"

  const availableActions: ActionType[] = ["approuve", "rejete", "mis_en_attente", "information_demandee"]

  async function handleAction(action: ActionType) {
    setActionLoading(action)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setActionLoading(null)
    setOpenDialog(null)
    setComment("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/demandes-adhesion" className="hover:text-emerald-800">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/demandes-adhesion" className="hover:text-emerald-800">
            Demandes d&apos;adhésion
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="max-w-[200px] truncate text-zinc-900">
            {demande.nom} {demande.prenom}
          </span>
        </nav>
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <Avatar className="h-24 w-24 shrink-0">
                  <AvatarImage src={demande.photoUrl} />
                  <AvatarFallback className="bg-emerald-800 text-3xl text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                    <h2 className="text-2xl font-bold text-zinc-900">
                      {demande.nom} {demande.prenom}
                    </h2>
                    <Badge variant={statut.variant} className="shrink-0">
                      <statut.icon className="mr-1 h-3.5 w-3.5" />
                      {statut.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{demande.lienParente}</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                      {demande.telephone}
                    </div>
                    {demande.email && (
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                        {demande.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                      Née le {format(parseISO(demande.dateNaissance), "dd MMMM yyyy", { locale: fr })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                      {demande.village}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Users className="h-4 w-4 shrink-0 text-zinc-400" />
                      {demande.lienParente}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Clock className="h-4 w-4 shrink-0 text-zinc-400" />
                      Demande du {format(parseISO(demande.dateDemande), "dd MMMM yyyy", { locale: fr })}
                    </div>
                    {demande.parrain && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 sm:col-span-2">
                        <UserCheck className="h-4 w-4 shrink-0" />
                        Recommandé par {demande.parrain.prenom} {demande.parrain.nom}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isPending && (
          <motion.div variants={item}>
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-900">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {availableActions.map((action) => {
                    const config = actionConfig[action]
                    const Icon = config.icon
                    return (
                      <Dialog
                        key={action}
                        open={openDialog === action}
                        onOpenChange={(open) => {
                          setOpenDialog(open ? action : null)
                          if (!open) setComment("")
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={config.buttonVariant}
                            className={`gap-2 ${config.buttonClass}`}
                          >
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {config.dialogTitle}
                            </DialogTitle>
                            <DialogDescription>
                              {action === "approuve" &&
                                "Cette action approuvera la demande d'adhésion. Le membre aura accès à toutes les fonctionnalités de la plateforme."}
                              {action === "rejete" &&
                                "Cette action rejettera la demande d'adhésion. Le demandeur sera notifié et son accès sera bloqué."}
                              {action === "mis_en_attente" &&
                                "La demande sera mise en attente. Le demandeur pourra être contacté ultérieurement."}
                              {action === "information_demandee" &&
                                "Des informations complémentaires seront demandées au membre. Il sera notifié par email."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor={`comment-${action}`}>
                              Commentaire (optionnel)
                            </Label>
                            <Textarea
                              id={`comment-${action}`}
                              placeholder="Ajouter un commentaire..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setOpenDialog(null)
                                setComment("")
                              }}
                            >
                              Annuler
                            </Button>
                            <Button
                              variant={action === "rejete" ? "destructive" : "default"}
                              className={action === "approuve" ? "bg-emerald-600 hover:bg-emerald-500" : action === "mis_en_attente" ? "border-amber-500 text-amber-700 hover:bg-amber-50" : ""}
                              disabled={actionLoading === action}
                              onClick={() => handleAction(action)}
                            >
                              {actionLoading === action ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Traitement...
                                </>
                              ) : (
                                <>
                                  <Icon className="mr-2 h-4 w-4" />
                                  {config.label}
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
                <ShieldCheck className="h-5 w-5 text-emerald-800" />
                Historique des validations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demande.historique.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-400">
                  Aucune action enregistrée pour le moment
                </p>
              ) : (
                <div className="space-y-0">
                  {demande.historique.map((entry, index) => {
                    const hc = historiqueConfig[entry.action]
                    const Icon = hc.icon
                    const isLast = index === demande.historique.length - 1
                    return (
                      <div key={entry.id} className="relative flex gap-4 pb-6">
                        {!isLast && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-zinc-200" />
                        )}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${hc.bg}`}>
                          <Icon className={`h-5 w-5 ${hc.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-zinc-900">{hc.label}</p>
                            <span className="shrink-0 text-xs text-zinc-400">
                              {format(parseISO(entry.date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-zinc-500">
                            Par {entry.admin}
                          </p>
                          {entry.commentaire && (
                            <div className="mt-2 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                              <p className="flex items-start gap-2">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                                {entry.commentaire}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
                <UserCheck className="h-5 w-5 text-emerald-800" />
                Vérification familiale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="lien-parente" />
                  <Label htmlFor="lien-parente" className="cursor-pointer text-sm font-normal text-zinc-700">
                    Lien de parenté vérifié
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="infos-personnelles" />
                  <Label htmlFor="infos-personnelles" className="cursor-pointer text-sm font-normal text-zinc-700">
                    Informations personnelles vérifiées
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="recommandations" />
                  <Label htmlFor="recommandations" className="cursor-pointer text-sm font-normal text-zinc-700">
                    Recommandations vérifiées
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="flex justify-start">
          <Button variant="ghost" asChild>
            <Link href="/demandes-adhesion">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux demandes
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
