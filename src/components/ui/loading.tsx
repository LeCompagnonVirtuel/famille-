"use client"

import { motion } from "framer-motion"

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-16 w-16 rounded-full border-4 border-zinc-200"
          style={{ borderTopColor: "#065f46", borderRightColor: "#d97706" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute flex items-center justify-center">
          <motion.div
            className="h-8 w-8 rounded-full"
            style={{
              background: "linear-gradient(135deg, #065f46 50%, #d97706 50%)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
      <motion.p
        className="mt-4 text-sm font-medium text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Chargement...
      </motion.p>
    </div>
  )
}
