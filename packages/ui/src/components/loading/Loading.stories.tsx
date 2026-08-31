import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  args: {
    size: "md",
    tone: "primary",
    variant: "inline"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "neutral", "inverse", "danger"]
    },
    variant: {
      control: "inline-radio",
      options: ["inline", "block"]
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Loading size="sm" />
      <Loading size="md" />
      <Loading size="lg" />
    </div>
  )
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Loading tone="primary" />
      <Loading tone="neutral" />
      <Loading tone="danger" />
      <div className="rounded-[var(--sb-radius-md)] bg-[#060647] p-4">
        <Loading tone="inverse" />
      </div>
    </div>
  )
};

export const Block: Story = {
  render: () => (
    <div className="w-[360px] rounded-[var(--sb-radius-md)] border border-[var(--sb-color-border)] bg-[var(--sb-color-surface)]">
      <Loading size="lg" tone="neutral" variant="block" />
    </div>
  )
};
