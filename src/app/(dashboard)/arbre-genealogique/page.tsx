"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Relation = "conjoint" | "enfant" | "parent" | "grand-parent" | "frere" | "soeur"

interface FamilyMember {
  id: string
  name: string
  relation: Relation
  children?: FamilyMember[]
}

const MOCK_TREE: FamilyMember = {
  id: "root",
  name: "Koua Nangoin Aka",
  relation: "grand-parent",
  children: [
    {
      id: "child1",
      name: "Koua Nangoin Pierre",
      relation: "parent",
      children: [
        { id: "gc1", name: "Koua Nangoin David", relation: "enfant" },
        { id: "gc2", name: "Koua Nangoin Sarah", relation: "enfant" },
        { id: "gc3", name: "Koua Nangoin Joseph", relation: "enfant" },
      ],
    },
    {
      id: "sibling1",
      name: "Koua Nangoin Marie",
      relation: "parent",
      children: [
        { id: "gc4", name: "Koua Nangoin Rachel", relation: "enfant" },
        { id: "gc5", name: "Koua Nangoin Paul", relation: "enfant" },
      ],
    },
    {
      id: "sibling2",
      name: "Koua Nangoin Joseph",
      relation: "parent",
      children: [
        { id: "gc6", name: "Koua Nangoin Esther", relation: "enfant" },
        { id: "gc7", name: "Koua Nangoin Lucas", relation: "enfant" },
        { id: "gc8", name: "Koua Nangoin Emma", relation: "enfant" },
      ],
    },
  ],
}

const RELATION_VARIANTS: Record<Relation, string> = {
  "grand-parent": "bg-amber-600 text-white border-amber-600",
  parent: "bg-emerald-700 text-white border-emerald-700",
  enfant: "bg-emerald-100 text-emerald-900 border-emerald-300",
  conjoint: "bg-amber-100 text-amber-900 border-amber-300",
  frere: "bg-zinc-100 text-zinc-900 border-zinc-300",
  soeur: "bg-zinc-100 text-zinc-900 border-zinc-300",
}

const RELATION_LABELS: Record<Relation, string> = {
  "grand-parent": "Grand-parent",
  parent: "Parent",
  enfant: "Enfant",
  conjoint: "Conjoint(e)",
  frere: "Frère",
  soeur: "Sœur",
}

function TreeNode({
  member,
  depth = 0,
}: {
  member: FamilyMember
  depth?: number
}) {
  const hasChildren = member.children && member.children.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: depth * 0.1 }}
      className="flex flex-col items-center"
    >
      <Card
        className={`min-w-[160px] border-2 transition-all hover:shadow-lg ${RELATION_VARIANTS[member.relation]}`}
      >
        <CardContent className="p-3 text-center">
          <p className="text-sm font-semibold">{member.name}</p>
          <Badge
            variant={member.relation === "grand-parent" || member.relation === "parent" ? "default" : "secondary"}
            className="mt-1 text-[10px]"
          >
            {RELATION_LABELS[member.relation]}
          </Badge>
        </CardContent>
      </Card>

      {hasChildren && (
        <div className="flex flex-col items-center">
          <div className="h-6 w-px bg-zinc-300" />
          <div className="relative">
            <div className="absolute left-[calc(50%-((var(--child-count)*180px-20px)/2))] right-[calc(50%-((var(--child-count)*180px-20px)/2))] top-0 h-px bg-zinc-300" />
            <div
              className="flex gap-5 pt-6"
              style={{ "--child-count": member.children!.length } as React.CSSProperties}
            >
              {member.children!.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-zinc-300" />
                  <TreeNode member={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function ArbreGenealogiquePage() {
  const [scale, setScale] = useState(1)

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.4))
  const resetZoom = () => setScale(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">Arbre généalogique</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom arrière">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center text-sm text-zinc-600">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom avant">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetZoom} title="Réinitialiser">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center overflow-auto rounded-lg border border-zinc-200 bg-white p-8"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          <TreeNode member={MOCK_TREE} />
        </div>
      </motion.div>
    </div>
  )
}
