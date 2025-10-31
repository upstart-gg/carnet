---
name: typebox-schemas
description: Working with JSON schemas and TypeBox for defining type-safe data structures. Use when defining component props, page attributes, datasource schemas, or forms schemas.
toolsets: []
---

# TypeBox and JSON Schemas

## Overview
The Upstart platform uses:
- **Plain JSON schemas (draft-07)** for datasources and forms schemas
- **TypeBox** (runtime schema library) for Page `attributes`, component `props`, and other entities

Both support custom string formats for precise validation and enhanced user experience in the Upstart editor.

## Supported String Formats

Use the appropriate format for string fields to leverage built-in validation and UI features:

- `date-time` - For date and time values
- `date` - For date-only values
- `email` - For email addresses
- `url` - For generic URLs
- `image` - Image URLs
- `file` - File URLs (used for documents like PDFs)
- `slug` - Slug strings (used for URL slugs)
- `nanoid` - Nanoid strings (used for unique IDs)
- `multiline` - Multiline plain text
- `richtext` - Rich text strings with HTML (can contain tags like `<strong>`)
- `secret` - Sensitive information like passwords or API keys

## Usage in TypeBox (Components & Pages)

```tsx
import { Type, type Static } from "@sinclair/typebox";

export const props = Type.Object({
  title: Type.String({
    description: "The heading title",
    minLength: 1,
    maxLength: 100
  }),
  email: Type.String({
    format: "email",
    description: "Contact email address"
  }),
  description: Type.String({
    format: "richtext",
    description: "Product description with formatting"
  }),
  imageUrl: Type.String({
    format: "image",
    description: "Product image"
  }),
});

export type Props = Static<typeof props>;
```

## Usage in JSON Schemas (Datasources & Forms)

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "title": "Post Title",
      "description": "The blog post title",
      "minLength": 1,
      "maxLength": 200
    },
    "slug": {
      "type": "string",
      "format": "slug",
      "title": "URL Slug",
      "description": "URL-friendly version of the title"
    },
    "content": {
      "type": "string",
      "format": "richtext",
      "title": "Content",
      "description": "The main blog post content"
    },
    "publishedAt": {
      "type": "string",
      "format": "date-time",
      "title": "Published Date",
      "description": "When the post was published"
    }
  },
  "required": ["title", "slug", "content"]
}
```

## Best Practices

- Always provide `description` fields to help users understand the purpose
- Use the most specific format available for strings
- For datasources, provide `title` and `description` for each field
- Choose between `multiline` and `richtext` based on whether HTML formatting is needed
- Use `secret` format for sensitive data to ensure proper handling in the UI
