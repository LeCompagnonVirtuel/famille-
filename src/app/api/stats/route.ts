import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      membres: "150+",
      generations: "5",
      evenementsAn: "50+",
      famille: "100%",
    })
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  try {
    const [profilesRes, generationsRes, evenementsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("est_admin_valide", true),
      supabase
        .from("membre_arbre")
        .select("generation", { count: "exact", head: true })
        .order("generation", { ascending: false })
        .limit(1),
      supabase
        .from("evenements")
        .select("id", { count: "exact", head: true })
        .gte("date_debut", `${new Date().getFullYear()}-01-01`),
    ])

    let maxGeneration = 0
    if (generationsRes.data && generationsRes.data.length > 0) {
      const genRes = await supabase
        .from("membre_arbre")
        .select("generation")
        .order("generation", { ascending: false })
        .limit(1)
        .single()
      if (genRes.data) maxGeneration = genRes.data.generation
    }

    const membres = profilesRes.count ?? 0
    const generations = maxGeneration
    const evenementsAn = evenementsRes.count ?? 0

    return NextResponse.json({
      membres: membres > 0 ? `${membres}` : "0",
      generations: generations > 0 ? `${generations}` : "0",
      evenementsAn: evenementsAn > 0 ? `${evenementsAn}+` : "0",
      famille: "100%",
    })
  } catch {
    return NextResponse.json({
      membres: "150+",
      generations: "5",
      evenementsAn: "50+",
      famille: "100%",
    })
  }
}
