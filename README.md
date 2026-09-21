# Designtech Engineering Website

Official web application for **Designtech Engineering** — Civil and Structural Engineering Consultancy based in Bengaluru, Karnataka, India.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react-swc`
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Animation & Motion**: [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Maps**: [Leaflet](https://leafletjs.com/) (OpenStreetMap)
- **Styling**: Vanilla CSS with architectural design system tokens and responsive layouts

---

## Project Structure

```text
Designtech_Engineering-/
│
├── public/                     # Static assets served at root
│   ├── Clients/                # Client logo images (PNG, JPEG)
│   ├── Logo.png                # Primary company logo
│   └── hero.mp4                # High-definition hero video
│
├── scripts/
│   └── upscale-hero.cjs        # Hero video Lanczos 2-pass upscale utility
│
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI primitives (BeforeAfter, PageTransition)
│   │   ├── layout/             # Global layout shell (Navbar, Footer)
│   │   └── sections/           # Modular page sections
│   │       ├── home/           # Hero, HomeAboutTeaser, CapabilitiesPreview, etc.
│   │       ├── about/          # About, EngineeringProcess, ClientEcosystem, etc.
│   │       ├── sectors/        # Sectors & specialized fields
│   │       └── contact/        # Contact form with mailto & Leaflet studio map
│   │
│   ├── data/                   # Data-driven models
│   │   ├── clients.ts          # Client ecosystem roster
│   │   ├── projects.ts         # Portfolio project chapters
│   │   ├── sectors.ts          # Specialized sectors & fields of operation
│   │   ├── navigation.ts       # Main navbar and footer links
│   │   └── company.ts          # Office address, phones, email, coordinates
│   │
│   ├── hooks/                  # Custom React hooks (useLenis, useHashScroll)
│   ├── pages/                  # Page components (HomePage, AboutPage, SectorsPage, ContactPage)
│   ├── styles/                 # Global styles & design tokens (index.css)
│   ├── types/                  # TypeScript interface definitions
│   ├── utils/                  # Utility functions (mailto builder)
│   ├── App.tsx                 # Root application router shell
│   └── main.tsx                # Application entrypoint
│
├── index.html                  # HTML entrypoint
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## How to Install

Ensure Node.js is installed, then run:

```bash
npm install
```

---

## How to Run

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:5190` in your browser.

---

## How to Build

Compile TypeScript and build the production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

To run type checking:

```bash
npm run lint
```

---

## How to Add a Client

1. **Add Logo**: Place the new client logo in [`public/Clients/`](public/Clients/) (e.g. `client-acme.png`).
2. **Add Data Entry**: Open [`src/data/clients.ts`](src/data/clients.ts) and append an item to `CLIENTS`:

```typescript
{
  id: "acme-corp",
  name: "Acme Corporation",
  logo: "/Clients/client-acme.png",
  project: "Commercial Hub", // optional
}
```

The Client Ecosystem visualization will automatically recalculate radial coordinates, ring allocation, and connector animations.

---

## How to Edit Sectors

All sector details and fields of operation are centrally managed in [`src/data/sectors.ts`](src/data/sectors.ts).

- Edit `SECTORS` to modify titles, subheadings, descriptions, or tags on the `/sectors` page.
- Edit `FIELDS_PREVIEW` to update the cards on the home page.

---

## How to Edit Contact Information

All office details, phone numbers, email, and map location are stored centrally in [`src/data/company.ts`](src/data/company.ts):

- `addressLine1` through `addressLine5`
- `phone1` and `phone2`
- `email` (also used for mailto destination)
- `googleMapsUrl`
- `coordinates` (latitude & longitude used by Leaflet map)

Updating `OFFICE_INFO` in this single file immediately updates the **Contact Page**, **Studio Map**, **Footer**, and **Mailto Handler**.

---

## Contact Form Workflow

The contact form is 100% client-side and requires no external backend or API keys:

1. User fills out the form on `/contact`.
2. Form validates required fields and tests the honeypot anti-spam trap.
3. Clicking **Send Enquiry** builds a structured mailto link via [`src/utils/mailto.ts`](src/utils/mailto.ts).
4. The user's native email client (Outlook, Apple Mail, Gmail app, etc.) opens prefilled with the enquiry addressed to `designtecheng.team@gmail.com`.
