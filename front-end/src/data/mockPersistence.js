// ============================================
// Mock Data Persistence
// ============================================
// The mock backend keeps its "database" as plain in-memory JS arrays.
// That means data created in one browser tab (or lost on refresh) never
// reaches another tab / session, since each page load starts with a
// fresh copy of the hardcoded seed data in mockData.js.
//
// These helpers save mutated arrays to localStorage and reload them on
// startup, so created/updated records (requests, approvals, etc.) survive
// page refreshes and are shared across tabs of the same browser.
// ============================================

const STORAGE_PREFIX = 'eps_mock_';

/**
 * Load any previously-saved data for `key` into `arr` in place,
 * preserving the original array reference so every module that already
 * imported it keeps seeing the same (now-hydrated) array.
 */
export function hydrate(key, arr) {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      arr.length = 0;
      arr.push(...parsed);
    }
  } catch {
    // Corrupt or inaccessible storage — fall back to the hardcoded seed data.
  }
}

/**
 * Save the current contents of `arr` under `key` so they survive reloads
 * and are visible from other tabs.
 */
export function persist(key, arr) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(arr));
  } catch {
    // Storage full or unavailable — mutation still applies in-memory for this tab.
  }
}

/**
 * Clear all persisted mock data and go back to the original seed data
 * (useful for demos/resets).
 */
export function resetAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}
