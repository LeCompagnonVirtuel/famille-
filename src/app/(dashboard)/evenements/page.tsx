"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Heart,
  Church,
  Cross,
  Cake,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

type EventType = "reunion" | "mariage" | "bapteme" | "funerailles" | "anniversaire"

interface Evenement {
  id: string
  title: string
  date: string
  type: EventType
  location: string
  description: string
}

const EVENT_ICONS: Record<EventType, { icon: typeof Users; label: string }> = {
  reunion: { icon: Users, label: "Réunion" },
  mariage: { icon: Heart, label: "Mariage" },
  bapteme: { icon: Church, label: "Baptême" },
  funerailles: { icon: Cross, label: "Funérailles" },
  anniversaire: { icon: Cake, label: "Anniversaire" },
}

const MOCK_EVENTS: Evenement[] = [
  { id: "1", title: "Réunion familiale annuelle", date: "2026-06-15", type: "reunion", location: "Village familial", description: "Assemblée générale annuelle de la famille." },
  { id: "2", title: "Mariage de Koua Nangoin David", date: "2026-06-20", type: "mariage", location: "Église Saint-Pierre", description: "Célébration du mariage de David et Esther." },
  { id: "3", title: "Baptême de Koua Nangoin Sarah", date: "2026-06-22", type: "bapteme", location: "Paroisse Notre-Dame", description: "Baptême de la petite Sarah." },
  { id: "4", title: "Anniversaire de Tonton Koua", date: "2026-07-03", type: "anniversaire", location: "Salle des fêtes", description: "90 ans de notre doyen bien-aimé." },
  { id: "5", title: "Funérailles de Tante Marie", date: "2026-07-10", type: "funerailles", location: "Cimetière familial", description: "Cérémonie d'adieu à notre chère tante." },
  { id: "6", title: "Réunion du comité", date: "2026-07-18", type: "reunion", location: "Maison familiale", description: "Réunion du bureau exécutif." },
  { id: "7", title: "Baptême de Koua Nangoin Lucas", date: "2026-08-05", type: "bapteme", location: "Paroisse Saint-Joseph", description: "Baptême du nouveau-né Lucas." },
  { id: "8", title: "Anniversaire de mariage", date: "2026-08-12", type: "anniversaire", location: "Restaurant Le Dôme", description: "25 ans de mariage de Pierre et Marie." },
  { id: "9", title: "Mariage de Koua Nangoin Rachel", date: "2026-09-08", type: "mariage", location: "Mairie centrale", description: "Union de Rachel et Paul." },
  { id: "10", title: "Commémoration des ancêtres", date: "2026-08-04", type: "reunion", location: "Village", description: "Cérémonie traditionnelle annuelle." },
  { id: "11", title: "Funérailles de Grand-père Koua", date: "2026-09-20", type: "funerailles", location: "Cimetière du village", description: "Hommage à notre ancêtre." },
  { id: "12", title: "Réunion des jeunes", date: "2026-10-10", type: "reunion", location: "Centre culturel", description: "Rencontre des jeunes de la famille." },
  { id: "13", title: "Baptême de Koua Nangoin Emma", date: "2026-11-01", type: "bapteme", location: "Église Saint-Michel", description: "Baptême de la petite Emma." },
  { id: "14", title: "Anniversaire de Maman", date: "2026-11-20", type: "anniversaire", location: "Maison familiale", description: "Fête d'anniversaire surprise." },
  { id: "15", title: "Mariage de Koua Nangoin Joseph", date: "2026-12-05", type: "mariage", location: "Cathédrale", description: "Joseph épouse Awa." },
  { id: "16", title: "Funérailles de Tonton Paul", date: "2026-12-15", type: "funerailles", location: "Église du village", description: "Cérémonie funèbre." },
]

const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "reunion", label: "Réunions" },
  { value: "mariage", label: "Mariages" },
  { value: "bapteme", label: "Baptêmes" },
  { value: "funerailles", label: "Funérailles" },
  { value: "anniversaire", label: "Anniversaires" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

export default function EvenementsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5))
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [typeFilter, setTypeFilter] = useState("tous")

  const filteredEvents = useMemo(() => {
    if (typeFilter === "tous") return MOCK_EVENTS
    return MOCK_EVENTS.filter((e) => e.type === typeFilter)
  }, [typeFilter])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)

  const prevMonth = () => setCurrentMonth((d) => subMonths(d, 1))
  const nextMonth = () => setCurrentMonth((d) => addMonths(d, 1))

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Evenement[]>()
    for (const ev of filteredEvents) {
      const key = ev.date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ev)
    }
    return map
  }, [filteredEvents])

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredEvents])

  const calendarDays = useMemo(() => {
    const leadingBlanks = Array.from({ length: startDayOfWeek }, () => null)
    return [...leadingBlanks, ...daysInMonth]
  }, [startDayOfWeek, daysInMonth])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">Événements</h1>
        <Button variant="gold">
          <Plus className="mr-2 h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-100 p-1">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Calendrier
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            Liste
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          {EVENT_TYPES.map((t) => (
            <Button
              key={t.value}
              variant={typeFilter === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {viewMode === "calendar" && (
        <motion.div
          key={`cal-${typeFilter}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold text-emerald-800">
                  {format(currentMonth, "MMMM yyyy", { locale: fr })}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-zinc-500">
                    {d}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`blank-${i}`} />
                  const dateStr = format(day, "yyyy-MM-dd")
                  const dayEvents = eventsByDate.get(dateStr) || []
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isToday = isSameDay(day, new Date(2026, 5, 17))
                  return (
                    <motion.div
                      key={dateStr}
                      variants={itemVariants}
                      className={`min-h-[90px] rounded-lg border p-1 transition-colors ${
                        !isCurrentMonth
                          ? "border-zinc-100 bg-zinc-50 text-zinc-400"
                          : isToday
                            ? "border-emerald-800 bg-emerald-50"
                            : "border-zinc-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="mb-1 text-right text-xs font-medium">
                        {format(day, "d")}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const Icon = EVENT_ICONS[ev.type].icon
                          return (
                            <div
                              key={ev.id}
                              className="truncate rounded bg-emerald-100 px-1 py-0.5 text-[10px] text-emerald-800"
                              title={ev.title}
                            >
                              <Icon className="mr-0.5 inline h-2.5 w-2.5" />
                              {ev.title}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-zinc-500">
                            +{dayEvents.length - 2} autres
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {viewMode === "list" && (
        <motion.div
          key={`list-${typeFilter}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {sortedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 text-center">
              <Calendar className="mb-4 h-12 w-12 text-zinc-300" />
              <h3 className="mb-2 text-lg font-semibold text-zinc-600">
                Aucun événement
              </h3>
              <p className="text-sm text-zinc-500">
                Aucun événement ne correspond à ce filtre.
              </p>
            </div>
          ) : (
            sortedEvents.map((ev) => {
              const Icon = EVENT_ICONS[ev.type].icon
              const evDate = parseISO(ev.date)
              return (
                <motion.div key={ev.id} variants={itemVariants}>
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex min-w-[60px] flex-col items-center rounded-lg bg-emerald-800 px-3 py-2 text-white">
                        <span className="text-xl font-bold">{format(evDate, "dd")}</span>
                        <span className="text-xs uppercase">{format(evDate, "MMM", { locale: fr })}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-zinc-900">{ev.title}</h3>
                          <Badge variant="gold" className="shrink-0">
                            <Icon className="mr-1 h-3 w-3" />
                            {EVENT_ICONS[ev.type].label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </div>
                        <p className="mt-1 text-sm text-zinc-600">{ev.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </motion.div>
      )}
    </div>
  )
}
