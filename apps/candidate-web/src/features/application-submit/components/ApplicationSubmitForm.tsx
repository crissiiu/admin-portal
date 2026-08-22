"use client";

import { Send } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@job-portal/ui";

import { submitApplication } from "../api/submit-application.action";

export function ApplicationSubmitForm({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void submitApplication({ jobId });
        });
      }}
      type="button"
    >
      <Send aria-hidden size={16} />
      {isPending ? "Đang gửi" : "Ứng tuyển"}
    </Button>
  );
}

