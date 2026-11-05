// Mechanical checks for this repository's own documentation.
//
// Scope: every tracked Markdown file except skills/** and plugins/**, which are
// profile content written for other repositories and checked by validate.mjs.
// Comments in scripts/, .githooks/ and .github/ are checked for document names.
//
//   node scripts/docs-check.mjs            check, exit 1 on any problem
//   node scripts/docs-check.mjs --today YYYY-MM-DD   pin "today" (for tests)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, basename } from "node:path";

const INDEX = "docs/index.md";
const MAX_AGE_DAYS = 90;
const FILE_EXTENSIONS = /\.(md|json|mjs|cjs|js|ya?ml|svg|sh|txt)$/;

const todayArg = process.argv.indexOf("--today");
const today = new Date(`${todayArg > -1 ? process.argv[todayArg + 1] : new Date().toISOString().slice(0, 10)}T00:00:00Z`);

const tracked = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").filter((path) => path && existsSync(path));
const trackedSet = new Set(tracked);
const trackedBasenames = new Set(tracked.map((path) => basename(path)));
const rootEntries = new Set(tracked.map((path) => path.split("/")[0]));
const inScope = (path) => !path.startsWith("skills/") && !path.startsWith("plugins/") && !path.startsWith("node_modules/");
const docs = tracked.filter((path) => path.endsWith(".md") && inScope(path));
const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts ?? {};

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

const existsPath = (fromFile, target) => {
  const clean = target.replace(/\/$/, "");
  const candidates = [normalize(join(dirname(fromFile), clean)), normalize(clean)];
  return candidates.some((candidate) => trackedSet.has(candidate) || tracked.some((path) => path.startsWith(`${candidate}/`)) || (existsSync(candidate) && statSync(candidate).isDirectory()));
};

for (const file of docs) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  let inFence = false;
  lines.forEach((line, index) => {
    const at = `${file}:${index + 1}`;
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }
    // Commands, in code blocks and inline code alike.
    for (const match of line.matchAll(/\bnpm (?:run(?:-script)? ([\w:.-]+)|(test|start))\b/g)) {
      const script = match[1] ?? match[2];
      if (!(script in scripts)) fail(at, `"npm ${match[1] ? "run " : ""}${script}" is not a script in package.json. Add the script or correct the command.`);
    }
    if (inFence) return;

    // Relative links and image sources.
    const targets = [...line.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]).concat([...line.matchAll(/\bsrc="([^"]+)"/g)].map((m) => m[1]));
    for (const raw of targets) {
      if (/^(https?:|mailto:|#)/.test(raw)) continue;
      const target = decodeURI(raw.split("#")[0]);
      if (target && !existsPath(file, target)) fail(at, `link target "${raw}" does not exist. Fix the path or remove the link.`);
    }

    // Backticked paths.
    for (const match of line.matchAll(/`([^`\s]+)`/g)) {
      const token = match[1].replace(/:\d+$/, "");
      if (/[<>*${}]|^(https?:|\/|~|-)/.test(token) || token.includes("@")) continue;
      const looksLikeFile = FILE_EXTENSIONS.test(token);
      const firstSegmentKnown = token.includes("/") && rootEntries.has(token.split("/")[0]);
      if (!looksLikeFile && !firstSegmentKnown) continue;
      const ok = token.includes("/") ? existsPath(file, token) : trackedBasenames.has(token);
      if (!ok) fail(at, `\`${match[1]}\` names a path that does not exist. Fix the path, or create the file if the text is right.`);
    }

    // Documents named in prose.
    for (const match of line.replace(/`[^`]*`/g, "").replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, "").matchAll(/\b([\w./-]+\.md)\b/g)) {
      const name = match[1];
      if (!(name.includes("/") ? existsPath(file, name) : trackedBasenames.has(name))) fail(at, `names "${name}", but no tracked file is called that. Fix the name or add the document.`);
    }
  });
}

// Document names in code comments.
for (const file of tracked.filter((path) => /^(scripts|\.githooks|\.github)\//.test(path))) {
  readFileSync(file, "utf8").split("\n").forEach((line, index) => {
    const comment = /^\s*(\/\/|#|\*)(.*)$/.exec(line)?.[2];
    if (!comment) return;
    for (const match of comment.matchAll(/\b([\w./-]+\.md)\b/g)) {
      if (!(match[1].includes("/") ? trackedSet.has(match[1]) : trackedBasenames.has(match[1]))) {
        fail(`${file}:${index + 1}`, `comment names "${match[1]}", but no tracked file is called that. Fix the comment or add the document.`);
      }
    }
  });
}

// The index lists every in-scope document with a review date.
if (!existsSync(INDEX)) {
  fail(INDEX, "missing. Create it with one row per tracked document.");
} else {
  const rows = new Map();
  for (const line of readFileSync(INDEX, "utf8").split("\n")) {
    const link = /^\|\s*\[[^\]]*\]\(([^)]+)\)/.exec(line)?.[1];
    if (!link) continue;
    const target = normalize(join(dirname(INDEX), link));
    const reviewed = /Reviewed:\s*(\d{4}-\d{2}-\d{2})\s*\((read|edited)\)/.exec(line);
    rows.set(target, reviewed);
    if (!trackedSet.has(target)) fail(INDEX, `row links "${link}", which is not a tracked file. Remove the row or fix the link.`);
  }
  for (const doc of docs) {
    if (doc === INDEX) continue;
    if (!rows.has(doc)) {
      fail(INDEX, `no row for ${doc}. Add "| [${basename(doc)}](${doc.startsWith("docs/") ? doc.slice(5) : `../${doc}`}) | <kind> | <what it decides> | Reviewed: YYYY-MM-DD (edited) |" using its last commit date.`);
      continue;
    }
    const reviewed = rows.get(doc);
    if (!reviewed) {
      fail(INDEX, `row for ${doc} has no "Reviewed: YYYY-MM-DD (read|edited)". Add its last commit date as (edited).`);
      continue;
    }
    const age = Math.floor((today - new Date(`${reviewed[1]}T00:00:00Z`)) / 86_400_000);
    if (age > MAX_AGE_DAYS) {
      fail(INDEX, `${doc} was last reviewed ${reviewed[1]} (${age} days ago, limit ${MAX_AGE_DAYS}). Run the doc-gardener prompt (.claude/agents/doc-gardener.md) on it, fix any drift, then set the date to today with (read).`);
    }
  }
}

if (failures.length > 0) {
  console.error(`${failures.length} documentation problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Checked ${docs.length} documents: links, paths, commands, document names, index coverage and review dates.`);
