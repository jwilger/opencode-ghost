# Terminal Assumptions

The certified TUI matrix assumes:

- Linux terminal semantics
- UTF-8 input/output
- truecolor support
- deterministic width policy for Unicode codepoints
- explicit wrapping and clipping rules
- visible-cell parity rather than offscreen-buffer parity

## Certified matrix

- sizes: `120x40`, `160x48`
- theme: built-in `opencode`
- modes: dark and light

## Bootstrap caveat

This file states the initial assumptions only. The final ghost contract must
refine these assumptions into a frozen width policy, token vocabulary, and
certified observation space.
