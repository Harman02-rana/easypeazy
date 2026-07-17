import { store, TRACKER_KEYS } from "./storage";

const BACKUP_VERSION = 1;

interface BackupFile {
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportTrackerData(): void {
  const data: Record<string, unknown> = {};
  for (const key of Object.values(TRACKER_KEYS)) {
    const value = store.getItem<unknown>(key);
    if (value !== null) data[key] = value;
  }

  const backup: BackupFile = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobhunter-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseBackupFile(text: string): BackupFile {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || !("data" in parsed)) {
    throw new Error("This doesn't look like a JobHunter Pro backup file.");
  }
  return parsed as BackupFile;
}

/** Overwrites tracker keys found in the backup. Keys not present in the
 * file are left untouched. Caller is responsible for confirming with the
 * user before calling this, since it's destructive. */
export function restoreTrackerData(backup: BackupFile): void {
  const knownKeys = new Set<string>(Object.values(TRACKER_KEYS));
  for (const [key, value] of Object.entries(backup.data)) {
    if (knownKeys.has(key)) {
      store.setItem(key, value);
    }
  }
}
