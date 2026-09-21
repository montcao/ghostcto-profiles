import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { parse } from "yaml";

const directories = await readdir("skills");
assert.ok(directories.length > 0, "No skills found");
for (const name of directories) {
  assert.ok((await stat(`skills/${name}`)).isDirectory());
  const content = await readFile(`skills/${name}/SKILL.md`, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  assert.ok(match, `${name}: frontmatter and instructions required`);
  const metadata = parse(match[1], { uniqueKeys: true });
  assert.equal(metadata.name, name);
  assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(name.length <= 64);
  assert.equal(typeof metadata.description, "string");
  assert.ok(metadata.description.trim().length > 0 && metadata.description.length <= 1024);
  assert.equal(metadata.license, "Apache-2.0");
  assert.ok(match[2].trim().length > 0);
  for (const file of ["LICENSE", "NOTICE"]) {
    assert.equal(await readFile(`skills/${name}/${file}`, "utf8"), await readFile(file, "utf8"), `${name}: bundled ${file} must match repository`);
  }
  console.log(`Validated ${name}`);
}
