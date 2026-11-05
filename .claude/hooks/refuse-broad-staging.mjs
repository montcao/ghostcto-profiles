// PreToolUse hook: refuses git commands that stage or commit everything at once.
// Stage files by path instead (AGENTS.md). Exit code 2 blocks the call and shows the reason.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const command = JSON.parse(input || "{}").tool_input?.command ?? "";
  const broadAdd = /\bgit\s+(?:-C\s+\S+\s+)?add\b(?=[^;&|]*(?:\s-A\b|\s--all\b|\s-u\b|\s--update\b|\s\.(?=\s|$|[;&|])|\s:\/|\s\*))/;
  const commitAll = /\bgit\s+(?:-C\s+\S+\s+)?commit\b(?=[^;&|]*\s-(?:[a-zA-Z]*a[a-zA-Z]*)\b|[^;&|]*\s--all\b)/;
  if (broadAdd.test(command) || commitAll.test(command)) {
    console.error("Repo-wide staging is refused in this repository. Stage each file by path (git add path/to/file) and check git status before committing. See AGENTS.md.");
    process.exit(2);
  }
});
