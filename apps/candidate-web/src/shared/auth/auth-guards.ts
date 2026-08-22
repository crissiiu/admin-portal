import "server-only";

import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { getSessionToken } from "./session.server";

export async function requireSession() {
  const token = await getSessionToken();

  if (!token) {
    redirect(routes.signIn());
  }

  return token;
}

