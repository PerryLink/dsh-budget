// Ruler-liveness canary (alpha.2 line).
//
// This file must FAIL to compile against the current harness type line:
// `DEFAULT_PROFILE_PATCH_RELOAD` and `watchUserPatches` exist only on the
// 0.1.5-alpha.1 line. A ruler that compiles this file is measuring a stale
// (alpha.1) face — the classic false green. scripts/assert-ruler-live.mjs
// expects the failure and inverts the exit code.
import { DEFAULT_PROFILE_PATCH_RELOAD, watchUserPatches } from '@deepseek-ai/dsh-settings'

void DEFAULT_PROFILE_PATCH_RELOAD
void watchUserPatches
