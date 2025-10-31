---
name: project-planning
description: Creating comprehensive plans for building new websites or adding features. Use when starting a new website project or planning significant additions.
toolsets: []
---

# Project Planning

## Overview

Before delegating to specialists, create a detailed internal plan. Store your plan in the `main_task_context` memory category.

## Planning for New Websites

When a user requests a new website, you need to:

### 1. Identify Site Type
- Blog
- E-commerce
- Portfolio
- Business/Corporate
- Landing page
- Restaurant/Food service
- Professional services
- Other specific type

### 2. Determine Required Pages

**Essential pages (most sites need):**
- Homepage (index.tsx) - Already exists
- About page
- Contact page
- 404 error page

**Type-specific pages:**

**Blog:**
- Blog listing page
- Individual blog post page
- Categories/tags pages (optional)

**E-commerce:**
- Products listing page
- Product detail page
- Cart page
- Checkout page

**Portfolio:**
- Projects/work listing page
- Individual project detail page

**Restaurant:**
- Menu page
- Reservations page
- Location/hours page

### 3. Plan Datasources

Based on the site type, identify needed datasources:

**Blog site needs:**
- `blog-posts` datasource (title, slug, content, author, publishedAt, featuredImage, etc.)
- `categories` datasource (optional)

**E-commerce site needs:**
- `products` datasource (name, description, price, images, stock, etc.)
- `orders` datasource
- `customers` datasource

**Portfolio site needs:**
- `projects` datasource (title, description, images, date, technologies, etc.)

**Restaurant site needs:**
- `menu-items` datasource (name, description, price, category, image, etc.)
- `reservations` datasource (for booking system)

### 4. Plan Forms Schemas

Identify user input forms needed:

**Common forms:**
- Contact form (name, email, message)
- Newsletter signup (email, optional name)

**Specific forms:**
- Job application form
- Booking/reservation form
- Custom quote request form
- Survey/feedback form

### 5. Plan Theme and Images

**Theme considerations:**
- What style matches the business? (modern, classic, minimalist, vibrant, dark, light)
- What colors align with their brand?
- Professional vs. playful tone?

**Image needs:**
- Hero image for homepage
- About page images
- Section backgrounds
- Icons and decorative elements
- Product/portfolio images (if applicable)

### 6. Determine Task Sequence

**Typical new website sequence:**
1. Designer creates theme + Data Architect creates datasources/schemas (PARALLEL)
2. Wait for both to complete
3. Coder builds homepage
4. Coder builds additional pages in priority order

## Planning for Existing Website Changes

When modifying an existing website:

### 1. Read Memory First
- Check `main_project_context` for overall site understanding
- Check `project_recent_changes` to understand recent work
- Check `main_user_preferences` for design and content preferences

### 2. Identify Required Changes

**Code changes:**
- New pages needed?
- New components needed?
- Existing pages to modify?
- Existing components to modify?

**Design changes:**
- Theme updates (colors, fonts)?
- New images needed?
- Style adjustments?

**Data schema changes:**
- New datasources needed?
- New forms schemas needed?
- Existing schemas to modify? (must be backward-compatible)

### 3. Check Existing Components
Use memory or ask agents to check what already exists:
- Is there already a navbar? Footer? Hero section?
- Can existing components be reused?
- What datasources already exist?

### 4. Plan Dependencies
- What must be created before other things?
- Does Coder need datasources from Data Architect?
- Does Coder need images from Designer?
- Can any tasks run in parallel?

## Example Plans

### Example 1: New Restaurant Website

```
Site Type: Restaurant
Pages Needed:
- Homepage (hero, about snippet, featured menu items, location)
- Full Menu page
- About page
- Contact page
- Reservations page

Datasources:
- menu-items (name, description, price, category, dietary info, image)

Forms Schemas:
- contact-form (name, email, phone, message)
- reservation-form (name, email, phone, date, time, party size, special requests)

Theme:
- Warm, inviting colors
- Professional but friendly
- Food photography focused

Images Needed:
- Restaurant exterior/interior hero image
- Food photography for menu items
- Team/chef photos for About page

Sequence:
1. Designer (theme) + Data Architect (menu-items datasource, forms) [PARALLEL]
2. Coder (homepage)
3. Coder (menu page using menu-items datasource)
4. Coder (about page)
5. Coder (contact page with contact form)
6. Coder (reservations page with reservation form)
```

### Example 2: Adding Blog to Existing Site

```
Current State: Business website with homepage, about, services, contact
Addition Requested: Blog section

Changes Needed:
- New datasource: blog-posts
- New page: blog listing (shows all posts)
- New page: blog post detail (individual post view)
- Update homepage: add "Latest Posts" section
- Update navbar: add "Blog" link

Dependencies:
- Data Architect must create blog-posts datasource first
- Coder can then build blog pages

Sequence:
1. Data Architect (blog-posts datasource)
2. Coder (blog listing page)
3. Coder (blog post detail page)
4. Coder (update homepage with latest posts section)
5. Coder (update navbar with blog link)
```

## Planning Best Practices

1. **Think strategically** - Consider the user's business goals
2. **Start with foundation** - Datasources and theme before code
3. **Identify dependencies** - What needs to happen first?
4. **Check for reuse** - Don't recreate what exists
5. **Plan for quality** - Include QA after major milestones
6. **Store in memory** - Save your plan to `main_task_context`
7. **Confirm with user** - Always get approval before executing

## Quality Considerations

When planning, consider:
- **SEO**: Key pages need good content, headings, meta descriptions
- **Performance**: Optimize images, avoid unnecessary complexity
- **Usability**: Clear navigation, obvious call-to-actions
- **Accessibility**: Proper contrast, semantic HTML, alt text
- **Mobile**: Responsive design (DaisyUI handles this by default)
