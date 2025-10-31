---
name: forms
description: Building and handling forms with client-side validation and server-side submission to forms schemas. Use when implementing any user input forms.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Managing Forms

## Overview
Forms collect data from users and submit it to a Forms Schema (a database table). Forms use client-side validation and server-side persistence.

---

## API Reference

### `useFormSchema(id: string)`

**Import:**
```tsx
import { useFormSchema } from "@upstart.gg/sdk";
```

**Returns:** `{ schema: JSONSchema7, defaultValues: Record<string, any> }`

**Description:**
React hook that returns the JSON schema of a forms schema and default values for each field. Use this to get the schema definition and initial values for your form.

**Usage:**
```tsx
const { schema, defaultValues } = useFormSchema('contact-form');
```

### `saveSubmission(formSchemaId: string, data: FormData): Promise<void>`

**Import:**
```tsx
import { saveSubmission, ValidationError } from "@upstart.gg/sdk";
```

**Description:**
Helper function to save submitted data into a forms schema. It automatically validates the data based on the forms schema definition. Use this in your `action` function to persist form submissions.

**Throws:** `ValidationError` if data doesn't match the schema

**Usage:**
```tsx
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await saveSubmission('contact-form', formData);
    return redirect("/thank-you");
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: "Invalid form data", fieldErrors: error.fieldErrors };
    }
    return { error: "An unexpected error occurred" };
  }
}
```

---

## Required Tools

1. `useFetcher` or `useSubmit` from `react-router` - for form submission
2. `useForm` from `@tanstack/react-form` - for client-side state & validation
3. `useFormSchema` from `@upstart.gg/sdk` - to get schema fields and defaults
4. `saveSubmission` from `@upstart.gg/sdk` - to save data server-side (in `action` function)

## Complete Form Example

```tsx
import { useForm } from '@tanstack/react-form';
import { useFormSchema, saveSubmission, ValidationError } from "@upstart.gg/sdk";
import { useFetcher, redirect } from "react-router";
import { type PageAttributes } from "@upstart.gg/sdk";
import { Page, Droppable, Draggable } from "@upstart.gg/components";

export const attributes: PageAttributes = {
  path: "/contact",
  label: "Contact Page",
  title: "Contact Us",
  description: "Get in touch with our team",
};

// Server-side form submission handler
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await saveSubmission('contact-form', formData);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: "Invalid form data", fieldErrors: error.fieldErrors };
    }
    return { error: "An unexpected error occurred" };
  }

  return redirect("/thank-you");
}

export default function ContactPage() {
  const fetcher = useFetcher();
  const { schema, defaultValues } = useFormSchema('contact-form');

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      fetcher.submit(value, { method: 'post' });
    },
  });

  return (
    <Page>
      <Droppable id="contact-section" direction="vertical" className="container mx-auto py-12 flex flex-col">
        <Draggable id="contact-header">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-base-content/70">We'd love to hear from you</p>
          </div>
        </Draggable>

        <Draggable id="contact-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="max-w-2xl mx-auto w-full"
          >
            <form.Field name="name">
              {(field) => (
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="message">
              {(field) => (
                <div className="form-control w-full mb-6">
                  <label className="label">
                    <span className="label-text">Message</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {field.state.meta.errors[0]}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </form.Field>

            {fetcher.data?.error && (
              <div className="alert alert-error mb-4">
                <span>{fetcher.data.error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={fetcher.state === 'submitting'}
            >
              {fetcher.state === 'submitting' ? (
                <span className="loading loading-spinner" />
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </Draggable>
      </Droppable>
    </Page>
  );
}
```

## Form Patterns

### Newsletter Signup (Simple)

```tsx
<form.Field name="email">
  {(field) => (
    <div className="join w-full">
      <input
        type="email"
        placeholder="your@email.com"
        className="input input-bordered join-item flex-1"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <button type="submit" className="btn btn-primary join-item">
        Subscribe
      </button>
    </div>
  )}
</form.Field>
```

### Multi-step Form

```tsx
const [step, setStep] = useState(1);

return (
  <div>
    <ul className="steps w-full mb-8">
      <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Personal Info</li>
      <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Details</li>
      <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Review</li>
    </ul>

    {step === 1 && (
      <div>
        {/* Step 1 fields */}
        <button onClick={() => setStep(2)} className="btn btn-primary">
          Next
        </button>
      </div>
    )}

    {step === 2 && (
      <div>
        {/* Step 2 fields */}
        <div className="flex gap-2">
          <button onClick={() => setStep(1)} className="btn btn-outline">
            Back
          </button>
          <button onClick={() => setStep(3)} className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    )}

    {step === 3 && (
      <div>
        {/* Review & submit */}
        <button onClick={() => setStep(2)} className="btn btn-outline">
          Back
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    )}
  </div>
);
```

## Form Validation

Validation is automatic based on the Forms Schema. The schema defines:
- Required fields
- Field types (email, url, etc.)
- Min/max lengths
- Custom validation rules

Client-side validation happens on change/blur.
Server-side validation happens on submission.

## Handling Errors

```tsx
// Display global errors
{fetcher.data?.error && (
  <div className="alert alert-error">
    <span>{fetcher.data.error}</span>
  </div>
)}

// Display field-specific errors
{field.state.meta.errors && (
  <label className="label">
    <span className="label-text-alt text-error">
      {field.state.meta.errors[0]}
    </span>
  </label>
)}
```

## Loading States

```tsx
<button
  type="submit"
  className="btn btn-primary"
  disabled={fetcher.state === 'submitting'}
>
  {fetcher.state === 'submitting' ? (
    <>
      <span className="loading loading-spinner loading-sm" />
      Sending...
    </>
  ) : (
    'Send Message'
  )}
</button>
```

## Success Handling

After successful submission, redirect to a success page or show a toast:

```tsx
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await saveSubmission('contact-form', formData);
    return redirect("/thank-you");
  } catch (error) {
    return { error: "Failed to submit" };
  }
}
```

## Best Practices

1. **Always validate client-side** - Better UX
2. **Always validate server-side** - Security
3. **Show loading states** - Keep users informed
4. **Handle errors gracefully** - Clear, actionable messages
5. **Provide success feedback** - Confirm submission
6. **Use form-control class** - Consistent styling
7. **Label all fields** - Accessibility
8. **Disable during submission** - Prevent double-submits
9. **Clear form after success** - Or redirect to success page
10. **Test validation** - Try invalid inputs

## Important Notes

- Forms schemas are created by the Data Architect agent
- Check if the forms schema exists before implementing the form
- If missing, use `reportFailure` with type: 'dependency-missing'
- Form field names must match the schema exactly
- Validation rules come from the schema, not your code
