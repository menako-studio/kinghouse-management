"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react"

export type AlertCategory = "blog" | "booking" | "expense" | "seo" | "system" | "sync"
export type ToastType = "success" | "info" | "warning" | "error"

export interface SystemAlert {
  id: string
  title: string
  message: string
  category: AlertCategory
  timestamp: string
  timeAgo: string
  isRead: boolean
  actionUrl?: string
}

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface NotificationContextType {
  alerts: SystemAlert[]
  unreadCount: number
  addAlert: (alert: {
    title: string
    message: string
    category: AlertCategory
    actionUrl?: string
  }) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAlert: (id: string) => void
  clearAllAlerts: () => void
  showToast: (title: string, message?: string, type?: ToastType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = "kinghouse_system_alerts_v1"

const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: "alert-1",
    title: "Dynamic Pricing Calibrated",
    message: "Jagakarsa 5BR Villa weekend pricing updated based on South Jakarta market surge.",
    category: "system",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timeAgo: "10m ago",
    isRead: false,
    actionUrl: "/dashboard/properties",
  },
  {
    id: "alert-2",
    title: "Airbnb iCal Synced",
    message: "All 4 Jabodetabek listing calendars synced with 0 conflicts detected.",
    category: "sync",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    timeAgo: "1h ago",
    isRead: false,
    actionUrl: "/dashboard/bookings",
  },
  {
    id: "alert-3",
    title: "SEO Performance Pitch Ready",
    message: "Audit scores computed: 96% SEO health across current active listings.",
    category: "seo",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    timeAgo: "3h ago",
    isRead: false,
    actionUrl: "/dashboard/seo",
  },
]

function formatTimeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Baru saja"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((a: SystemAlert) => ({
            ...a,
            timeAgo: formatTimeAgo(a.timestamp),
          }))
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAlerts(updated)
        }
      }
    } catch {
      // ignore JSON error
    }
    setIsHydrated(true)
  }, [])

  // Sync to localStorage whenever alerts change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
      } catch {
        // ignore storage quota error
      }
    }
  }, [alerts, isHydrated])

  const unreadCount = alerts.filter((a) => !a.isRead).length

  const showToast = (title: string, message?: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastItem = { id, title, message, type }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  const addAlert = ({
    title,
    message,
    category,
    actionUrl,
  }: {
    title: string
    message: string
    category: AlertCategory
    actionUrl?: string
  }) => {
    const now = new Date().toISOString()
    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      category,
      timestamp: now,
      timeAgo: "Baru saja",
      isRead: false,
      actionUrl,
    }

    setAlerts((prev) => [newAlert, ...prev])
  }

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))
    showToast("Semua Notifikasi Ditandai Dibaca", undefined, "info")
  }

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const clearAllAlerts = () => {
    setAlerts([])
    showToast("Semua Notifikasi Dibersihkan", undefined, "info")
  }

  return (
    <NotificationContext.Provider
      value={{
        alerts,
        unreadCount,
        addAlert,
        markAsRead,
        markAllAsRead,
        clearAlert,
        clearAllAlerts,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Floating In-App Toast Container
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        let borderColor = "border-emerald-200"
        const bgColor = "bg-white"

        if (toast.type === "error") {
          icon = <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          borderColor = "border-rose-200"
        } else if (toast.type === "warning") {
          icon = <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          borderColor = "border-amber-200"
        } else if (toast.type === "info") {
          icon = <Info className="h-5 w-5 text-[#B8934C] flex-shrink-0" />
          borderColor = "border-[#E8E4DC]"
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl ${bgColor} border ${borderColor} shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex items-start space-x-3 animate-kh-sheet`}
          >
            {icon}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-[#222225] leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-[#717171] mt-0.5 leading-relaxed font-light">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-[#717171] hover:text-[#222225] rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
