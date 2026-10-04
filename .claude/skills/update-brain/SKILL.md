---
name: update-brain
description: Record what this session established into brain/ (lasting facts, decisions, action-item changes, pruning) and push only that to main.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git fetch:*), Bash(git branch:*), Bash(git worktree:*), Bash(git -C:*)
---

# Update the brain

Write this session's lasting knowledge into `brain/`, then push only that change to `main`. The brain rules in the root `CLAUDE.md` apply.

## 1. Decide what's worth keeping

Read `brain/action-items.md` and the files for the areas this session touched. Keep only what a future session needs and can't cheaply get from the code or `git log`:

- **Keep:** decisions and their *why*; how things work when it isn't obvious from one file (data flow, access rules, contracts, conventions); gotchas that cost time; new to-dos and open questions.
- **Drop:** narration of what was done, general explanations (REST, SQL or language concepts the user asked about), temporary state.

Only write what you've confirmed in the code or database, including every path, function and route you name. If nothing qualifies and nothing needs pruning, say so and stop.

## 2. Edit brain/

- **Action items:** delete finished ones (moving lasting knowledge to an info file), shrink partly done ones, add new ones.
- **Info files:** edit the existing line instead of appending; never leave a contradiction.
- **Decisions:** a dated entry with its rationale in `decisions.md`. No *why* means it's a fact for an info file.
- **Prune** anything you read that's no longer true: obsolete items, renamed or deleted files and routes, superseded decisions, history that explains nothing. **Remove duplicates**, keeping each fact in its owning file.
- **Keep it small.** `architecture.md` and `action-items.md` load into every session, so they hold only orientation and open work. Prefer one precise sentence, and a reference to a type or file over restating it.
- Update the index in `CLAUDE.md` if you add, rename or remove a brain file.

## 3. Push to main

Only the brain commit goes to `main`, from a separate worktree, so other work on the current branch (committed or not) never reaches `main`. Run each line as its own command; nothing relies on shell state. `<branch>` is the current branch (including `main` itself).

```bash
git add brain/ CLAUDE.md && git commit -m "brain: <what changed>" -- brain/ CLAUDE.md
git fetch origin main
git worktree remove --force ../lettuce-brain-merge   # only if left over from an earlier run
git worktree add --detach ../lettuce-brain-merge origin/main
git -C ../lettuce-brain-merge cherry-pick <branch>
git -C ../lettuce-brain-merge push origin HEAD:main
git worktree remove ../lettuce-brain-merge
```

Always finish the push:
- **Conflicts:** resolve them in the worktree, keeping `main`'s facts plus the new ones, then `git -C ../lettuce-brain-merge add -A` and `git -C ../lettuce-brain-merge -c core.editor=true cherry-pick --continue` (the `-c` skips the editor).
- **Push rejected because `main` moved:** `git -C ../lettuce-brain-merge pull --rebase origin main` (on conflicts: resolve, `add -A`, then `-c core.editor=true rebase --continue`), then push again.
- **Cherry-pick is empty** (already on `main`): `git -C ../lettuce-brain-merge cherry-pick --skip`; there's nothing to push.
- Never force-push.

## 4. Report

One line each for what was added, changed and pruned, and the commit pushed to `main`. If a step failed, say which and leave the worktree in place.
