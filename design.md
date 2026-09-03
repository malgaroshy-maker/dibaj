---
name: Luxury Damask & Textiles
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#504538'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#827566'
  outline-variant: '#d4c4b3'
  surface-tint: '#815508'
  primary: '#815508'
  on-primary: '#ffffff'
  primary-container: '#c08b3e'
  on-primary-container: '#422800'
  inverse-primary: '#f7bc6a'
  secondary: '#7b563c'
  on-secondary: '#ffffff'
  secondary-container: '#fecdac'
  on-secondary-container: '#79553b'
  tertiary: '#506354'
  on-tertiary: '#ffffff'
  tertiary-container: '#869a89'
  on-tertiary-container: '#203225'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb4'
  primary-fixed-dim: '#f7bc6a'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#633f00'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ecbd9d'
  on-secondary-fixed: '#2e1502'
  on-secondary-fixed-variant: '#603f27'
  tertiary-fixed: '#d3e8d5'
  tertiary-fixed-dim: '#b7ccb9'
  on-tertiary-fixed: '#0e1f13'
  on-tertiary-fixed-variant: '#394b3d'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  headline-xl:
    fontFamily: libreCaslonText
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: libreCaslonText
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 42px
  headline-lg:
    fontFamily: libreCaslonText
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: libreCaslonText
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: libreCaslonText
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 36px
  title-lg:
    fontFamily: manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
  title-md:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: manrope
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter-desktop: 2rem
  gutter-mobile: 1rem
  container-max: 1280px
---

## Brand & Style
This design system embodies high-end North African craft, bespoke upholstery, and Mediterranean architectural luxury tailored for premium curtains, majlis seating, and high-thread-count textiles. Rooted in the visual identity seen in the corporate letterhead—notably the layered amber, bronze, and chocolate dynamic waves and classic crest iconography—the aesthetic blends tactile skeuomorphic subtleties with timeless editorial minimalism.

The visual direction projects warmth, tactile comfort, bespoke tailor-grade refinement, and prestigious hospitality. Interfaces evoke the sensation of running fingertips across weighted brocades, silk curtains, and carved hardwood finishes.

## Colors
The palette extracts its heritage from the company's branded stationery:
- **Imperial Bronze Gold (`#C08B3E`)**: The primary brand accent used for interactive calls to action, badges, luxury seals, focus outlines, and key value indicators.
- **Dark Velveteen Chocolate (`#5A3A22`)**: The dominant structural color used for deep backgrounds, high-contrast typography, structural headers, and premium container cards.
- **Deep Muted Olive / Mediterranean Laurel (`#4A5D4E`)**: A calming, organic tertiary tone reflecting garden courtyards and architectural drape accents, ideal for status indicators, fabric swatch filters, and secondary metadata.
- **Warm Damask Ivory (`#FAF7F2`)**: The core neutral background evoking unbleached linen and polished warm marble, avoiding the harsh glare of generic digital white while providing ample contrast.
- **Pure Marble Base (`#FFFFFF`)**: Reserved for foreground surface cards, active input fields, and swatch showcases.

## Typography
Typographic pairings rely on high-prestige editorial serif headers paired with clean, accessible sans-serif body copy. In production contexts handling full Arabic RTL localization, fallback font families map seamlessly to Tajawal or Almarai, ensuring identical vertical metrics and rhythmic line spacing.

Letter spacing is tightened slightly on large display serif headlines for an authoritative editorial impact, while labels and numerical specs receive generous breathing room.

## Layout & Spacing
The layout adheres to a 12-column responsive fluid grid anchored by a maximum content container of 1280px. 

- **Desktop (1024px+)**: 12 columns with 32px gutters and 48px page margins. Section blocks use dramatic vertical breathing space (`space-3xl`) to echo luxury brand ateliers.
- **Tablet (768px - 1023px)**: 8 columns with 24px gutters and 32px outer safe zones.
- **Mobile (< 768px)**: 4 columns with 16px gutters and 16px margins, stacking luxury catalog cards into immersive vertical or horizontal snap-carousel arrangements.

RTL layout rules strictly reverse inline directionality: navigation drawers, swatch galleries, back buttons, and pricing indicators orient smoothly from right to left.

## Elevation & Depth
Depth mimics physical interior design sample boards and layered textiles:
- **Surface Layering**: The primary foundation rests on `#FAF7F2` (Warm Damask Ivory). Elevated panels, cards, and drawers sit on pure white `#FFFFFF` or elevated cream tints `#F5EFE6`.
- **Ambient Shadows**: Shadows carry a warm, chocolate-tinted umber undertone rather than neutral gray. 
  - *Low Elevation (Cards, Filters)*: `0px 4px 16px -2px rgba(90, 58, 34, 0.06), 0px 1px 3px rgba(90, 58, 34, 0.04)`.
  - *High Elevation (Modals, Customizer Sheets, Luxury Menus)*: `0px 20px 40px -8px rgba(90, 58, 34, 0.14), 0px 4px 12px rgba(90, 58, 34, 0.05)`.
- **Wave Dividers & Accent Trims**: Subtle fluid curves inspired by the multi-tonal header wave (layering Gold, Amber, and Chocolate) are utilized as divider ribbons across hero headers and section transitions.
- **Borders**: Hairline strokes (`1px solid rgba(192, 139, 62, 0.22)`) rim high-value surfaces to produce a subtle gilded picture-frame finish.

## Shapes
A soft geometric approach (`roundedness: 1`) is applied throughout. Corners utilize gentle 4px (`rounded-sm`) to 8px (`rounded-lg`) radii, mirroring bespoke joinery, tailored cushion piping, and architectural cornice lines. Completely circular shapes are reserved exclusively for circular fabric swatches, avatar crests, and stamp indicators reminiscent of the official company seal.

## Components

### Buttons
- **Primary**: Solid imperial bronze gold (`#C08B3E`) background with crisp white or dark chocolate text (`#5A3A22`), 8px border-radius, soft bronze shadow, and subtle inner highlight.
- **Secondary (Bespoke Outline)**: Transparent background encased in a 1.5px border of `#C08B3E`, with `#5A3A22` text. Hover shifts background to `rgba(192, 139, 62, 0.08)`.
- **Text & Link Actions**: Rendered in `#5A3A22` with an underline accented by a `#C08B3E` transition.

### Cards & Textile Swatches
- **Catalog Cards**: White backgrounds bounded by `1px solid rgba(192, 139, 62, 0.18)` and `rounded-lg` corners. Images maintain a 4:5 portrait ratio to honor draping textiles, curtains, and full majlis salons.
- **Fabric Swatch Pickers**: Circular selectors (44px) surrounded by an active double-ring in `#C08B3E` with a 2px offset. Include texture tooltips showing material blend (e.g., Jacquard, Velvet, Damask Silk).

### Input Fields & Controls
- **Form Controls**: Generous 48px height, filled with `#FFFFFF` against `#FAF7F2` backdrops. Borders feature warm neutral gray-taupe, transitioning to `#C08B3E` with an ambient glow on `:focus`. Floating labels align right-to-left for Arabic inputs.
- **Checkboxes & Radios**: Custom-styled square with soft bevels (checkbox) or gold-ringed radio buttons; checked states fill with `#C08B3E` featuring an ivory glyph.

### Navigation & Headers
- Top navigation features the dual Arabic and Latin typography alongside the circular NA crest emblem.
- A delicate multi-tone ribbon trim (reflecting the 3-step bronze-to-chocolate wave) runs beneath hero headers and section anchors.