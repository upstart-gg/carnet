---
name: pages
description: Creating and structuring pages with Page attributes, Droppable and Draggable components. Use when building any page in the website.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Pages

## Overview
Every page in Upstart is a TypeScript/React component wrapped in a `<Page>` component. Pages define routes, metadata, and content structure.

## Page Structure

A page file must follow this structure:
1. Import statements at the top
2. Export of `attributes` constant (PageAttributes)
3. Optional `loader` function export (for data fetching)
4. Optional `action` function export (for form handling)
5. Default export of React component with `<Page>` as root element

## Page Attributes

Page attributes define metadata and routing for the page.

```tsx
import { type PageAttributes } from "@upstart.gg/sdk";

export const attributes: PageAttributes = {
  path: "/about",           // Required: URL path for this page
  layout: "default",        // Optional: Layout to use (default: "default")
  label: "About Us",        // Required: Display name in editor (not public)
  title: "About Our Company", // Optional: Page title (editable in editor)
  description: "Learn about our company", // Optional: Meta description
  keywords: "about, company, team", // Optional: Meta keywords
  language: "en",           // Optional: Override site language
};
```

### Page Attributes Schema

Page attributes should conform to the following JSON schema:

```json
{{ PAGE_ATTRIBUTES_SCHEMA }}
```

### Dynamic Pages

For pages with URL parameters, set `title`, `description`, and `keywords` to `null` and use dynamic meta tags inside the component:

```tsx
export const attributes: PageAttributes = {
  path: "/products/:productId",
  label: "Product Detail",
  title: null,  // Dynamic title in component
  description: null,
  keywords: null,
};

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <Page>
      <title>{product.name}</title>
      <meta name="description" content={product.description} />
      {/* Page content */}
    </Page>
  );
}
```

## The `<Page>` Component

The `<Page>` component is the root wrapper for all page content.

### Rules
- Must be the root element of your page component
- Can only contain:
  - One or more `<Droppable>` components
  - `<title>`, `<meta>`, and `<link>` tags for dynamic metadata

### Props
- `className` - Optional additional class names

### Example
```tsx
import { Page, Droppable, Draggable } from "@upstart.gg/components";

export default function HomePage() {
  return (
    <Page className="bg-base-100">
      <title>Welcome to Our Site</title>
      <Droppable id="hero" direction="vertical" className="flex flex-col">
        <Draggable id="hero-title">
          <h1>Welcome!</h1>
        </Draggable>
      </Droppable>
    </Page>
  );
}
```

## The `<Droppable>` Component

A `<Droppable>` is a container for `<Draggable>` components. It defines sections of the page.

### Rules
- Each `<Droppable>` must have a unique `id` prop
- Can only contain `<Draggable>` components as direct children
- Cannot be conditionally rendered or inside loops
- Rendered as a `<div>` element

### Props
- `id` - Required unique identifier
- `direction` - `"horizontal"` or `"vertical"` (guides drag-and-drop behavior)
- `className` - Class names (should use flex layout matching direction)

### Examples

**Vertical section:**
```tsx
<Droppable
  id="main-content"
  direction="vertical"
  className="flex flex-col gap-8 p-8"
>
  <Draggable id="heading">
    <h1>Page Title</h1>
  </Draggable>
  <Draggable id="content">
    <p>Page content here</p>
  </Draggable>
</Droppable>
```

**Horizontal section:**
```tsx
<Droppable
  id="features"
  direction="horizontal"
  className="flex flex-row gap-4 justify-around"
>
  <Draggable id="feature-1">
    <div className="card">Feature 1</div>
  </Draggable>
  <Draggable id="feature-2">
    <div className="card">Feature 2</div>
  </Draggable>
</Droppable>
```

## The `<Draggable>` Component

A `<Draggable>` wraps content that can be dragged in the Upstart Editor.

### Rules
- Each `<Draggable>` must have a unique `id` prop
- Cannot be conditionally rendered or inside loops
- Cannot have another `<Draggable>` as direct child
- Rendered as a `<div>` with `display: contents` (doesn't affect layout)

### Props
- `id` - Required unique identifier

### Important Notes
- No styling or className can be applied to Draggable itself
- Style the content inside the Draggable instead
- The Draggable wrapper is invisible to layout

### Examples

**Simple text draggable:**
```tsx
<Draggable id="welcome-text">
  <h1 className="text-4xl font-bold">Welcome</h1>
</Draggable>
```

**Component draggable:**
```tsx
<Draggable id="navbar">
  <Navbar />
</Draggable>
```

**Complex content:**
```tsx
<Draggable id="hero-section">
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Hello there</h1>
        <p className="py-6">Welcome to our amazing website</p>
        <button className="btn btn-primary">Get Started</button>
      </div>
    </div>
  </div>
</Draggable>
```

## Working with Dynamic Data

### Using Loader Data
```tsx
import { datasource } from "@upstart.gg/sdk";
import { useLoaderData } from "react-router";

export async function loader() {
  const posts = await datasource("blog-posts")
    .select('*')
    .limit(10);
  return { posts };
}

export default function BlogPage() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <Page>
      <Droppable id="posts-list" direction="vertical" className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <Draggable key={post.$id} id={`post-${index}`}>
            <article className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
            </article>
          </Draggable>
        ))}
      </Droppable>
    </Page>
  );
}
```

## Complete Page Example

```tsx
import { type PageAttributes, datasource } from "@upstart.gg/sdk";
import { Page, Droppable, Draggable } from "@upstart.gg/components";
import { useLoaderData } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const attributes: PageAttributes = {
  path: "/blog",
  label: "Blog Page",
  title: "Our Blog",
  description: "Read our latest articles and insights",
  keywords: "blog, articles, news",
};

export async function loader() {
  const posts = await datasource("blog-posts")
    .select('*')
    .orderBy('$publicationDate', 'desc')
    .limit(10);
  return { posts };
}

export default function BlogPage() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <Page>
      <Droppable id="hero-section" direction="vertical" className="flex flex-col items-center justify-center min-h-[40vh] bg-primary text-primary-content">
        <Draggable id="hero-title">
          <h1 className="text-5xl font-bold">Our Blog</h1>
        </Draggable>
        <Draggable id="hero-subtitle">
          <p className="text-xl mt-4">Insights, stories, and updates</p>
        </Draggable>
      </Droppable>

      <Droppable id="posts-grid" direction="vertical" className="container mx-auto py-12 flex flex-col gap-8">
        {posts.map((post, index) => (
          <Draggable key={post.$id} id={`post-${index}`}>
            <article className="card bg-base-100 shadow-sm hover:shadow-md transition">
              <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p className="text-sm text-base-content/70">{new Date(post.$publicationDate).toLocaleDateString()}</p>
                <p>{post.excerpt}</p>
                <div className="card-actions justify-end">
                  <a href={`/blog/${post.$slug}`} className="btn btn-primary">Read More</a>
                </div>
              </div>
            </article>
          </Draggable>
        ))}
      </Droppable>
    </Page>
  );
}
```

## Layouts

Layouts define common elements that wrap pages, such as navbar and footer. Pages use layouts to maintain consistent structure across multiple pages.

### Layout Location

Layouts are React components stored in the `./app/layouts/` folder.

### Default Layout

By default, a `_default.tsx` layout is already setup with minimal structure. It only includes an `<Outlet />` component from `react-router` to render the page content.

**Default layout for a new site:**

```tsx
// app/layouts/_default.tsx
import { Outlet } from "react-router";

// Export the Layout using a default export
export default function Layout() {
  // A layout must always render an <Outlet /> component to render the page content
  return <Outlet />;
}
```

You can customize the default layout to add a navbar, footer, or any other common elements.

### Creating Custom Layouts

You can create and use multiple layouts for different pages. Pages specify which layout to use via the `layout` attribute in the page attributes.

**Example layout with navbar and footer:**

```tsx
// app/layouts/main-layout.tsx
import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
```

**Using the layout in a page:**

```tsx
export const attributes: PageAttributes = {
  path: "/about",
  layout: "main-layout",  // Use main-layout.tsx
  label: "About Page",
  title: "About Us",
};
```

### Layout Rules

1. **Always include `<Outlet />`** - This is where the page content will be rendered
2. **Use default export** - Export the layout component as default
3. **Import from `react-router`** - Use `import { Outlet } from "react-router"`
4. **Store in `./app/layouts/`** - All layout files must be in this directory
5. **Reference by filename** - Use the filename (without extension) in page attributes

### Layout Best Practices

- Create layouts for different sections (public pages, admin pages, landing pages)
- Keep layouts simple and focused on structure
- Extract complex components (Navbar, Footer) to `~/components/`
- Use consistent naming (e.g., `main-layout.tsx`, `admin-layout.tsx`)

---

## Best Practices

1. **Use meaningful IDs** - Make Droppable/Draggable IDs descriptive
2. **Don't nest components in page files** - Extract to `~/components/` instead
3. **Use DaisyUI classes** - Leverage the design system
4. **Write complete content** - No placeholders or lorem ipsum
5. **Dynamic pages use null titles** - Allow runtime title generation
6. **One Draggable per logical unit** - Don't over-segment or under-segment
7. **Flex layouts for Droppables** - Always use flex with appropriate direction
8. **Use layouts for consistency** - Share navbar/footer across pages with layouts
