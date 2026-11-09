// Structural checks for the published profiles and the generated Claude Code plugin.
// Every failure names the file and what to do, because the reader is often an agent.
// skills/, plugins/ghostcto/, assets/ and README.md are written by the sync from the
// private source repository: fix the source, not the copy here (see ARCHITECTURE.md).
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { parse } from "yaml";

const PLUGIN = "ghostcto";
const PLUGIN_ROOT = `plugins/${PLUGIN}`;
const PREFIX = "ghostcto-";
const FORK_MODELS = ["haiku", "sonnet", "opus", "fable"];
// Skills whose plugin copy ships under another name, so it is invoked as /ghostcto:<alias>.
// Mirrors plugin.skillAliases in the private export manifest (see ARCHITECTURE.md, Boundary 2).
const SKILL_ALIASES = { "ghostcto-bigboss": "start" };
const copySlugOf = (name) => SKILL_ALIASES[name] ?? name.slice(PREFIX.length);
const SYNCED = "This path is written by the profile sync; change it in the private source repository, not here.";

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

function splitFrontmatter(file, content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) {
    failures.push(`${file}: needs YAML frontmatter between --- lines followed by instructions.`);
    return null;
  }
  return { metadata: parse(match[1], { uniqueKeys: true }), body: match[2] };
}

const rootLicense = await readFile("LICENSE", "utf8");
const rootNotice = await readFile("NOTICE", "utf8");
const readme = await readFile("README.md", "utf8");

const skills = [];
for (const name of (await readdir("skills")).sort()) {
  const dir = `skills/${name}`;
  if (!(await stat(dir)).isDirectory()) {
    failures.push(`${dir}: only skill directories belong in skills/. Move or delete it. ${SYNCED}`);
    continue;
  }
  skills.push(name);
  const file = `${dir}/SKILL.md`;
  if (!existsSync(file)) {
    failures.push(`${file}: missing. Every skill directory needs a SKILL.md. ${SYNCED}`);
    continue;
  }
  const content = await readFile(file, "utf8");
  const parsed = splitFrontmatter(file, content);
  if (!parsed) continue;
  const { metadata, body } = parsed;
  check(metadata.name === name, `${file}: frontmatter name is "${metadata.name}" but the directory is "${name}". Make them identical. ${SYNCED}`);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && name.length <= 64, `${dir}: skill names must be kebab-case and at most 64 characters.`);
  check(name.startsWith(PREFIX), `${dir}: skill names start with "${PREFIX}" so the plugin can derive ${PLUGIN}:<slug>.`);
  check(typeof metadata.description === "string" && metadata.description.trim().length > 0 && metadata.description.length <= 1024,
    `${file}: description must be a non-empty string of at most 1024 characters. ${SYNCED}`);
  check(metadata.license === "Apache-2.0", `${file}: license must be Apache-2.0. ${SYNCED}`);
  check(metadata.metadata?.internal !== true, `${file}: a published skill must not set metadata.internal, or the skills CLI hides it. ${SYNCED}`);
  check(body.trim().length > 0, `${file}: instructions are empty. ${SYNCED}`);
  for (const heading of ["## Output", "## Escalate"]) {
    check(new RegExp(`^${heading}$`, "m").test(body),
      `${file}: no "${heading}" section. Every profile states what it returns (Output) and when it must stop and ask (Escalate). ${SYNCED}`);
  }
  for (const [extra, expected] of [["LICENSE", rootLicense], ["NOTICE", rootNotice]]) {
    const path = `${dir}/${extra}`;
    check(existsSync(path) && (await readFile(path, "utf8")) === expected, `${path}: must exist and match the repository ${extra} byte for byte. ${SYNCED}`);
  }
  const slug = name.slice(PREFIX.length);
  check(existsSync(`assets/${slug}.svg`), `assets/${slug}.svg: missing avatar for ${name}. ${SYNCED}`);
  check(readme.includes(`| \`${name}\` |`), `README.md: no catalog row for ${name}. Add "| \`${name}\` | <use it for> |" to the Profiles table. ${SYNCED}`);

  // The plugin copy must be the source with only the name changed and metadata.internal added.
  const copySlug = copySlugOf(name);
  const copyPath = `${PLUGIN_ROOT}/skills/${copySlug}/SKILL.md`;
  if (!existsSync(copyPath)) {
    failures.push(`${copyPath}: missing plugin copy of ${name}. ${SYNCED}`);
  } else {
    // A copy may also run as a forked subagent on a cheaper model (see ARCHITECTURE.md, Boundary 2).
    const base = `name: ${copySlug}\nmetadata:\n  internal: true`;
    const allowed = [base, ...FORK_MODELS.map((model) => `${base}\ncontext: fork\nmodel: ${model}\nbackground: false`)]
      .map((header) => content.replace(new RegExp(`^name: ${name}$`, "m"), header));
    check(allowed.includes(await readFile(copyPath, "utf8")),
      `${copyPath}: differs from ${file} beyond the name, metadata.internal and optional fork lines (context: fork, model: <${FORK_MODELS.join("|")}>, background: false). Regenerate the plugin from skills/. ${SYNCED}`);
    for (const extra of ["LICENSE", "NOTICE"]) {
      const path = `${PLUGIN_ROOT}/skills/${copySlug}/${extra}`;
      check(existsSync(path) && (await readFile(path, "utf8")) === (extra === "LICENSE" ? rootLicense : rootNotice), `${path}: must match the repository ${extra}. ${SYNCED}`);
    }
  }
  console.log(`Validated ${name}`);
}
check(skills.length > 0, "skills/: no skills found.");

const expectedSlugs = skills.map(copySlugOf);
for (const slug of existsSync(`${PLUGIN_ROOT}/skills`) ? (await readdir(`${PLUGIN_ROOT}/skills`)).sort() : []) {
  check(expectedSlugs.includes(slug), `${PLUGIN_ROOT}/skills/${slug}: plugin copy has no source skill ${PREFIX}${slug} and is not an alias in SKILL_ALIASES. Remove it from the export. ${SYNCED}`);
}
for (const row of readme.matchAll(/^\| `(ghostcto-[a-z0-9-]+)` \|/gm)) {
  check(skills.includes(row[1]), `README.md: catalog row for ${row[1]}, but skills/${row[1]} does not exist. Remove the row. ${SYNCED}`);
}

const marketplace = JSON.parse(await readFile(".claude-plugin/marketplace.json", "utf8"));
check(marketplace.plugins?.some((p) => p.name === PLUGIN && p.source === `./${PLUGIN_ROOT}`),
  `.claude-plugin/marketplace.json: must list plugin "${PLUGIN}" with source "./${PLUGIN_ROOT}". ${SYNCED}`);
const plugin = JSON.parse(await readFile(`${PLUGIN_ROOT}/.claude-plugin/plugin.json`, "utf8"));
check(plugin.name === PLUGIN, `${PLUGIN_ROOT}/.claude-plugin/plugin.json: name must be "${PLUGIN}". ${SYNCED}`);
check(plugin.version === undefined, `${PLUGIN_ROOT}/.claude-plugin/plugin.json: remove "version"; it pins installs until bumped by hand. ${SYNCED}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Validated ${skills.length} skills, their plugin copies, assets and catalog rows.`);
