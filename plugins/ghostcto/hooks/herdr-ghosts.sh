#!/bin/sh
# Records GhostCTO profile use for the herdr ghosts pane; what it stores is listed in the plugin README.

pane=${HERDR_PANE_ID:-}
[ -n "$pane" ] || exit 0
case $pane in *[!A-Za-z0-9:_-]*) exit 0 ;; esac

payload=$(cat) || exit 0
# field NAME PATTERN: first capture of PATTERN in the JSON value of NAME.
field() { printf '%s\n' "$payload" | sed -n -E "s/.*\"$1\" *: *\"$2.*/\\1/p" | head -n 1; }

event=$(field hook_event_name '([A-Za-z]+)"')
session=$(field session_id '([A-Za-z0-9-]+)"')
agent=$(field agent_id '([A-Za-z0-9_-]+)"')
dir=${XDG_STATE_HOME:-$HOME/.local/state}/ghostcto/herdr
(umask 077 && mkdir -p "$dir/sessions") 2>/dev/null || exit 0

emit() {
  file=$dir/events.jsonl
  size=$(wc -c 2>/dev/null <"$file" || echo 0)
  [ "$size" -gt 262144 ] && mv -f "$file" "$file.1" 2>/dev/null
  (umask 077 && printf '{"v":1,"pane":"%s","session":"%s","agent":"%s","ts":%s,%s}\n' \
    "$pane" "$session" "$agent" "$(date +%s)" "$1" >>"$file") 2>/dev/null
}

# Keeps only "program subcommand" per shell segment, never arguments.
programs() {
  printf '%s' "$1" | sed -E 's/\\n/;/g; s/\\"//g' | awk '
    { n = split($0, parts, /&&|\|\||;|\|/)
      out = ""
      for (i = 1; i <= n; i++) {
        m = split(parts[i], w, /[ \t]+/); j = 1
        while (j <= m && (w[j] == "" || w[j] ~ /^[A-Za-z_][A-Za-z0-9_]*=/)) j++
        if (j > m) continue
        prog = w[j]; sub(/.*\//, "", prog)
        if (prog !~ /^[A-Za-z0-9._+-]+$/) continue
        if (j + 1 <= m && w[j+1] ~ /^[a-z][a-z0-9-]*$/) prog = prog " " w[j+1]
        out = (out == "" ? prog : out ", " prog)
      }
      printf "%s", substr(out, 1, 200) }'
}

safe() { printf '%s' "$1" | tr -d '"\\' | cut -c1-300; }

case $event in
  PreToolUse)
    skill=$(field skill '(ghostcto[:-][a-z0-9-]*)"')
    [ -n "$skill" ] && emit "\"kind\":\"skill\",\"skill\":\"$skill\""
    ;;
  UserPromptSubmit)
    skill=$(field prompt '\/(ghostcto:[a-z0-9-]*)[" \\]')
    [ -n "$skill" ] && emit "\"kind\":\"skill\",\"skill\":\"$skill\""
    ;;
  PostToolUse)
    tool=$(field tool_name '([A-Za-z0-9_]+)"')
    case $tool in
      Edit|Write|Read|MultiEdit) detail=$(safe "$(field file_path '([^"]*)"')") ;;
      NotebookEdit) detail=$(safe "$(field notebook_path '([^"]*)"')") ;;
      Bash) detail=$(programs "$(field command '(([^"\\]|\\.)*)"')") ;;
      Agent|Task) detail=$(safe "$(field subagent_type '([A-Za-z0-9:_-]*)"')") ;;
      Skill) detail=$(safe "$(field skill '([A-Za-z0-9:_-]*)"')") ;;
      *) detail= ;;
    esac
    [ -n "$tool" ] && emit "\"kind\":\"tool\",\"tool\":\"$tool\",\"detail\":\"$(safe "$detail")\""
    ;;
  Stop)
    transcript=$(safe "$(field transcript_path '([^"]*)"')")
    if [ -n "$session" ]; then
      (umask 077 && field last_assistant_message '(([^"\\]|\\.)*)"' | cut -c1-4096 | sed -E \
        -e 's/sk-[A-Za-z0-9_-]{16,}/[redacted]/g' \
        -e 's/(ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{20,}/[redacted]/g' \
        -e 's/github_pat_[A-Za-z0-9_]{20,}/[redacted]/g' \
        -e 's/AKIA[0-9A-Z]{16}/[redacted]/g' \
        -e 's/xox[abprs]-[A-Za-z0-9-]{10,}/[redacted]/g' \
        -e 's/-----BEGIN [A-Z ]*PRIVATE KEY-----/[redacted]/g' \
        >"$dir/sessions/$session.last") 2>/dev/null
    fi
    emit "\"kind\":\"stop\",\"transcript\":\"$transcript\""
    ;;
  SessionEnd)
    [ -n "$session" ] && rm -f "$dir/sessions/$session.last" 2>/dev/null
    ;;
esac
exit 0
