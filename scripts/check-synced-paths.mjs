// Fails when a pull request from anywhere but the sync branch changes a synced path.
// Synced paths are overwritten by the profile sync; see ARCHITECTURE.md (Boundary 1).
//   HEAD_REF=<branch> BASE_REF=<branch> node scripts/check-synced-paths.mjs
import { execFileSync } from "node:child_process";

const SYNC_BRANCH = "sync/ghostcto-profiles";
const SYNCED_FILES = ["README.md", "LICENSE", "NOTICE", ".claude-plugin/marketplace.json"];
const SYNCED_PREFIXES = ["skills/", "assets/", "plugins/ghostcto/"];

const head = process.env.HEAD_REF ?? "";
const base = process.env.BASE_REF || "main";
if (head === SYNC_BRANCH) {
  console.log(`${SYNC_BRANCH} may change synced paths.`);
  process.exit(0);
}
const changed = execFileSync("git", ["diff", "--name-only", `origin/${base}...HEAD`], { encoding: "utf8" }).split("\n").filter(Boolean);
const offending = changed.filter((path) => SYNCED_FILES.includes(path) || SYNCED_PREFIXES.some((prefix) => path.startsWith(prefix)));
if (offending.length > 0) {
  console.error(`These synced paths changed outside ${SYNC_BRANCH}:\n${offending.map((p) => `- ${p}`).join("\n")}\n` +
    "The next sync would overwrite them. Revert them here and make the change in the private source repository (profiles/ or public/avatars/profiles/). See ARCHITECTURE.md.");
  process.exit(1);
}
console.log(`No synced paths changed (${changed.length} file(s) checked).`);
