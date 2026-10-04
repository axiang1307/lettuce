---
name: update-brain
description: Record what this session established into brain/ (lasting facts, decisions, action-item changes, pruning) and push only that to main.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git fetch:*), Bash(git branch:*), Bash(git worktree:*), Bash(git -C:*), Bash(git restore:*), Bash(git merge:*)
---

# Update the brain

Write this session's lasting knowledge into `brain/`, then push only that change to `main`. The brain rules in the root `CLAUDE.md` apply.

**Brain edits never become a commit on the current branch.** They're committed only on `main`, from a temporary worktree, and then dropped from the current branch's working tree.

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

Edit `brain/` and `CLAUDE.md` in the current working tree as usual, but **don't commit them here**. Move the uncommitted edits onto `origin/main` in a temporary worktree, commit and push there, then discard them from the current branch. Run each line as its own command; nothing relies on shell state.

```bash
git fetch origin main
git worktree remove --force ../lettuce-brain-merge   # only if left over from an earlier run
git worktree add --detach ../lettuce-brain-merge origin/main
git diff HEAD -- brain/ CLAUDE.md | git -C ../lettuce-brain-merge apply --3way
git -C ../lettuce-brain-merge commit -m "brain: <what changed>"
git -C ../lettuce-brain-merge push origin HEAD:main
git worktree remove ../lettuce-brain-merge
git restore --source=HEAD --staged --worktree brain/ CLAUDE.md
```

- `git diff HEAD` takes every brain edit since the branch's last commit, staged or not. `apply --3way` replays the edits onto `main` and stages them there, so it also works when `main`'s brain has moved on since this branch was cut.
- **The diff is empty:** nothing to push; skip the rest.
- **Conflicts:** resolve them in the worktree, keeping `main`'s facts plus the new ones, then `git -C ../lettuce-brain-merge add -A` and commit.
- **Push rejected because `main` moved:** `git -C ../lettuce-brain-merge pull --rebase origin main` (on conflicts: resolve, `add -A`, then `-c core.editor=true rebase --continue`), then push again.
- **The last line** removes the branch's copy of the edits (they live on `main` now), so a later `git add -A` on the branch can't commit them. The branch sees them once it merges `main` (`git merge origin/main`, only when the user wants that). If the session is on `main` itself, finish with `git merge --ff-only origin/main` instead.
- Never force-push, and never commit `brain/` or `CLAUDE.md` on a feature branch.

## 4. Report

One line each for what was added, changed and pruned, and the commit pushed to `main`. If a step failed, say which and leave the worktree in place.
