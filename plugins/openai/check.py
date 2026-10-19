#!/usr/bin/env python3
"""Check the Hugeicons plugin package against OpenAI's submission rules, then build the upload ZIP.

Usage:  python3 check.py          # check, and build dist/hugeicons-plugin-<version>.zip if everything passes
        python3 check.py --check  # check only
        python3 check.py --test   # build a local test archive, skipping the submission-only demo video check

Uses only the Python standard library.
"""
import hashlib, json, os, re, shutil, struct, sys, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SHIP = ["plugin.json", "mcp.json", "skills", "assets"]  # only these go into the ZIP

# Skills shared with the repo. They are copied in from ../../skills before every check so the
# plugin can't drift from what `npx skills add` installs; skills/get-started is plugin-only.
SHARED_SKILLS = ["hugeicons", "hugeicons-migrate"]
REPO_SKILLS = os.path.normpath(os.path.join(ROOT, "..", "..", "skills"))

def sync_shared_skills():
    for name in SHARED_SKILLS:
        src = os.path.join(REPO_SKILLS, name)
        dst = os.path.join(ROOT, "skills", name)
        if not os.path.isdir(src):
            bad(f"skills/{name}: source not found at {os.path.relpath(src, ROOT)}"); continue
        shutil.rmtree(dst, ignore_errors=True)
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".*"))
        print(f"synced skills/{name} from {os.path.relpath(src, ROOT)}")

# sha256 of the placeholder images shipped in the draft; real artwork must replace them
PLACEHOLDERS = {
    "729d19e844b21af5211fd2f2c0c05fffacf9e8110f5054a074ad64c5bfab028d",
    "d6bb1bb8e71a51049653c2bc4e25c0eac2d78e07c7fa1d145505fb1143d152a7",
    "2a71be7329fcb7d4ccbf2a86f1a392be9b48e7523bcc03b7fc333e2fa67b7728",
    "e4bdfab09696d29e9c108b179873cb0346d8a50c75727c680937874c41c5690e",
}

TEST_BUILD = "--test" in sys.argv  # local install only, never upload one of these
problems, notes = [], []
def bad(msg): problems.append(msg)

def load(name):
    try:
        with open(os.path.join(ROOT, name), encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        bad(f"{name}: cannot read JSON ({e})"); return {}

def https(url): return isinstance(url, str) and url.startswith("https://") and "@" not in url.split("/")[2]

def image_size(path):
    """Return (width, height, kind) for PNG/JPEG/WebP/SVG, or None."""
    with open(path, "rb") as f: data = f.read()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", data[16:24]); return w, h, "png"
    if data[:2] == b"\xff\xd8":
        i = 2
        while i < len(data) - 9:
            if data[i] != 0xFF: i += 1; continue
            marker = data[i + 1]
            if marker in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack(">HH", data[i + 5:i + 9]); return w, h, "jpeg"
            i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        if data[12:16] == b"VP8X":
            w = int.from_bytes(data[24:27], "little") + 1; h = int.from_bytes(data[27:30], "little") + 1; return w, h, "webp"
        if data[12:16] == b"VP8 ":
            w, h = struct.unpack("<HH", data[26:30]); return w & 0x3FFF, h & 0x3FFF, "webp"
        if data[12:16] == b"VP8L":
            b = int.from_bytes(data[21:25], "little"); return (b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1, "webp"
    text = data[:4096].decode("utf-8", "ignore")
    if "<svg" in text:
        m = re.search(r'viewBox="\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)', text)
        if m: return float(m.group(1)), float(m.group(2)), "svg"
        return None
    return None

def check_asset(field, rel, square):
    if not isinstance(rel, str) or not rel.startswith("./"):
        bad(f"{field}: path must start with ./ (got {rel!r})"); return
    path = os.path.join(ROOT, rel[2:])
    if not os.path.isfile(path):
        bad(f"{field}: file not found: {rel}"); return
    if os.path.getsize(path) > 5 * 1024 * 1024: bad(f"{field}: {rel} is over 5 MiB")
    if hashlib.sha256(open(path, "rb").read()).hexdigest() in PLACEHOLDERS:
        bad(f"{field}: {rel} is still the placeholder image, replace it with real artwork")
    size = image_size(path)
    if not size: bad(f"{field}: {rel} is not a PNG, JPEG, WebP or SVG (with viewBox)"); return
    w, h, kind = size
    if square:
        if w != h: bad(f"{field}: {rel} must be square (is {w}x{h})")
        if min(w, h) < 48: bad(f"{field}: {rel} must be at least 48x48 (is {w}x{h})")
    if kind != "svg" and max(w, h) > 4096: bad(f"{field}: {rel} is over 4096 px")

# ---------- plugin.json ----------
p = load("plugin.json")
allowed_root = {"$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"}
for k in set(p) - allowed_root: bad(f"plugin.json: unknown top-level field {k!r}")
if p.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json": bad("plugin.json: wrong or missing $schema")
if not re.fullmatch(r"(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?", p.get("name", "")) or len(p.get("name", "")) > 64:
    bad("plugin.json: name must be lowercase letters, digits and single hyphens, max 64")
if not re.fullmatch(r"\d+\.\d+\.\d+", p.get("version", "")): bad("plugin.json: version should be semantic, e.g. 1.0.0")
if "author" in p and set(p["author"]) - {"name", "email", "url"}: bad("plugin.json: author allows only name, email, url")

oa = p.get("extensions", {}).get("com.openai", {})
ui = oa.get("interface", {})
limits = {"displayName": 30, "shortDescription": 30, "longDescription": 4000, "developerName": 80}
for k, n in limits.items():
    v = ui.get(k)
    if not isinstance(v, str) or not v.strip(): bad(f"interface.{k}: required")
    elif len(v) > n: bad(f"interface.{k}: {len(v)} characters, limit {n}")
if not ui.get("category"): bad("interface.category: required")
caps = ui.get("capabilities", [])
if len(caps) > 20 or any(len(c) > 120 for c in caps): bad("interface.capabilities: max 20 items, 120 characters each")
for k in ("websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"):
    v = ui.get(k)
    if not https(v): bad(f"interface.{k}: required HTTPS URL")
    elif len(v) > 1024: bad(f"interface.{k}: over 1024 characters")
prompts = ui.get("defaultPrompt", [])
prompts = [prompts] if isinstance(prompts, str) else prompts
if len(prompts) > 3: bad("interface.defaultPrompt: max 3")
for s in prompts:
    if len(s) > 128: bad(f"interface.defaultPrompt: over 128 characters: {s[:40]}...")
    if "@" in s: bad(f"interface.defaultPrompt: remove @mentions: {s[:40]}...")
if len(set(prompts)) != len(prompts): bad("interface.defaultPrompt: prompts must be unique")
for k in ("brandColor", "brandColorDark"):
    if k in ui and not re.fullmatch(r"#[0-9A-Fa-f]{6}", ui[k]): bad(f"interface.{k}: use #RRGGBB")
for k in ("logo", "composerIcon"):
    if k not in ui: bad(f"interface.{k}: required")
for k in ("logo", "logoDark", "composerIcon", "composerIconDark"):
    if k in ui: check_asset(f"interface.{k}", ui[k], square=True)
# Screenshots are allowed only when the MCP tool scan reports a UI output template.
# Our tools return text and structured data, so including any earns `screenshots_not_allowed`.
if ui.get("screenshots"): bad("interface.screenshots: not allowed — this server ships no custom UI; remove the field")

onb = oa.get("onboardingSkill")
if onb and not os.path.isfile(os.path.join(ROOT, onb.lstrip("./"))): bad(f"onboardingSkill: file not found: {onb}")

rv = oa.get("review", {})
tc = rv.get("test_cases", {})
pos, neg = tc.get("positive", []), tc.get("negative", [])
if len(pos) != 5: bad(f"review: exactly 5 positive test cases required (have {len(pos)})")
if len(neg) != 3: bad(f"review: exactly 3 negative test cases required (have {len(neg)})")
for i, c in enumerate(pos):
    for k in ("description", "prompt", "tools_triggered", "expected_behavior"):
        if not c.get(k): bad(f"review.positive[{i}]: {k} required")
for i, c in enumerate(neg):
    for k in ("description", "prompt"):
        if not c.get(k): bad(f"review.negative[{i}]: {k} required")
if not https(rv.get("demo_recording_url")):
    if TEST_BUILD:
        notes.append("review.demo_recording_url missing - fine for a test build, required before submitting")
    else:
        bad("review.demo_recording_url: add the HTTPS link to the walkthrough video (reviewers must open it without signing in)")
for k in ("test_credentials", "reviewer_instructions"):
    if k in rv: bad(f"review.{k}: not allowed in the ZIP, enter it in the dashboard")
if not oa.get("publication", {}).get("release_notes"): notes.append("publication.release_notes is empty")

# ---------- mcp.json ----------
m = load("mcp.json")
if m.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json": bad("mcp.json: wrong or missing $schema")
servers = m.get("mcpServers", {})
if len(servers) != 1: bad(f"mcp.json: exactly one server for plugin-level test cases (have {len(servers)})")
for name, s in servers.items():
    if s.get("type") != "streamable-http": bad(f"mcp.json: {name} must be type streamable-http")
    if not https(s.get("url")): bad(f"mcp.json: {name} needs an HTTPS url")
    if s.get("headers"): bad(f"mcp.json: {name} must not carry headers (public submission rejects them)")

# ---------- skills ----------
sync_shared_skills()
skills_dir = os.path.join(ROOT, "skills")
found = 0
for d in sorted(os.listdir(skills_dir)) if os.path.isdir(skills_dir) else []:
    if d.startswith("."): continue  # .DS_Store and friends are not skills
    f = os.path.join(skills_dir, d, "SKILL.md")
    if not os.path.isfile(f): bad(f"skills/{d}: missing SKILL.md"); continue
    found += 1
    text = open(f, encoding="utf-8").read()
    fm = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not fm: bad(f"skills/{d}/SKILL.md: missing YAML frontmatter"); continue
    head = fm.group(1)
    nm = re.search(r"^name:\s*(.+)$", head, re.M)
    if not nm: bad(f"skills/{d}/SKILL.md: frontmatter needs name")
    elif nm.group(1).strip() != d: notes.append(f"skills/{d}: name {nm.group(1).strip()!r} differs from folder name")
    if not re.search(r"^description:\s*\S", head, re.M): bad(f"skills/{d}/SKILL.md: frontmatter needs description")
if not found: bad("skills/: no skills found")

# ---------- things the portal rejects ----------
for dirpath, _, files in os.walk(ROOT):
    for fn in files:
        if fn.endswith(".app.json") or fn in ("hooks.json",): bad(f"remove {os.path.relpath(os.path.join(dirpath, fn), ROOT)}: app references and hooks can't be submitted")

# ---------- report ----------
for n in notes: print("note:", n)
if problems:
    print(f"\n{len(problems)} problem(s) to fix before upload:")
    for x in problems: print("  -", x)
    sys.exit(1)
print("All checks passed.")
if "--check" in sys.argv: sys.exit(0)

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
suffix = "-TEST" if TEST_BUILD else ""
out = os.path.join(ROOT, "dist", f"hugeicons-plugin-{p['version']}{suffix}.zip")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for item in SHIP:
        full = os.path.join(ROOT, item)
        if os.path.isfile(full): z.write(full, item)
        else:
            for dirpath, _, files in os.walk(full):
                for fn in sorted(files):
                    if fn.startswith("."): continue
                    fp = os.path.join(dirpath, fn); z.write(fp, os.path.relpath(fp, ROOT))
if TEST_BUILD:
    print("Built", os.path.relpath(out, ROOT), "- for local install only. Do NOT upload this to the submission portal.")
else:
    print("Built", os.path.relpath(out, ROOT), "- upload this file in the plugin submission portal.")
