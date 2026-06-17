"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import * as Avatar from "@radix-ui/react-avatar"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import type { Profile, Role } from "@/lib/types"

interface HeaderProps {
  title?: string
  user?: Pick<Profile, "nom" | "prenom" | "photo_url" | "role"> | null
  notificationCount?: number
  onMenuToggle?: () => void
  onLogout?: () => void
}

const pageTitles: Record<string, string> = {
  "/": "Tableau de bord",
  "/annonces": "Annonces",
  "/informations": "Informations",
  "/secretariat": "Secrétariat Général",
  "/suggestions": "Suggestions",
  "/communicateur": "Communicateur",
  "/partage-idees": "Partage d'idées",
  "/tresorerie": "Trésorerie",
  "/votes": "Votes",
  "/membres": "Membres",
  "/annuaire": "Annuaire",
  "/arbre-genealogique": "Arbre généalogique",
  "/galerie": "Galerie",
  "/evenements": "Événements",
  "/documents": "Documents",
}

const roleLabels: Record<Role, string> = {
  president: "Président",
  secretaire_general: "Secrétaire Général",
  tresorier: "Trésorier",
  communicateur: "Communicateur",
  membre: "Membre",
}

export function Header({
  title,
  user,
  notificationCount = 0,
  onMenuToggle,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  const displayTitle =
    title ?? pageTitles[pathname] ?? "Tableau de bord"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-4 shadow-sm lg:px-6">
      {/* Mobile menu toggle */}
      {onMenuToggle && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Page title */}
      <motion.h1
        key={displayTitle}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="hidden text-lg font-semibold text-zinc-900 sm:block"
      >
        {displayTitle}
      </motion.h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden items-center sm:flex">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Rechercher..."
            className="h-9 w-48 border-zinc-200 pl-9 text-sm focus:w-64 lg:w-56 lg:focus:w-72"
          />
        </div>
      </div>

      {/* Mobile search toggle */}
      <button
        type="button"
        onClick={() => setSearchOpen(!searchOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 sm:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* User dropdown */}
      {user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-100"
            >
              <Avatar.Root className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-800">
                <Avatar.Image
                  src={user.photo_url ?? undefined}
                  alt={`${user.prenom} ${user.nom}`}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="text-xs font-medium text-white" delayMs={600}>
                  {user.prenom?.charAt(0)}
                  {user.nom?.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-tight text-zinc-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs leading-tight text-zinc-500">
                  {roleLabels[user.role]}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-zinc-400 md:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-zinc-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-zinc-500">{roleLabels[user.role]}</p>
              </div>

              <DropdownMenu.Separator className="h-px bg-zinc-200" />

              <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-700 outline-none hover:bg-zinc-100">
                <User className="h-4 w-4" />
                Mon profil
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-700 outline-none hover:bg-zinc-100">
                <Settings className="h-4 w-4" />
                Paramètres
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-zinc-200" />

              {onLogout && (
                <DropdownMenu.Item
                  onClick={onLogout}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-16 overflow-hidden border-b border-zinc-200 bg-white px-4 pb-3 pt-2 sm:hidden"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Rechercher..."
                className="h-9 w-full border-zinc-200 pl-9 text-sm"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
