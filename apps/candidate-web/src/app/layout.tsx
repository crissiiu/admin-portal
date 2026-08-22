import "@job-portal/ui/styles.css";
import "../shared/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appMetadata } from "@/config/app-metadata";
import { AppProviders } from "@/shared/providers/AppProviders";

export const metadata: Metadata = appMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

