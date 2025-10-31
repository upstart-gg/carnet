---
name: design-system
description: DaisyUI and TailwindCSS design system guidelines including colors, typography, spacing, and component patterns. Use when styling any component or page.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Design System Guidelines

## Color System (CRITICAL)

Use **DaisyUI semantic colors** exclusively: `primary`, `secondary`, `accent`, `neutral`, `base-100/200/300`, `base-content`, `info`, `success`, `warning`, `error` with `-content` variants.

### Color Rules

- **Always use semantic colors** (`bg-primary`, `text-base-content`)
- **Never use raw Tailwind colors** (no `bg-blue-500` - use `bg-primary` instead)
- `base-*` for backgrounds: `base-100` (main), `base-200` (elevated), `base-300` (more elevated)
- `primary` for CTAs only (maximum 2-3 per screen)
- **Always pair backgrounds with `-content` variants** (`bg-primary text-primary-content`)
- **Max 3-4 colors per component** - avoid color overload

### Color Examples

```tsx
// Good - semantic colors
<div className="bg-base-100 text-base-content">
  <button className="btn btn-primary">Call to Action</button>
  <div className="alert alert-info">
    <span className="text-info-content">Information message</span>
  </div>
</div>

// Bad - raw Tailwind colors
<div className="bg-white text-gray-900">  {/* DON'T DO THIS */}
  <button className="bg-blue-600">...</button>
</div>
```

## Visual Hierarchy

### Spacing (8px base unit)

Follow the 8px rhythm for consistent spacing:

- **Micro**: `gap-2/3` (8/12px) - tight spacing
- **Small**: `gap-4` (16px) - related items
- **Medium**: `gap-6` (24px) - **DEFAULT** - standard spacing
- **Large**: `gap-8` (32px) - separate sections
- **XLarge**: `gap-12` (48px) - major sections
- **Sections**: `py-12` to `py-24` - page sections

```tsx
// Good spacing examples
<div className="flex flex-col gap-6">  {/* DEFAULT */}
  <div className="space-y-2">  {/* Tight for related items */}
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <div className="mt-8">  {/* Separate section */}
    ...
  </div>
</div>
```

### Typography

Use these consistent typography scales:

- **Hero**: `text-5xl md:text-7xl font-bold`
- **H1**: `text-4xl md:text-5xl font-bold`
- **H2**: `text-3xl md:text-4xl font-bold`
- **H3**: `text-2xl md:text-3xl font-semibold`
- **Body**: `text-base leading-relaxed` - **DEFAULT**
- **Small**: `text-sm`
- **Caption**: `text-xs`

**Line height:**
- Headings: `leading-tight`
- Body: `leading-relaxed`

**Text colors:**
- Primary: `text-base-content`
- Secondary: `text-base-content/70`
- Muted: `text-base-content/50`

```tsx
// Typography example
<article>
  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
    Page Title
  </h1>
  <p className="text-base leading-relaxed text-base-content/70 mb-6">
    Body text with good readability
  </p>
  <p className="text-sm text-base-content/50">
    Secondary information
  </p>
</article>
```

### Component Sizing

Use DaisyUI size modifiers:
- `btn-sm`, `btn-md` (DEFAULT), `btn-lg`
- `input-sm`, `input-md`, `input-lg`
- Minimum **44px touch targets** for mobile

## Modern Design

### Visual Polish

#### 1. Elevation & Shadows
Progressive elevation creates depth:
- Base: `bg-base-100` (no shadow)
- Elevated: `shadow`
- Floating: `shadow-lg`
- Modal: `shadow-2xl`

```tsx
<div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
  ...
</div>
```

#### 2. Border Radius
- **Recommended**: `rounded-xl` (12px)
- Theme-aware: `rounded-box`
- Nested elements: slightly smaller radius
- Full round: `rounded-full` (for avatars, badges)

#### 3. Borders
- Standard: `border border-base-300`
- Accent: `border-l-4 border-primary`
- Glass effect: `bg-base-100/80 backdrop-blur-lg`

#### 4. Animations
**Always include transitions**: `transition-all duration-300 ease-in-out`

Common hover effects:
- Scale: `hover:scale-105`
- Shadow: `hover:shadow-lg`
- Lift: `hover:-translate-y-1`
- Focus: `focus-visible:ring-2 focus-visible:ring-primary`

```tsx
<div className="card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  <img className="transition-transform duration-300 hover:scale-105" />
</div>
```

### Layout Patterns

#### Grid & Flex
```tsx
// Flex layout
<div className="flex flex-col md:flex-row gap-6">
  ...
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ...
</div>
```

#### Responsive Design
- **Mobile-first approach**
- Use `md:` and `lg:` breakpoints
- Stack vertically on mobile, side-by-side on desktop

#### Containers
```tsx
// Page container
<div className="max-w-7xl mx-auto px-4 lg:px-8">
  ...
</div>

// Prose content
<div className="max-w-3xl mx-auto">
  ...
</div>
```

#### Aspect Ratios
- Video: `aspect-video` (16:9)
- Square: `aspect-square` (1:1)

#### Z-Index Layers
- Content: `z-10`
- Dropdowns: `z-30`
- Modals: `z-40`
- Toasts: `z-50`

## Component Patterns

### Cards

```tsx
<div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
  <figure>
    <img className="transition-transform hover:scale-105" src="..." alt="..." />
  </figure>
  <div className="card-body space-y-4">
    <h2 className="card-title">Card Title</h2>
    <p className="text-base-content/70">Card content description</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

### Buttons

- **Primary action**: `btn btn-primary` (main CTAs)
- **Secondary action**: `btn btn-secondary` or `btn btn-outline`
- **States**: `btn-disabled`, `loading loading-spinner`
- **Groups**: `btn-group`
- **Spacing**: `gap-2` between buttons

```tsx
<div className="flex gap-2">
  <button className="btn btn-primary">Primary</button>
  <button className="btn btn-outline">Secondary</button>
</div>
```

### Forms

```tsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text">Email address</span>
  </label>
  <input
    type="email"
    placeholder="you@example.com"
    className="input input-bordered w-full"
  />
  <label className="label">
    <span className="label-text-alt text-error">Error message here</span>
  </label>
</div>

<button className="btn btn-primary btn-lg btn-block mt-4">
  Submit
</button>
```

### Navigation

```tsx
// Navbar
<nav className="navbar bg-base-100 shadow-md sticky top-0 z-50">
  <div className="navbar-start">...</div>
  <div className="navbar-center">...</div>
  <div className="navbar-end">...</div>
</nav>

// Mobile drawer
<div className="drawer">
  <input id="drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">...</div>
  <div className="drawer-side">
    <label htmlFor="drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 bg-base-100">...</ul>
  </div>
</div>
```

### Modals

```tsx
<dialog className="modal">
  <div className="modal-box max-w-2xl">
    <h3 className="font-bold text-lg">Modal Title</h3>
    <p className="py-4">Modal content</p>
    <div className="modal-action">
      <button className="btn">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```

### Data Display

**Tables:**
```tsx
<div className="overflow-x-auto">
  <table className="table table-zebra">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Stats:**
```tsx
<div className="stats shadow">
  <div className="stat">
    <div className="stat-title">Total Users</div>
    <div className="stat-value">1,234</div>
    <div className="stat-desc">↗︎ 20% increase</div>
  </div>
</div>
```

**Badges:**
```tsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
```

## Page Patterns

### Landing Page

```tsx
// Hero section
<div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Welcome!</h1>
      <p className="py-6">Compelling value proposition here</p>
      <button className="btn btn-primary btn-lg">Get Started</button>
    </div>
  </div>
</div>

// Features section
<section className="py-24">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature cards */}
    </div>
  </div>
</section>

// Repeat CTA every 2-3 sections
```

### Dashboard

- Sidebar: `drawer` + `menu`
- Stats overview at top
- Tables with filters, search, pagination
- Charts: use react-chartjs-2
- Empty states with helpful CTAs

## Accessibility & UX

### Must-Haves:
- **Semantic HTML**: `<nav>`, `<main>`, `<article>`, `<section>`
- **ARIA labels**: where needed for screen readers
- **Keyboard navigation**: visible focus states `focus-visible:ring-2 focus-visible:ring-primary`
- **Loading states**: `loading` spinner or skeleton screens
- **Empty states**: illustration + explanation + CTA
- **Error states**: `alert-error` with clear, actionable messages
- **Success feedback**: toast notifications, checkmarks
- **Touch targets**: minimum 44x44px
- **Contrast**: WCAG AA minimum (4.5:1)
- **Motion**: respect `prefers-reduced-motion`

## Quality Checklist

### Must Have:
- ✅ Consistent 8px spacing rhythm
- ✅ Clear visual hierarchy
- ✅ Semantic color usage (no raw Tailwind colors)
- ✅ Smooth transitions (300ms)
- ✅ Progressive elevation/shadows
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Generous whitespace
- ✅ Hover/focus states on all interactive elements
- ✅ Loading/error/empty states designed
- ✅ Typography follows scale

### Avoid:
- ❌ Raw Tailwind colors (`bg-blue-500`) - use semantic colors
- ❌ Cramped spacing
- ❌ Too many font sizes/weights
- ❌ Missing hover/focus states
- ❌ Inconsistent component sizes
- ❌ No visual hierarchy
- ❌ Missing mobile responsiveness
- ❌ Poor contrast
- ❌ Mixing design styles
- ❌ Too many competing CTAs (max 2-3 per screen)

## Design Philosophy

Create interfaces that are:
1. **Visually stunning** - proper spacing, hierarchy, polish
2. **Theme-consistent** - DaisyUI semantic colors throughout
3. **Responsive** - all screen sizes work beautifully
4. **Accessible** - keyboard navigation, WCAG compliant
5. **Performant** - smooth, optimized
6. **Intuitive** - clear next steps for users
7. **Delightful** - thoughtful micro-interactions
8. **Professional** - pixel-perfect attention to detail
