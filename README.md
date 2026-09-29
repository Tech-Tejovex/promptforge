# PromptForge — Ultra-Premium AI Prompt Generator

A production-ready, agency-grade SaaS built with Next.js 15, designed to transform raw ideas into structured, world-class AI prompts.

## Design Philosophy

PromptForge is designed for the $500k agency aesthetic: deep blacks (`#030303`), glassmorphism (`backdrop-blur-2xl`, `border-white/[0.08]`), subtle noise textures, spring physics animations (`stiffness: 400`), and editorial typography (`font-serif` for headlines, `Geist` for UI).

## Tech Stack

- **Framework:** Next.js 16.3.6 (App Router)
- **Styling:** Tailwind CSS v4, CSS Variables for theming
- **Motion:** Framer Motion
- **Icons:** Lucide React
- **State:** Zustand
- **UI Components:** Custom `GlassCard`, `MagneticButton`, `NoiseOverlay`
- **Data:** Seed data for 12 professions (Medical, Legal, Marketing, Engineering, etc.)

## Key Features Implemented

1. **Cinematic Landing Page:** Animated hero with floating glass cards, feature grid, pricing teaser, and ambient background gradients.
2. **Glassmorphism System:** `GlassCard` component with `backdrop-blur-2xl`, thin white borders, and hover glow effects.
3. **Interactive Components:** `MagneticButton` with scale animations and shimmer hover states.
4. **Noise Texture:** Subtle SVG noise overlay for organic texture.
5. **Profession Data:** 12 professional domains with icons and descriptions.
6. **Auth Pages:** Beautiful Sign In / Sign Up with floating labels and glass cards.
7. **Dashboard Routes:** Forge (prompt engineering workspace), History, and Settings.
8. **AI Engine Setup:** Prompt templates using a structured 6-part framework (Role, Context, Task, Format, Tone, Constraints).

## Project Structure

```
src/
  app/
    page.tsx                    # Cinematic Landing Page
    layout.tsx                  # Root layout with NoiseOverlay
    globals.css                 # Design System (dark-first, glass variables)
    auth/
      layout.tsx
      sign-in/page.tsx
      sign-up/page.tsx
    dashboard/
      forge/page.tsx
      history/page.tsx
      settings/page.tsx
  components/
    shared/
      NoiseOverlay.tsx
      GlassCard.tsx
    ui/
      MagneticButton.tsx
  lib/
    data/
      professions.ts             # 12 profession seed data
    ai/
      promptTemplates.ts         # AI transformation logic
    store/
      uiStore.ts                 # Zustand state
```

## Environment Setup

1. Clone and install:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment. Ensure your `next.config.ts` is set and deploy via:
```bash
vercel --prod
```

## Design Details

- **Colors:** `#030303` (void), `#0A0A0A` (surface), `rgba(255,255,255,0.06)` (glass)
- **Animations:** `ease: [0.22, 1, 0.36, 1]` (smooth spring-like curves)
- **Typography:** `font-serif` for editorial impact, `font-sans` (Geist) for UI precision.
- **Shadows:** `shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]` for depth without color pollution.
