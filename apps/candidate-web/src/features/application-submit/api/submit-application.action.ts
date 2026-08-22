"use server";

import { applicationSubmitSchema, type ApplicationSubmitInput } from "../model/application-submit.schema";

import type { ActionResult } from "@/shared/types/action-result";

export async function submitApplication(input: ApplicationSubmitInput): Promise<ActionResult> {
  const parsed = applicationSubmitSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      message: "Thông tin ứng tuyển chưa hợp lệ."
    };
  }

  return {
    ok: true,
    data: undefined
  };
}

