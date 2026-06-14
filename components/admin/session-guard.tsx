"use client";

import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api";
import { SessionExpiredDialog } from "@/components/admin/session-expired-dialog";

/**
 * Mounts on every admin page. On first render it pings a lightweight
 * protected endpoint to verify the DB session is still active. If Laravel
 * returns 401 (JWT valid but AdminSession expired), it opens the session-
 * expired dialog so the user knows to log in again.
 */
export function SessionGuard() {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/admin/messages/unread-count"), { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          setExpired(true);
        }
      })
      .catch(() => {
        // Network error — don't assume session is expired.
      });
  }, []);

  return <SessionExpiredDialog open={expired} />;
}
