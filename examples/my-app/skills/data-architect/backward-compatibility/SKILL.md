---
name: backward-compatibility
description: Understanding and applying backward compatibility constraints to schema changes. Use when modifying existing datasources or forms schemas.
toolsets: []
---

# Backward Compatibility

## Critical Constraint

⚠️ **Datasources and Forms Schemas can ONLY be modified in a backward-compatible way.**

The internal migration system is basic, so breaking changes are not supported.

## Why This Matters

### Initial Decisions Are PERMANENT
- Field names: **Forever**
- Field types: **Forever**
- Required fields: **Can only become optional, never the reverse**
- Enum values: **Can only add, never remove**

**If breaking changes are needed, a NEW schema must be created.** This is expensive and disruptive, so **getting it right the first time is paramount**.

## What You CAN Do (Compatible Changes)

### ✅ Add New Optional Fields
Safe to add new fields that aren't required:

```json
// BEFORE
{
  "properties": {
    "title": { "type": "string" },
    "content": { "type": "string" }
  },
  "required": ["title", "content"]
}

// AFTER - SAFE
{
  "properties": {
    "title": { "type": "string" },
    "content": { "type": "string" },
    "author": { "type": "string" }  // NEW optional field
  },
  "required": ["title", "content"]
}
```

### ✅ Make Required Fields Optional
Safe to remove fields from `required` array:

```json
// BEFORE
{
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" },
    "phone": { "type": "string" }
  },
  "required": ["name", "email", "phone"]
}

// AFTER - SAFE
{
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" },
    "phone": { "type": "string" }
  },
  "required": ["name", "email"]  // phone is now optional
}
```

### ✅ Expand Enum Values
Safe to add new values to enum:

```json
// BEFORE
{
  "properties": {
    "status": {
      "type": "string",
      "enum": ["draft", "published"]
    }
  }
}

// AFTER - SAFE
{
  "properties": {
    "status": {
      "type": "string",
      "enum": ["draft", "published", "archived"]  // NEW value
    }
  }
}
```

### ✅ Relax Constraints
Safe to make validation less strict:

```json
// BEFORE
{
  "properties": {
    "bio": {
      "type": "string",
      "maxLength": 200
    }
  }
}

// AFTER - SAFE
{
  "properties": {
    "bio": {
      "type": "string",
      "maxLength": 500  // INCREASED limit
    }
  }
}
```

### ✅ Update Descriptions
Safe to change titles and descriptions (metadata only):

```json
// BEFORE
{
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "description": "Your name"
    }
  }
}

// AFTER - SAFE
{
  "properties": {
    "name": {
      "type": "string",
      "title": "Full Name",  // CHANGED
      "description": "Your first and last name"  // CHANGED
    }
  }
}
```

## What You CANNOT Do (Breaking Changes)

### ❌ Remove Fields
Cannot remove existing fields:

```json
// BEFORE
{
  "properties": {
    "title": { "type": "string" },
    "subtitle": { "type": "string" }  // Existing field
  }
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "title": { "type": "string" }
    // subtitle removed - BREAKS COMPATIBILITY!
  }
}
```

**Alternative:** Keep the field but make it optional if it's currently required.

### ❌ Rename Fields
Cannot rename existing fields:

```json
// BEFORE
{
  "properties": {
    "email": { "type": "string", "format": "email" }
  }
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "emailAddress": { "type": "string", "format": "email" }  // RENAMED - BREAKS!
  }
}
```

**Alternative:** Add new field with new name, keep old field for backward compatibility.

### ❌ Change Field Types
Cannot change the type of existing fields:

```json
// BEFORE
{
  "properties": {
    "price": { "type": "string" }
  }
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "price": { "type": "number" }  // TYPE CHANGED - BREAKS!
  }
}
```

**Alternative:** Add new field with correct type, deprecate old field.

### ❌ Make Optional Fields Required
Cannot add fields to `required` array:

```json
// BEFORE
{
  "properties": {
    "name": { "type": "string" },
    "bio": { "type": "string" }
  },
  "required": ["name"]
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "name": { "type": "string" },
    "bio": { "type": "string" }
  },
  "required": ["name", "bio"]  // bio now required - BREAKS!
}
```

**Alternative:** Cannot be done. If field must be required, need new schema.

### ❌ Remove Enum Values
Cannot remove values from enum:

```json
// BEFORE
{
  "properties": {
    "status": {
      "type": "string",
      "enum": ["draft", "published", "archived"]
    }
  }
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "status": {
      "type": "string",
      "enum": ["draft", "published"]  // archived removed - BREAKS!
    }
  }
}
```

**Alternative:** Keep all enum values, just don't use deprecated ones in UI.

### ❌ Strengthen Constraints
Cannot make validation more strict:

```json
// BEFORE
{
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 200
    }
  }
}

// AFTER - BREAKING (DON'T DO THIS!)
{
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 100  // DECREASED limit - BREAKS!
    }
  }
}
```

**Alternative:** Cannot be done if existing data exceeds new limit.

## Design Strategies for Future Flexibility

### 1. Use Optional Fields by Default
When uncertain, make fields optional:

```json
{
  "properties": {
    "title": { "type": "string" },
    "subtitle": { "type": "string" },  // optional by default
    "featured": { "type": "boolean" }  // optional
  },
  "required": ["title"]  // Only truly essential fields
}
```

### 2. Use String Over Enum When Values Might Expand
If unsure about all possible values:

```json
// MORE FLEXIBLE
{
  "properties": {
    "category": { "type": "string" }  // Free-form
  }
}

// LESS FLEXIBLE
{
  "properties": {
    "category": {
      "type": "string",
      "enum": ["A", "B", "C"]  // Can only add, never remove
    }
  }
}
```

### 3. Plan Generous Constraints
Better to have loose constraints than tight ones:

```json
{
  "properties": {
    "bio": {
      "type": "string",
      "maxLength": 1000  // Generous limit
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150  // Generous range
    }
  }
}
```

### 4. Choose Field Names Carefully
Field names are **permanent** - make them:
- Clear and unambiguous
- Future-proof
- Consistent with naming conventions

```json
// GOOD - clear, future-proof
{
  "publishedAt": { "type": "string", "format": "date-time" },
  "authorName": { "type": "string" },
  "isPublished": { "type": "boolean" }
}

// QUESTIONABLE - too generic or ambiguous
{
  "date": { "type": "string", "format": "date-time" },  // Which date?
  "name": { "type": "string" },  // Name of what?
  "flag": { "type": "boolean" }  // What flag?
}
```

## When Breaking Changes Are Needed

If you must make breaking changes:

### Option 1: Add New Fields
Keep old field, add new one:

```json
{
  "properties": {
    "price": { "type": "string" },  // OLD - keep for compatibility
    "priceAmount": { "type": "number" }  // NEW - correct type
  }
}
```

### Option 2: Create New Schema
Create entirely new schema with different ID:

```json
// Old schema: blog-posts-v1.json
// New schema: blog-posts-v2.json
```

**This requires:**
- Migrating existing data manually
- Updating code to use new schema
- Handling both schemas during transition

### Option 3: Request User Input
If breaking changes seem necessary, use `reportFailure`:

```
Type: dependency-missing
Message: "The user requested changing the 'price' field from string to number, but this is a breaking change that's not supported.

Options:
1. Add a new 'priceAmount' field as number, keep 'price' as string
2. Create a new 'products-v2' datasource with correct types
3. Accept the limitation and continue with string type

Please clarify with the user which approach they prefer."
```

## Design Review Checklist

Before finalizing a schema, ask:

- [ ] Are field names clear and future-proof?
- [ ] Have I used the most flexible types possible?
- [ ] Are fields optional unless absolutely required?
- [ ] If using enums, am I confident values won't need to change?
- [ ] Are constraints generous enough for future needs?
- [ ] Have I documented WHY I made these choices?
- [ ] Can this schema handle likely future requirements?

## Documentation

Always document your design decisions in `data-architect_decisions` memory:

```
Created 'blog-posts' datasource:
- Used optional 'author' field (might not always have author info)
- Used string for 'category' instead of enum (categories may expand)
- Set maxLength 500 for 'excerpt' (generous for future flexibility)
- Made 'featured' boolean optional (not all posts need this)
- Field names chosen to be self-documenting and permanent
```

## Remember

- **Initial decisions are PERMANENT** due to backward compatibility
- **Get it right the first time** through careful planning
- **When uncertain, ask for clarification** via reportFailure
- **Document your reasoning** for future reference
- **Think strategically** about future needs, not just current requirements
