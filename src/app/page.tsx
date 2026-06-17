"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Shield,
  Wallet,
  Megaphone,
  Calendar,
  Vote,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Crown,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const features = [
  {
    icon: Megaphone,
    title: "Annonces",
    description: "Restez informé des dernières nouvelles de la famille",
  },
  {
    icon: Wallet,
    title: "Trésorerie",
    description: "Gérez vos cotisations et suivez les finances",
  },
  {
    icon: Vote,
    title: "Votes",
    description: "Participez aux décisions importantes",
  },
  {
    icon: MessageSquare,
    title: "Partage d'idées",
    description: "Échangez et discutez avec les membres",
  },
  {
    icon: Calendar,
    title: "Événements",
    description: "Ne manquez aucun événement familial",
  },
  {
    icon: Users,
    title: "Annuaire",
    description: "Retrouvez tous les membres de la famille",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-emerald-900 text-lg">
                Famille KOUA NANGOIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 hover:text-emerald-800 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} >
              <div className="inline-flex items-center gap-2 bg-amber-600/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Crown className="w-4 h-4" />
                Bienvenue sur la plateforme familiale
              </div>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Groupe Famille{" "}
              <span className="text-amber-500">KOUA NANGOIN</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              
              className="text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              La plateforme numérique dédiée à la gestion et au renforcement des
              liens de notre grande famille. Ensemble, restons connectés.
            </motion.p>
            <motion.div
              variants={itemVariants}
              
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25"
              >
                Rejoindre la famille
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Se connecter
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              
              className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4"
            >
              Tout ce dont vous avez besoin
            </motion.h2>
            <motion.p
              variants={itemVariants}
              
              className="text-lg text-stone-600 max-w-2xl mx-auto"
            >
              Une plateforme complète pour gérer tous les aspects de la vie
              familiale
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                
                className="group bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-lg hover:border-emerald-200 transition-all"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-800" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "150+", label: "Membres" },
              { number: "5", label: "Générations" },
              { number: "50+", label: "Événements/An" },
              { number: "100%", label: "Famille" },
            ].map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} >
                <div className="text-3xl sm:text-4xl font-bold text-amber-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-emerald-100/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              
              className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4"
            >
              Prêt à rejoindre l&apos;aventure ?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              
              className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto"
            >
              Créez votre compte et commencez à participer à la vie de la
              famille KOUA NANGOIN
            </motion.p>
            <motion.div variants={itemVariants} >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-emerald-800 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-emerald-900 transition-all shadow-lg"
              >
                Créer mon compte
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-white text-lg">
              Famille KOUA NANGOIN
            </span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Groupe Famille KOUA NANGOIN. Tous
            droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}



