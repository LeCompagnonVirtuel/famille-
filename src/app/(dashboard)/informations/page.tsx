"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Download,
  Phone,
  Mail,
  ScrollText,
  BookOpen,
  PhoneCall,
  FileArchive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Contact {
  id: string
  name: string
  role: string
  phone: string
  email: string
}

interface Document {
  id: string
  title: string
  description: string
  file: string
}

const SECTIONS = [
  { value: "historique", label: "Historique", icon: BookOpen },
  { value: "reglement", label: "Règlement", icon: ScrollText },
  { value: "contacts", label: "Contacts", icon: PhoneCall },
  { value: "documents", label: "Documents", icon: FileArchive },
]

const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "Koua Nangoin Pierre", role: "Président", phone: "+225 01 02 03 04 05", email: "pierre.koua@famille.ci" },
  { id: "2", name: "Koua Nangoin Marie", role: "Secrétaire générale", phone: "+225 05 06 07 08 09", email: "marie.koua@famille.ci" },
  { id: "3", name: "Koua Nangoin Joseph", role: "Trésorier", phone: "+225 03 04 05 06 07", email: "joseph.koua@famille.ci" },
  { id: "4", name: "Koua Nangoin Awa", role: "Conseillère", phone: "+225 07 08 09 10 11", email: "awa.koua@famille.ci" },
  { id: "5", name: "Koua Nangoin Paul", role: "Vice-président", phone: "+225 02 03 04 05 06", email: "paul.koua@famille.ci" },
]

const MOCK_DOCUMENTS: Document[] = [
  { id: "1", title: "Acte de naissance - Koua Nangoin Aka", description: "Acte de naissance original numérisé", file: "/documents/acte-naissance-aka.pdf" },
  { id: "2", title: "Acte de mariage - Pierre et Marie", description: "Acte de mariage signé à la mairie centrale", file: "/documents/acte-mariage-pierre-marie.pdf" },
  { id: "3", title: "Recensement familial 2026", description: "Liste complète des membres de la famille", file: "/documents/recensement-2026.pdf" },
  { id: "4", title: "Statuts de l'association familiale", description: "Statuts officiels déposés en préfecture", file: "/documents/statuts-association.pdf" },
  { id: "5", title: "Procès-verbal AG 2025", description: "Compte rendu de l'assemblée générale annuelle", file: "/documents/pv-ag-2025.pdf" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function InformationsPage() {
  const [activeTab, setActiveTab] = useState("historique")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">Informations</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="gap-2">
              <s.icon className="h-4 w-4" />
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="historique">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="prose prose-zinc max-w-none p-6">
                  <h3 className="text-xl font-semibold text-emerald-800">
                    Les origines de la famille Koua Nangoin
                  </h3>
                  <p>
                    La famille Koua Nangoin puise ses racines dans le village ancestral situé dans
                    la région de la Marahoué, au centre-ouest de la Côte d&apos;Ivoire. Fondée il y a
                    plusieurs générations par le patriarche Koua Nangoin Aka, elle s&apos;est
                    progressivement étendue à travers le pays et au-delà des frontières.
                  </p>
                  <p>
                    Le nom &quot;Koua Nangoin&quot; signifie littéralement &quot;celui qui rassemble les siens&quot;
                    dans le dialecte local. Cette étymologie reflète la valeur fondamentale qui
                    anime la famille : l&apos;unité et la solidarité entre ses membres.
                  </p>
                  <p>
                    Au fil des décennies, la famille a su préserver ses traditions tout en
                    s&apos;adaptant à la modernité. Les valeurs de respect, d&apos;entraide et de transmission
                    du savoir restent au cœur de l&apos;identité familiale.
                  </p>
                  <h4 className="font-semibold text-emerald-700">Dates clés</h4>
                  <ul>
                    <li><strong>1905</strong> — Naissance du patriarche Koua Nangoin Aka</li>
                    <li><strong>1930</strong> — Fondation du village familial</li>
                    <li><strong>1950</strong> — Création de l&apos;association familiale</li>
                    <li><strong>1980</strong> — Construction de la maison familiale</li>
                    <li><strong>2000</strong> — Première réunion familiale officielle</li>
                    <li><strong>2020</strong> — Lancement de la plateforme numérique familiale</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="reglement">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <CardTitle className="text-emerald-800">Règlement intérieur</CardTitle>
                      <p className="mt-1 text-sm text-zinc-500">
                        Version 2026 — Approuvé en assemblée générale du 15 mai 2026
                      </p>
                    </div>
                    <Button variant="gold">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger (PDF)
                    </Button>
                  </div>
                  <div className="space-y-4 text-sm text-zinc-700">
                    <h4 className="font-semibold text-emerald-700">Titre I : Dispositions générales</h4>
                    <p>
                      <strong>Article 1 :</strong> La famille Koua Nangoin est une communauté de personnes
                      unies par les liens du sang, de l&apos;alliance ou de l&apos;adoption, vivant sous
                      les principes de respect mutuel, de solidarité et d&apos;entraide.
                    </p>
                    <p>
                      <strong>Article 2 :</strong> Le présent règlement intérieur a pour objet de définir
                      les règles de fonctionnement et d&apos;organisation de la vie familiale.
                    </p>
                    <h4 className="font-semibold text-emerald-700">Titre II : Droits et devoirs</h4>
                    <p>
                      <strong>Article 3 :</strong> Tout membre de la famille a le droit de participer aux
                      réunions familiales et d&apos;exprimer son opinion dans le respect des autres.
                    </p>
                    <p>
                      <strong>Article 4 :</strong> Chaque membre s&apos;engage à contribuer au bon
                      fonctionnement de la communauté selon ses moyens.
                    </p>
                    <h4 className="font-semibold text-emerald-700">Titre III : Organisation</h4>
                    <p>
                      <strong>Article 5 :</strong> Le bureau exécutif est composé d&apos;un président,
                      d&apos;un vice-président, d&apos;un secrétaire général et d&apos;un trésorier.
                    </p>
                    <p>
                      <strong>Article 6 :</strong> L&apos;assemblée générale se tient une fois par an,
                      au mois d&apos;août, au village familial.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="contacts">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {MOCK_CONTACTS.map((contact) => (
              <motion.div key={contact.id} variants={itemVariants}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-zinc-900">{contact.name}</h3>
                      <p className="text-sm text-zinc-500">{contact.role}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1 text-emerald-700 hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {contact.phone}
                        </a>
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 text-emerald-700 hover:underline"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="documents">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {MOCK_DOCUMENTS.map((doc) => (
              <motion.div key={doc.id} variants={itemVariants}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-zinc-900">{doc.title}</h3>
                      <p className="text-sm text-zinc-500">{doc.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.file} download>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
