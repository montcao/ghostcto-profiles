#!/usr/bin/env node
// Fails when commits or a pull request description credit an AI model or tool.
// Profiles run on many models and hosts, so a model credit misstates who did the
// work. Co-authors that are real accounts, such as dependabot[bot] or a person,
// are allowed.
//
// Usage: node scripts/check-attribution.mjs <base-sha> <head-sha>
// The pull request description is read from the PR_BODY environment variable.

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const AI_NAMES = "claude|anthropic|openai|chatgpt|gpt-?\\d|codex|gemini|copilot|cursor|devin|aider|windsurf|llm";

const RULES = [
  { label: "model co-author trailer", pattern: new RegExp(`^\\s*co-authored-by:.*(${AI_NAMES}|noreply@anthropic\\.com)`, "i") },
  { label: "generated-by line", pattern: new RegExp(`generated (with|by)\\b.*(${AI_NAMES}|\\bai\\b)`, "i") },
];

/** Lines in `text` that credit an AI model or tool, with the rule each one breaks. */
export function findAiAttribution(text) {
  const hits = [];
  for (const line of String(text ?? "").split(/\r?\n/)) {
    const rule = RULES.find((item) => item.pattern.test(line));
    if (rule) hits.push({ line: line.trim(), rule: rule.label });
  }
  return hits;
}

function commitMessages(base, head) {
  const out = execFileSync("git", ["log", "--format=%H%x00%B%x01", `${base}..${head}`], { encoding: "utf8" });
  return out.split("\x01").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
    const [sha, message] = entry.split("\x00");
    return { sha: sha.slice(0, 7), message };
  });
}

function main() {
  const [base, head] = process.argv.slice(2);
  if (!base || !head) {
    process.stderr.write("usage: node scripts/check-attribution.mjs <base-sha> <head-sha>\n");
    process.exit(2);
  }
  const problems = [];
  for (const { sha, message } of commitMessages(base, head)) {
    for (const hit of findAiAttribution(message)) problems.push(`commit ${sha}: ${hit.rule}: ${hit.line}`);
  }
  for (const hit of findAiAttribution(process.env.PR_BODY)) problems.push(`pull request description: ${hit.rule}: ${hit.line}`);
  if (problems.length) {
    process.stderr.write(`${problems.join("\n")}\n\nRemove AI, model and tool attribution from commits and the pull request description (see AGENTS.md). Reword commits with an interactive rebase on your branch, or edit the description.\n`);
    process.exit(1);
  }
  process.stdout.write("No AI attribution in commits or the pull request description.\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
