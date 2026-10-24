import type { FunnelKey } from "./en"

/** Every language must translate every funnel key — enforced at compile time. */
export type FunnelDictionary = Record<FunnelKey, string>
