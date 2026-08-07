# Innovatech Engineering Solutions

Marketing website for **Innovatech Engineering Solutions** — a Cameroonian technology company
offering phone & gadget repair, electronics repair, electronics sales, and app/software
development. Parent company of **Skolar**.

Built with React (class components), React Router, and Framer Motion.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

This project is ready to deploy on [Vercel](https://vercel.com) with zero configuration:

1. Import the GitHub repository into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build` — Output directory: `dist` (auto-detected).

`vercel.json` includes an SPA rewrite rule so client-side routes (e.g. `/about`, `/shop`)
work correctly on refresh and direct navigation.

## Project Structure

```
src/
  components/   Reusable UI class components (Navbar, Footer, cards, form, etc.)
  data/         Services, products and testimonials content
  models/       Service and Product classes
  pages/        One class component per route (Home, About, Services, Shop, Contact)
  styles/       Global design-system stylesheet
public/
  images/       Site imagery and brand assets (logo-full.svg, logo-icon.svg)
```
