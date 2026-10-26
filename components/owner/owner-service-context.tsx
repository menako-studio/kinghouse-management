"use client"

import { createContext, useContext, useState } from "react"
import type { OwnerServiceChoice } from "@/lib/funnel/config"

interface OwnerServiceState {
  service: OwnerServiceChoice
  setService: (service: OwnerServiceChoice) => void
}

const OwnerServiceContext = createContext<OwnerServiceState | null>(null)

/**
 * Shares the service picked on a card with the owner form further down the
 * page, so the owner never has to choose it twice.
 */
export function OwnerServiceProvider({
  children,
  initialService = "undecided",
}: {
  children: React.ReactNode
  initialService?: OwnerServiceChoice
}) {
  const [service, setService] = useState<OwnerServiceChoice>(initialService)
  return <OwnerServiceContext.Provider value={{ service, setService }}>{children}</OwnerServiceContext.Provider>
}

/** Falls back to local state when the form is used outside a provider. */
export function useOwnerService(): OwnerServiceState {
  const shared = useContext(OwnerServiceContext)
  const [service, setService] = useState<OwnerServiceChoice>("undecided")
  return shared ?? { service, setService }
}
