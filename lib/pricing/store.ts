import { DatePriceOverride, PricingRuleConfig } from "./types"

// Global in-memory cache for pricing overrides and customized rules
declare global {
  var __kinghouse_pricing_overrides: Map<string, DatePriceOverride> | undefined
  var __kinghouse_pricing_rules: Map<string, Partial<PricingRuleConfig>> | undefined
}

function getOverrideKey(propertySlug: string, date: string): string {
  return `${propertySlug}:${date}`
}

export function getPriceOverridesStore(): Map<string, DatePriceOverride> {
  if (!globalThis.__kinghouse_pricing_overrides) {
    globalThis.__kinghouse_pricing_overrides = new Map<string, DatePriceOverride>()
  }
  return globalThis.__kinghouse_pricing_overrides
}

export function getPriceOverride(propertySlug: string, date: string): DatePriceOverride | undefined {
  const store = getPriceOverridesStore()
  return store.get(getOverrideKey(propertySlug, date))
}

export function setPriceOverride(override: DatePriceOverride): void {
  const store = getPriceOverridesStore()
  store.set(getOverrideKey(override.propertySlug, override.date), override)
}

export function removePriceOverride(propertySlug: string, date: string): boolean {
  const store = getPriceOverridesStore()
  return store.delete(getOverrideKey(propertySlug, date))
}

export function getPropertyOverrides(propertySlug: string): DatePriceOverride[] {
  const store = getPriceOverridesStore()
  const results: DatePriceOverride[] = []
  store.forEach((val) => {
    if (val.propertySlug === propertySlug) {
      results.push(val)
    }
  })
  return results
}

export function getPricingRulesStore(): Map<string, Partial<PricingRuleConfig>> {
  if (!globalThis.__kinghouse_pricing_rules) {
    globalThis.__kinghouse_pricing_rules = new Map<string, Partial<PricingRuleConfig>>()
  }
  return globalThis.__kinghouse_pricing_rules
}

export function getPropertyRuleOverrides(propertySlug: string): Partial<PricingRuleConfig> | undefined {
  const store = getPricingRulesStore()
  return store.get(propertySlug)
}

export function setPropertyRuleOverrides(propertySlug: string, rules: Partial<PricingRuleConfig>): void {
  const store = getPricingRulesStore()
  const current = store.get(propertySlug) || {}
  store.set(propertySlug, { ...current, ...rules })
}
