"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Megaphone,
  Info,
  FileText,
  Lightbulb,
  MessageSquare,
  Users,
  Wallet,
  Vote,
  UserPlus,
  ClipboardCheck,
  BookOpen,
  GitBranch,
  BarChart3,
  ClipboardList,
  Image,
  Calendar,
  Folder,
  Crown,
  LogOut,
  X,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import * as Avatar from "@radix-ui/react-avatar"
import * as Separator from "@radix-ui/react-separator"
import type { Profile, Role } from "@/lib/types"

interface SidebarProps {
  user?: Pick<Profile, "nom" | "prenom" | "photo_url" | "role"> | null
  onLogout?: () => void
  mobileOpen?: boolean
  onMobileToggle?: (open: boolean) => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { label: "Annonces", href: "/annonces", icon: Megaphone },
  { label: "Informations", href: "/informations", icon: Info },
  { label: "Secrétariat Général", href: "/secretariat", icon: FileText },
  { label: "Suggestions", href: "/suggestions", icon: Lightbulb },
  { label: "Communicateur", href: "/communicateur", icon: MessageSquare },
  { label: "Partage d'idées", href: "/partage-idees", icon: Users },
  { label: "Trésorerie", href: "/tresorerie", icon: Wallet },
  { label: "Votes", href: "/votes", icon: Vote },
  { label: "Membres", href: "/membres", icon: UserPlus },
  { label: "Demandes d'adhésion", href: "/demandes-adhesion", icon: ClipboardCheck },
  { label: "Annuaire", href: "/annuaire", icon: BookOpen },
  { label: "Arbre généalogique", href: "/arbre-genealogique", icon: GitBranch },
  { label: "Recensement", href: "/recensement", icon: ClipboardList },
  { label: "Statistiques", href: "/statistiques-genealogiques", icon: BarChart3 },
  { label: "Galerie", href: "/galerie", icon: Image },
  { label: "Événements", href: "/evenements", icon: Calendar },
  { label: "Documents", href: "/documents", icon: Folder },
]

const roleLabels: Record<Role, string> = {
  president: "Président",
  secretaire_general: "Secrétaire Général",
  tresorier: "Trésorier",
  communicateur: "Communicateur",
  membre: "Membre",
}

export function Sidebar({ user, onLogout, mobileOpen: controlledOpen, onMobileToggle }: SidebarProps) {
  const pathname = usePathname()
  const [internalOpen, setInternalOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const mobileOpen = controlledOpen ?? internalOpen
  const setMobileOpen = onMobileToggle ?? setInternalOpen

  useEffect(() => {
    if (onMobileToggle) {
      onMobileToggle(false)
    } else {
      setInternalOpen(false)
    }
  }, [pathname, onMobileToggle])

  const sidebarContent = (
    <div className="flex h-full flex-col bg-emerald-800 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-emerald-700 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div className={cn("flex flex-col", collapsed && "hidden")}>
          <span className="text-sm font-bold leading-tight">Famille</span>
          <span className="text-xs font-semibold text-amber-400">KOUA NANGOIN</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full">
          <nav className="space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors md:py-2.5",
                    isActive
                      ? "border-l-4 border-amber-600 bg-emerald-700/60 text-white"
                      : "border-l-4 border-transparent text-emerald-100 hover:bg-emerald-700/40 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={cn("truncate", collapsed && "hidden")}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex w-2 touch-none select-none bg-emerald-700/30 p-0.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-emerald-600" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Separator */}
      <Separator.Root className="mx-4 my-2 h-px bg-emerald-700" />

      {/* User Profile */}
      {user && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600">
              <Avatar.Image
                src={user.photo_url ?? undefined}
                alt={`${user.prenom} ${user.nom}`}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="text-sm font-medium text-white" delayMs={600}>
                {user.prenom?.charAt(0)}
                {user.nom?.charAt(0)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className={cn("flex min-w-0 flex-1 flex-col", collapsed && "hidden")}>
              <span className="truncate text-sm font-medium text-white">
                {user.prenom} {user.nom}
              </span>
              <span className="truncate text-xs text-amber-400">
                {roleLabels[user.role]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      {onLogout && (
        <div className="px-4 pb-4">
          <Button
            variant="ghost"
            onClick={onLogout}
            className={cn(
              "w-full justify-start gap-3 text-emerald-100 hover:bg-emerald-700 hover:text-white",
              collapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && "hidden")}>Déconnexion</span>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-lg md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col",
          collapsed ? "w-16" : "w-64",
          "transition-all duration-300 ease-in-out",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            >
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white shadow-md hover:bg-emerald-600"
                >
                  <X className="h-4 w-4" />
                </button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
