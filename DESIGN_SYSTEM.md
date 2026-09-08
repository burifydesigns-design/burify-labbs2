# Burify Labs Design System

## Brand Overview

**Brand Name:** BURIFY LABS
**Domain:** burifylabs.com
**Industry:** Web Design + AI Automation Agency

**Positioning:** A premium technology studio that designs exceptional digital experiences and builds intelligent automation systems for forward-thinking businesses.

**Brand Personality:**
- Intelligent — Smart solutions, thoughtful design
- Modern — Current trends, contemporary aesthetics
- Premium — High-quality, sophisticated
- Innovative — Cutting-edge technology
- Precise — Attention to detail
- Trustworthy — Reliable, professional
- Fast — Efficient, responsive
- Technical — Skilled, expert
- Human — Approachable, personal
- Forward-thinking — Future-ready, progressive

---

## Color System

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Purple | `#6B5FA9` | Primary brand color, CTAs, links |
| Light Purple | `#8D81E3` | Hover states, secondary elements |
| Dark Purple | `#4B4275` | Dark backgrounds, emphasis |
| Accent Pink | `#D484B2` | Highlights, special accents |
| White | `#FFFFFF` | Primary background |
| Light Lavender | `#CBC5DC` | Subtle backgrounds, cards |

### Light Mode

```css
--color-background: #FFFFFF;
--color-background-secondary: #F8F7FC;
--color-text-primary: #1A1625;
--color-text-secondary: #4B4275;
--color-text-muted: #6B5FA9;
--color-border: #E8E4F0;
--color-border-light: #F0EDF7;
```

### Dark Mode

```css
--color-background: #1A1625;
--color-background-secondary: #241E33;
--color-text-primary: #FFFFFF;
--color-text-secondary: #CBC5DC;
--color-text-muted: #8D81E3;
--color-border: #3D3457;
--color-border-light: #4B4275;
```

### Color Usage Guidelines

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary CTA | Primary Purple | Primary Purple |
| Text Links | Primary Purple | Light Purple |
| Cards | White / Lavender | Dark Secondary |
| Section Alt | Lavender | Dark |
| Accents | Pink | Pink |

---

## Typography

### Font Family

**Primary Font:** Inter (Google Fonts)
**Fallbacks:** system-ui, -apple-system, sans-serif

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| display | 72px / 4.5rem | 700 | 1.1 | -0.02em | Hero headlines |
| h1 | 60px / 3.75rem | 700 | 1.1 | -0.02em | Page titles |
| h2 | 48px / 3rem | 600 | 1.25 | -0.02em | Section headers |
| h3 | 36px / 2.25rem | 600 | 1.25 | 0 | Subsection headers |
| h4 | 24px / 1.5rem | 600 | 1.25 | 0 | Card titles |
| body-lg | 18px / 1.125rem | 400 | 1.75 | 0 | Lead paragraphs |
| body | 16px / 1rem | 400 | 1.5 | 0 | Body copy |
| body-sm | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text |
| caption | 12px / 0.75rem | 500 | 1.5 | 0.05em | Labels, tags |
| nav | 14px / 0.875rem | 500 | 1.5 | 0 | Navigation |
| button | 14px / 0.875rem | 500 | 1 | 0 | Button text |

### Responsive Typography

| Breakpoint | Display | H1 | H2 | H3 |
|------------|---------|----|----|-----|
| Mobile | 40px | 36px | 32px | 28px |
| Tablet | 48px | 44px | 38px | 32px |
| Desktop | 60px | 52px | 44px | 36px |
| Large | 72px | 60px | 48px | 36px |

### Typography Guidelines

- Headlines: Use tight letter spacing (-0.02em)
- Body text: Use relaxed line height (1.5–1.75)
- Avoid ALL CAPS for long text
- Use uppercase sparingly for labels and tags
- Maintain minimum 1.2 contrast ratio for body text

---

## Spacing System

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| 0 | 0 | 0 | None |
| 1 | 0.25rem | 4px | Micro spacing |
| 2 | 0.5rem | 8px | Tight spacing |
| 3 | 0.75rem | 12px | Compact spacing |
| 4 | 1rem | 16px | Base spacing |
| 5 | 1.25rem | 20px | Comfortable |
| 6 | 1.5rem | 24px | Standard |
| 8 | 2rem | 32px | Section spacing |
| 10 | 2.5rem | 40px | Large gaps |
| 12 | 3rem | 48px | Section padding |
| 16 | 4rem | 64px | Major sections |
| 20 | 5rem | 80px | Hero spacing |
| 24 | 6rem | 96px | Large sections |
| 32 | 8rem | 128px | Hero sections |

### Spacing Usage

| Context | Vertical Spacing | Horizontal Spacing |
|---------|-----------------|-------------------|
| Page margins | 16px (mobile) / 48px (desktop) | 16px–48px |
| Section padding | 64px–128px | Container width |
| Card padding | 24px–32px | 24px–32px |
| Component gap | 8px–24px | 8px–24px |
| Button padding | 12px–16px | 24px–32px |

---

## Layout System

### Container Width

| Name | Max Width | Padding |
|------|-----------|---------|
| sm | 640px | 16px |
| default | 1280px | 24px (mobile) / 48px (desktop) |
| lg | 1024px | 24px |
| xl | 1280px | 24px |
| full | 100% | 24px |

### Grid System

| Device | Columns | Gutter |
|--------|---------|--------|
| Mobile | 4 | 16px |
| Tablet | 8 | 24px |
| Desktop | 12 | 24px |

### Responsive Breakpoints

| Name | Min Width | Max Width | Columns |
|------|-----------|-----------|---------|
| xs | 0px | 479px | 4 |
| sm | 480px | 639px | 4 |
| md | 640px | 767px | 8 |
| lg | 768px | 1023px | 8 |
| xl | 1024px | 1279px | 12 |
| 2xl | 1280px | — | 12 |

### Section Spacing

| Section Type | Mobile | Tablet | Desktop |
|--------------|--------|--------|---------|
| Compact | 48px | 64px | 80px |
| Standard | 64px | 80px | 96px |
| Large | 80px | 96px | 128px |
| Hero | 96px | 128px | 160px |

---

## Button System

### Button Variants

#### Primary
```css
bg: Primary Purple (#6B5FA9)
text: White
border: none
hover: Dark Purple (#4B4275)
active: Dark Purple (#4B4275)
```

#### Secondary
```css
bg: Light Lavender (#CBC5DC)
text: Dark Purple (#4B4275)
border: none
hover: Lavender with 80% opacity
active: Lavender with 70% opacity
```

#### Outline
```css
bg: transparent
text: Primary Purple
border: 1px Primary Purple
hover: Primary Purple fill, white text
active: Dark Purple border
```

#### Ghost
```css
bg: transparent
text: Primary Purple
border: none
hover: Primary Purple with 10% opacity background
active: Primary Purple with 20% opacity background
```

#### Dark
```css
bg: Dark Background (#1A1625)
text: White
border: none
hover: Dark Secondary (#241E33)
active: Dark Secondary
```

### Button Sizes

| Size | Height | Padding | Font Size | Border Radius |
|------|--------|---------|-----------|---------------|
| sm | 36px | 12px 16px | 14px | 8px |
| md | 44px | 12px 24px | 14px | 12px |
| lg | 52px | 16px 32px | 16px | 12px |

### Button States

- **Default:** Standard appearance
- **Hover:** Color change, subtle scale (1.02)
- **Active:** Darker color, scale (0.98)
- **Focus:** 2px ring outline
- **Disabled:** 50% opacity, cursor not-allowed
- **Loading:** Spinner icon, disabled interaction

---

## Card System

### Card Variants

#### Default
```css
bg: White / Dark Background
border: 1px solid Border color
border-radius: 16px
padding: 24px
shadow: none
hover: border-color Primary Light, shadow-lg, translateY(-2px)
```

#### Elevated
```css
bg: White / Dark Background
border: none
border-radius: 16px
padding: 24px
shadow: shadow-lg
hover: shadow-xl, translateY(-2px)
```

#### Outlined
```css
bg: transparent
border: 2px solid Border color
border-radius: 16px
padding: 24px
shadow: none
hover: border Primary, shadow-md
```

#### Glass
```css
bg: rgba(255,255,255,0.1) / rgba(26,22,37,0.8)
border: 1px solid rgba(255,255,255,0.2) / rgba(75,66,117,0.3)
border-radius: 16px
padding: 24px
backdrop-filter: blur(10px)
```

### Card Types

| Type | Purpose | Key Elements |
|------|---------|--------------|
| ServiceCard | Service offerings | Icon, title, description, features list |
| ProjectCard | Portfolio items | Image, title, description, tags |
| TestimonialCard | Client quotes | Quote, author, role, rating |
| BlogCard | Blog posts | Image, category, date, title, excerpt |
| FeatureCard | Key features | Icon, title, stat, description |
| ProcessCard | Process steps | Step number, title, description |

---

## Form System

### Input Styles

```css
/* Default */
bg: White / Dark Background
border: 1px solid Border color
border-radius: 12px
padding: 12px 16px
font-size: 16px

/* Focus */
border: Primary Purple
ring: 2px Primary Purple with 20% opacity

/* Error */
border: Red-500
ring: 2px Red-500 with 20% opacity

/* Disabled */
bg: Background Secondary
cursor: not-allowed
```

### Form Component Specifications

| Component | Height | Border Radius | States |
|-----------|--------|--------------|--------|
| Input | 48px | 12px | default, focus, error, disabled, filled |
| Select | 48px | 12px | default, focus, error, disabled |
| Textarea | min 120px | 12px | default, focus, error, disabled |
| Checkbox | 20px × 20px | 4px | default, checked, focus, disabled |
| Radio | 20px × 20px | 50% | default, checked, focus, disabled |

### Form Label Styles

```css
font-size: 14px
font-weight: 500
color: Text Primary
margin-bottom: 8px

/* Required indicator */
color: Accent Pink (#D484B2)
margin-left: 4px
```

### Error Message Styles

```css
font-size: 14px
color: Red-500
margin-top: 8px
```

---

## Navigation Design

### Desktop Navigation

- Fixed header with 80px height
- Logo left, navigation center, CTA right
- Navigation links: 14px, medium weight, 32px gap
- Hover: Primary color
- Active: Primary color with underline

### Navigation Variants

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| Light | White with 95% opacity, blur | Text Primary | Default light pages |
| Dark | Dark with 95% opacity, blur | White | Dark sections |
| Transparent | Transparent | White | Hero sections (scrolls to light) |

### Mobile Navigation

- Fixed header with 72px height
- Logo left, hamburger right
- Full-screen overlay menu
- Slide-in animation from right
- Close button top-right
- Navigation links: 18px, full width
- CTA button: Full width at bottom

### Navigation States

- **Default:** Standard appearance
- **Scrolled:** Add background, shadow, reduce height slightly
- **Hover:** Link color change
- **Active:** Underline indicator
- **Mobile Open:** Overlay visible, body scroll locked

---

## Logo Concept

### Concept Direction

The Burify Labs logo should communicate:

- **Intelligence** — Sophisticated, smart
- **Transformation** — Evolution, improvement
- **Systems** — Connected, organized
- **Modernity** — Contemporary, current

### Visual Mark Guidelines

The logo mark should be:

- Simple enough for 16×16px favicon
- Geometric and clean
- Not relying on AI/tech clichés (no brains, circuits, robots)
- Versatile across light and dark backgrounds
- Strong at small sizes

### Conceptual Directions

#### Option 1: Abstract B
- Stylized "B" formed by geometric shapes
- Represents "Burify" while being abstract
- Can use negative space creatively

#### Option 2: Connected Nodes
- Minimal dots or circles connected by lines
- Represents systems, automation, networks
- Suggests "intelligence" without being literal

#### Option 3: Flow/Transformation
- Abstract shapes suggesting transformation
- Layers or steps implying process
- Dynamic but not aggressive

#### Option 4: Modular/Lattice
- Grid-like or modular pattern
- Represents precision and systems
- Scalable and geometric

### Logo Specifications

| Element | Specification |
|---------|--------------|
| Wordmark | "BURIFY LABS" — Inter Bold |
| Icon | Abstract mark, 32×32px minimum |
| Favicon | 32×32px, icon only |
| Spacing | Minimum 8px padding around icon |

### Logo Color Usage

| Background | Logo Color |
|------------|-----------|
| White | Full color (Purple/Pink) |
| Light Lavender | Full color |
| Dark Background | White or light version |
| Primary Purple | White |
| Images/Photos | White with subtle shadow or border |

---

## Iconography

### Icon Style Guidelines

| Property | Specification |
|----------|--------------|
| Style | Line icons, 2px stroke |
| Size | 24×24px default |
| Corner radius | 2px (rounded) or 0px (sharp) |
| Consistency | Same stroke width across all icons |

### Icon Usage

| Context | Size | Treatment |
|---------|------|-----------|
| UI elements | 20×20px | Outline |
| Feature cards | 24×24px | Filled or outline |
| Navigation | 24×24px | Outline |
| Social links | 20×20px | Filled |
| Decorative | As needed | Outline |

### Icon Categories

| Category | Examples |
|----------|---------|
| Navigation | Arrow, Menu, Close, Chevron |
| Actions | Send, Download, Upload, Edit |
| Social | Twitter, LinkedIn, Instagram, Dribbble |
| Services | Code, Palette, Layers, Bot, Cloud |
| UI | Check, X, Search, Filter, Settings |

### Icon Usage Rules

- Use icons purposefully, not decoratively
- Ensure icons have sufficient contrast
- Maintain consistent visual weight
- Use accessible labels for screen readers

---

## Motion & Animation

### Animation Principles

1. **Purposeful** — Motion should convey meaning
2. **Subtle** — Enhance, don't distract
3. **Fast** — No unnecessary delays
4. **Smooth** — Use appropriate easing curves

### Timing Guidelines

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| UI feedback | 200ms | ease-out |
| Element transitions | 300ms | ease-in-out |
| Page transitions | 400ms | ease-in-out |
| Scroll reveals | 400–600ms | ease-out |

### Animation Types

#### Fade
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
duration: 300ms
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
duration: 400ms
```

#### Scale
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
duration: 200ms
```

### Hover Interactions

| Element | Interaction |
|---------|-------------|
| Buttons | Scale 1.02, color change |
| Cards | translateY(-2px), shadow increase |
| Links | Color change, underline |
| Icons | Color change, scale 1.1 |
| Images | Scale 1.05 |

### Scroll Animations

- Use intersection observer for scroll reveals
- Stagger animations by 100ms for lists
- Animate from bottom or side
- Limit to key sections (hero, features, CTA)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Visual Effects

### Gradients

| Name | Direction | Colors |
|------|-----------|--------|
| Primary | 135deg | #6B5FA9 → #D484B2 |
| Subtle | Bottom-right | rgba(107,95,169,0.05) → transparent |
| Dark | Vertical | #1A1625 → #241E33 |

### Effects Usage

| Effect | When to Use | Intensity |
|--------|-------------|-----------|
| Shadows | Cards, elevated elements | Light to medium |
| Glows | Accents, highlights | Subtle (20% opacity) |
| Glass | Overlays, modals | Medium blur (10px) |
| Grid patterns | Background texture | Very subtle (3% opacity) |
| Noise | Texture, grain | Subtle (2% opacity) |

### Effects Guidelines

- Use effects sparingly
- Maintain performance
- Ensure accessibility
- Test on various backgrounds

---

## Image & Art Direction

### Image Guidelines

**Preferred:**
- Real project screenshots
- Website mockups
- Product interfaces
- Custom illustrations
- Abstract technology visuals
- Process diagrams
- Team photos (professional, not stocky)

**Avoid:**
- Generic business stock photography
- AI-brain graphics
- Circuit-board imagery
- Robot illustrations
- Cliché tech metaphors
- Over-processed images

### Image Treatment

| Context | Aspect Ratio | Style |
|---------|--------------|-------|
| Hero | 16:9 or wider | Bold, impactful |
| Project cards | 4:3 | Clean, professional |
| Team | 1:1 | Professional headshots |
| Blog | 16:9 | Editorial, clean |
| Backgrounds | Various | Subtle, non-distracting |

### Illustration Style

If using illustrations:
- Geometric and minimal
- Consistent with brand colors
- Not overly complex
- Scalable SVG format

---

## Page-Specific Design Principles

### Homepage
- Bold hero with clear value proposition
- Service overview with icons
- Featured work showcase
- Trust indicators (testimonials, stats)
- Strong CTA sections
- Light/dark section contrast

### Services Pages
- Clear service description
- Feature/benefit list
- Process explanation
- Related case studies
- Pricing or CTA
- Technical credibility

### Work/Portfolio
- Filterable project grid
- Large project images
- Case study format
- Results/metrics emphasis
- Before/after when relevant

### About
- Team introduction
- Company story
- Values/mission
- Office/culture imagery
- Client logos
- Partnership highlights

### Blog
- Editorial layout
- Featured post hero
- Category filtering
- Author attribution
- Related posts
- Share functionality

### Contact
- Clear contact options
- Contact form
- Location/availability
- Response time expectation
- Multiple contact methods

### Page Layout Principles

- Each page should feel unique
- Maintain consistent navigation/footer
- Use page-specific components where needed
- Keep page CSS isolated from global styles
- Optimize for page-specific goals

---

## Accessibility Guidelines

### Requirements

| Requirement | Implementation |
|-------------|----------------|
| Contrast | Minimum 4.5:1 for text |
| Focus states | Visible 2px outline |
| Touch targets | Minimum 44×44px |
| Keyboard nav | Full functionality |
| Screen readers | Semantic HTML, ARIA labels |
| Motion | prefers-reduced-motion support |

### Implementation

- Use semantic HTML elements
- Add ARIA labels for icons
- Ensure form labels are associated
- Provide alt text for images
- Test with screen readers
- Validate color contrast

---

## Component Architecture

### Folder Structure

```
components/
├── effects/          # Visual effects
├── forms/           # Form components
├── layout/          # Layout components
├── seo/             # SEO/Typography
└── ui/              # UI components
    ├── cards/       # Card variants
    └── icons/       # Icon components
```

### Component Guidelines

| Guideline | Description |
|-----------|-------------|
| Props | Use TypeScript interfaces |
| Variants | Support multiple visual styles |
| States | Include all interaction states |
| Composition | Build from smaller components |
| Naming | Use clear, descriptive names |

---

## CSS Architecture

### CSS Variable Structure

```css
:root {
  /* Colors */
  --color-primary: #6B5FA9;
  --color-primary-light: #8D81E3;
  --color-primary-dark: #4B4275;
  --color-accent-pink: #D484B2;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --text-display: 4.5rem;
  --text-h1: 3.75rem;

  /* Spacing */
  --space-4: 1rem;
  --space-8: 2rem;

  /* Effects */
  --shadow-md: 0 4px 6px -1px rgba(26, 22, 37, 0.08);
  --radius-xl: 1rem;

  /* Transitions */
  --transition-base: 200ms ease;

  /* Layout */
  --container-max: 1280px;
}
```

### CSS Organization

| Layer | Contents |
|-------|----------|
| Base | Reset, variables, typography |
| Components | Reusable component styles |
| Utilities | Helper classes |

---

## Usage Examples

### Button
```tsx
<Button variant="primary" size="md">Start a Project</Button>
<Button variant="outline" href="/work">View Our Work</Button>
```

### Card
```tsx
<ServiceCard
  icon={<CodeIcon />}
  title="Web Design"
  description="Beautiful, responsive websites"
  features={["Responsive", "SEO Optimized", "Fast"]}
/>
```

### Layout
```tsx
<Section variant="dark" padding="xl">
  <Container>
    <Grid columns={1} tabletColumns={2} desktopColumns={3}>
      <GridItem>Content</GridItem>
    </Grid>
  </Container>
</Section>
```

---

## Next Steps

1. Build homepage with design system
2. Create service pages
3. Build work/portfolio pages
4. Develop about page
5. Create blog functionality
6. Build contact page
7. Add animations progressively
8. Optimize for performance
