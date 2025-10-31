---
name: typescript-react-best-practices
description: TypeScript and React coding standards, quality guidelines, and best practices for the Coder agent. Use when writing any code.
toolsets: []
---

# TypeScript & React Best Practices

## Code Quality Standards

### TypeScript Guidelines

1. **Code exclusively in TypeScript and TSX** (React with TypeScript)
2. **Avoid `any` type** - Use precise types and interfaces
3. **Use proper type imports** - `import type` for type-only imports
4. **Define interfaces for complex types**
5. **Use TypeBox for props and attributes** - Ensures runtime validation

```tsx
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// Bad
function UserCard({ user }: { user: any }) {  // Don't use 'any'
  return <div>{user.name}</div>;
}
```

### React Best Practices

1. **Never create inline components** in pages or layouts
2. **Always extract components** to `~/components/` directory
3. **Use functional components** exclusively
4. **Use hooks properly** (useState, useEffect, custom hooks)
5. **Follow React naming conventions** (PascalCase for components)

```tsx
// Bad - inline component
export default function HomePage() {
  const Feature = () => <div>Feature</div>;  // DON'T DO THIS
  return <Feature />;
}

// Good - extracted component
import Feature from "~/components/Feature";

export default function HomePage() {
  return <Feature />;
}
```

## Code Organization

### File Structure

```
~/components/
  ├── Navbar.tsx          # Component file
  ├── Footer.tsx
  └── cards/
      ├── ProductCard.tsx
      └── BlogCard.tsx

~/hooks/
  └── useAuth.ts

~/utils/
  └── formatting.ts

~/pages/
  └── index.tsx
```

### Component Structure

Every component file should follow this pattern:

```tsx
// 1. Imports
import { useState } from "react";
import { Type, type Static } from "@sinclair/typebox";
import OtherComponent from "~/components/OtherComponent";

// 2. TypeBox props schema
export const props = Type.Object({
  title: Type.String({ description: "Title" }),
  count: Type.Number({ description: "Initial count" }),
});

// 3. Component definition
export default function MyComponent({ title, count }: Static<typeof props>) {
  const [value, setValue] = useState(count);

  return (
    <div>
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}
```

## Modular & Well-Structured Code

### Keep Components Focused

Each component should have a single, clear responsibility.

```tsx
// Good - focused components
<ProductList products={products} />
<Pagination currentPage={page} totalPages={total} />

// Bad - doing too much in one component
<ProductPageWithEverything />
```

### Extract Reusable Logic

```tsx
// Custom hook
function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  const setStoredValue = (newValue: string) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, setStoredValue] as const;
}

// Usage
function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  // ...
}
```

## Error Handling

Always include proper error handling:

```tsx
// In loader functions
export async function loader() {
  try {
    const data = await datasource("products").select('*');
    return { data };
  } catch (error) {
    console.error("Failed to load products:", error);
    return { data: [], error: "Failed to load products" };
  }
}

// In components
function ProductList({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No products found</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.$id} product={product} />
      ))}
    </div>
  );
}
```

## Comments & Documentation

### When to Add Comments

1. **Complex logic** that isn't immediately obvious
2. **Business rules** that explain why, not what
3. **Workarounds** for platform limitations
4. **TODOs** for future improvements (sparingly)

```tsx
// Good comments
export default function PricingCalculator({ items }: Props) {
  // Apply 10% discount for orders over $100 (business rule from June 2024)
  const discount = total > 100 ? total * 0.1 : 0;

  // Workaround: API returns prices in cents, we need dollars
  const finalPrice = (total - discount) / 100;

  return <div>${finalPrice.toFixed(2)}</div>;
}
```

### Avoid Obvious Comments

```tsx
// Bad - obvious comment
const total = items.reduce((sum, item) => sum + item.price, 0);  // Calculate total

// Good - no comment needed, code is self-explanatory
const total = items.reduce((sum, item) => sum + item.price, 0);
```

## Code Formatting

### Indentation

- Use **2 spaces** for indentation (not tabs)
- Consistent indentation throughout

### Line Length

- Keep lines reasonably short (aim for 80-100 characters)
- Break long chains into multiple lines

```tsx
// Good
const products = await datasource("products")
  .where({ featured: true })
  .orderBy('price', 'desc')
  .limit(10);

// Acceptable but less readable
const products = await datasource("products").where({ featured: true }).orderBy('price', 'desc').limit(10);
```

## DaisyUI & Tailwind Usage

### Always Use DaisyUI Components

```tsx
// Good - using DaisyUI
<button className="btn btn-primary">Click me</button>

// Bad - custom styling when DaisyUI exists
<button className="px-4 py-2 bg-blue-600 rounded">Click me</button>
```

### Follow Tailwind Limitations

- Use semantic colors from theme (no raw colors like `bg-blue-500`)
- Use Tailwind's spacing scale
- Use DaisyUI's component classes

## Imports Organization

Organize imports in this order:

```tsx
// 1. React and external libraries
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Type, type Static } from "@sinclair/typebox";

// 2. Upstart SDK
import { datasource, type PageAttributes } from "@upstart.gg/sdk";
import { Page, Droppable, Draggable } from "@upstart.gg/components";

// 3. Your components
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

// 4. Utilities
import { formatDate } from "~/utils/formatting";
```

## Quality Checklist

Before finishing any code task, verify:

- [ ] No `any` types used
- [ ] All imports are correct and complete
- [ ] Components are extracted (not inline)
- [ ] Props use TypeBox schemas
- [ ] DaisyUI classes used where applicable
- [ ] Proper error handling included
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Code is properly indented (2 spaces)
- [ ] Comments explain complex logic
- [ ] No console.logs left in production code
- [ ] File linted successfully
- [ ] Code committed with descriptive message

## Content Standards

### Never Use Placeholder Content

- **No Lorem Ipsum** - write real, relevant content
- **No "Coming Soon"** - write actual content or ask for it
- **No "Example Company"** - use the actual business name
- **Full text content** - write complete, professional copy

```tsx
// Bad
<h1>Welcome to Our Website</h1>
<p>Lorem ipsum dolor sit amet...</p>

// Good
<h1>Transform Your Business with AI-Powered Solutions</h1>
<p>
  We help companies like yours leverage artificial intelligence to automate
  workflows, gain insights from data, and deliver exceptional customer
  experiences. Our platform is trusted by over 500 businesses worldwide.
</p>
```

### Write Professional, Complete Content

Every page should have:
1. **Clear value proposition** - What benefit does the user get?
2. **Specific details** - Real numbers, features, benefits
3. **Compelling copy** - Engage the reader
4. **Call to action** - What should they do next?

## Required Actions

### Always Lint After Editing

```bash
# After creating or modifying any file, always run:
lint
```

This ensures:
- No syntax errors
- TypeScript types are correct
- Code follows standards

### Always Commit When Done

```bash
# After completing a task, commit your work:
commit
```

Use clear, descriptive commit messages:
- "Add contact page with form"
- "Create product card component"
- "Update homepage hero section"
