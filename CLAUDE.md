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
| `brain/architecture.md` | how the pieces connect, auth and data flow, shared types, resource migration status |
| `brain/api.md` | API pipeline, layering, identity and access rules, error contract, env |
| `brain/endpoints.md` | every API route: request, validation, status codes, response shape |
| `brain/frontend.md` | routing, event flow, data and repository layer, theme, guardrails, env |
| `brain/dev-workflow.md` | install, run, typecheck, iOS/CNG, EAS, known breakages |
| `brain/decisions.md` | settled decisions and their rationale |
| `brain/action-items.md` | **the only place** for in-progress work, to-dos and open questions |

Keeping it up to date:
- **Information files only state how things are.** No to-dos, "in progress" or "TODO" notes; those go in `action-items.md`.
- **When something changes**, update the file that describes it in the same change, and add or replace an entry in `decisions.md` if a decision was made.
- **When an action item is finished**, delete it and move any lasting knowledge into the right info file.
- **Don't duplicate.** Each fact lives in one file; other files link to it.
- **Per-app `CLAUDE.md` files are retired.** Add new knowledge to `brain/`.

@brain/architecture.md
@brain/action-items.md
