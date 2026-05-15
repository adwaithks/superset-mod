# Weekly Changelog Generation

Generate a new changelog entry for this week based on merged PRs.

## Instructions

1. **Find PRs merged since last Monday**
   - Use `gh pr list --state merged --search "merged:>=$(date -d 'last monday' +%Y-%m-%d)" --json number,title,body,url,mergedAt --limit 50` to get all PRs merged in the past week
   - Categorize PRs into: **Major features**, **Improvements**, **Bug fixes**
   - Skip PRs that are purely internal (CI/CD, dev tooling, refactors) unless they affect users

2. **Check for existing changelog**
   - Before creating a new file, check if a changelog already exists for this week's date (e.g. under `apps/docs/` if you add a changelog section there, or in GitHub Releases).
   - If an entry for today's date already exists, skip creation and report that a changelog already exists

3. **Prioritize content**
   - **Lead with 2-4 major features** - These get their own sections with full descriptions
   - **Group smaller improvements** - Can combine related small changes under one heading
   - **Bug fixes go in a footnote section** - Brief one-liner summaries at the bottom

4. **Create the changelog entry**
   - Prefer publishing user-facing notes as a **GitHub Release** for this repo, or add an MDX page under `apps/docs/content/` if the docs site should carry dated release notes.
   - If writing a docs MDX file, use a path like `apps/docs/content/changelog/YYYY-MM-DD-slug.mdx` and keep the format below.

5. **Follow this exact format** (MDX):

```mdx
---
title: Brief title highlighting 1-2 main features
date: YYYY-MM-DD
image: /changelog/IMAGE_PLACEHOLDER.png
---

{/* TODO: Replace header image with actual screenshot */}

## Major Feature Name <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />

One or two sentences describing what users can now do. Keep it brief and scannable.

- Key capability one
- Key capability two

## Another Major Feature <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />

Brief description of the feature and its benefit to users.

## Improvements

- **Improvement name** - Brief description <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />
- **Another improvement** - Brief description <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />

---

**Bug fixes**

- Fixed issue with X <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />
- Resolved Y problem <PRBadge url="https://github.com/superset-sh/superset/pull/NUMBER" />
```

6. **Important formatting rules**
   - Frontmatter (`---`) must be at the very top of the file with no content before it
   - MDX comments (`{/* ... */}`) must come AFTER the frontmatter, not before
   - Set `image:` in frontmatter to `/changelog/IMAGE_PLACEHOLDER.png` - reviewers will replace this
   - Add TODO comments for features that would benefit from screenshots
   - Use a horizontal rule (`---`) before the bug fixes section
   - Bug fixes should use bullet points, one fix per line, same as Improvements

7. **Writing style**
   - **Be brief** - Users scan changelogs, they don't read every word
   - **Lead with value** - What can users do now that they couldn't before?
   - **One sentence per feature** - If you need more, use 2-3 bullet points max
   - **Skip implementation details** - Users don't care about internal changes
   - **Combine related small fixes** - Don't give each tiny fix its own section

## Content hierarchy

| PR Type | Treatment |
|---------|-----------|
| New user-facing feature | Own section with heading, 1-2 sentences + bullets |
| Significant improvement | Own section or grouped under "Improvements" |
| Small enhancement | One line under "Improvements" |
| Bug fix | Bullet point in footnote section at bottom |
| Internal/refactor | Skip entirely unless user-visible |

## Reference Examples

Use recent GitHub Release notes for this repository, or existing MDX pages under `apps/docs/content/`, as style references.

## Output

Publish exactly one changelog (GitHub Release and/or new docs MDX). If there are no significant PRs to report or a changelog already exists for this week, do not create duplicate content and report why.
