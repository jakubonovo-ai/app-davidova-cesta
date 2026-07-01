---
name: Never use "Allow Always" in permission prompts
description: When Claude Code prompts to approve a Bash/tool call, always pick "once", never "always". Claude must prefer env-var substitution so a captured permission rule never contains a literal secret.
type: feedback
---

**Rule:** When Claude Code asks "Allow this command?" with options like *Yes, once* / *Yes, always* / *No*, pick **Once** for any non-trivial command. Never *Always* / *Don't ask again*.

**Why (generic):** Claude Code's permission system saves the EXACT command string — with no secret redaction — when an *Always* rule is approved. If a command ever contains an inline credential (a Bearer token in a `curl -H`, an API key on a command line), an *Always* approval writes that secret verbatim into `settings.local.json`, creating durable plaintext storage of it. This has happened in practice: early API-exploration `curl` calls captured a live token into the local settings file and it sat there for weeks. *Once*-only as a standing policy prevents the pattern even when a proposed command carries an inline secret.

**How to apply (Claude side):**
1. **Default to env-var substitution before proposing any command that touches a credential.** The literal secret then never appears in the command text, so even an accidental *Always* would only capture the variable name.
   - `curl -H "Authorization: Bearer $API_TOKEN" ...` (curl reads `$API_TOKEN` at run time)
   - `python -c "import os, httpx; httpx.get(URL, headers={'Authorization': f'Bearer {os.environ[\"API_TOKEN\"]}'})"`
2. **If a literal secret must appear inline**, warn first: *"This command contains a literal secret. Approve as 'Once' only — 'Always' saves it verbatim into settings.local.json."* Wait for explicit acknowledgement.
3. **During any maintenance / close review**, grep `.claude/settings.local.json` for high-entropy strings (30+ alphanumerics that look token-shaped) and flag matches as potential leftover leaks from older *Always* approvals.

**How to apply (workflow side):**
- The commitment is forward-looking: the file should not GROW with new auto-allows that carry secrets. Existing sprawl gets cleaned when convenient.
- If a workflow genuinely needs an *Always* (a constantly-repeating, secret-free build command), call it out explicitly and confirm the exception is justified for that specific command.
