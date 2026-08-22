import "server-only";

import { cookies } from "next/headers";

export async function getSessionToken() {
  return (await cookies()).get("job_portal_session")?.value;
}

