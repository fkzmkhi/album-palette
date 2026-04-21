Run these steps to create a git commit:

1. Run `git status` and `git diff` in parallel to see what changed.
2. Stage relevant files with `git add <files>` — never use `git add -A` or `git add .`.
3. Write a commit message following Conventional Commits:
   - `feat:` new feature
   - `fix:` bug fix
   - `style:` UI/CSS only
   - `refactor:` no behaviour change
   - `chore:` config, deps, tooling
4. Commit with:
```
git commit -m "$(cat <<'EOF'
<type>: <summary in English, imperative mood>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```
5. Run `git status` to confirm success.

**Rules:**
- Never push — user handles all remote operations.
- Never use `--no-verify`.
- If a pre-commit hook fails, fix the issue and create a new commit (never `--amend`).
