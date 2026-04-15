# TUI Normalization

TUI parity depends on normalized observations rather than raw terminal output.

## Laws

- Determinism: the same input state normalizes identically.
- Idempotence: normalizing an already normalized frame is a no-op.
- Monotonic erasure: normalization may remove irrelevant distinctions, never
  introduce new ones.
- Semantic preservation: focus, visible text, dialog stack, region visibility,
  and ordering must survive normalization.

## Initial normalized fields

- timestamps
- generated identifiers
- absolute local paths
- cursor blink state
- transient loading text
- theme RGB values, when reducible to stable style tokens

## Initial non-normalizable fields

- visible glyph content
- visible cell ordering
- semantic region identity
- focus target
- dialog precedence
- scroll anchors
