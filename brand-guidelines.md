# Brand Guidelines

## 1. Project Concept
**Fluentia** is a modern, developer-focused AI communication coaching platform. The platform features a Vercel-like, minimalist aesthetic designed for productivity, leveraging a dark-mode-first interface that caters to professionals, students, and job seekers aiming to improve their speaking confidence.

## 2. Visual Identity & Aesthetic
The visual language is inspired by cutting-edge developer tools and AI platforms. It balances deep, immersive dark backgrounds with high-contrast, energetic accents to create a "cyber-professional" and futuristic feel.

- **Theme:** Dark mode primary.
- **Vibe:** Sleek, technical, futuristic yet highly functional and uncluttered.
- **Key Motifs:** Subtle radiant glows, translucent overlays (glassmorphism), thin precision borders, and code/tech-inspired faint background textures.

## 3. Color Palette
The color system uses deep darks for depth, stark white for high readability, and a vibrant neon green for distinct interactions and calls to action.

### Primary Accents
- **Neon Bright Green (Primary/Brand):** `#00F38D` (Approximate hex) - Used for primary buttons, active states, key highlights, and blurred background glows.
- **Secondary Green (Muted):** `rgba(0, 243, 141, 0.15)` - Used for subtle highlights, tag backgrounds, or active states.

### Neutral & Backgrounds
- **App Background (Deepest Dark):** `#000000` or `#050505` - Creates the infinite canvas feel.
- **Surface/Card Background:** `#0A0A0A` to `#111111` or `rgba(255, 255, 255, 0.03)` - Used for scenarios, dashboard cards, and structured containers.
- **Borders & Dividers:** `rgba(255, 255, 255, 0.1)` - Very faint, 1px lines to separate content without adding visual noise.

### Typography Colors
- **Primary Text (Headings/Important Data):** `#FFFFFF` - High contrast for maximum legibility.
- **Secondary Text (Body/Descriptions):** `#888888` or `rgba(255, 255, 255, 0.6)` - Muted grays for supporting information, timestamps, or secondary Kanban card details.

## 4. Typography
A clean, geometric sans-serif typeface that looks native to modern IDEs and developer platforms (e.g., *Outfit*, *Inter*, or *Geist*).

- **Headings:** Bold to Extra-Bold, tightly spaced (`tracking-tighter`). High contrast (pure white).
- **Body Text:** Regular weight, optimized for readability in smaller sizes (scenario details, feedback metrics). Muted gray.
- **Technical/Tags:** Consider a clean Monospace font for specific data points, tech stacks, or status labels to reinforce the developer aesthetic.

## 5. UI Elements & Components

### Buttons
- **Primary Action (e.g., "Add Application"):** 
  - Background: Solid Neon Green.
  - Text: Stark Black (`text-black`) for maximum contrast.
  - Shape: Slightly rounded corners (`rounded-md` or `rounded-lg`).
  - Hover: Subtle brightness increase or a soft green drop-shadow/glow.
- **Secondary/Outline Action:** 
  - Background: Transparent.
  - Text: White or Light Gray.
  - Border: Thin border (`border-white/20`).

### Cards & Dashboard Panels
- **Aesthetic:** Vercel-like flat, precision design.
- **Background:** Subtle dark gray (`bg-[#111]`) or frosted glass (`backdrop-blur-md`).
- **Border:** 1px solid `border-white/10`.
- **Shadows:** Avoid heavy, muddy drop shadows. Rely on border contrast and glowing accents beneath elements to create depth.

### Accents & Effects
- **Glows:** Strategic use of blurred radial gradients (`blur-3xl`) beneath key elements (like the hero text, Spline 3D elements, or primary highlights) using the primary Neon Green to create a "glowing" effect against the black background.
- **Background Textures:** Faint, repeating matrix-like code arrays or subtle grid patterns embedded in the deep background of hero sections or empty board states.
