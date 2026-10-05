// PreToolUse hook on Bash: blocks commands that skip the git hooks.
// Wired up in .claude/settings.json.
import { findBypass } from "../bypass.ts";
import { OK, exitWith, readHookInput } from "../hook-io.ts";

const input = readHookInput();
const command = input?.tool_input?.command;
const reason = typeof command === "string" ? findBypass(command) : null;

exitWith(reason === null ? OK : { exitCode: 2, stdout: "", stderr: reason });
