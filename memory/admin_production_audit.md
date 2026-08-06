# Admin Production Audit & Feature Map

Last updated: August 2026 — production maturity initiative.

## Canonical business flow

```
Itinerary (draft → final)
  → Invoice (draft → confirmed/partial/paid)
    → Booking / Operations (guides, transport, hotels, passports, permits)
      → Payments & documents
```

Public marketing content is edited only from admin (Frontend / Hero / Tours / Blog). Public layout/visual design is finalized and must not be redesigned — only content and brand color tokens.

## Feature inventory

| Area | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboard | `/admin/dashboard` | Working | Stats + recent bookings |
| Frontend CMS | `/admin/frontend` | Wired | settings JSONB keys |
| Hero | `/admin/hero` | Working | `settings.hero_slides` |
| Tours | `/admin/tours` | Working | CRUD + gallery |
| Categories | `/admin/tour-categories` | Working | Homepage cards |
| Blog | `/admin/blog` | TipTap HTML editor | Renders as HTML on public |
| Itineraries | `/admin/itineraries` | Working | Full PDF/HTML builder |
| Invoices | `/admin/invoices` | Working | From itinerary; `invoice_data` JSONB |
| Operations | `/admin/operations` | Working | Assignments via `?bookingId=` |
| Settings | `/admin/settings` | Working | Company, users, theme |
| CMS alt | `/admin/cms` | Legacy | Prefer Frontend (`settings`) |

## Settings keys (public site)

- `hero_slides`, `tour_categories`
- `homepage_*` (founder, trust, reviews, journeys, cinematic, faq, concierge_form, bento)
- `about_page_story`, `about_page_team`, `about_page_credentials`, `about_page_timeline`
- `concierge_page_hero`, `concierge_page_process`, `concierge_page_services`, `concierge_page_form`
- `footer_content`, `nav_content`, `theme_tokens`, `bank_details`

## Auth

- Middleware: any authenticated user for `/admin/*` except login
- Settings (users/theme): `admin` or `account_staff` as configured
- APIs under `/api/admin/*` and `/api/operations/*` use server Supabase client

## Fixed loopholes (this initiative)

1. Invoice APIs moved to `/api/admin/invoices` with server client + `invoice_data` schema
2. Ops assignment fetches use `?bookingId=`
3. `/admin` redirects to dashboard
4. Itinerary row Edit → `/edit`
5. Sidebar includes Invoices, Operations, Settings
6. Middleware writes refreshed auth cookies
7. About / Concierge / Footer / Nav consume settings with hardcoded fallbacks
8. Blog TipTap (Docs-style) stores HTML
9. Theme tokens for admin + public brand CSS variables
