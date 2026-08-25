import "@job-portal/ui/styles.css";
import "../shared/styles/globals.css";

import { UiThemeProvider } from "@job-portal/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appMetadata } from "@/config/app-metadata";

export const metadata: Metadata = appMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <UiThemeProvider>{children}</UiThemeProvider>
      </body>
    </html>
  );
}
