---
name: data-modeling-philosophy
description: Core principles for data modeling - consolidation over proliferation, when to separate entities, and avoiding premature fragmentation. Use when making structural design decisions.
toolsets: []
---

# Data Modeling Philosophy

## Core Principle: Think Strategically, Not Literally

When given requirements, **deeply analyze** the underlying data model:
1. **What entities truly exist?** Not just surface-level categories
2. **What are intrinsic properties vs states?** Properties are part of the entity, states are temporary
3. **How will this evolve?** Plan for future extensibility
4. **What queries will be common?** Optimize for actual usage

## Consolidation Over Proliferation

**Default to consolidation** - only create multiple datasources when there's a strong architectural reason.

### The Anti-Pattern: Premature Fragmentation

❌ **Bad Examples:**
- Creating `featured-recipes` and `regular-recipes` datasources
- Creating `draft-posts` and `published-posts` datasources
- Creating `premium-users` and `free-users` datasources
- Creating `active-products` and `archived-products` datasources

### The Correct Approach: Properties Over Tables

✅ **Good Examples:**
- ONE `recipes` datasource with `featured: boolean` field
- ONE `posts` datasource with `status: enum` field (draft/published/archived)
- ONE `users` datasource with `subscription_tier` field
- ONE `products` datasource with `status` field

## When to Actually Separate Datasources

Separate datasources ARE appropriate when:

### 1. Fundamentally Different Entities
Entities with completely different attributes and purposes.

**Examples:**
- `users` vs `products` - Completely different concepts
- `blog-posts` vs `products` - Different types of content
- `team-members` vs `testimonials` - Different purposes

### 2. Clear Relationship Patterns
Parent-child or related entity relationships.

**Examples:**
- `orders` and `order-items` - One-to-many relationship
- `courses` and `lessons` - Hierarchical structure
- `products` and `reviews` - Related but distinct

### 3. Different Data Access Patterns
Entities accessed in fundamentally different ways.

**Examples:**
- `public-articles` (displayed on site) vs `admin-logs` (internal only)
- `realtime-metrics` (frequent updates) vs `historical-reports` (static)

### 4. Security/Privacy Boundaries
Data that requires different access controls.

**Examples:**
- `user-profiles` (public) vs `user-private-data` (sensitive)
- `public-content` vs `draft-content` (if drafts contain sensitive info)

## Red Flags: When You're Probably Fragmenting

Ask yourself these questions:

### 🚩 "Is this just a category or state?"
If the only difference is a single property value, use a field instead.

**Example:**
- Request: "Create featured-products datasource"
- Question: "Is this just products where `featured = true`?"
- Answer: YES → Use a `featured` field in `products`

### 🚩 "Would I filter for this in a query?"
If you'd query `WHERE featured = true`, it should be a field, not a table.

**Example:**
- Request: "Create archived-posts datasource"
- Question: "Would I query `WHERE status = 'archived'`?"
- Answer: YES → Use a `status` field in `posts`

### 🚩 "Do both entities have the same fields?"
If they have identical or mostly identical schemas, consolidate them.

**Example:**
- Request: "Create recipes and featured-recipes"
- Question: "Do they have the same fields (title, ingredients, instructions)?"
- Answer: YES → One `recipes` datasource with `featured` field

### 🚩 "Is this just a lifecycle stage?"
If it represents the same entity at different stages, use a status field.

**Example:**
- Request: "Create draft-articles and published-articles"
- Question: "Is this the same article in different lifecycle stages?"
- Answer: YES → One `articles` with `status: enum['draft', 'published', 'archived']`

## Common Consolidation Patterns

### Pattern 1: Boolean Flags
For binary distinctions:

```json
{
  "id": "products",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "featured": { "type": "boolean", "default": false },
      "onSale": { "type": "boolean", "default": false },
      "inStock": { "type": "boolean", "default": true }
    }
  }
}
```

Query in code: `datasource("products").where({ featured: true })`

### Pattern 2: Status Enums
For lifecycle stages or states:

```json
{
  "id": "blog-posts",
  "schema": {
    "properties": {
      "title": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ["draft", "published", "archived"],
        "default": "draft"
      }
    }
  }
}
```

Query in code: `datasource("blog-posts").where({ status: 'published' })`

### Pattern 3: Category/Type Fields
For different types of the same entity:

```json
{
  "id": "content-items",
  "schema": {
    "properties": {
      "title": { "type": "string" },
      "type": {
        "type": "string",
        "enum": ["article", "video", "podcast", "infographic"]
      },
      "content": { "type": "string", "format": "richtext" },
      "mediaUrl": { "type": "string", "format": "url" }  // For video/podcast
    }
  }
}
```

### Pattern 4: Tier/Level Fields
For different tiers or levels:

```json
{
  "id": "users",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "subscriptionTier": {
        "type": "string",
        "enum": ["free", "basic", "premium", "enterprise"]
      }
    }
  }
}
```

## Design Process Checklist

Before creating a datasource, ask:

- [ ] Does a datasource for this entity already exist?
- [ ] Could this be a field in an existing datasource?
- [ ] Are these truly different entities or just states/categories?
- [ ] Would I filter for this in a query? (If yes, use a field)
- [ ] Do both have the same or very similar fields? (If yes, consolidate)
- [ ] Is this a lifecycle stage? (If yes, use status enum)
- [ ] Is this a category/type? (If yes, use type field)
- [ ] Will this structure support future queries efficiently?
- [ ] Is this design flexible for future requirements?

## Explaining to Main Agent

When you identify that a request should be consolidated, use `reportFailure` to explain:

**Example:**
```
Type: dependency-missing
Message: "The user requested a 'featured-recipes' datasource, but this should actually be a 'featured' boolean field in the existing (or new) 'recipes' datasource. Creating separate datasources for different states of the same entity leads to data duplication and maintenance issues.

Recommendation: Create a single 'recipes' datasource with a 'featured: boolean' field. This allows easy filtering (`WHERE featured = true`) and keeps all recipe data in one place.

Please confirm with the user that this approach works for their needs."
```

## Real-World Examples

### Example 1: Blog System

❌ **Bad Design (Fragmented):**
- `featured-blog-posts`
- `regular-blog-posts`
- `draft-blog-posts`

✅ **Good Design (Consolidated):**
```json
{
  "id": "blog-posts",
  "schema": {
    "properties": {
      "title": { "type": "string" },
      "content": { "type": "string", "format": "richtext" },
      "status": {
        "type": "string",
        "enum": ["draft", "published", "archived"]
      },
      "featured": { "type": "boolean" }
    }
  }
}
```

Query: `datasource("blog-posts").where({ status: 'published', featured: true })`

### Example 2: E-commerce

❌ **Bad Design (Fragmented):**
- `featured-products`
- `sale-products`
- `out-of-stock-products`

✅ **Good Design (Consolidated):**
```json
{
  "id": "products",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "price": { "type": "number" },
      "featured": { "type": "boolean" },
      "onSale": { "type": "boolean" },
      "stock": { "type": "number", "minimum": 0 }
    }
  }
}
```

Queries:
- Featured: `datasource("products").where({ featured: true })`
- On sale: `datasource("products").where({ onSale: true })`
- In stock: `datasource("products").where('stock', '>', 0)`

### Example 3: Team Directory

❌ **Bad Design (Fragmented):**
- `executives`
- `employees`
- `contractors`

✅ **Good Design (Consolidated):**
```json
{
  "id": "team-members",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "role": { "type": "string" },
      "employmentType": {
        "type": "string",
        "enum": ["full-time", "part-time", "contractor", "executive"]
      },
      "isLeadership": { "type": "boolean" }
    }
  }
}
```

## Remember: Permanent Decisions

Because of **backward compatibility constraints**, initial design decisions are mostly **permanent**. You cannot:
- Remove fields
- Rename fields
- Change field types
- Make optional fields required

This makes strategic thinking CRITICAL. Get it right the first time by:
1. Thinking deeply about the data model
2. Considering future use cases
3. Using flexible structures (optional fields, enums, booleans)
4. Requesting clarification when uncertain
5. Documenting your reasoning in memory
