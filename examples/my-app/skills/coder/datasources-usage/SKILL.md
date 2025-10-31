---
name: datasources-usage
description: Querying and using datasources (databases) in pages to display dynamic content. Use when building pages that need to fetch and display data from datasources.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Datasources Usage (for Coder Agent)

## Overview
Datasources represent a source of dynamic data that can be consumed by pages. Under the hood, it is backed by a database, but users don't manage it directly. *Datasource* is the SDK name, while *Database* is what users call it.

**IMPORTANT FOR CODERS:**
- You **CANNOT create or modify datasources** - that's the Data Architect's job
- You can only **READ** from datasources
- Datasources are read-only from your perspective
- Check if datasources exist before using them with filesystem tools

---

## API Reference

### `datasource(id: string): Knex`

**Import:**
```tsx
import { datasource } from "@upstart.gg/sdk";
```

**Description:**
Helper function that returns a Knex instance bound to the datasource SQLite table. This allows you to query the datasource using Knex query builder methods.

**Important:**
- **READ-ONLY**: You cannot write to a datasource, only read operations are allowed
- The datasource must exist in `./app/config/datasources/` before using it
- Returns a Knex query builder for chainable queries

**Usage:**
```tsx
const products = await datasource("products")
  .select('*')
  .where({ featured: true })
  .limit(10);
```

---

## Checking for Existing Datasources

Before using a datasource, check if it exists:
```
Use `ls` tool on: ./app/config/datasources/
```

Each datasource is a JSON file. The filename (without extension) is the datasource ID.

## Predefined Fields

All datasources automatically have these fields (managed by Upstart):
- `$id` - Unique identifier (string)
- `$slug` - URL-friendly unique string
- `$publicationDate` - Publication date-time
- `$lastModificationDate` - Last modification date-time

**Note:** Fields starting with `$` are protected and automatically managed.

## Querying Datasources

Use the `datasource()` helper in the page's `loader` function.

### Basic Query

```tsx
import { datasource } from "@upstart.gg/sdk";
import { type LoaderFunctionArgs } from "react-router";

export async function loader() {
  const products = await datasource("products")
    .select('name', 'description', 'price')
    .limit(10);

  return { products };
}
```

### Query with Filter

```tsx
export async function loader() {
  const featuredProducts = await datasource("products")
    .where({ featured: true })
    .select('name', 'price', 'image')
    .orderBy('price', 'desc')
    .limit(5);

  return { featuredProducts };
}
```

### Query with URL Parameter

```tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const product = await datasource("products")
    .where({ $id: params.productId })
    .select('name', 'description', 'price', 'image')
    .first();

  return { product };
}
```

### Query with $slug

```tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const post = await datasource("blog-posts")
    .where({ $slug: params.slug })
    .select('title', 'content', 'author', '$publicationDate')
    .first();

  return { post };
}
```

## Using Data in Components

```tsx
import { useLoaderData } from "react-router";
import { Page, Droppable, Draggable } from "@upstart.gg/components";

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Page>
      <Droppable id="products-section" direction="vertical" className="flex flex-col gap-4">
        {products.map((product, index) => (
          <Draggable key={product.$id} id={`product-${index}`}>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.description}</p>
                <p className="text-lg font-bold">${product.price}</p>
              </div>
            </div>
          </Draggable>
        ))}
      </Droppable>
    </Page>
  );
}
```

## Complete Example: Product Detail Page

```tsx
import { datasource, type PageAttributes } from "@upstart.gg/sdk";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Page, Droppable, Draggable } from "@upstart.gg/components";

export const attributes: PageAttributes = {
  path: "/products/:productId",
  label: "Product Detail Page",
  title: null, // Dynamic title
  description: null,
  keywords: null,
};

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await datasource("products")
    .where({ $id: params.productId })
    .select('name', 'image', 'description', 'price')
    .first();

  return { product };
}

export default function ProductDetailPage() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <Page>
      {/* Dynamic meta tags */}
      <title>{product.name}</title>
      <meta name="description" content={product.description} />

      <Droppable id="product-section" direction="vertical" className="my-8 flex flex-col items-center">
        <Draggable id="product-card">
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
              <img src={product.image} alt={product.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <p className="text-2xl font-bold">${product.price}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        </Draggable>
      </Droppable>
    </Page>
  );
}
```

## Common Patterns

### Listing Page with Pagination
```tsx
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = 12;

  const products = await datasource("products")
    .select('*')
    .limit(perPage)
    .offset((page - 1) * perPage);

  return { products, page };
}
```

### Detail Page with Related Items
```tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const product = await datasource("products")
    .where({ $id: params.id })
    .first();

  const relatedProducts = await datasource("products")
    .where({ category: product.category })
    .whereNot({ $id: product.$id })
    .limit(4);

  return { product, relatedProducts };
}
```

## Important Limitations

- Datasources are **flat structures** (no nested objects or arrays)
- Use multiple related datasources to model relationships
- Always check datasource exists before using it
- If you need a datasource that doesn't exist, use `reportFailure` with type: 'dependency-missing'

## When to Request a Datasource

If your task requires a datasource that doesn't exist:
1. Check `./app/config/datasources/` to confirm it's missing
2. Use `reportFailure` tool with type: 'dependency-missing'
3. Clearly state what datasource you need and why
4. Wait for Data Architect to create it
5. Resume your work once it exists
