"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Users,
  PiggyBank,
  Lightbulb,
  Vote,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

type Role = "président" | "vice-président" | "secrétaire" | "trésorier" | "conseiller" | "membre"

interface MemberDetail {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  role: Role
  status: "actif" | "inactif"
  photoUrl: string
  initials: string
  address: string
  profession: string
  dateOfBirth: string
  familyRole: string
  registeredAt: string
  stats: {
    cotisationsPayees: number
    suggestionsSoumises: number
    votesParticipés: number
  }
  recentActivity: {
    date: string
    action: string
    detail: string
  }[]
}

const MOCK_MEMBER: MemberDetail = {
  id: "1",
  name: "Koua Nangoin Pierre",
  email: "pierre.koua@email.com",
  phone: "+225 01 02 03 04",
  whatsapp: "+225 01 02 03 04",
  role: "président",
  status: "actif",
  photoUrl: "",
  initials: "KP",
  address: "Abidjan, Cocody, Rue des Jardins",
  profession: "Ingénieur en génie civil",
  dateOfBirth: "1978-05-20",
  familyRole: "Chef de famille",
  registeredAt: "2022-01-15",
  stats: {
    cotisationsPayees: 48,
    suggestionsSoumises: 12,
    votesParticipés: 15,
  },
  recentActivity: [
    { date: "2026-06-15", action: "Cotisation", detail: "Paiement de la cotisation de juin 2026" },
    { date: "2026-06-10", action: "Vote", detail: "Participation au scrutin 'Organisation de la fête annuelle'" },
    { date: "2026-06-05", action: "Suggestion", detail: "Proposition d'une activité pour les jeunes" },
    { date: "2026-05-28", action: "Annonce", detail: "Publication d'une annonce sur les travaux de rénovation" },
    { date: "2026-05-15", action: "Cotisation", detail: "Paiement de la cotisation de mai 2026" },
  ],
}

function getMemberById(id: string): MemberDetail | null {
  return MOCK_MEMBER.id === id ? MOCK_MEMBER : null
}

const roleBadgeVariant: Record<Role, "default" | "secondary" | "destructive" | "outline" | "gold"> = {
  "président": "gold",
  "vice-président": "default",
  "secrétaire": "default",
  "trésorier": "default",
  "conseiller": "secondary",
  "membre": "outline",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MembreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const member = getMemberById(params.id as string)

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-2 text-2xl font-bold text-zinc-600">Membre introuvable</h2>
        <p className="mb-6 text-zinc-500">Ce membre n'existe pas ou a été supprimé.</p>
        <Button asChild variant="gold">
          <Link href="/membres">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux membres
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Button variant="ghost" asChild>
          <Link href="/membres">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-80 shrink-0">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="flex flex-col items-center pt-6 text-center">
              <Avatar className="mb-4 h-28 w-28">
                <AvatarImage src={member.photoUrl} />
                <AvatarFallback className="bg-emerald-800 text-3xl text-white">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-zinc-900">{member.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={roleBadgeVariant[member.role]}>{member.role}</Badge>
                <Badge variant={member.status === "actif" ? "default" : "secondary"}>
                  {member.status === "actif" ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <Separator className="my-5" />
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="text-zinc-600">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="text-zinc-600">{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-zinc-600">{member.whatsapp}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="text-zinc-600">{member.address}</span>
                </div>
              </div>
              <Separator className="my-5" />
              <Button variant="gold" className="w-full gap-1.5">
                <Edit className="h-4 w-4" />
                Modifier le profil
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <PiggyBank className="h-6 w-6 text-emerald-800" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{member.stats.cotisationsPayees}</p>
                  <p className="text-xs text-zinc-500">Cotisations payées</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{member.stats.suggestionsSoumises}</p>
                  <p className="text-xs text-zinc-500">Suggestions soumises</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Vote className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{member.stats.votesParticipés}</p>
                  <p className="text-xs text-zinc-500">Votes participés</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-900">
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-500">Profession</p>
                      <p className="text-sm font-medium text-zinc-900">{member.profession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-500">Date de naissance</p>
                      <p className="text-sm font-medium text-zinc-900">
                        {formatDate(member.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-500">Rôle familial</p>
                      <p className="text-sm font-medium text-zinc-900">{member.familyRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-500">Date d'inscription</p>
                      <p className="text-sm font-medium text-zinc-900">
                        {formatDate(member.registeredAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-zinc-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-800" />
                <CardTitle className="text-lg font-semibold text-zinc-900">
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {member.recentActivity.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-zinc-100 p-3 transition-colors hover:border-zinc-200"
                    >
                      <Badge
                        variant={
                          activity.action === "Cotisation"
                            ? "default"
                            : activity.action === "Vote"
                            ? "gold"
                            : activity.action === "Suggestion"
                            ? "secondary"
                            : "outline"
                        }
                        className="shrink-0 text-[10px]"
                      >
                        {activity.action}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-zinc-700">{activity.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs text-zinc-400">
                        {formatDate(activity.date, "dd MMM")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
