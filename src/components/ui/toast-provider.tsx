"use client"

import * as React from "react"
import { Toaster as HotToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "white",
          color: "#18181b",
          border: "1px solid #e4e4e7",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: {
            primary: "#065f46",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "white",
          },
        },
      }}
    />
  )
}

export { toast } from "react-hot-toast"
