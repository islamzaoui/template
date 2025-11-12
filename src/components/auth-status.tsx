"use client";

import { useEffect, useState } from "react";

export function AuthStatus() {
  const [status, setStatus] = useState<{ isLoggedIn: boolean; user?: any } | null>(
    null
  );

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setStatus(data);
    }
    fetchStatus();
  }, []);

  if (status === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Auth Status</h1>
      {status.isLoggedIn ? (
        <div>
          <p>Logged in as {status.user.email}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
