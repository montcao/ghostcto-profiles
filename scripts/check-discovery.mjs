// Runs the upstream skills CLI the way users do and fails unless it finds exactly
// one skill per skills/ directory. Plugin copies must stay hidden (metadata.internal).
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";

const CLI = "skills@1.7.0";
const expected = readdirSync("skills").filter((name) => statSync(`skills/${name}`).isDirectory()).length;
const output = execFileSync("npx", ["--yes", CLI, "add", ".", "--list"], {
  encoding: "utf8",
  env: { ...process.env, DISABLE_TELEMETRY: "1" },
  stdio: ["ignore", "pipe", "pipe"],
}).replace(/\u001b\[[0-9;]*m/g, "");
process.stdout.write(output);
const found = Number(/Found (\d+) skills?/.exec(output)?.[1] ?? NaN);
if (found !== expected) {
  console.error(`\n${CLI} found ${found} skills but skills/ has ${expected}. ` +
    "If the extra entries are plugin copies, the export must add metadata.internal: true to plugins/ghostcto/skills/*/SKILL.md. " +
    "If skills are missing, check their frontmatter. Fix it in the private source repository; see ARCHITECTURE.md.");
  process.exit(1);
}
console.log(`\n${CLI} found ${found} skills, one per skills/ directory.`);
