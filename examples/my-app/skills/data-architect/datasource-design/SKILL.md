---
name: datasource-design
description: Designing datasource schemas for storing and querying dynamic content. Use when creating datasources for blogs, products, or any read-only data that pages will display.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Datasource Design

## Overview
Datasources represent sources of dynamic data that pages can query and display. They are backed by a database but users don't manage them directly.

**Key Points:**
- Datasources are **read-only** for Coder agents
- Automatically include predefined fields ($id, $slug, $publicationDate, $lastModificationDate)
- Located in `./app/config/datasources/`
- Each JSON file's name (without extension) is the datasource ID
- Must always be backward compatible (see backward-compatibility skill)

## When to Create a Datasource

Create datasources for:
- **Blog posts** - Articles, news, updates
- **Products** - E-commerce items, services
- **Projects** - Portfolio items, case studies
- **Team members** - About page, staff directory
- **Testimonials** - Customer reviews, feedback
- **FAQ items** - Questions and answers
- **Events** - Calendar, workshops, webinars
- Any data that pages need to **display** (not collect)

## Datasource vs Forms Schema

- **Datasource**: Data you create/manage (blog posts, products) - pages READ from it
- **Forms Schema**: Data users submit (contact forms, signups) - pages WRITE to it

## File Location

Each datasource is defined in a JSON file in the `~/config/datasources/` directory (or `./app/config/datasources/`).

The **filename** (without extension) is the unique ID of the datasource.

**Example:**
- File: `./app/config/datasources/blog-posts.json`
- Datasource ID: `"blog-posts"`

## Schema Type

Datasources should conform to the following JSON schema:

```json
{{ DATASOURCE_SCHEMA }}
```

## Important Limitations

**Flat Structure Only:**
- Datasources are **flat structures** - they do not support nested objects or arrays
- If you need relationships, create multiple related datasources instead

**Automatic Migrations:**
- Migrations are automatic and managed by Upstart
- You cannot define custom migrations

**Backward Compatibility Required:**
- Editing a datasource schema **MUST always be backward compatible**
- The internal migration system is basic
- See the `backward-compatibility` skill for details

## Predefined Fields

Some predefined fields are automatically added to every datasource and indexed by Upstart:

- **`$id`** - Unique identifier for each record (string)
- **`$slug`** - URL-friendly unique string that can be used to identify a record in a URL
- **`$publicationDate`** - Date-time string representing the publication date of the record
- **`$lastModificationDate`** - Date-time string representing the last modification date

**Important:**
- These fields are automatically added and managed by Upstart - no need to define them manually
- These fields are **protected** and cannot be altered or deleted
- More generally, all fields starting with a `$` sign are protected

## Datasource Structure

```json
{
  "id": "blog-posts",
  "label": "Blog Posts",
  "description": "Collection of blog articles",
  "schema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "title": "Post Title",
        "description": "The blog post title",
        "minLength": 1,
        "maxLength": 200
      },
      "excerpt": {
        "type": "string",
        "format": "multiline",
        "title": "Excerpt",
        "description": "Short summary for listings",
        "maxLength": 300
      },
      "content": {
        "type": "string",
        "format": "richtext",
        "title": "Content",
        "description": "Main post content with HTML formatting"
      },
      "author": {
        "type": "string",
        "title": "Author Name",
        "description": "Post author"
      },
      "category": {
        "type": "string",
        "title": "Category",
        "description": "Post category",
        "enum": ["Technology", "Business", "Design", "Other"]
      },
      "featured": {
        "type": "boolean",
        "title": "Featured Post",
        "description": "Show on homepage?",
        "default": false
      },
      "featuredImage": {
        "type": "string",
        "format": "image",
        "title": "Featured Image",
        "description": "Main post image URL"
      },
      "tags": {
        "type": "array",
        "items": { "type": "string" },
        "title": "Tags",
        "description": "Post tags for filtering"
      }
    },
    "required": ["title", "content"]
  },
  "examples": [
    {
      "title": "Getting Started with Our Platform",
      "excerpt": "Learn the basics of using our platform effectively",
      "content": "<p>Welcome to our platform! Here's what you need to know...</p>",
      "author": "John Smith",
      "category": "Technology",
      "featured": true,
      "featuredImage": "/images/blog/getting-started.jpg",
      "tags": ["tutorial", "getting-started"]
    }
    // ... 5 more examples (6 total required)
  ]
}
```

## Predefined Fields

These fields are automatically added to every datasource:
- `$id` - Unique identifier (string)
- `$slug` - URL-friendly unique string
- `$publicationDate` - Publication date-time
- `$lastModificationDate` - Last modification date-time

**Never define these manually** - they're managed by Upstart.

## Field Types & Formats

### Common Field Types

**String fields:**
```json
{
  "type": "string",
  "title": "Field Label",
  "description": "What this field is for"
}
```

**With format:**
```json
{
  "type": "string",
  "format": "email",  // or: url, image, richtext, multiline, slug, date, date-time
  "title": "Email Address"
}
```

**Number fields:**
```json
{
  "type": "number",
  "title": "Price",
  "description": "Product price in USD",
  "minimum": 0
}
```

**Boolean fields:**
```json
{
  "type": "boolean",
  "title": "Is Featured",
  "description": "Show on homepage",
  "default": false
}
```

**Enum fields:**
```json
{
  "type": "string",
  "title": "Status",
  "enum": ["draft", "published", "archived"]
}
```

**Array fields:**
```json
{
  "type": "array",
  "items": { "type": "string" },
  "title": "Tags",
  "description": "List of tags"
}
```

## Design Process

### 1. Analyze Requirements
- What entity are we modeling? (posts, products, etc.)
- What fields are needed?
- What fields are required vs optional?
- How will this data be queried?
- Will data be filtered or sorted?

### 2. Check for Existing Datasources
```bash
ls ./app/config/datasources/
```

Ask yourself:
- Does a similar datasource exist?
- Should this be a field in an existing datasource?
- Is this truly a separate entity?

### 3. Apply Data Modeling Philosophy
See the `data-modeling-philosophy` skill for guidance on:
- Consolidation over proliferation
- When to use properties vs separate tables
- Avoiding premature fragmentation

### 4. Design the Schema
- Choose appropriate field types
- Use specific formats (email, url, image, etc.)
- Set reasonable constraints (min/max length)
- Provide clear titles and descriptions
- Mark required fields

### 5. Create Examples
**Always provide 6 examples** of valid data.
Examples become seed data for development and testing.

Make examples:
- Realistic and relevant
- Diverse (different categories, types, etc.)
- Complete (all required fields)
- Representative of actual use cases

### 6. Document Decisions
Update `data-architect_decisions` memory with:
- Why you chose this structure
- Key design decisions
- Any trade-offs made
- Future extensibility considerations

## Common Datasource Patterns

### Blog Posts
```json
{
  "id": "blog-posts",
  "schema": {
    "properties": {
      "title": { "type": "string" },
      "excerpt": { "type": "string", "format": "multiline" },
      "content": { "type": "string", "format": "richtext" },
      "author": { "type": "string" },
      "category": { "type": "string", "enum": [...] },
      "featured": { "type": "boolean" },
      "featuredImage": { "type": "string", "format": "image" },
      "tags": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```

### Products
```json
{
  "id": "products",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "description": { "type": "string", "format": "richtext" },
      "price": { "type": "number", "minimum": 0 },
      "compareAtPrice": { "type": "number", "minimum": 0 },
      "inStock": { "type": "boolean" },
      "category": { "type": "string" },
      "images": { "type": "array", "items": { "type": "string", "format": "image" } },
      "sku": { "type": "string" },
      "featured": { "type": "boolean" }
    }
  }
}
```

### Team Members
```json
{
  "id": "team-members",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "role": { "type": "string" },
      "bio": { "type": "string", "format": "multiline" },
      "photo": { "type": "string", "format": "image" },
      "email": { "type": "string", "format": "email" },
      "linkedin": { "type": "string", "format": "url" },
      "order": { "type": "number", "description": "Display order" }
    }
  }
}
```

## Best Practices

1. **Always provide 6 examples** - Required for seed data
2. **Use appropriate formats** - email, url, image, richtext, etc.
3. **Provide titles and descriptions** - Helps users understand fields
4. **Set sensible constraints** - Min/max lengths, minimums for numbers
5. **Consider future needs** - Use optional fields when uncertain
6. **Use properties over proliferation** - Boolean flags instead of separate datasources
7. **Think about queries** - How will coders filter and sort this data?
8. **Document your reasoning** - Why did you structure it this way?

## Important Limitations

- **Flat structure only** - No nested objects or arrays of objects
- **Use multiple datasources for relations** - Can't do joins, but can query separately
- **Backward compatibility required** - See backward-compatibility skill
- **Automatic migrations only** - Can't write custom migration scripts

## Workflow

1. **Read memory** - Understand project context
2. **Analyze requirements** - What data needs to be stored?
3. **Check existing datasources** - Avoid duplicates
4. **Design schema** - Apply best practices
5. **Create 6 examples** - Realistic seed data
6. **Create file** in `./app/config/datasources/[id].json`
7. **Lint** - Validate the schema
8. **Update memory** - Document decisions
9. **Commit** - Save changes
10. **Report completion** - Summarize what was created

## Handling Conflicts

If requested datasource conflicts with existing structure:
1. Use `reportFailure` to explain the conflict
2. Suggest better alternative (e.g., add field to existing datasource)
3. Let main agent communicate with user
4. Wait for clarification before proceeding
