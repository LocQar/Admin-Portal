/**
 * Legacy API stub used by LegacyAdminShell.jsx during the migration to the
 * typed feature modules. The original implementation hit a hardcoded
 * `http://localhost:3000` backend that no longer exists, which spammed the
 * console with `ERR_FAILED` on every page load.
 *
 * Modern feature modules use `src/shared/api/client.ts` (talks to MSW or the
 * real `dashboard-api`). This stub returns empty payloads so the legacy
 * shell falls through to its inline `INITIAL_*` mock data without errors.
 * Once Phase 4 finishes converting the remaining legacy pages, delete this
 * file along with `LegacyAdminShell.jsx`.
 */
export const api = {
    async get(_endpoint) {
        return [];
    },
    async post(_endpoint, _data) {
        return { ok: true };
    },
    async patch(_endpoint, _data) {
        return { ok: true };
    },
    async delete(_endpoint) {
        return { ok: true };
    },
};
