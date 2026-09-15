// Thin client for the GitHub Contents API. Used by the admin dashboard to read
// and write content/campaign.json directly from the browser, using a token the
// admin supplies themselves (never baked into the build, never sent anywhere
// but api.github.com). A push to `main` triggers the Pages deploy workflow,
// so an edit here becomes live in ~1-2 minutes.

const OWNER = process.env.NEXT_PUBLIC_GH_OWNER || "";
const REPO = process.env.NEXT_PUBLIC_GH_REPO || "";
const BRANCH = process.env.NEXT_PUBLIC_GH_BRANCH || "main";
const API = "https://api.github.com";

function assertConfigured() {
  if (!OWNER || !REPO) {
    throw new Error(
      "NEXT_PUBLIC_GH_OWNER / NEXT_PUBLIC_GH_REPO are not set — the dashboard doesn't know which repo to write to yet."
    );
  }
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode("0x" + p1)
    )
  );
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Verify a token actually works and can see the repo, before trusting it. */
export async function verifyToken(token) {
  assertConfigured();
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Token can't see this repo — check it has 'repo' (or fine-grained Contents read/write) access."
        : `GitHub rejected the token (HTTP ${res.status}).`
    );
  }
  return res.json();
}

/** Fetch a JSON file's parsed contents plus its blob sha (needed to update it). */
export async function getJsonFile(path, token) {
  assertConfigured();
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: authHeaders(token) }
  );
  if (res.status === 404) {
    return { data: null, sha: null };
  }
  if (!res.ok) {
    throw new Error(`Failed to load ${path} (HTTP ${res.status})`);
  }
  const body = await res.json();
  const text = b64DecodeUnicode(body.content.replace(/\n/g, ""));
  return { data: JSON.parse(text), sha: body.sha };
}

/** Commit a JSON object back to the repo. Pass the sha you last read to avoid clobbering a concurrent edit. */
export async function putJsonFile(path, data, { token, sha, message }) {
  assertConfigured();
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message || `Update ${path} via admin dashboard`,
      content: b64EncodeUnicode(JSON.stringify(data, null, 2) + "\n"),
      sha: sha || undefined,
      branch: BRANCH,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error(
        "Someone else's edit landed first — reload the dashboard to get the latest version, then retry your change."
      );
    }
    throw new Error(body.message || `Failed to save ${path} (HTTP ${res.status})`);
  }
  return res.json();
}

export const repoInfo = { owner: OWNER, repo: REPO, branch: BRANCH };
