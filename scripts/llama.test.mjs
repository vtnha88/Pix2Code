import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const scripts = dirname(fileURLToPath(import.meta.url));

test("llama runner validates inputs and forwards local-only options", (t) => {
  const root = mkdtempSync(join(tmpdir(), "pixel2code-llama-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  copyFileSync(join(scripts, "llama-run.sh"), join(root, "scripts", "llama-run.sh"));
  const run = (...args) => spawnSync("bash", [join(root, "scripts", "llama-run.sh"), ...args], { encoding: "utf8" });
  assert.match(run("--model", "missing.gguf").stderr, /llama-server not found/);

  const binDir = join(root, ".local", "llama.cpp", "build", "bin");
  mkdirSync(binDir, { recursive: true });
  writeFileSync(join(binDir, "llama-server"), "#!/bin/bash\nprintf '<%s>\\n' \"$@\"\n", { mode: 0o755 });
  const model = join(root, "model with spaces.gguf");
  const projector = join(root, "projector.gguf");
  writeFileSync(model, "fixture");
  writeFileSync(projector, "fixture");
  assert.match(run("--model", "missing.gguf").stderr, /readable GGUF/);
  assert.match(run("--model", model, "--mmproj", "missing.gguf").stderr, /mmproj file/);
  assert.match(run("--model", model, "--port", "65536").stderr, /Port must/);
  assert.match(run("--model", model, "--context", "0").stderr, /Context must/);
  assert.match(run("--model", model, "--host", "0.0.0.0").stderr, /Unknown option/);

  const output = execFileSync("bash", [join(root, "scripts", "llama-run.sh"), "--model", model, "--mmproj", projector, "--port", "8081", "--context", "4096"], { encoding: "utf8" });
  assert.match(output, /<--host>\n<127\.0\.0\.1>/);
  assert.match(output, /<--port>\n<8081>/);
  assert.match(output, /<--ctx-size>\n<4096>/);
  assert.match(output, /<--n-gpu-layers>\n<0>/);
  assert.match(output, /<--cors-origins>\n<localhost>/);
  assert.ok(output.includes(`<--model>\n<${model}>`));
  assert.ok(output.includes(`<--mmproj>\n<${projector}>`));
});

test("installer does not overwrite an existing non-checkout", (t) => {
  const root = mkdtempSync(join(tmpdir(), "pixel2code-llama-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  copyFileSync(join(scripts, "llama-install.sh"), join(root, "scripts", "llama-install.sh"));
  mkdirSync(resolve(root, ".local", "llama.cpp"), { recursive: true });
  const result = spawnSync("bash", [join(root, "scripts", "llama-install.sh")], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not a Git checkout/);
});

test("installer verifies downloads, retries safely, and preserves existing files", (t) => {
  const root = mkdtempSync(join(tmpdir(), "pixel2code-llama-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const scriptDir = join(root, "scripts");
  const binDir = join(root, "bin");
  const source = join(root, ".local", "llama.cpp");
  mkdirSync(scriptDir);
  mkdirSync(binDir);
  mkdirSync(join(source, ".git"), { recursive: true });
  mkdirSync(join(source, "build", "bin"), { recursive: true });
  copyFileSync(join(scripts, "llama-install.sh"), join(scriptDir, "llama-install.sh"));
  writeFileSync(join(source, "build", "bin", "llama-server"), "#!/bin/bash\n", { mode: 0o755 });

  const mock = (name, body) => writeFileSync(join(binDir, name), `#!/bin/bash\n${body}\n`, { mode: 0o755 });
  mock("git", 'if [[ "$*" == *"rev-parse HEAD"* ]]; then echo 8d60873dfb8619f2b5ed31adfbab07cccb40db5c; fi');
  mock("cmake", "exit 0");
  mock("curl", `
    while [[ $# -gt 0 ]]; do
      case "$1" in --output) output="$2"; shift 2 ;; *) url="$1"; shift ;; esac
    done
    echo "$url" >> "$DOWNLOAD_LOG"
    if [[ "$url" == *"/mmproj-"* ]]; then
      printf projector > "$output"
      [[ "\${FAIL_PROJECTOR:-}" != 1 ]] || exit 22
    else
      if [[ "\${BAD_MODEL:-}" == 1 ]]; then printf invalid > "$output"; else printf model > "$output"; fi
    fi
  `);
  mock("shasum", `
    case "$(cat "$3")" in
      model) echo "d02fe9b69ad8cadbbd228e387667af66612c44bed29ffc8eb1e7caf9ac486c12  $3" ;;
      projector) echo "980c9b2f78c04e6cff93d277ada09e768394f112d75db3b4e9dea8a69f9fb904  $3" ;;
      *) echo "invalid  $3" ;;
    esac
  `);

  const model = join(root, "Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf");
  const projector = join(root, "mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf");
  const log = join(root, "downloads.log");
  const run = (extra = {}) => spawnSync("bash", [join(scriptDir, "llama-install.sh")], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${binDir}:${process.env.PATH}`, DOWNLOAD_LOG: log, ...extra },
  });

  const badDownload = run({ BAD_MODEL: "1" });
  assert.notEqual(badDownload.status, 0);
  assert.match(badDownload.stderr, /SHA-256 verification failed/);
  assert.ok(!readdirSync(root).some((name) => name.endsWith(".gguf") || name.startsWith(".llama-download.")));
  writeFileSync(log, "");

  assert.notEqual(run({ FAIL_PROJECTOR: "1" }).status, 0);
  assert.equal(readFileSync(model, "utf8"), "model");
  assert.ok(!readdirSync(root).some((name) => name.startsWith(".llama-download.")));
  const retry = run();
  assert.equal(retry.status, 0, retry.stderr);
  assert.equal(readFileSync(projector, "utf8"), "projector");
  assert.equal(readFileSync(log, "utf8").trim().split("\n").length, 3);
  assert.equal(run().status, 0);
  assert.equal(readFileSync(log, "utf8").trim().split("\n").length, 3);

  writeFileSync(model, "user data");
  const invalid = run();
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /will not be overwritten/);
  assert.equal(readFileSync(model, "utf8"), "user data");
});
