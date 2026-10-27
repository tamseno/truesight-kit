# Skill: handoff-brief

Purpose: turn a messy request (a Slack thread, a bug report, a one-line message) into one clean task for a cloud coding agent, start the agent, and keep the loop closed until the proof matches the request.

## Inputs
- The request, plus any links (Slack thread, issue, crash trace, dashboard).
- The owning repo and branch naming rule: `fix/<short-name>` or `feat/<short-name>`.

## Workflow
1. Gather context first. Read the linked threads, the issue and the crash trace. Reproduce in staging if possible. Keep dead ends and brainstorming out of the brief.
2. Write the brief with exactly these sections:
   - **Task** — one sentence, testable.
   - **Context** — only facts the agent needs (sources linked, versions, affected devices).
   - **Skills** — repo skills to load (for example `/ios-best-practices`, `/run-ios-e2e`).
   - **Proof expected** — what must come back: test output, screenshots, before vs after for visual changes, a short video for flows.
   - **Stop and ask if** — areas that need a human (auth, payments, migrations, infra).
3. Start one cloud coding agent with the brief. One task per agent.
4. Watch the transcript and artifacts. When the agent says it is done, check the proof yourself:
   - Visual change requested → the after screenshot must show it, on the device named in the brief.
   - Tests → the suite named in the brief must be green in the output, not described as green.
5. If the proof doesn't match, push back with the specific gap and let the agent continue. Do not forward unverified work.
6. If the agent stalls on environment flakiness, unblock it (retry, restart the dev build, point it at the real error). If you can't without new permissions, stop and report.
7. When the agent figures out a reusable flow (for example driving the simulator end to end), ask it to save that as a repo skill.

## Output
- The PR link, the proof (attached, not summarised), and the brief you used.
- Update the PR board row: `Working` → `Ready for review` only after the proof passes.

## Limits
- Max 3 push-back rounds, then stop and ask the owner with what's blocking.
- Never merge from this skill. Merging is the PR sweep's job, under the low-risk rules.
