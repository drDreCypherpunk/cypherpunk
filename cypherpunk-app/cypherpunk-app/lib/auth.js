// Passphrase gate for the admin dashboard.
//
// Honest security note: this is a soft gate, not real access control. The app
// is statically exported (no server), so this check runs entirely in the
// visitor's browser against a SHA-256 hash baked into the public JS bundle.
// It keeps casual visitors and search engines out of the dashboard UI, but
// anyone who reads the bundle can find the hash and could brute-force a weak
// passphrase offline. It is NOT what protects your data.
//
// What actually protects your data: nothing can be WRITTEN back to the repo
// without a valid GitHub token with access to it (see lib/github.js). The
// passphrase only gates the UI; GitHub's own auth gates every write. Use a
// long passphrase, and rotate your GitHub token if you ever suspect it leaked
// (it lives only in this browser's localStorage, never in the bundle).

const SESSION_KEY = "cypherpunk_admin_authed";

export async function sha256Hex(input) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkPassphrase(candidate) {
  const expected = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || "";
  if (!expected) {
    throw new Error(
      "NEXT_PUBLIC_ADMIN_PASS_HASH isn't set at build time — see README for how to set an admin passphrase."
    );
  }
  const got = await sha256Hex(candidate);
  return got === expected;
}

export function markAuthed() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function isAuthed() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}
