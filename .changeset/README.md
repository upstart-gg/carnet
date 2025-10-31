# Changesets

This directory contains changeset files for managing version bumps and changelog entries.

## Adding a Changeset

To add a changeset for your changes:

```bash
bun changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the type of version bump (major, minor, patch)
3. Write a description of the changes

Changeset files are automatically committed and will be consumed during the release process.

## Release Process

When a changeset is merged to main, the `release.yml` workflow will:
1. Create a release PR with all pending changesets
2. Automatically publish to npm when the PR is merged
3. Create GitHub releases and tags

## Snapshot Releases

On PR merge, snapshot releases are automatically published with the commit SHA as part of the version number.

See the GitHub workflows for more details.
