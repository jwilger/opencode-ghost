# TUI Contracts

This directory contains the normative bootstrap for the built-in `opencode` TUI.

The TUI contract is decomposed into three artifact families:

- `interaction`: input events, route/dialog transitions, and action semantics
- `layout`: semantic regions, focus, visibility, and scroll state
- `frame`: terminal-cell observations for the certified matrix

At bootstrap time these files are intentionally skeletal. They define the
semantic partitioning and the observation vocabulary without yet freezing every
route, dialog, style token, or region taxonomy.
