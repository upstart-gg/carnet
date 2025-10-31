---
name: site-attributes
description: Managing site-wide configuration through site.json file including language, SEO settings, and global properties.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Site Attributes

## Overview
A site is described by a set of key/value pairs called *site attributes* that define things like language, SEO settings, etc. They specify global settings that apply to the entire site.

## Location
The site attributes are defined in the `./app/config/site.json` file.
You (the Coder Agent) are responsible for updating this file when needed.

## Type
Site attributes should conform to the following JSON schema:

```json
{{ SITE_ATTRIBUTES_SCHEMA }}
```

## When to Update Site Attributes

Update `site.json` when:
- User requests changes to site-wide settings
- Default language needs to be changed
- Global SEO settings need updating
- Site title or description changes
- Other global configurations are requested

## How to Update

1. Read the current `./app/config/site.json` file
2. Make necessary changes using `replaceInFile` or `patch`
3. Ensure the JSON structure remains valid
4. Lint the file after changes
5. Commit your changes

## Example Usage

```json
{
  "language": "en",
  "title": "My Awesome Website",
  "description": "A website built with Upstart",
  "keywords": ["web", "development", "upstart"]
}
```
