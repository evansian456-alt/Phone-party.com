Copilot Repository Instructions — Phone Party

These instructions apply to all pull requests, code reviews, fixes, tests, CI repairs, deployment fixes, security fixes, and automated changes performed by GitHub Copilot.

Copilot must follow these rules strictly.

These rules are mandatory and non-negotiable.

---

1. Repository Purpose Detection

This repository belongs to Phone Party.

Copilot must determine which type of repository this is before making changes.

A — Marketing Website Repository

If this repository is the marketing website for phone-party.com:

Allowed technologies:

- HTML
- CSS
- JavaScript

Requirements:

- Keep the site static and lightweight
- Maintain fast loading performance
- Maintain Cloud Run compatibility
- Maintain static hosting compatibility

Forbidden actions unless explicitly requested:

- Converting the site to React
- Converting to Next.js
- Converting to Vue
- Converting to Angular
- Adding unnecessary frameworks

The website should remain a simple, production-quality static site.

---

B — Phone Party Application Repository

If this repository is the Phone Party application, Copilot must preserve all application behavior including:

- authentication
- account creation
- DJ profiles
- party creation
- party joining
- messaging
- music synchronization
- uploads
- payments
- tier enforcement
- deployment systems

Copilot must fix root causes rather than applying superficial workarounds.

---

2. Non-Negotiable Pull Request Completion Rule

A pull request is NOT complete unless ALL of the following are true:

• All tests pass
• All required GitHub checks are green
• CI workflows succeed
• CodeQL security scans pass
• Deployment checks pass
• No checks are pending
• No checks are expected
• No checks are blocked
• No failing tests remain
• The PR is actually mergeable
• The Merge button is available

If ANY condition above is false:

Copilot must continue investigating and fixing issues until it becomes true.

Copilot must not stop merely because:

- the code compiles
- most tests pass
- the issue seems solved
- the fix seems likely
- CI appears partially green

Copilot must verify actual PR mergeability.

---

3. Mandatory Investigation Process

When PR checks fail Copilot must:

1. Open the latest failing GitHub Actions run
2. Identify the exact failing step
3. Identify failing test names
4. Identify stack traces
5. Identify file paths
6. Identify line numbers
7. Identify the true root cause
8. Fix the root cause
9. Re-check CI
10. Repeat until green

Copilot must never guess when logs are available.

---

4. Testing Integrity Rules

Copilot must never weaken tests to make CI pass.

Forbidden actions:

- Skipping tests
- Disabling tests
- Removing tests
- Removing assertions
- Marking failing tests TODO
- Ignoring CI failures
- Disabling workflows
- Changing branch protection to hide failures

Required behavior:

- Fix real bugs
- Fix broken test setup only if setup is truly incorrect
- Preserve or improve test coverage
- Add regression tests for bug fixes

---

5. Frontend Visual Verification

If Copilot modifies any frontend code including:

- HTML
- CSS
- JavaScript
- Layout
- UI components
- Styling
- Navigation
- Interactions
- Animations
- Forms
- Responsive design

Copilot must visually verify the change.

Required process:

1. Start the site locally or in preview.
2. Open the affected pages in a browser.
3. Confirm the UI change appears correctly.
4. Interact with modified components.
5. Check for console errors.
6. Verify responsive layout.
7. Test both desktop and mobile.

Frontend work is not complete until the UI behaves correctly.

---

6. Automated Browser Testing

If the repository contains browser testing tools such as:

- Playwright
- Cypress
- Puppeteer

Copilot must run those tests.

When appropriate Copilot should:

- update tests
- add missing UI tests
- add screenshot validation

---

7. CI Self-Healing Behavior

Copilot must behave like a persistent maintainer.

After making fixes Copilot must:

1. Check PR status again
2. Check GitHub Actions again
3. Check required checks again

If anything remains:

- failing
- pending
- expected
- blocked

Copilot must continue fixing issues until all checks pass.

---

8. Deployment Rules

Copilot must preserve deployment compatibility.

Static Website Deployment

For static marketing site repos:

Deployment must support:

- Google Cloud Run
- Static hosting environments

If Cloud Run is used:

Required configuration:

- Dockerfile exists
- container serves static files
- container exposes port 8080
- production-safe static server

Recommended base image:

nginx:alpine

---

Application Deployment

For application repos Copilot must preserve compatibility with:

- Cloud Run
- CI/CD pipelines
- environment variables
- build pipelines

Broken deployments must be fixed at the configuration level.

---

9. Security Rules

Copilot must enforce strong security practices.

Never commit:

- API keys
- tokens
- passwords
- credentials
- secrets

Copilot must fix:

- CodeQL alerts
- injection risks
- XSS
- insecure format strings
- unsafe input handling

Security alerts must be fixed, not hidden.

---

10. Minimal Change Principle

Copilot should prefer:

- minimal fixes
- root-cause fixes
- backwards-compatible changes

Copilot must avoid:

- unnecessary refactors
- framework migrations
- architecture changes not required by the task

---

11. Website Information Accuracy

For the marketing website repository Copilot must ensure the site always reflects accurate product information.

If information becomes outdated Copilot must update:

- product features
- screenshots
- pricing
- documentation links
- branding
- feature descriptions

The website must remain accurate and current.

---

12. Frontend Quality Standards

UI must maintain premium production quality.

Copilot must ensure:

- clean layout
- consistent spacing
- responsive design
- professional typography
- smooth animations
- consistent visual style

Copilot must avoid introducing:

- broken layouts
- mobile overflow
- clipped text
- broken navigation
- nonfunctional buttons
- console errors

---

13. Review Comment Handling

When responding to PR review comments Copilot must:

- address the exact feedback
- apply code fixes
- verify CI again
- ensure the comment is actually resolved

Copilot must confirm the PR remains mergeable after the change.

---

14. Reporting Requirements

After making fixes Copilot must report:

• root cause
• failing step
• failing tests
• stack traces
• files changed
• why changes were made
• confirmation tests now pass
• confirmation CI is green
• confirmation PR is mergeable

Copilot must not claim completion unless the PR is mergeable.

---

15. Continuous Repository Maintenance

Copilot should proactively maintain repository health.

If Copilot detects:

- failing CI
- failing tests
- security alerts
- broken deployment
- outdated documentation
- broken frontend behavior

Copilot should propose or create pull requests to fix the issue.

---

16. Final Completion Criteria

Copilot is not finished until ALL of the following are true:

• tests pass
• CI is green
• security checks pass
• deployment checks pass
• frontend changes are visually verified
• PR is mergeable
• Merge button is available

If this is not true:

Copilot must continue working until it is resolved.
