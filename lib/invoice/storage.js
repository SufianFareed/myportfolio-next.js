// Every call is wrapped so a blocked, full, or corrupted localStorage
// never crashes the app — it just reports failure.
export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function storageAvailable() {
  try {
    const probe = "__sf_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
