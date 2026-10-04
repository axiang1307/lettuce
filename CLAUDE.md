# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Lettuce** is a mobile social scheduling app. Users form groups with friends, create events inside them, and use polls to pick a time and an activity. The goal is to take the coordination effort out of making plans.

The repo is an npm-workspaces monorepo:
- `frontend/`: Expo / React Native app
- `api/`: Express / TypeScript REST API
- `packages/api-types/`: shared, type-only package

All three use one Supabase project.

## Goals

- **The API is a learning project.** It exists so the developer can learn REST API design by replacing *part* of Supabase's auto-generated PostgREST layer with hand-written routes. It does not replace Supabase wholesale:
  - Supabase Auth stays.
  - Resources move to the API one at a time, when it's worth it.
  - Leftover direct-Supabase usage is not a defect in itself.
- **The app is a real product in progress.** Replace mock data with real data in end-to-end vertical slices while keeping the current UX.

## Working norms

- **In `api/`:** explain the concepts and reasoning behind a change (why this status code, why this layer, the trade-offs, the standard REST convention). Make edits directly when asked to fix or implement something.
- Run `npx tsc --noEmit` in `frontend/` and `api/` after changes. Metro doesn't typecheck.
- Always `npm install` from the repo root.

## The brain

`brain/` holds the project knowledge that persists across sessions. Read the relevant files before working in an area.

| File | Contents |
|---|---|
| `brain/product.md` | what Lettuce is, entities, non-goals, product source of truth |
| `brain/architecture.md` | repo layout, how the pieces connect, resource status |
| `brain/api.md` | API pipeline, layering, access rules, error contract, env |
| `brain/endpoints.md` | every route: body, validation, status codes |
| `brain/frontend.md` | routing, screens and data flow, repositories, theme, guardrails, env |
| `brain/dev-workflow.md` | install, run, typecheck, native builds, shared types and migrations, gotchas |
| `brain/decisions.md` | settled decisions and their rationale |
| `brain/action-items.md` | **the only place** for to-dos and open questions |

Rules:
- Info files state how things are; to-dos go only in `action-items.md`. Delete finished items, moving lasting knowledge to an info file.
- Update the describing file in the same change; record decisions in `decisions.md`.
- Each fact lives in one file. Edit in place; never append a contradiction.
- `/update-brain` records a session's lasting knowledge and pushes only that to `main`.

@brain/architecture.md
@brain/action-items.md
