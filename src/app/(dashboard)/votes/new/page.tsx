"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Loader2, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const createVoteSchema = z.object({
  titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  options: z
    .array(
      z.object({
        label: z.string().min(1, "Le libellé est requis"),
      })
    )
    .min(2, "Ajoutez au moins 2 options"),
})

type CreateVoteFormData = z.infer<typeof createVoteSchema>

export default function NewVotePage() {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateVoteFormData>({
    resolver: zodResolver(createVoteSchema),
    defaultValues: {
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      options: [{ label: "" }, { label: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  const values = watch()

  const onSubmit = async (_data: CreateVoteFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/votes")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/votes" className="hover:text-emerald-800">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/votes" className="hover:text-emerald-800">
          Votes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900">Nouveau scrutin</span>
      </nav>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-800">Créer un scrutin</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouveau vote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre du scrutin</Label>
                <Input
                  id="titre"
                  placeholder="Ex: Élection du président"
                  {...register("titre")}
                />
                {errors.titre && (
                  <p className="text-sm text-red-500">{errors.titre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'objet du vote..."
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_debut">Date de début</Label>
                  <Input
                    id="date_debut"
                    type="date"
                    {...register("date_debut")}
                  />
                  {errors.date_debut && (
                    <p className="text-sm text-red-500">
                      {errors.date_debut.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_fin">Date de fin</Label>
                  <Input
                    id="date_fin"
                    type="date"
                    {...register("date_fin")}
                  />
                  {errors.date_fin && (
                    <p className="text-sm text-red-500">
                      {errors.date_fin.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Options de vote</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ label: "" })}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Ajouter une option
                </Button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`option-${index}`}>
                        Option {index + 1}
                      </Label>
                      <Input
                        id={`option-${index}`}
                        placeholder="Libellé de l'option"
                        {...register(`options.${index}.label`)}
                      />
                      {errors.options?.[index]?.label && (
                        <p className="text-sm text-red-500">
                          {errors.options[index]?.label?.message}
                        </p>
                      )}
                    </div>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mb-0.5 h-10 w-10 text-red-500 hover:text-red-700"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.options && !Array.isArray(errors.options) && (
                <p className="text-sm text-red-500">{errors.options.message}</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
              <div className="text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">Récapitulatif</span>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  <li>{values.titre || "Titre non défini"}</li>
                  <li>
                    {values.options.filter((o) => o.label).length} option
                    {values.options.filter((o) => o.label).length > 1 ? "s" : ""}
                  </li>
                  <li>
                    {values.date_debut && values.date_fin
                      ? `Du ${values.date_debut} au ${values.date_fin}`
                      : "Dates non définies"}
                  </li>
                </ul>
              </div>
              <Button
                type="submit"
                variant="gold"
                disabled={
                  isSubmitting ||
                  !values.titre ||
                  !values.description ||
                  !values.date_debut ||
                  !values.date_fin ||
                  values.options.filter((o) => o.label).length < 2
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer le scrutin"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
