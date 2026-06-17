"use client"

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  Component,
  type ReactNode,
  type ErrorInfo,
} from "react"
import * as d3 from "d3"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────────
//  1.  ERROR BOUNDARY
// ──────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class TreeErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[FamilyTree] Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-96 items-center justify-center rounded-lg border border-red-200 bg-zinc-50 p-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">
                Erreur d&apos;affichage
              </p>
              <p className="mt-2 text-zinc-500">
                Impossible de charger l&apos;arbre g&eacute;n&eacute;alogique.
              </p>
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: null })
                }
                className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-700"
              >
                R&eacute;essayer
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}

// ──────────────────────────────────────────────────
//  2.  TYPES
// ──────────────────────────────────────────────────

export type Sexe = "homme" | "femme"
type StatutMembreArbre = "vivant" | "decede"

export interface MembreArbre {
  id: string
  nom: string
  prenom: string
  sexe: Sexe
  date_naissance: string
  lieu_naissance: string | null
  telephone: string | null
  email: string | null
  photo_url: string | null
  profession: string | null
  village_origine: string | null
  pere_id: string | null
  mere_id: string | null
  conjoint_id: string | null
  generation: number
  statut: StatutMembreArbre
  date_deces: string | null
  biographie: string | null
}

export interface MembreArbreAvecParents extends MembreArbre {
  pere?: MembreArbre | null
  mere?: MembreArbre | null
  conjoint?: MembreArbre | null
  enfants?: MembreArbre[]
  freresSoeurs?: MembreArbre[]
}

// ──────────────────────────────────────────────────
//  3.  INTERNAL DATA TYPES
// ──────────────────────────────────────────────────

interface D3NodeData {
  id: string
  member: MembreArbreAvecParents
  children?: D3NodeData[]
}

interface FamilyTreeProps {
  members?: MembreArbreAvecParents[]
  onMemberClick?: (memberId: string) => void
  selectedMemberId?: string | null
  filterGeneration?: number | null
  searchQuery?: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  member: MembreArbreAvecParents | null
}

// ──────────────────────────────────────────────────
//  4.  CONSTANTS
// ──────────────────────────────────────────────────

const NODE_W = 190
const NODE_H = 70
const PHOTO_R = 17
const PHOTO_CX = 30
const PHOTO_CY = 35
const VERT_GAP = 100
const HORIZ_GAP_MIN = 30

const C = {
  nodeBorder: "#065f46",
  nodeBorderSelected: "#059669",
  nodeBg: "#ffffff",
  link: "#d6d3d1",
  maleTint: "#93c5fd",
  femaleTint: "#f9a8d4",
  badgeBg: "#d1fae5",
  badgeText: "#065f46",
  badgeStroke: "#a7f3d0",
  deceased: "#dc2626",
  textPrimary: "#292524",
  textSecondary: "#78716c",
  fallbackBg: "#065f46",
  fallbackText: "#ffffff",
}

// ──────────────────────────────────────────────────
//  5.  MOCK DATA
// ──────────────────────────────────────────────────

function mock(): MembreArbreAvecParents[] {
  const m = (
    id: string,
    nom: string,
    prenom: string,
    sexe: Sexe,
    overrides: Partial<MembreArbreAvecParents> = {},
  ): MembreArbreAvecParents => ({
    id,
    nom,
    prenom,
    sexe,
    date_naissance: "",
    lieu_naissance: null,
    telephone: null,
    email: null,
    photo_url: null,
    profession: null,
    village_origine: null,
    pere_id: null,
    mere_id: null,
    conjoint_id: null,
    generation: 1,
    statut: "vivant",
    date_deces: null,
    biographie: null,
    pere: null,
    mere: null,
    conjoint: null,
    enfants: [],
    freresSoeurs: [],
    ...overrides,
  })

  // ── Gen 1 ──
  const g1 = m("g1-nangoing", "KOUA", "NANGOIN", "homme", {
    date_naissance: "1876",
    lieu_naissance: "Kpouèbo",
    profession: "Chef de famille",
    village_origine: "Kpouèbo",
    generation: 1,
    statut: "decede",
    date_deces: "1953",
    biographie: "Ancêtre fondateur de la famille KOUA NANGOIN",
  })

  // ── Gen 2 ──
  const g2ak = m("g2-akissi", "N'GUESSAN", "Akissi", "femme", {
    generation: 2,
    conjoint_id: "g2-aka",
    village_origine: "Bocanda",
  })

  const g2ad = m("g2-adjoua", "KOUA", "Adjoua", "femme", {
    generation: 2,
    pere_id: "g1-nangoing",
    conjoint_id: "g2-kouadio",
    village_origine: "Kpouèbo",
    profession: "Commerçante",
    date_naissance: "1910",
  })

  const g2ko = m("g2-kouadio", "KONAN", "Kouadio", "homme", {
    generation: 2,
    conjoint_id: "g2-adjoua",
    village_origine: "Bocanda",
    profession: "Agriculteur",
  })

  const g2ah = m("g2-ahou", "KOUA", "Ahou", "femme", {
    generation: 2,
    pere_id: "g1-nangoing",
    conjoint_id: "g2-mohamed",
    village_origine: "Kpouèbo",
    profession: "Ménagère",
    date_naissance: "1915",
  })

  const g2mo = m("g2-mohamed", "TOURE", "Mohamed", "homme", {
    generation: 2,
    conjoint_id: "g2-ahou",
    village_origine: "Kong",
    profession: "Commerçant",
  })

  const g2aka = m("g2-aka", "KOUA", "Aka", "homme", {
    generation: 2,
    pere_id: "g1-nangoing",
    conjoint_id: "g2-akissi",
    village_origine: "Kpouèbo",
    profession: "Instituteur",
    date_naissance: "1905",
    statut: "decede",
    date_deces: "1982",
    biographie: "Fils aîné de KOUA NANGOIN, instituteur de profession",
  })

  // ── Gen 3 ──
  const g3ng = m("g3-nguessan", "KOUA", "N'Guessan", "homme", {
    generation: 3,
    pere_id: "g2-aka",
    mere_id: "g2-akissi",
    village_origine: "Kpouèbo",
    profession: "Fonctionnaire",
    date_naissance: "1935",
    statut: "decede",
    date_deces: "2019",
    biographie: "Petit-fils de KOUA NANGOIN",
  })

  const g3ay = m("g3-aya", "KOUA", "Aya", "femme", {
    generation: 3,
    pere_id: "g2-aka",
    mere_id: "g2-akissi",
    village_origine: "Kpouèbo",
    profession: "Infirmière",
    date_naissance: "1940",
  })

  const g3yao = m("g3-yao", "KONAN", "Yao", "homme", {
    generation: 3,
    pere_id: "g2-kouadio",
    mere_id: "g2-adjoua",
    village_origine: "Bocanda",
    profession: "Enseignant",
    date_naissance: "1938",
    conjoint_id: "g3-amenan",
  })

  const g3am = m("g3-amenan", "KONAN", "Amenan", "femme", {
    generation: 3,
    pere_id: "g2-kouadio",
    mere_id: "g2-adjoua",
    village_origine: "Bocanda",
    profession: "Ménagère",
    date_naissance: "1942",
    conjoint_id: "g3-yao",
  })

  const g3fa = m("g3-fatou", "TOURE", "Fatoumata", "femme", {
    generation: 3,
    pere_id: "g2-mohamed",
    mere_id: "g2-ahou",
    village_origine: "Kong",
    profession: "Secrétaire",
    date_naissance: "1945",
  })

  const g3ou = m("g3-ousmane", "TOURE", "Ousmane", "homme", {
    generation: 3,
    pere_id: "g2-mohamed",
    mere_id: "g2-ahou",
    village_origine: "Kong",
    profession: "Médecin",
    date_naissance: "1948",
  })

  // ── Gen 4 ──
  const g4ni = m("g4-nina", "KOUA", "Nina", "femme", {
    generation: 4,
    pere_id: "g3-nguessan",
    village_origine: "Abidjan",
    profession: "Avocate",
    date_naissance: "1970",
  })

  const g4je = m("g4-jean", "KOUA", "Jean", "homme", {
    generation: 4,
    pere_id: "g3-nguessan",
    village_origine: "Abidjan",
    profession: "Ingénieur",
    date_naissance: "1975",
  })

  const g4ma = m("g4-marie", "KONAN", "Marie", "femme", {
    generation: 4,
    pere_id: "g3-yao",
    mere_id: "g3-amenan",
    village_origine: "Bocanda",
    profession: "Comptable",
    date_naissance: "1968",
  })

  const g4pa = m("g4-paul", "KONAN", "Paul", "homme", {
    generation: 4,
    pere_id: "g3-yao",
    mere_id: "g3-amenan",
    village_origine: "Bocanda",
    profession: "Architecte",
    date_naissance: "1972",
  })

  // ── Link relationships ──
  const all = [
    g1,
    g2ak,
    g2aka,
    g2ad,
    g2ko,
    g2ah,
    g2mo,
    g3ng,
    g3ay,
    g3yao,
    g3am,
    g3fa,
    g3ou,
    g4ni,
    g4je,
    g4ma,
    g4pa,
  ]

  const map = new Map(all.map((x) => [x.id, x]))

  // Populate enfants
  g1.enfants = [g2aka, g2ad, g2ah].map((x) => map.get(x.id)!)
  g2aka.enfants = [g3ng, g3ay].map((x) => map.get(x.id)!)
  g2ad.enfants = [g3yao, g3am].map((x) => map.get(x.id)!)
  g2ah.enfants = [g3fa, g3ou].map((x) => map.get(x.id)!)
  g3ng.enfants = [g4ni, g4je].map((x) => map.get(x.id)!)
  g3yao.enfants = [g4ma, g4pa].map((x) => map.get(x.id)!)

  // Populate conjoint
  g2aka.conjoint = map.get(g2ak.conjoint_id!)!
  g2ak.conjoint = map.get(g2aka.conjoint_id!)!
  g2ad.conjoint = map.get(g2ko.conjoint_id!)!
  g2ko.conjoint = map.get(g2ad.conjoint_id!)!
  g2ah.conjoint = map.get(g2mo.conjoint_id!)!
  g2mo.conjoint = map.get(g2ah.conjoint_id!)!
  g3yao.conjoint = map.get(g3am.conjoint_id!)!
  g3am.conjoint = map.get(g3yao.conjoint_id!)!

  // Populate pere / mere references
  for (const member of all) {
    if (member.pere_id) member.pere = map.get(member.pere_id) ?? null
    if (member.mere_id) member.mere = map.get(member.mere_id) ?? null
  }

  // Populate freresSoeurs
  for (const member of all) {
    member.freresSoeurs = all.filter(
      (x) =>
        x.id !== member.id &&
        ((x.pere_id && x.pere_id === member.pere_id) ||
          (x.mere_id && x.mere_id === member.mere_id)),
    )
  }

  return all
}

// ──────────────────────────────────────────────────
//  6.  HELPERS
// ──────────────────────────────────────────────────

function buildHierarchy(data: MembreArbreAvecParents[]): D3NodeData | null {
  const root = data.find((m) => m.generation === 1)
  if (!root) return null

  function walk(member: MembreArbreAvecParents): D3NodeData {
    const children: MembreArbreAvecParents[] =
      member.enfants?.map((c) => data.find((x) => x.id === c.id)).filter((x): x is MembreArbreAvecParents => x != null) ?? []
    return {
      id: member.id,
      member,
      children: children.length > 0 ? children.map(walk) : undefined,
    }
  }

  return walk(root)
}

function getFilteredIds(
  data: MembreArbreAvecParents[],
  search?: string,
  gen?: number | null,
): Set<string> {
  const ids = new Set<string>()

  if (!search && !gen) return ids

  const q = search?.toLowerCase().trim() ?? ""

  for (const member of data) {
    const nameMatch =
      !q ||
      `${member.prenom} ${member.nom}`.toLowerCase().includes(q) ||
      `${member.nom} ${member.prenom}`.toLowerCase().includes(q)

    const genMatch = gen == null || member.generation === gen

    if (nameMatch && genMatch) {
      // Add the member and all ancestors
      const addAncestors = (id: string) => {
        ids.add(id)
        const m = data.find((x) => x.id === id)
        if (m?.pere_id) addAncestors(m.pere_id)
        if (m?.mere_id && !ids.has(m.mere_id)) addAncestors(m.mere_id)
      }
      addAncestors(member.id)
    }
  }

  return ids
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "\u2026" : str
}

// ──────────────────────────────────────────────────
//  7.  MAIN COMPONENT
// ──────────────────────────────────────────────────

export function generateMockData(): MembreArbreAvecParents[] {
  return mock()
}

export function FamilyTree({
  members: propMembers,
  onMemberClick,
  selectedMemberId,
  filterGeneration,
  searchQuery,
}: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const d3GRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [dimensions, setDimensions] = useState({ w: 800, h: 600 })
  const [isMobile, setIsMobile] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [data, setData] = useState<MembreArbreAvecParents[]>(propMembers ?? mock())
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    member: null,
  })

  useEffect(() => {
    if (propMembers) setData(propMembers)
  }, [propMembers])

  // ── ResizeObserver ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        setDimensions({ w: Math.max(width, 300), h: Math.max(height, 300) })
        setIsMobile(width < 640)
      }
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── D3 render ──
  useEffect(() => {
    const svgEl = svgRef.current
    const container = containerRef.current
    if (!svgEl || !container || data.length === 0) return

    const hierarchy = buildHierarchy(data)
    if (!hierarchy) return

    const w = dimensions.w
    const h = dimensions.h

    // SVG setup
    const svg = d3.select(svgEl)
    svg.selectAll("*").remove()
    svg.attr("width", w).attr("height", h)

    // Defs (filters, clip paths)
    const defs = svg.append("defs")

    defs
      .append("filter")
      .attr("id", "glow")
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("stdDeviation", 4)
      .attr("flood-color", "#059669")
      .attr("flood-opacity", 0.4)

    defs
      .append("filter")
      .attr("id", "grayscale")
      .append("feColorMatrix")
      .attr("type", "saturate")
      .attr("values", "0")

    // Container group
    const g = svg.append("g").attr("class", "tree-group")

    // Compute tree layout
    const maxDepth = d3.max(data, (d) => d.generation) ?? 1
    const siblingCounts = data.reduce<Record<string, number>>((acc, m) => {
      const parentKey = m.pere_id ?? m.mere_id ?? "root"
      acc[parentKey] = (acc[parentKey] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
    const maxSiblings = Math.max(...Object.values(siblingCounts), 3)

    const treeW = Math.max(w * 2, maxSiblings * (NODE_W + HORIZ_GAP_MIN))
    const treeH = maxDepth * (NODE_H + VERT_GAP) + NODE_H

    const treeLayout = d3.tree<D3NodeData>().size([treeH, treeW]).separation((a, b) => {
      return a.parent === b.parent ? 1 : 1.8
    })

    const root = treeLayout(d3.hierarchy(hierarchy, (d) => d.children))

    // Edges ──
    const linkGroup = g.append("g").attr("class", "links")

    linkGroup
      .selectAll<SVGPathElement, d3.HierarchyPointLink<D3NodeData>>("path")
      .data(root.links())
      .join("path")
      .attr("d", (d) => {
        const sourceX = d.source.y
        const sourceY = d.source.x
        const targetX = d.target.y
        const targetY = d.target.x
        const midX = (sourceX + targetX) / 2
        return `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`
      })
      .attr("fill", "none")
      .attr("stroke", C.link)
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)

    // Marriage links (conjoint) ──
    const conjointLinks: Array<{
      source: { x: number; y: number }
      target: { x: number; y: number }
    }> = []

    for (const node of root.descendants()) {
      const member = node.data.member
      if (member.conjoint_id) {
        const conjointNode = root.descendants().find((n) => n.data.member.id === member.conjoint_id)
        if (conjointNode) {
          conjointLinks.push({
            source: { x: node.x, y: node.y },
            target: { x: conjointNode.x, y: conjointNode.y },
          })
        }
      }
    }

    linkGroup
      .selectAll<SVGLineElement, (typeof conjointLinks)[0]>("line.marriage")
      .data(conjointLinks)
      .join("line")
      .attr("class", "marriage")
      .attr("x1", (d) => d.source.y + NODE_W / 2 + 4)
      .attr("y1", (d) => d.source.x)
      .attr("x2", (d) => d.target.y - NODE_W / 2 - 4)
      .attr("y2", (d) => d.target.x)
      .attr("stroke", "#a8a29e")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,3")
      .attr("opacity", 0.7)

    // Visible IDs for search / filter
    const visibleIds = getFilteredIds(data, searchQuery, filterGeneration)
    const hasFilter = visibleIds.size > 0

    // Nodes ──
    const nodeGroups = g
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, d3.HierarchyPointNode<D3NodeData>>("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")

    // Opacity for filter
    nodeGroups.attr("opacity", (d) => {
      if (!hasFilter) return 1
      return visibleIds.has(d.data.member.id) ? 1 : 0.15
    })

    // Node rect
    nodeGroups
      .append("rect")
      .attr("width", NODE_W)
      .attr("height", NODE_H)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", C.nodeBg)
      .attr(
        "stroke",
        (d) =>
          (d.data.member.id === selectedMemberId ? C.nodeBorderSelected : C.nodeBorder) as string,
      )
      .attr("stroke-width", (d) => (d.data.member.id === selectedMemberId ? 3 : 2) as number)
      .style(
        "filter",
        (d) =>
          (d.data.member.id === selectedMemberId ? "url(#glow)" : "none") as string,
      )

    // Photo clip path
    nodeGroups.append("clipPath").attr("id", (d) => `clip-${d.data.member.id}`).append("circle")
      .attr("cx", PHOTO_CX)
      .attr("cy", PHOTO_CY)
      .attr("r", PHOTO_R)

    // Photo or fallback
    nodeGroups
      .append("image")
      .attr("x", PHOTO_CX - PHOTO_R)
      .attr("y", PHOTO_CY - PHOTO_R)
      .attr("width", PHOTO_R * 2)
      .attr("height", PHOTO_R * 2)
      .attr("clip-path", (d) => `url(#clip-${d.data.member.id})`)
      .attr("href", (d) => d.data.member.photo_url ?? "")
      .attr("opacity", (d) => (d.data.member.photo_url ? 1 : 0) as number)
      .attr("preserveAspectRatio", "xMidYMid slice")

    // Fallback circle (when no photo)
    nodeGroups
      .filter((d) => !d.data.member.photo_url)
      .append("circle")
      .attr("cx", PHOTO_CX)
      .attr("cy", PHOTO_CY)
      .attr("r", PHOTO_R)
      .attr("fill", C.fallbackBg)
      .attr(
        "stroke",
        (d) => {
          if (d.data.member.sexe === "femme") return C.femaleTint
          if (d.data.member.sexe === "homme") return C.maleTint
          return C.nodeBorder
        },
      )
      .attr("stroke-width", 2)

    // Fallback initials
    nodeGroups
      .filter((d) => !d.data.member.photo_url)
      .append("text")
      .attr("x", PHOTO_CX)
      .attr("y", PHOTO_CY + 5)
      .attr("text-anchor", "middle")
      .attr("fill", C.fallbackText)
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("font-family", "inherit")
      .text(
        (d) =>
          `${d.data.member.prenom.charAt(0)}${d.data.member.nom.charAt(0)}`,
      )

    // Deceased overlay on photo
    nodeGroups
      .filter((d) => d.data.member.statut === "decede" && !d.data.member.photo_url)
      .append("line")
      .attr("x1", PHOTO_CX - PHOTO_R)
      .attr("y1", PHOTO_CY - PHOTO_R)
      .attr("x2", PHOTO_CX + PHOTO_R)
      .attr("y2", PHOTO_CY + PHOTO_R)
      .attr("stroke", C.deceased)
      .attr("stroke-width", 2)

    nodeGroups
      .filter((d) => d.data.member.statut === "decede" && !d.data.member.photo_url)
      .append("line")
      .attr("x1", PHOTO_CX + PHOTO_R)
      .attr("y1", PHOTO_CY - PHOTO_R)
      .attr("x2", PHOTO_CX - PHOTO_R)
      .attr("y2", PHOTO_CY + PHOTO_R)
      .attr("stroke", C.deceased)
      .attr("stroke-width", 2)

    // Name
    nodeGroups
      .append("text")
      .attr("x", 56)
      .attr("y", 26)
      .attr("fill", C.textPrimary)
      .attr("font-size", (d) => (isMobile ? 10 : 12) as number)
      .attr("font-weight", 600)
      .attr("font-family", "inherit")
      .text((d) => truncate(`${d.data.member.prenom} ${d.data.member.nom}`, isMobile ? 14 : 18))

    // Generation badge background
    nodeGroups
      .append("rect")
      .attr("x", 56)
      .attr("y", 34)
      .attr("width", 50)
      .attr("height", 18)
      .attr("rx", 9)
      .attr("ry", 9)
      .attr("fill", C.badgeBg)
      .attr("stroke", C.badgeStroke)
      .attr("stroke-width", 0.5)

    // Generation badge text
    nodeGroups
      .append("text")
      .attr("x", 81)
      .attr("y", 46)
      .attr("text-anchor", "middle")
      .attr("fill", C.badgeText)
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("font-family", "inherit")
      .text((d) => `G${d.data.member.generation}`)

    // Deceased badge
    nodeGroups
      .filter((d) => d.data.member.statut === "decede")
      .append("text")
      .attr("x", NODE_W - 10)
      .attr("y", 18)
      .attr("text-anchor", "end")
      .attr("fill", C.deceased)
      .attr("font-size", 14)
      .attr("font-weight", "bold")
      .attr("font-family", "inherit")
      .text("\u271D")

    // Deceased label under generation badge
    nodeGroups
      .filter((d) => d.data.member.statut === "decede")
      .append("text")
      .attr("x", 56)
      .attr("y", 62)
      .attr("fill", C.deceased)
      .attr("font-size", 8)
      .attr("font-weight", 500)
      .attr("font-family", "inherit")
      .text("D\u00E9c\u00E9d\u00E9(e)")

    // Sex indicator dot on photo
    nodeGroups
      .filter((d) => !!d.data.member.photo_url)
      .append("circle")
      .attr("cx", PHOTO_CX + PHOTO_R - 3)
      .attr("cy", PHOTO_CY + PHOTO_R - 3)
      .attr("r", 5)
      .attr("fill", (d) =>
        d.data.member.sexe === "femme" ? C.femaleTint : C.maleTint,
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)

    // Interaction events
    nodeGroups
      .on("click", (_event, d) => {
        onMemberClick?.(d.data.member.id)
      })
      .on("mouseenter", function (event, d) {
        d3.select(this).select("rect").attr("stroke-width", 3)

        const rect = container.getBoundingClientRect()
        const cx = event.clientX - rect.left
        const cy = event.clientY - rect.top

        setTooltip({
          visible: true,
          x: cx,
          y: cy,
          member: d.data.member,
        })
      })
      .on("mousemove", function (event) {
        const rect = container.getBoundingClientRect()
        setTooltip((prev) =>
          prev.visible
            ? {
                ...prev,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
            : prev,
        )
      })
      .on("mouseleave", function () {
        d3.select(this).select("rect").attr("stroke-width", (d: unknown) => {
          const nd = d as d3.HierarchyPointNode<D3NodeData>
          return nd.data.member.id === selectedMemberId ? 3 : 2
        })

        setTooltip({ visible: false, x: 0, y: 0, member: null })
      })

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .extent([
        [0, 0],
        [w, h],
      ])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString())
        setZoomLevel(event.transform.k)
      })

    zoomRef.current = zoom
    svg.call(zoom)

    // Initial transform to center tree
    const x0 = d3.min(root.descendants(), (d) => d.y) ?? 0
    const x1 = d3.max(root.descendants(), (d) => d.y) ?? treeW
    const y0 = d3.min(root.descendants(), (d) => d.x) ?? 0
    const y1 = d3.max(root.descendants(), (d) => d.x) ?? treeH

    const tw = x1 - x0 + NODE_W + 60
    const th = y1 - y0 + NODE_H + 60

    const scale = Math.min(w / tw, h / th, 1.2)
    const tx = w / 2 - ((x0 + x1) / 2) * scale
    const ty = h / 2 - ((y0 + y1) / 2) * scale

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(tx, ty).scale(scale),
    )

    // Cleanup
    return () => {
      svg.on(".zoom", null)
    }
  }, [data, dimensions, filterGeneration, searchQuery, selectedMemberId, isMobile, onMemberClick])

  // ── Zoom controls ──
  const handleZoomIn = useCallback(() => {
    const svg = svgRef.current
    const zoom = zoomRef.current
    if (!svg || !zoom) return
    d3.select(svg).transition().duration(300).call(zoom.scaleBy, 1.35)
  }, [])

  const handleZoomOut = useCallback(() => {
    const svg = svgRef.current
    const zoom = zoomRef.current
    if (!svg || !zoom) return
    d3.select(svg).transition().duration(300).call(zoom.scaleBy, 1 / 1.35)
  }, [])

  const handleZoomReset = useCallback(() => {
    const svg = svgRef.current
    const zoom = zoomRef.current
    if (!svg || !zoom) return
    d3.select(svg).call(zoom.transform, d3.zoomIdentity)
  }, [])

  // ── Render ──
  const showEmpty = data.length === 0

  return (
    <TreeErrorBoundary>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
      >
        {showEmpty ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <svg
              className="mb-4 h-16 w-16 text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-lg font-semibold text-zinc-400">
              Aucun membre &agrave; afficher
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Ajoutez des membres pour voir l&apos;arbre g&eacute;n&eacute;alogique.
            </p>
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              className="block"
              style={{ width: "100%", height: "100%" }}
            />

            {/* Tooltip */}
            <AnimatePresence>
              {tooltip.visible && tooltip.member && (
                <motion.div
                  ref={tooltipRef}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute z-50 rounded-lg border border-zinc-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur"
                  style={{
                    left: Math.min(tooltip.x + 14, dimensions.w - 180),
                    top: Math.max(tooltip.y - 40, 8),
                  }}
                >
                  <p className="whitespace-nowrap text-sm font-semibold text-zinc-800">
                    {tooltip.member.prenom} {tooltip.member.nom}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    G&eacute;n&eacute;ration {tooltip.member.generation}
                    {tooltip.member.statut === "decede" && (
                      <span className="ml-2 text-red-500">&#10013; D&eacute;c&eacute;d&eacute;(e)</span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zoom controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute right-4 top-4 flex flex-col gap-1"
            >
              <button
                onClick={handleZoomIn}
                aria-label="Zoom avant"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold",
                  "border border-zinc-200/60 bg-white/70 text-zinc-700",
                  "shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md",
                  "active:scale-95",
                )}
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                aria-label="Zoom arrière"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold",
                  "border border-zinc-200/60 bg-white/70 text-zinc-700",
                  "shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md",
                  "active:scale-95",
                )}
              >
                &minus;
              </button>
              <button
                onClick={handleZoomReset}
                aria-label="Réinitialiser le zoom"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold",
                  "border border-zinc-200/60 bg-white/70 text-zinc-500",
                  "shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md",
                  "active:scale-95",
                )}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <div className="mt-1 text-center text-[10px] font-medium text-zinc-400">
                {Math.round(zoomLevel * 100)}%
              </div>
            </motion.div>

            {/* Mobile hint */}
            <AnimatePresence>
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/70 px-4 py-1.5 text-xs text-white backdrop-blur"
                >
                  Utilisez deux doigts pour naviguer
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </TreeErrorBoundary>
  )
}

export default FamilyTree
