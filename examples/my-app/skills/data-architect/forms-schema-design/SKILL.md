---
name: forms-schema-design
description: Designing forms schemas for collecting user-submitted data through forms and surveys. Use when creating contact forms, signup forms, or any user input collection.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Forms Schema Design

## Overview
Forms Schemas define destinations for data submitted by users through forms and surveys. They're optimized for **collecting** data rather than displaying it.

**Key Differences from Datasources:**
- Forms Schemas: Users **submit** data (contact forms, signups, surveys)
- Datasources: Pages **display** data (blog posts, products)

**Important:**
- Cannot be queried from public pages
- Only used to store submitted data
- Can be shared across multiple sites
- Must always be backward compatible

## When to Create a Forms Schema

Create forms schemas for:
- **Contact forms** - User inquiries
- **Newsletter signups** - Email collection
- **Job applications** - Candidate submissions
- **Survey responses** - User feedback
- **Booking requests** - Reservations, appointments
- **Quote requests** - Sales inquiries
- **Event registrations** - Sign-ups for events
- Any data that **users submit** (not data you create)

## File Location

Each forms schema is defined in a JSON file in the `./app/config/forms-schemas/` directory.

The **filename** (without extension) is the unique ID of the forms schema.

**Example:**
- File: `./app/config/forms-schemas/contact-form.json`
- Forms Schema ID: `"contact-form"`

## Schema Type

Forms Schemas should conform to the following JSON schema:

```json
{{ DATARECORD_SCHEMA }}
```

## Important Limitations

**Flat Structure Only:**
- Forms Schemas are **flat structures** - they do not support nested objects or arrays
- Keep form structures simple and flat

**Automatic Migrations:**
- Migrations are automatic and managed by Upstart
- You cannot define custom migrations

**Backward Compatibility Required:**
- Editing a forms schema **MUST always be backward compatible**
- The internal migration system is basic
- See the `backward-compatibility` skill for details

## Sharing Forms Schemas

You can opt-in to share a forms schema between all the sites of the same user or organization using the `shared` attribute in the forms schema definition.

**When shared:**
- A single forms schema can be used by multiple sites
- Data submitted from different sites are aggregated in a single forms schema
- The site ID is automatically added to each record to identify the source site

**Use Case Example:**
Collect leads from multiple mini-sites into a single forms schema for centralized management.

## Forms Schema Structure

```json
{
  "id": "contact-form",
  "label": "Contact Form Submissions",
  "description": "Messages from website contact form",
  "shared": false,  // Can this be shared across multiple sites?
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Full Name",
        "description": "Visitor's name",
        "minLength": 1,
        "maxLength": 100
      },
      "email": {
        "type": "string",
        "format": "email",
        "title": "Email Address",
        "description": "Contact email"
      },
      "phone": {
        "type": "string",
        "title": "Phone Number",
        "description": "Optional phone contact",
        "pattern": "^[0-9\\-\\+\\(\\)\\s]*$"
      },
      "subject": {
        "type": "string",
        "title": "Subject",
        "description": "Message subject",
        "enum": ["General Inquiry", "Support", "Sales", "Partnership", "Other"]
      },
      "message": {
        "type": "string",
        "format": "multiline",
        "title": "Message",
        "description": "The user's message",
        "minLength": 10,
        "maxLength": 2000
      },
      "consent": {
        "type": "boolean",
        "title": "Privacy Consent",
        "description": "User agreed to privacy policy",
        "const": true  // Must be true
      }
    },
    "required": ["name", "email", "message", "consent"]
  }
}
```

## Design Process

### 1. Identify Data to Collect
- What information do you need from users?
- What's required vs optional?
- What validation rules are needed?

### 2. Check for Existing Forms Schemas
```bash
ls ./app/config/forms-schemas/
```

Ask yourself:
- Does a similar forms schema exist?
- Can it be reused or extended?
- Should fields be added to existing schema?

### 3. Design Field Structure
- Use appropriate types and formats
- Set validation rules (required, min/max, patterns)
- Provide clear titles and descriptions
- Consider user experience (not too many required fields)

### 4. Consider Privacy & Compliance
- Add consent fields for GDPR/privacy
- Mark sensitive fields appropriately
- Consider data retention needs

### 5. Decide on Sharing
- `"shared": false` - Site-specific (default)
- `"shared": true` - Shared across user's sites (e.g., lead collection from multiple landing pages)

## Field Types & Formats

### Text Input
```json
{
  "type": "string",
  "title": "Full Name",
  "description": "Your name",
  "minLength": 1,
  "maxLength": 100
}
```

### Email
```json
{
  "type": "string",
  "format": "email",
  "title": "Email Address"
}
```

### Phone Number
```json
{
  "type": "string",
  "title": "Phone",
  "pattern": "^[0-9\\-\\+\\(\\)\\s]*$"
}
```

### Multiline Text
```json
{
  "type": "string",
  "format": "multiline",
  "title": "Message",
  "minLength": 10,
  "maxLength": 2000
}
```

### Select/Dropdown
```json
{
  "type": "string",
  "title": "Subject",
  "enum": ["Option 1", "Option 2", "Option 3"]
}
```

### Checkbox (Boolean)
```json
{
  "type": "boolean",
  "title": "Subscribe to newsletter",
  "default": false
}
```

### Required Checkbox (Consent)
```json
{
  "type": "boolean",
  "title": "I agree to privacy policy",
  "const": true  // Must be checked
}
```

### Number
```json
{
  "type": "number",
  "title": "Age",
  "minimum": 18,
  "maximum": 120
}
```

### URL
```json
{
  "type": "string",
  "format": "url",
  "title": "Website"
}
```

### Date
```json
{
  "type": "string",
  "format": "date",
  "title": "Preferred Date"
}
```

## Common Forms Schema Patterns

### Contact Form
```json
{
  "id": "contact-form",
  "schema": {
    "properties": {
      "name": { "type": "string", "minLength": 1 },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" },  // optional
      "message": { "type": "string", "format": "multiline" },
      "consent": { "type": "boolean", "const": true }
    },
    "required": ["name", "email", "message", "consent"]
  }
}
```

### Newsletter Signup
```json
{
  "id": "newsletter-signup",
  "schema": {
    "properties": {
      "email": { "type": "string", "format": "email" },
      "firstName": { "type": "string" },  // optional
      "interests": {
        "type": "array",
        "items": { "type": "string" },
        "title": "Topics of Interest"
      }
    },
    "required": ["email"]
  }
}
```

### Job Application
```json
{
  "id": "job-application",
  "schema": {
    "properties": {
      "fullName": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" },
      "position": {
        "type": "string",
        "enum": ["Software Engineer", "Designer", "Product Manager"]
      },
      "resume": { "type": "string", "format": "file" },
      "coverLetter": { "type": "string", "format": "multiline" },
      "linkedin": { "type": "string", "format": "url" }
    },
    "required": ["fullName", "email", "position", "resume"]
  }
}
```

### Event Registration
```json
{
  "id": "event-registration",
  "schema": {
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "ticketType": {
        "type": "string",
        "enum": ["General Admission", "VIP", "Student"]
      },
      "numberOfTickets": {
        "type": "number",
        "minimum": 1,
        "maximum": 10
      },
      "dietaryRestrictions": { "type": "string" }  // optional
    },
    "required": ["name", "email", "ticketType", "numberOfTickets"]
  }
}
```

## Validation Rules

### String Constraints
- `minLength` - Minimum characters
- `maxLength` - Maximum characters
- `pattern` - Regular expression validation

### Number Constraints
- `minimum` - Minimum value
- `maximum` - Maximum value
- `multipleOf` - Must be multiple of (e.g., 5)

### Required Fields
```json
{
  "required": ["name", "email", "message"]
}
```

### Constant Values
```json
{
  "type": "boolean",
  "const": true  // Must be exactly true
}
```

## Shared Forms Schemas

Set `"shared": true` to collect data from multiple sites into one schema.

**Use case:** Lead generation from multiple landing pages

```json
{
  "id": "lead-capture",
  "shared": true,  // Shared across all user's sites
  "schema": {
    "properties": {
      "email": { "type": "string", "format": "email" },
      "source": { "type": "string", "description": "Which landing page" }
    }
  }
}
```

When shared:
- Data from all sites is aggregated
- Site ID is automatically added to each record
- Useful for centralized lead management

## Best Practices

1. **Keep forms simple** - Only ask for necessary information
2. **Use appropriate formats** - Enables proper validation and UI
3. **Provide clear titles/descriptions** - Help users understand what to enter
4. **Set reasonable constraints** - Not too restrictive, but validate important fields
5. **Make strategic fields optional** - Increases form completion rates
6. **Include consent fields** - For privacy compliance (GDPR, etc.)
7. **Use enums for controlled inputs** - Ensures data consistency
8. **Consider mobile users** - Short forms work better on mobile
9. **Test validation** - Ensure rules make sense for users
10. **Document your design** - Update memory with rationale

## Important Limitations

- **Flat structure only** - No nested objects
- **Cannot be queried from pages** - Only for storage
- **Backward compatibility required** - See backward-compatibility skill
- **Automatic migrations only** - Can't write custom migrations

## Workflow

1. **Read memory** - Understand project context
2. **Analyze requirements** - What data needs to be collected?
3. **Check existing schemas** - Avoid duplicates
4. **Design schema** - Fields, validation, required vs optional
5. **Decide on sharing** - Site-specific or shared?
6. **Create file** in `./app/config/forms-schemas/[id].json`
7. **Lint** - Validate the schema
8. **Update memory** - Document decisions
9. **Commit** - Save changes
10. **Report completion** - Summarize what was created

## Handling Requests for Clarification

If requirements are unclear, use `reportFailure` with type: 'dependency-missing':
- "Should this be shared across sites?"
- "Which fields are truly required?"
- "What validation rules should apply?"
- "Do we need GDPR consent fields?"

Let the main agent clarify with the user before proceeding.
