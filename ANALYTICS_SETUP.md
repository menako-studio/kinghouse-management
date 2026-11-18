# GA4 / GTM setup after the website-recommendations work

The code half is in the repo. These steps must be done once in the Google UIs
(they cannot be done from code). Verify each in **GA4 → Admin → DebugView**.

## 1. Keep the CMS out of GA4 (Kritis)
Code: `components/analytics/analytics-gate.tsx` does not render GA/GTM on
`/login` and `/dashboard/*`, sets `window['ga-disable-<ID>']`, and pushes
`{ cms_route: true }` to the dataLayer when someone navigates into the CMS.

GTM (belt and braces):
1. Variables → New → *Data Layer Variable* `cms_route`.
2. Triggers → New → *Custom Event*… or *Page View*, condition
   `Page Path` matches RegEx `^/(login|dashboard)` → name it `CMS routes`.
3. Open the GA4 tag(s) → *Advanced settings → Exceptions* → add `CMS routes`.
4. GA4 → Admin → Data streams → Configure tag settings → *Define internal
   traffic* + a Data filter (Internal Traffic) for office IPs.

## 2. page_view
The site sends exactly one `page_view` per route (`PageViewTracker`, after the
route title has updated). The GA4 config tag in GTM must NOT also send a
page_view on the same load: in the GTM GA4 Configuration tag set
*Send a page view event when this configuration loads* = off, **or** remove the
gtag.js direct snippet. Run only one of the two. Check in DebugView that a
navigation produces one `page_view` with the right `page_title`.

## 3. Events
| Event | Fired by | Key event |
|---|---|---|
| `generate_lead` | any form submit (owner / event / stay) | yes |
| `click_whatsapp` | every WhatsApp CTA (chooser) | yes |
| `click_phone` | `trackPhoneCall()` (no `tel:` link exists on the site yet) | yes |
| `booking_request` | booking channel modal | yes |
| `calculator_open` | owner calculator scrolls into view | no |
| `cta_owner_click` | owner hero CTA, header "Owner Services" | no |

Legacy events (`whatsapp_click`, `phone_call_click`, `booking_inquiry`,
`owner_lead_submit`, `submit_*_form`) still fire for continuity but must NOT be
key events. They can be removed from `lib/analytics.ts` after 1-2 months.

GA4 → Admin → Events: mark only the four above as key events and un-mark the
rest (46 → 4).

## 4. Custom dimensions (Admin → Custom definitions → Create, scope: Event)
- `villa_name`  (event parameter `villa_name`)
- `service_type` (event parameter `service_type`; values: guest, owner, wedding, event)

## 5. UTM
`LeadSourceCapture` stores utm_source / utm_medium / utm_campaign in the
session and attaches them to every lead. Use one format everywhere, e.g.
`?utm_source=instagram&utm_medium=social&utm_campaign=villa_privatepool`.
