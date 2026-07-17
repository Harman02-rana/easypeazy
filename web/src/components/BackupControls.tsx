"use client";

import { useRef, useState } from "react";
import { exportTrackerData, parseBackupFile, restoreTrackerData } from "@/lib/backup";

export default function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        parseBackupFile(text); // validate shape before asking to overwrite
        setPendingImport(text);
        setMessage(null);
      } catch {
        setMessage("That file doesn't look like a valid backup.");
      }
    });
    e.target.value = "";
  }

  function confirmImport() {
    if (!pendingImport) return;
    try {
      restoreTrackerData(parseBackupFile(pendingImport));
      setMessage("Backup restored. Reloading...");
      setPendingImport(null);
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setMessage("Something went wrong restoring that file.");
      setPendingImport(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        onClick={() => exportTrackerData()}
        className="btn-secondary-sm"
      >
        Export my data
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn-secondary-sm"
      >
        Import my data
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChosen}
        className="hidden"
      />

      {pendingImport && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
          <span className="text-muted">
            This will overwrite your current tracker data. Continue?
          </span>
          <button
            onClick={confirmImport}
            className="font-semibold text-accent cursor-pointer"
          >
            Yes, overwrite
          </button>
          <button
            onClick={() => setPendingImport(null)}
            className="text-muted cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {message && <span className="text-muted">{message}</span>}
    </div>
  );
}
