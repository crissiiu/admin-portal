import type { Preview } from "@storybook/react-vite";
import "antd/dist/reset.css";

import "../src/styles/styles.css";
import { UiThemeProvider, type ThemeMode } from "../src/theme";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "UI theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" }
        ],
        title: "Theme"
      }
    }
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme as ThemeMode;

      return (
        <UiThemeProvider mode={mode}>
          <div
            style={{
              background: "var(--sb-color-background)",
              color: "var(--sb-color-foreground)",
              minHeight: "100vh",
              padding: "24px"
            }}
          >
            <Story />
          </div>
        </UiThemeProvider>
      );
    }
  ],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered"
  }
};

export default preview;

