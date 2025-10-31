---
name: components
description: Creating reusable custom components with TypeBox props. Use when building components.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Components

## Overview
Create custom components in `~/app/components/`. Organize them in subfolders and reuse them across your app. Components make your code modular and maintainable.

## Component Rules

1. **Use a default export** for the component
2. **Type props with TypeBox**, export as `const props`
3. **Use DaisyUI classnames** and attributes
4. **Follow Tailwind limitations** (use the defined color palette)
5. **Never declare components inside page files** - always extract to `~/components/`

## Basic Component Structure

```tsx
import { Type, type Static } from "@sinclair/typebox";

// Always export the props schema as a named export
export const props = Type.Object({
  label: Type.String({ description: "Button label" }),
  variant: Type.Optional(Type.String({ description: "Button style variant" })),
});

// Always export your component as a default export
export default function MyButton({ label, variant = "primary" }: Static<typeof props>) {
  return (
    <button className={`btn btn-${variant}`}>
      {label}
    </button>
  );
}
```

## Component with State

```tsx
import { useState } from "react";
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  initialCount: Type.Optional(Type.Number({ description: "Starting count" })),
});

export default function Counter({ initialCount = 0 }: Static<typeof props>) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <p className="text-2xl font-bold">{count}</p>
      <button
        className="btn btn-primary mt-2"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}
```

## Component with Children

```tsx
import { type PropsWithChildren } from "react";
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  title: Type.String({ description: "Card title" }),
  variant: Type.Optional(Type.String({ description: "Card variant" })),
});

export default function Card({
  title,
  variant = "default",
  children
}: PropsWithChildren<Static<typeof props>>) {
  return (
    <div className={`card bg-base-${variant === "elevated" ? "200" : "100"} shadow-lg`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
```

## Using Icons

Use icons from `@iconify/react` only! Always pass the `ssr` prop for server-side rendering.

```tsx
import { Icon } from '@iconify/react';
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  icon: Type.String({ description: "Icon name from Iconify" }),
  label: Type.String({ description: "Feature label" }),
  description: Type.String({ description: "Feature description" }),
});

export default function FeatureCard({ icon, label, description }: Static<typeof props>) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body items-center text-center">
        <Icon icon={icon} className="text-4xl text-primary" ssr={true} />
        <h3 className="card-title">{label}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
```

## Using Charts

Use `react-chartjs-2` for graphs and charts (v4).

**Important:** Chart.js is auto-imported by the platform - do NOT import it yourself!

```tsx
import { Chart } from 'react-chartjs-2';
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  data: Type.Any({ description: "Chart data" }),
  type: Type.String({ description: "Chart type (line, bar, pie, etc.)" }),
});

export default function ChartComponent({ data, type }: Static<typeof props>) {
  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <Chart type={type} data={data} />
    </div>
  );
}
```

## Using Links

Always use `<Link>` and `<NavLink>` from `react-router` for internal links.

```tsx
import { Link } from "react-router";
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  items: Type.Array(Type.Object({
    title: Type.String(),
    slug: Type.String(),
    excerpt: Type.String(),
  })),
});

export default function BlogList({ items }: Static<typeof props>) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          to={`/blog/${item.slug}`}
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
        >
          <div className="card-body">
            <h3 className="card-title">{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

## Complex Component Example: Navbar

```tsx
import { Link, NavLink } from "react-router";
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  siteName: Type.String({ description: "Site name/logo text" }),
  links: Type.Array(Type.Object({
    label: Type.String(),
    href: Type.String(),
  })),
});

export default function Navbar({ siteName, links }: Static<typeof props>) {
  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink to={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">{siteName}</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink to={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-primary">Get Started</a>
      </div>
    </nav>
  );
}
```

## Component Organization

**Good structure:**
```
~/components/
  ├── Navbar.tsx
  ├── Footer.tsx
  ├── Hero.tsx
  ├── cards/
  │   ├── ProductCard.tsx
  │   ├── BlogCard.tsx
  │   └── FeatureCard.tsx
  └── forms/
      ├── ContactForm.tsx
      └── NewsletterForm.tsx
```

## TypeBox Prop Types

Common TypeBox patterns for component props:

```tsx
export const props = Type.Object({
  // Strings
  title: Type.String({ description: "Title text" }),
  subtitle: Type.Optional(Type.String({ description: "Optional subtitle" })),

  // Numbers
  count: Type.Number({ description: "Count value", minimum: 0 }),
  price: Type.Optional(Type.Number({ description: "Price", minimum: 0 })),

  // Booleans
  featured: Type.Boolean({ description: "Is featured item" }),
  showDetails: Type.Optional(Type.Boolean({ description: "Show details" })),

  // Enums
  variant: Type.Union([
    Type.Literal("primary"),
    Type.Literal("secondary"),
    Type.Literal("accent"),
  ], { description: "Visual variant" }),

  // Arrays
  items: Type.Array(Type.String(), { description: "List of items" }),
  tags: Type.Optional(Type.Array(Type.String()), { description: "Tags" }),

  // Objects
  author: Type.Object({
    name: Type.String(),
    avatar: Type.Optional(Type.String()),
  }),

  // Images
  image: Type.String({ format: "image", description: "Image URL" }),

  // URLs
  link: Type.String({ format: "url", description: "Link URL" }),

  // Rich text
  content: Type.String({ format: "richtext", description: "HTML content" }),
});
```

## Best Practices

1. **Always export props schema** - Required for Upstart editor integration
2. **Use TypeBox for all props** - Enables validation and editor support
3. **Provide descriptions** - Helps in the Upstart editor
4. **Use DaisyUI components** - Leverage the design system
5. **Make components reusable** - Avoid hardcoding values
6. **Extract complex logic** - Keep components focused
7. **Use semantic class names** - Follow DaisyUI patterns
8. **Add proper TypeScript types** - Use `Static<typeof props>`
9. **Handle empty states** - Show helpful messages when data is missing
10. **Test with different props** - Ensure flexibility
