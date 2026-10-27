# Routine: PR sweep (every 30 minutes)

Paste to the Bot that owns the board:

> Every 30 minutes, review every row in the shared PR board that is `Working` or `Ready for review`.
>
> For each PR, check:
> 1. Bug-bot comments and security findings — decide whether each one is legitimate. Fix legitimate ones through the PR's cloud agent; reply with a reason to the rest.
> 2. Failing CI runs.
> 3. Merge conflicts.
>
> If anything is off, follow up with that PR's cloud agent with the exact failure, and move the row back to `Working`.
> If everything is clean, move the row to `Ready for review` and start an automatic code review run, looking for quality problems and misses.
>
> Merge automatically only if the review is highly confident AND the blast radius is low (no auth, payments, migrations or infra files; diff under 300 lines). Everything else waits for me, with the proof linked in the row.
>
> If the board or GitHub is unavailable, post that in this chat and stop. Don't guess the state of a PR. Don't contact anyone outside this chat.

Notes from the docs:
- Routine schedules must be at least five minutes apart; 30 minutes is plenty for a PR board.
- Pressing **Test** does real work. Test this on a sandbox repo or with merging disabled first.
- Every run spends usage, so keep the check cheap: read the board, act only on rows that changed.
- If you're away for a long time, Grok Bot may pause routines until you respond.

Then, once this runs clean for a week, add the nightly audit (3 a.m.):

> Every night at 3:00, run one audit on <domain>: dead code and unused logic, app load time, bundle size. Open at most 3 small PRs with proof, add them to the PR board as `Working`, and summarise in this chat. Never merge from this routine.
