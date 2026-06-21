# Design System Inspired by Stablewatch

## 1. Visual Theme & Atmosphere

Stablewatch's design embodies precision, clarity, and financial trust through a clean, minimalist approach that prioritizes data accessibility and analytical depth. The visual language combines a bright, open aesthetic with carefully considered accents that draw attention to key financial metrics—gains displayed in vibrant teal-green, losses in coral-pink, and interactive elements in rich electric blue. The system emphasizes horizontal scanning patterns optimized for table-based financial data, with generous whitespace and soft shadows that create gentle depth without distraction. This is a design system built for professionals who need to parse complex yield data quickly and confidently.

**Key Characteristics**
- Clean, data-forward presentation with minimal ornamentation
- High contrast between neutral backgrounds and semantic status indicators
- Soft, barely-perceptible shadows for card elevation
- Accessible typography scales designed for readability across numerical and textual content
- Rounded, approachable button treatments that soften technical rigor
- Strategic use of accent colors to highlight gains (green), losses (pink), and interactive states (blue)

## 2. Color Palette & Roles

### Primary
- **Primary Action** (`#1857EC`): Main interactive element, link destinations, and call-to-action buttons throughout the interface
- **Primary Dark** (`#0645DA`): Darker shade of primary for hover states and secondary emphasis on key navigation items

### Accent Colors
- **Positive/Gain Indicator** (`#0BBA71`): Shows upward yield trends, positive percentage changes, and success states
- **Negative/Loss Indicator** (`#F43F5E`): Highlights downward trends, negative APY changes, and warning-level alerts; most frequently used accent
- **Information/Secondary Action** (`#2464F9`): Alternative interactive state, research highlights, and secondary CTAs
- **Tertiary Action** (`#4F46E5`): Indigo accent for supplementary interactive elements and secondary UI components
- **Cyan Accent** (`#06B6D4`): Protocol badges, secondary status indicators, and category highlights

### Interactive
- **Active/Hover Overlay** (`#FFF3`): Subtle white overlay for hover states and interactive component feedback (semi-transparent)

### Neutral Scale
- **Text Primary** (`#000000`): Primary body text, headings, and dense data within tables (used 937 times across UI)
- **Text Secondary** (`#0A0A0A`): Near-black variant for slightly de-emphasized content and secondary text layers
- **Text Tertiary** (`#171717`): Dark grey for tertiary labels, metadata, and disabled states
- **Text Muted** (`#A3A3A3`): Placeholder text, hints, and very subtle secondary information

### Surface & Borders
- **Surface Light** (`#FFFFFF`): Primary surface for cards, containers, and data tables; main background for content areas
- **Surface Subtle** (`#FAFAFA`): Very light neutral background for secondary surfaces and grouped content sections
- **Surface Tertiary** (`#F5F5F5`): Light grey background for inactive zones, disabled states, and filter containers
- **Border Default** (`#E5E5E5`): Card and container borders; subtle dividers between content blocks

### Status & Semantic
- **Warning** (`#F0BF0D`): Alert states, caution indicators, and deprecated/uncertain data points

## 3. Typography Rules

### Font Family
- **Primary**: Innovator Grotesk, sans-serif
- **Fallback stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace (for numeric data)**: `"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display 1 | Innovator Grotesk | 32px | 600 | 40px | -0.01em | Hero statements, main dashboard titles |
| Display 2 | Innovator Grotesk | 24px | 600 | 32px | -0.008em | Section headers, major data callouts |
| Heading 1 | Innovator Grotesk | 20px | 600 | 28px | -0.006em | Primary headings, card titles |
| Heading 2 | Innovator Grotesk | 16px | 600 | 24px | -0.004em | Subsection headers, tab labels |
| Heading 3 | Innovator Grotesk | 14px | 500 | 20px | -0.002em | Small headers, table column titles |
| Body Regular | Innovator Grotesk | 16px | 400 | 24px | 0em | Primary body text, descriptions |
| Body Small | Innovator Grotesk | 14px | 400 | 20px | 0em | Secondary text, metadata, table data |
| Button | Innovator Grotesk | 14px | 500 | 20px | 0.01em | All button text, call-to-action labels |
| Button Small | Innovator Grotesk | 12px | 500 | 18px | 0.015em | Compact button text, badge labels |
| Link | Innovator Grotesk | 16px | 500 | 24px | 0em | Hyperlinks, inline actions |
| Caption | Innovator Grotesk | 12px | 400 | 16px | 0.01em | Figure captions, timestamps, disclaimers |
| Input | Innovator Grotesk | 14px | 400 | 20px | 0em | Form fields, search input text |
| Code | SF Mono | 13px | 400 | 18px | 0em | Contract addresses, token symbols |

### Principles
- **Numeric Preference**: Use proportional figures for financial UI; tabular figures in data-dense tables for vertical alignment
- **Weight Restraint**: Limit to two weights per composition (typically 400 and 500 or 600) to maintain visual hierarchy clarity
- **Line Height Consistency**: Maintain minimum 1.5× multiplier for body text to ensure comfortable reading density
- **Semantic Sizing**: Use size increments (12px, 14px, 16px, 20px, 24px, 32px) to create clear visual rhythm and hierarchy
- **Emphasis via Weight**: Prefer weight variation over size change for subtle emphasis; increase size for structural hierarchy

## 4. Component Stylings

### Buttons

#### Primary Button
```css
background-color: #1857EC;
color: #FFFFFF;
font-size: 14px;
font-weight: 500;
font-family: Innovator Grotesk, sans-serif;
padding: 10px 24px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 40px;
line-height: 20px;
transition: background-color 0.2s ease;
```
**Hover**: `background-color: #0645DA;`
**Active**: `background-color: #0432B4;`
**Disabled**: `background-color: #E5E5E5; color: #A3A3A3;`

#### Secondary Button
```css
background-color: #F5F5F5;
color: #000000;
font-size: 14px;
font-weight: 500;
font-family: Innovator Grotesk, sans-serif;
padding: 8px 16px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 36px;
line-height: 20px;
```
**Hover**: `background-color: #E5E5E5;`

#### Ghost Button
```css
background-color: transparent;
color: #1857EC;
font-size: 14px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 0px;
border-radius: 0px;
border: 0px solid transparent;
box-shadow: none;
height: auto;
line-height: 24px;
text-decoration: underline;
```
**Hover**: `color: #0645DA; text-decoration-thickness: 2px;`

#### Icon Button
```css
background-color: transparent;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 0px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 40px;
width: 40px;
line-height: 24px;
display: flex;
align-items: center;
justify-content: center;
```
**Hover**: `background-color: #FAFAFA;`

### Cards & Containers

#### Card Default
```css
background-color: #FFFFFF;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 20px 24px;
border-radius: 24px;
border: 1px solid #E5E5E5;
box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0px 4px 0px;
line-height: 24px;
```

#### Card Elevated
```css
background-color: #FFFFFF;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 24px;
border-radius: 16px;
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: rgba(0, 0, 0, 0.05) 0px 1.5008px 3px 1px;
line-height: 24px;
```

#### Card Flat
```css
background-color: #FAFAFA;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 16px 20px;
border-radius: 16px;
border: 0px solid transparent;
box-shadow: none;
line-height: 24px;
```

### Inputs & Forms

#### Input Field Default
```css
background-color: #FFFFFF;
color: #000000;
font-size: 14px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 10px 16px;
border-radius: 9999px;
border: 1px solid #E5E5E5;
box-shadow: none;
height: 40px;
line-height: 20px;
transition: border-color 0.2s ease, box-shadow 0.2s ease;
```
**Focus**: `border-color: #1857EC; box-shadow: 0px 0px 0px 3px rgba(24, 87, 236, 0.1);`
**Disabled**: `background-color: #F5F5F5; color: #A3A3A3; border-color: #E5E5E5; cursor: not-allowed;`

#### Input Placeholder
```css
color: #A3A3A3;
font-size: 14px;
font-weight: 400;
```

#### Select / Dropdown
```css
background-color: #FFFFFF;
color: #000000;
font-size: 14px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 10px 16px;
padding-right: 40px;
border-radius: 9999px;
border: 1px solid #E5E5E5;
box-shadow: none;
height: 40px;
line-height: 20px;
cursor: pointer;
background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path stroke="%23000000" stroke-width="2" d="M6 8l4 4 4-4"/></svg>');
background-repeat: no-repeat;
background-position: right 12px center;
background-size: 16px;
appearance: none;
```

### Navigation

#### Main Navigation Bar
```css
background-color: #FFFFFF;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 16px 32px;
border-radius: 0px;
border-bottom: 1px solid #E5E5E5;
box-shadow: none;
height: 72px;
display: flex;
align-items: center;
gap: 24px;
```

#### Nav Link
```css
background-color: transparent;
color: #000000;
font-size: 16px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 8px 16px;
border-radius: 0px;
border-bottom: 2px solid transparent;
box-shadow: none;
height: auto;
line-height: 24px;
cursor: pointer;
transition: border-color 0.2s ease, color 0.2s ease;
```
**Active/Hover**: `border-bottom-color: #1857EC; color: #1857EC;`

#### Sidebar Navigation Item
```css
background-color: transparent;
color: #171717;
font-size: 14px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 12px 16px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 40px;
line-height: 20px;
display: flex;
align-items: center;
gap: 12px;
cursor: pointer;
transition: background-color 0.2s ease, color 0.2s ease;
```
**Hover**: `background-color: #FAFAFA;`
**Active**: `background-color: #F5F5F5; color: #000000; font-weight: 500;`

### Badges & Tags

#### Badge Primary
```css
background-color: #1857EC;
color: #FFFFFF;
font-size: 12px;
font-weight: 500;
font-family: Innovator Grotesk, sans-serif;
padding: 4px 12px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 24px;
line-height: 16px;
display: inline-flex;
align-items: center;
```

#### Badge Success
```css
background-color: #0BBA71;
color: #FFFFFF;
font-size: 12px;
font-weight: 500;
font-family: Innovator Grotesk, sans-serif;
padding: 4px 12px;
border-radius: 9999px;
border: 0px solid transparent;
box-shadow: none;
height: 24px;
line-height: 16px;
display: inline-flex;
align-items: center;
```

#### Badge Alert
```css
background-color: #F43F5E;
color: #FFFFFF;
font-size: 12px;
font-weight: 500;
font-family: Innovator Grotesk, sans-serif;
padding: 4px 12px;
border-radius: 9999py;
border: 0px solid transparent;
box-shadow: none;
height: 24px;
line-height: 16px;
display: inline-flex;
align-items: center;
```

### Tables

#### Table Row Default
```css
background-color: #FFFFFF;
color: #000000;
font-size: 14px;
font-weight: 400;
font-family: Innovator Grotesk, sans-serif;
padding: 16px 20px;
border-radius: 0px;
border-bottom: 1px solid #E5E5E5;
box-shadow: none;
height: 56px;
line-height: 20px;
transition: background-color 0.2s ease;
```
**Hover**: `background-color: #FAFAFA;`

#### Table Header Cell
```css
background-color: #F5F5F5;
color: #171717;
font-size: 12px;
font-weight: 600;
font-family: Innovator Grotesk, sans-serif;
padding: 12px 20px;
border-radius: 0px;
border-bottom: 1px solid #E5E5E5;
box-shadow: none;
height: 44px;
line-height: 18px;
text-transform: uppercase;
letter-spacing: 0.05em;
```

## 5. Layout Principles

### Spacing System

**Base Unit**: `4px`

**Scale**:
- `4px` – Micro-spacing; gaps between inline elements, tight component spacing
- `8px` – XS spacing; internal component gaps, small padding
- `12px` – S spacing; form input padding, card internal gaps
- `16px` – M spacing; standard component padding, moderate gaps
- `20px` – L spacing; card padding, section spacing
- `24px` – XL spacing; card padding, navigation height
- `32px` – 2XL spacing; section margins, container inner spacing
- `36px` – 3XL spacing; dashboard section gaps
- `48px` – 4XL spacing; major layout divisions, feature sections
- `64px` – 5XL spacing; page section spacing
- `80px` – 6XL spacing; hero padding, top-level page margins

**Context**:
- **Horizontal gaps**: `8px` (compact), `16px` (standard), `24px` (generous)
- **Vertical gaps**: `12px` (labels to fields), `16px` (stacked components), `32px` (section breaks)
- **Internal padding**: Cards `20px–24px`, Buttons `10px–12px vertical`, `16px–24px horizontal`

### Grid & Container

**Max Width**: `1440px` (content container)
**Viewport Container**: `100%` with horizontal gutters of `32px` at tablet+, `16px` at mobile

**Column Strategy**:
- **Desktop (1440px+)**: 12-column grid, `12px` gutter
- **Tablet (768px–1439px)**: 8-column grid, `12px` gutter
- **Mobile (<768px)**: 4-column grid, `8px` gutter

**Section Patterns**:
- **Data tables**: Full-width with `32px` horizontal padding, sticky header at top
- **Dashboard cards**: 3-column on desktop, 2-column on tablet, 1-column on mobile
- **Navigation + content**: Sidebar (`240px` fixed or collapsible) + main (`1fr` flexible)

### Whitespace Philosophy

Whitespace in Stablewatch is strategic and deliberate, creating visual rest and guiding attention to high-priority data. Generous padding around cards (`20px–24px`) provides breathing room, while tight horizontal spacing within tables (`8px` gaps) maintains data density. Vertical rhythm is anchored to line-height multiples (24px base) to create harmonious relationships between blocks. Empty space is never wasted; instead, it establishes visual hierarchy and reduces cognitive load for users scanning complex financial datasets.

### Border Radius Scale

- **None**: `0px` – Links, tables, navigation bars, horizontal dividers
- **Small**: `8px` – Icon buttons, small badges, minor UI accents
- **Medium**: `16px` – Input fields, dropdowns, modal dialogs, secondary cards
- **Large**: `24px` – Primary cards, major containers, prominent call-to-action cards
- **Pill/Full**: `9999px` – All buttons, rounded input fields, avatar circles, fully rounded components

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (L0) | No shadow; `border: 1px solid #E5E5E5;` | Inputs, secondary surfaces, muted cards |
| Raised (L1) | `box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 8px 0px, rgba(0, 0, 0, 0.04) 0px 0px 4px 0px;` | Default cards, active elements, standard containers |
| Elevated (L2) | `box-shadow: rgba(0, 0, 0, 0.05) 0px 1.5008px 3px 1px;` | Modal overlays, dropdown menus, floating panels |
| Floating (L3) | `box-shadow: rgba(0, 0, 0, 0.08) 0px -1px 0px 0px inset;` | Tooltips, ephemeral notifications, top-layer popovers |

**Shadow Philosophy**: Shadows in Stablewatch are minimal and use low-opacity black (`0.04–0.08` alpha) to maintain the system's clean, uncluttered aesthetic. Rather than dramatic vertical displacement, shadows suggest gentle surface separation through soft blur and inset treatments. This prevents the interface from feeling "heavy" while preserving spatial hierarchy. Most interactive surfaces rely on color, border, or hover state feedback rather than elevation alone.

## 7. Do's and Don'ts

### Do
- **Use semantic colors consistently**: Display gains in `#0BBA71`, losses in `#F43F5E`, primary actions in `#1857EC`
- **Maintain rhythm with the spacing scale**: Use multiples of `4px` for all spacing to create visual coherence
- **Prioritize readability over decoration**: Keep font weights to 400 and 500–600 for hierarchy; avoid excessive bold text
- **Provide clear focus states on interactive elements**: Use a `3px` border-glow or background shift on inputs and buttons
- **Group related data in cards with `24px` border-radius**: This creates perceived separation without harsh borders
- **Use the full 12-column grid layout**: Ensure content never exceeds `1440px` and respects gutter widths
- **Apply transitions to state changes**: 200ms cubic-bezier easing on color, background, and shadow changes
- **Stack numerical data vertically aligned**: Use tabular figures in `SF Mono` for financial tables
- **Differentiate hover, active, and disabled states**: Change background color, border, or shadow—never rely on opacity alone

### Don't
- **Mix multiple primary colors in a single composition**: Choose one action color per screen section; use secondary or accent colors for supporting elements
- **Exceed 2–3 font weights in a layout**: Avoid mixing 300, 400, 500, 600, and 700 on the same page
- **Use shadows deeper than level 2 (L2)**: Heavier shadows create visual clutter and undermine the minimalist aesthetic
- **Apply padding inconsistently**: Always use the spacing scale (`8px`, `12px`, `16px`, `20px`, etc.)—no arbitrary `13px` or `18px` padding
- **Create buttons smaller than `36px` height**: Maintain touch-target minimum of `40–44px` for cursor and touch accessibility
- **Reduce contrast below WCAG AA standards**: Ensure text-to-background contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text
- **Display more than 10 columns in data tables**: Horizontally scroll or collapse columns on smaller screens
- **Use pure white (`#FFFFFF`) text on dark backgrounds without high contrast color**: Prefer off-white (`#F5F5F5`) on dark surfaces for reduced eye strain
- **Override the Innovator Grotesk font family for UI text**: Reserve serif or decorative fonts for marketing materials only
- **Place critical CTAs near screen edges**: Maintain `16px–32px` margin from viewport edges to prevent accidental activation on touch devices

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|---|
| Mobile | 320px–767px | 4-column grid, `8px` gutter, single-column layouts, collapsed navigation, full-width cards, `16px` padding |
| Tablet | 768px–1023px | 8-column grid, `12px` gutter, 2-column card grids, sidebar toggles, reduced type sizes by 1–2px |
| Desktop | 1024px–1439px | 12-column grid, `12px` gutter, 3-column card layouts, sticky sidebar, standard type sizes |
| Wide | 1440px+ | 12-column grid, centered max-width `1440px`, `32px` horizontal margins, multi-row layouts |

### Touch Targets

- **Minimum button height**: `40px` (target size 44×44px for touch)
- **Minimum button width**: `44px` for icon-only buttons; `80px` minimum for text buttons
- **Minimum spacing between interactive elements**: `8px` horizontal, `12px` vertical
- **Input field minimum height**: `40px` for touch keyboards
- **Link padding**: Minimum `8px` around text links to prevent mis-taps

### Collapsing Strategy

**Navigation**:
- Desktop (1024px+): Full sidebar with text and icons visible, `240px` fixed width
- Tablet (768px–1023px): Collapsed sidebar showing icons only, `64px` width, with expandable drawer
- Mobile (320px–767px): Hidden sidebar, hamburger menu toggles bottom navigation or full-screen drawer

**Data Tables**:
- Desktop: Full horizontal scroll, all columns visible with `16px` padding per cell
- Tablet: Primary columns (asset, value, APY) visible; secondary metrics in collapsible rows or tabs
- Mobile: Stacked card view showing only key metrics per row; full table data accessible via modal

**Cards & Grids**:
- Desktop (1440px): 3-column grid with `24px` gap
- Tablet (1024px): 2-column grid with `20px` gap
- Mobile (768px): 1-column stack with `16px` vertical gap

**Typography Scaling**:
- Display: `32px` (desktop) → `24px` (tablet) → `20px` (mobile)
- Heading 1: `20px` (desktop) → `18px` (tablet) → `16px` (mobile)
- Body: `16px` (desktop) → `14px` (tablet) → `14px` (mobile)
- Caption: `12px` (all breakpoints, no reduction)

**Padding Reduction**:
- Containers: `80px` (desktop) → `48px` (tablet) → `16px` (mobile)
- Cards: `24px` (desktop) → `20px` (tablet) → `16px` (mobile)
- Buttons: `10px vert / 24px horiz` (all breakpoints)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA & Links**: Primary (`#1857EC`) with hover state `#0645DA`
- **Secondary CTA & Navigation**: Secondary (`#2464F9`) for alternative actions
- **Positive Indicators & Success**: Gain Green (`#0BBA71`) for upward trends and success states
- **Negative Indicators & Alerts**: Loss Pink (`#F43F5E`) for downward trends and warnings
- **Background & Surfaces**: White (`#FFFFFF`) for primary content, Light Grey (`#FAFAFA`) for secondary, Subtle Grey (`#F5F5F5`) for inactive zones
- **Text & Headings**: Black (`#000000`) for primary text, Near-Black (`#0A0A0A`) for secondary, Muted Grey (`#A3A3A3`) for hints
- **Borders & Dividers**: Light Border (`#E5E5E5`) for all card and section boundaries
- **Warning/Caution**: Warning Gold (`#F0BF0D`) for alerts and uncertain data

### Iteration Guide

1. **All interactive elements must use the primary color `#1857EC`** for hover and active states unless explicitly semantic (gains `#0BBA71`, losses `#F43F5E`). Default state text is `#000000`.

2. **Spacing must strictly follow the scale**: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `36px`, `48px`, `64px`, `80px`. No arbitrary pixel values.

3. **Buttons are always `40px` height minimum** with `9999px` border-radius (pill-shaped). Text buttons use `8–12px` vertical padding and `16–24px` horizontal padding.

4. **Cards use `24px` border-radius** with `20–24px` internal padding. Default border is `1px solid #E5E5E5`. Shadows are light (`0.04–0.08` alpha black) and soft-blurred, never sharp.

5. **Typography is always Innovator Grotesk** with weights limited to `400` (body), `500` (button/label), and `600` (heading). Font sizes follow the hierarchy: `12px`, `14px`, `16px`, `20px`, `24px`, `32px`.

6. **Line-height must be at least `1.5×` font size** for body text (e.g., `24px` for `16px` font). Use `1.4×` minimum for headings.

7. **Inputs and form fields are `40px` height** with `10px` vertical and `16px` horizontal padding. Focus state adds `3px` glow using primary color with `0.1` alpha.

8. **Tables use `44px` header height** with `12px` padding; data rows are `56px` with `16px` padding. Hover state backgrounds shift to `#FAFAFA`.

9. **Navigation bars are `72px` height** on desktop; collapse to `56px` on mobile. Sidebar width is `240px` fixed on desktop, `64px` icon-only on tablet, hidden drawer on mobile.

10. **Color contrast must meet WCAG AA** (4.5:1 for body text, 3:1 for large). Test all text-on-background combinations; never pair `#000000` text directly on `#0A0A0A` background.