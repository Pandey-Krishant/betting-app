"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-green-500" />
        ),
        info: (
          <InfoIcon className="size-5 text-blue-500" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-yellow-500" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-orange-500" />
        ),
      }}
      style={
        {
          "--normal-bg": "#1a1a1a",
          "--normal-text": "#ffffff",
          "--normal-border": "#333333",
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !bg-[#1a1a1a] !text-white !border !border-[#333] !rounded-lg",
          description: "text-gray-300 text-sm",
          actionButton: "bg-orange-500 text-black font-bold",
          cancelButton: "bg-gray-700 text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
