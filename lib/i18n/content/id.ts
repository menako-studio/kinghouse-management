// Indonesian translations of English-authored page copy, keyed by the English
// source text. Split by page so each file stays reviewable.

import { common } from "./id/common"
import { owner } from "./id/owner"
import { home } from "./id/home"
import { villas } from "./id/villas"
import { events } from "./id/events"
import { eventPackages } from "./id/event-packages"
import { areas } from "./id/areas"
import { villaDetail } from "./id/villa-detail"
import { pages } from "./id/pages"

export const ID_CONTENT: Record<string, string> = {
  ...common,
  ...owner,
  ...home,
  ...villas,
  ...events,
  ...eventPackages,
  ...areas,
  ...villaDetail,
  ...pages,
}
