---
name: SupportDesk
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style
The design system is engineered for high-performance B2B workflows where clarity, speed, and data density are paramount. The aesthetic follows a **Modern Corporate/Minimalist** approach, specifically drawing inspiration from the "Linear/Plain" movement: precision-driven, utilitarian, and sophisticated.

The UI should feel like a high-end tool—unobtrusive yet authoritative. It prioritizes the content (tickets, customer data, metrics) by using a restrained color palette, generous whitespace within data-dense environments, and a focus on perfect alignment. The emotional response is one of calm control and professional efficiency.

## Colors
The palette is rooted in a "Scale of Grays" to maintain a professional SaaS atmosphere. 

- **Primary:** Indigo (#4F46E5) is used sparingly for primary actions and active states to guide the eye without overwhelming the user.
- **Neutrals:** White (#FFFFFF) serves as the primary surface color, while Off-white (#F9FAFB) differentiates background layers and sidebars. Slate-gray (#1E293B) provides high-contrast legibility for body text.
- **Semantics:** Status indicators use soft-tints (light backgrounds with dark text) to ensure they are visible at a glance within data tables without creating visual vibration.

## Typography
Inter is chosen for its exceptional legibility in data-heavy interfaces and its neutral, systematic character. 

The system uses a **14px base** for standard body text and inputs to maximize information density. Titles utilize semi-bold weights and slight negative letter-spacing to appear more "pressed" and professional. Label styles are used for column headers in data tables and metadata, often paired with an uppercase or tight-tracking treatment to distinguish them from actionable text.

## Layout & Spacing
This design system employs an **8px grid** (with a 4px sub-grid for tight component internals). 

The layout follows a **fixed-fluid hybrid model**: 
- **Sidebar:** Fixed at 240px or 280px.
- **Main Content:** Fluid container with a maximum width of 1440px to prevent line lengths from becoming unreadable on ultra-wide monitors.
- **Tables:** Fluid width with specific minimum widths for columns to ensure data integrity.

Spacing is tight to accommodate the CRM's functional requirements. Large margins are reserved for high-level dashboard views, while ticket details and CRM tables use the `sm` (8px) and `md` (16px) units to group related information densely.

## Elevation & Depth
In alignment with the "Plain" aesthetic, depth is created primarily through **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows.

- **Level 0 (Background):** #F9FAFB (Off-white).
- **Level 1 (Cards/Surface):** #FFFFFF with a 1px solid border (#E2E8F0).
- **Level 2 (Dropdowns/Modals):** #FFFFFF with a subtle, highly-diffused ambient shadow (`0 4px 6px -1px rgb(0 0 0 / 0.1)`).
- **Interactive:** Hover states on rows or cards use a subtle shift to a cooler gray (#F1F5F9) or a very thin primary-colored left border to denote focus.

## Shapes
The design system uses a **Soft (0.25rem / 4px)** corner radius for standard components like buttons, input fields, and tags. This provides a professional, geometric look that feels precise. 

- **Standard (4px):** Buttons, Inputs, Checkboxes.
- **Large (8px):** Cards, Modals, Containers.
- **Pill (Full):** Specifically reserved for Status Badges (OPEN, CLOSED) to make them instantly recognizable as distinct semantic entities.

## Components

### Buttons
- **Primary:** Solid Indigo (#4F46E5) with white text. No gradient.
- **Outline:** 1px border (#E2E8F0) with Slate-gray text. High contrast on hover.
- **Ghost:** No border or background. Indigo or Gray text. Used for secondary actions in toolbars.

### Status Badges (Pills)
Fully rounded corners. Use the semantic background/text pairings defined in the Color section. Text should be all-caps and use `label-md` for maximum clarity at small sizes.

### Input Fields
- **Default:** 1px border (#E2E8F0), 14px text, 8px vertical padding.
- **Focus:** 1px Indigo border with a subtle 2px Indigo outer glow (low opacity).

### Data Tables
- **Header:** #F9FAFB background, `label-md` text color #64748B, bottom border only.
- **Rows:** 48px height, subtle hover state (#F8FAFC), 1px border-bottom (#F1F5F9).

### Cards
White background, 1px border (#E2E8F0), and the `Level 1` shadow profile. Padding should be consistent at `md` (16px) or `lg` (24px) depending on content density.