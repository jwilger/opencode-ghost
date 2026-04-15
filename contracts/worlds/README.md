# Reference Worlds

This directory contains named reference worlds used by promoted witness cases.

Each world gives a reusable setup vocabulary for:

- runtime cases
- TUI cases
- integration cases
- security cases

## World types

Positive worlds:

- minimal repo
- dirty git repo
- permission-request session
- tool-output-heavy session
- shared/imported session
- worktree lifecycle

Adversarial worlds:

- permission rejection session
- path traversal request
- partial stream disconnect
- corrupted persisted state
- invalid TUI interaction
- malformed replay ordering
- mid-run cancellation

Use worlds to understand the intended setup context for a case before you read
the case-specific expectations.
