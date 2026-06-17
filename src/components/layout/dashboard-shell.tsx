"use client"

import { useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/types"

interface DashboardShellProps {
  children: ReactNode
  title?: string
  user?: Pick<Profile, "nom" | "prenom" | "photo_url" | "role"> | null
  notificationCount?: number
  onLogout?: () => void
  className?: string
}

export function DashboardShell({
  children,
  title,
  user,
  notificationCount = 0,
  onLogout,
  className,
}: DashboardShellProps) {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar
        user={user}
        onLogout={onLogout}
        mobileOpen={sidebarMobileOpen}
        onMobileToggle={setSidebarMobileOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={title}
          user={user}
          notificationCount={notificationCount}
          onMenuToggle={() => setSidebarMobileOpen((prev) => !prev)}
          onLogout={onLogout}
        />

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 lg:p-6",
            className,
          )}
        >
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
