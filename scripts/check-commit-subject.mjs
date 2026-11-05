// Checks one commit subject or PR title against Conventional Commits.
//   node scripts/check-commit-subject.mjs "<subject>"   or   --file <commit message file>
import { readFileSync } from "node:fs";

const TYPES = ["feat", "fix", "docs", "chore", "refactor", "test", "build", "ci", "perf", "revert", "style"];
const PATTERN = new RegExp(`^(${TYPES.join("|")})(\\([a-z0-9-]+\\))?!?: \\S.{0,99}$`);

const fileArg = process.argv.indexOf("--file");
const raw = fileArg > -1 ? readFileSync(process.argv[fileArg + 1], "utf8") : (process.argv[2] ?? "");
const subject = raw.split("\n").find((line) => line.trim() && !line.startsWith("#"))?.trim() ?? "";

if (/^(fixup|squash|amend)! /.test(subject) || /^Revert "/.test(subject) || /^Merge /.test(subject)) process.exit(0);
if (!PATTERN.test(subject)) {
  console.error(`Not a Conventional Commit subject: "${subject}"\n` +
    `Use "<type>(optional-scope): <summary>", type one of ${TYPES.join(", ")}, summary under 100 characters.\n` +
    "feat releases a minor version and fix a patch; see CONTRIBUTING.md. Squash merges use the PR title, so fix the title, not just the commits.");
  process.exit(1);
}
