# CLAUDE.md — Innovatech Engineering Solutions website

Orientation for any AI assistant working in this repo. Read this first; it is written to
save you from re-deriving the codebase. If something here contradicts the code, the code
wins — fix this file in the same commit.

---

## 1. What this project is

Marketing + self-service website for **Innovatech Engineering Solutions**, a Cameroonian
technology company headquartered in **Melen, Yaoundé** (not Douala — corrected mid-project).

The company is the **parent of Skolar** (internal codename *Edukam*), a school-management
SaaS built by the same team in a **separate repo**. Skolar is referenced in marketing copy
here, but none of its code lives in this repo.

Business lines the site sells:

- Phone & gadget repair
- Electronics / hardware repair
- App & software development
- Sales of new and fairly-used electronics
- Design & Conception (custom hardware/IoT prototyping, "Innovation Hub")
- **WiFi Zone** — self-service data vouchers (pick a plan → get a generated ID + code →
  pay via WhatsApp/Mobile Money). No physical scratch cards.

Contact number and WhatsApp are the same: **+237 651 162 373**. Currency is **FCFA**
throughout. Repo: `https://github.com/Toko12pro1/invatech.git`.

---

## 2. Stack and commands

React 18 + Vite 6, plain CSS (no framework), Supabase for data/auth/storage, deployed to
Vercel.

```bash
npm install
npm run dev       # vite dev server
npm run build     # -> dist/
npm run preview   # serve the production build
```

There is **no test suite, no linter, no formatter, and no TypeScript**. Don't invent a test
command; verify by building and by looking at the running page.

Key dependencies: `react-router-dom` v6, `framer-motion` v11, `i18next` +
`react-i18next` + `i18next-browser-languagedetector`, `react-icons` (Font Awesome set),
`@supabase/supabase-js` v2.

`vercel.json` holds the SPA rewrite (`/(.*)` → `/index.html`) so deep links survive a
refresh. Vite config is stock — just the React plugin.

---

## 3. THE house rule: class components, always

**Every component in `src/` is an ES6 class extending `React.Component`.** This is an
explicit, repeated instruction from the owner ("oop oriented then classes, clean code"),
not an accident of history. Do not "modernise" anything to hooks.

Consequences you must work around:

- **React hooks are off-limits** — no `useState`, `useEffect`, `useMemo`, etc. Use
  `this.state`, `setState`, and lifecycle methods.
- **Hook-only third-party APIs get wrapped in an HOC** that injects a prop:
  - `withTranslation()` from react-i18next → gives `this.props.t` / `i18n`
  - [`src/utils/withNavigate.jsx`](src/utils/withNavigate.jsx) → wraps `useNavigate` into a
    `navigate` prop. Copy this pattern if you need another hook-only API.
- **Framer Motion**: JSX props on `motion.*` (`initial`, `animate`, `whileInView`, `whileHover`)
  work fine from a class `render()`. Its *hook* APIs (`useMotionValue`, `useScroll`, …) do not.
  For hook-shaped needs, hand-roll it with `IntersectionObserver` + `requestAnimationFrame`
  in lifecycle methods — [StatCounter.jsx](src/components/StatCounter.jsx) is the reference
  implementation (observer in `componentDidMount`, both torn down in `componentWillUnmount`).
  For plain scroll-in animations you don't need any of that: reuse
  [`<Reveal>`](src/components/Reveal.jsx), which wraps children in a `motion` tag with
  `whileInView` and accepts `as` / `delay` / `y` / `className`.
- Bind handlers in the constructor (`this.foo = this.foo.bind(this)`) — that's the style in use.

Note: this OOP rule is **specific to this repo**. The Skolar/Edukam repo is a normal
hooks-based app; don't carry the rule across.

---

## 4. Layout of the code

```
src/
  App.jsx              Router + PublicLayout (Navbar/Outlet/Footer) + admin routes
  main.jsx             Entry; imports ./i18n and styles/index.css
  components/
    BasePage.jsx       Base class every page extends (see below)
    Navbar, Footer, PageHero, SectionHeading, Reveal, StatCounter,
    ServiceCard, ProductCard, TestimonialCard, ProfileCard,
    ContactForm, PromoVideo, Logo, LanguageSwitcher
    admin/RequireAuth.jsx   Session gate; redirects to /admin/login
  data/                services.js, testimonials.js — ids/icons/images ONLY, no copy
  models/              Service.js, Product.js, WifiPackage.js — classes, not plain objects
  i18n/
    index.js           i18next init
    locales/en.json    All English copy (~300 keys)
    locales/fr.json    French mirror — must stay key-for-key identical
  lib/supabaseClient.js
  pages/               Home, About, Services, Shop, WifiZone, Contact, NotFound
    admin/             AdminLogin, AdminLayout, AdminProducts, AdminWifiPackages, AdminVouchers
  styles/index.css     ~1400 lines, the entire design system + every component's styles
  utils/withNavigate.jsx
public/
  images/              Verified stock photos + logo-full.svg / logo-icon.svg
  videos/              innovatech-promo.mp4 / .webm
supabase/migrations/   0001_init.sql, 0002_seed.sql, 0003_wifi_vouchers.sql
```

### Routes

Public (wrapped in `PublicLayout` → Navbar + Footer):
`/`, `/about`, `/services`, `/shop`, `/wifi-zone`, `/contact`, `*` → NotFound.

Admin (no public nav link, gated by `RequireAuth`):
`/admin/login`, `/admin` → redirects to `/admin/products`, plus `/admin/wifi-packages`
and `/admin/vouchers`.

### BasePage

[`BasePage`](src/components/BasePage.jsx) owns scroll-to-top on mount and a Framer Motion
fade-in wrapper. Pages extend it and implement **`renderPage()`**, never `render()`.
If a page needs its own `componentDidMount`, **call `super.componentDidMount()` first** or
you silently lose the scroll-to-top ([WifiZone.jsx:29](src/pages/WifiZone.jsx#L29) shows it).

---

## 5. Bilingual EN/FR — the rule that breaks things most often

The site is fully bilingual. Language persists in `localStorage` under **`innovatech-lang`**;
detection order is localStorage → navigator, fallback `en`.

**Display text is never hardcoded in a component.** Data files and model classes carry only
`id`, `icon`, `image`, `price` — the words are looked up with `t()` in the consuming
component, using the id as part of the key. `Service` even exposes the helper
`translationKey(field)` → `servicesData.<id>.<field>`, so a card renders
`t(service.translationKey("title"))`. Keep it that way when adding content.

Editing rules:

1. Add the key to **both** `en.json` and `fr.json`. They must stay structurally identical.
2. Arrays of strings are fetched with `t("some.key", { returnObjects: true })`.
3. Product/WiFi content stored in Supabase is bilingual **in the DB** instead — `products`
   has `name_en` / `name_fr`, and `Product.getName(lang)` picks one. Read the current
   language from `this.props.i18n.language`.

### ⚠️ The `<Trans>` indexing trap

Inside `<Trans i18nKey="…">` children, **never write an explicit `{" "}`** between a text run
and the following element.

JSX already joins adjacent lines with a single space. An explicit `{" "}` becomes its *own*
entry in the children array, shifting every numeric placeholder index by one — so a
translation string containing `<1>Skolar</1>` silently renders **nothing** where the bold
text should be. There is **no build error and no console warning**. This bug already shipped
once in the Home hero subtitle and was only caught by looking at a real screenshot.

If you touch a `<Trans>` block, verify it visually, not just with `npm run build`.

---

## 6. Supabase

Client is created in [`src/lib/supabaseClient.js`](src/lib/supabaseClient.js) from
`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

**Secrets rule:** only public, RLS-constrained values may carry the `VITE_` prefix — Vite
inlines those into the client bundle. `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ACCESS_TOKEN`
live in `.env` for CLI/admin use only and must **never** be prefixed with `VITE_` or imported
from `src/`. `.env` is git-ignored; `.env.example` is the committed template.

### Schema (see `supabase/migrations/`)

| Table | Purpose |
| --- | --- |
| `products` | Shop items. Bilingual names, `price` / `old_price` (integer FCFA), `condition` (`New` \| `Fairly Used`), `badge`, `image_url`, `sort_order`, `active`. Category is a CHECK-constrained enum. |
| `stores` | Partner stores and approved store-owner listings. Store owners are linked through `owner_id`. |
| `store_owner_applications` | Store-owner onboarding applications awaiting Innovatech review. |
| `wifi_packages` | WiFi Zone plans: `data_amount` + `data_unit` (`MB`\|`GB`), `duration_days`, price fields, `is_popular`, `sort_order`, `active`. |
| `wifi_vouchers` | One row per issued voucher. `code` is **UNIQUE**; `status` is `pending` \| `paid` \| `used`. |

Storage bucket **`product-images`** is public-read; admins and approved store owners can
upload images under their own seller path, and the resulting public URL is stored in
`products.image_url`.

### RLS model — understand this before changing a query

- Public/anon can `select` only rows where `active = true` on `products` and `wifi_packages`.
- Anon can `insert` into `wifi_vouchers`, but **only** with `status = 'pending'`, and has
  **no select/update policy** — so a visitor can reserve a code but can never list, look up,
  or re-use anyone else's.
- Admin access is controlled by the Supabase auth `app_metadata.role = 'admin'` claim and
  checked server-side by the `public.is_admin()` function. The admin route and admin RLS
  policies must never rely on a client-side flag.
- Approved store owners can view and manage only products linked to their own `stores.owner_id`.
  Normal members can access neither admin data nor seller-management writes.
- Auth is plain Supabase email+password; store-owner approval is separate from admin access.
- `updated_at` is maintained by the `set_updated_at()` trigger on all three tables.

### Voucher generation

[`WifiZone.generateVoucher()`](src/pages/WifiZone.jsx#L54) **inserts the row first, then
shows the code** — the DB unique constraint is what guarantees single use. It retries up to
5 times on Postgres error `23505` (unique_violation) and surfaces any other error. Do not
"simplify" this into generate-then-display-then-save; that would reintroduce duplicate codes.
The character pool deliberately omits look-alikes (I, O, 0, 1).

---

## 7. Styling

One stylesheet: [`src/styles/index.css`](src/styles/index.css), organised into commented
sections (design tokens → base → buttons → navbar → … → admin → responsive). Add new rules to
the matching section rather than appending at the bottom.

Design tokens live in `:root`. Brand palette is **yellow → orange on white/cream, with navy
text**:

```
--color-yellow #ffd23f   --color-orange #ff6b00   --color-orange-light #ff9a1f
--color-white  #ffffff   --color-cream  #fff8ee   --color-navy   #16202a
--gradient-primary: 135deg yellow → orange-light → orange
--font-heading "Poppins"  --font-body "Inter"     --container-width 1180px
```

Also tokenised: `--shadow-sm/md/lg`, `--radius-sm/md/lg`, gray ramp. **Use the variables** —
don't hardcode hex values or px radii.

Class naming is BEM-ish: block `.btn`, modifier `.btn--primary`, element `.admin-table-actions`.
Admin styles are all namespaced `.admin-*`.

---

## 8. Brand assets and imagery

**The logo is final.** `public/images/logo-full.svg` and `logo-icon.svg` are the owner's own
supplied artwork — a hexagon of six gradient arc segments around an ascending triangular
shard, with an "INNOVATECH / ENGINEERING SOLUTIONS" wordmark in Space Grotesk. An earlier
lightning-bolt-in-hexagon draft was rejected. **Do not redesign it unless asked.**

Two hard-won rules about photos:

1. **Show Black African people, in a Cameroonian context.** The client is in Cameroon and
   the default "generic tech stock photo" cast was explicitly rejected. This applies to team
   shots, testimonials, and any people imagery.
2. **Never trust an image URL you recalled from memory — look at the file before using it.**
   Roughly a third of blind picks were mislabeled (a "phone repair" URL was a desk flatlay; a
   "team" photo was a shoe). Download it, open it with the Read tool, *then* wire it in.

---

## 9. Contact / WhatsApp integration

There is **no backend for the contact form**. [`ContactForm`](src/components/ContactForm.jsx)
builds a message and either opens `https://wa.me/237651162373?text=…` or a `mailto:` to
`hello@innovatech.cm`. The same wa.me number appears in Navbar, Home, Shop, ProductCard, and
the WiFi Zone voucher hand-off. If the number ever changes, grep for `237651162373` and
`651 162 373` — it appears both as a link and as displayed text in the locale files.

---

## 10. Working agreements

- Match the surrounding style: class components, double-quoted strings, comments that explain
  *why* (the existing comments are sparse and load-bearing — keep that ratio).
- Adding a page? Create `src/pages/X.jsx` extending `BasePage`, add its route in `App.jsx`,
  add nav copy to both locale files, add styles to the right section of `index.css`.
- Adding a DB column? Write a new numbered migration in `supabase/migrations/`; don't edit
  applied ones. Update the model class's constructor **and** its `toRow()`.
- Verify visually before declaring UI work done — several bug classes here (the `<Trans>`
  one especially) produce a clean build and a broken page.
- Don't commit or push unless asked.

## 11. Skill use and durable project rules

- Before starting work, inspect the available skills and read the full instructions for every skill that clearly applies to the task.
- Use applicable skills faithfully, announce their use while working, and mention any material effect they had in the final handoff.
- When the owner explicitly asks to preserve a project preference or working rule, record it in this file so future assistants can follow it.
- These repository rules apply to this project only; system, developer, and current user instructions always take precedence.
