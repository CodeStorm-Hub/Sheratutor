## Completed this session

**Dashboard (full B2C page set)**
- Sidebar/drawer nav shell (Dashboard, Upload, Submissions, AI Tutor, Study Plan, Profile)
- Submissions list page (was home-page-only top-5 before)
- Study plan page + deterministic 14-day generator (weighted by weakness score)
- Profile page (edit exam details, training-data opt-in toggle)

**AI Tutor Chat — now fully persistent**
- DB-backed chat history (`tutor_chat_sessions`/`messages`), survives closing/reopening the panel
- Standalone `/dashboard/tutor` page for general (non-graded) subject Q&A, RAG-grounded
- Daily rate limit (50 msgs/day)
- Shared chat UI component, brand-token fix (was using off-palette colors)

**Question-region mapping** — verified live
Students tag which question each uploaded page answers; grading is scoped per-question instead of every question seeing every page.

**Transcription-fidelity safeguard** — verified live, caught a real mismatch in testing
Confidence badges, "this isn't what I wrote" flag, and an image-grounded cross-check that flagged a genuine transcript/image mismatch during testing.

**Real job queue (pgmq)** — verified live, including the retry path
Replaced the same-process `after()` dispatch with a real queue; watched a failed attempt auto-retry and succeed on redelivery.

**Two real security/RLS bugs found and fixed** (not part of the plan — discovered during implementation):
- `submission_pages` had no INSERT/UPDATE policy at all (upload would've silently failed)
- New pgmq wrapper functions were briefly callable by unauthenticated `anon` requests (Postgres's default grant-to-PUBLIC)

## Remaining

**Question-paper generator (FR-GEN-01)** — code complete, **not confirmed working**. Three live attempts all failed (upstream NIM connection errors / empty structured output on the larger generation call). Needs a retry/backoff wrapper or a simpler output schema before it's trustworthy. This is the one open item from last session.

**Everything still explicitly out of scope** (by your own earlier calls, not forgotten):
- B2B / institutional dashboard
- Guardian consent (SMS-OTP verification) — still checkbox-only
- Golden dataset population (~30 real graded scripts + human grading) — schema and eval harness exist, no data
- FR-GEN-02 (past-paper replication), FR-GEN-03 (PDF export / QR answer-sheet convention)
- Full CER-based transcription metrics (needs the golden set above)
- Per-criterion image-crop re-verification (current implementation does whole-page cross-check, not per-criterion)

**Production wiring not done** (can't be done from here):
- `pg_cron` schedule to auto-drain the grading queue — written but commented out, needs a real deployed URL
- NIM reliability is a recurring operational issue (showed up 3+ times this session across different call types) — worth planning retry logic or a paid tier before relying on this in front of real students