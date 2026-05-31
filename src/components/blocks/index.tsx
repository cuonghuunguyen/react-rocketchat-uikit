import { createElement, type ReactNode } from 'react';
import type { TextObject } from '../../types';

// Internal helper — lets us create custom host elements with typed React props
// without fighting the JSX intrinsic-element type system.
function el<P>(type: string, props: P) {
  return createElement(type, props as unknown as Record<string, unknown>);
}

// ─────────────────────────────────────────────────────────────────────────────
// Props interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionsProps {
  blockId?: string;
  appId?: string;
  /** Interactive elements rendered as `elements`. */
  children: ReactNode;
}

export interface SectionProps {
  blockId?: string;
  appId?: string;
  /** Section body text — string is interpreted as Markdown. */
  text?: string | TextObject;
  /** Array of text fields — strings are interpreted as Markdown. */
  fields?: Array<string | TextObject>;
  /**
   * A single interactive element placed as the section `accessory`.
   * Supports: Button, DatePicker, ImageElement, StaticSelect,
   * MultiStaticSelect, Overflow.
   */
  children?: ReactNode;
}

export interface InputProps {
  blockId?: string;
  appId?: string;
  /** Label shown above the input — string is converted to `plain_text`. */
  label: string | TextObject;
  /** Hint text shown below the input — string is converted to `plain_text`. */
  hint?: string | TextObject;
  optional?: boolean;
  /** Exactly one input element. */
  children: ReactNode;
}

export interface ContextProps {
  blockId?: string;
  appId?: string;
  /** Mix of text (`<Mrkdwn>`, `<Plain>`) and `<ImageElement>` nodes. */
  children: ReactNode;
}

export interface ImageBlockProps {
  blockId?: string;
  appId?: string;
  imageUrl: string;
  altText: string;
  /** Optional title — string is converted to `plain_text`. */
  title?: string | TextObject;
}

export interface DividerProps {
  blockId?: string;
  appId?: string;
}

export interface CalloutProps {
  blockId?: string;
  appId?: string;
  /** Main callout text — string is interpreted as Markdown. */
  text: string | TextObject;
  /** Optional title — string is interpreted as Markdown. */
  title?: string | TextObject;
  variant?: 'info' | 'danger' | 'warning' | 'success';
  /** Optional single accessory element: Button or Overflow. */
  children?: ReactNode;
}

/** Thumb variant — `thumb` and `preview` are mutually exclusive. */
export interface PreviewPropsWithThumb {
  blockId?: string;
  appId?: string;
  title: Array<string | TextObject>;
  description: Array<string | TextObject>;
  thumb: { url: string; dimensions?: { width: number; height: number } };
  preview?: never;
  externalUrl?: never;
  oembedUrl?: never;
  /** Optional `<Context>` block rendered as `footer`. */
  children?: ReactNode;
}

/** Preview-image variant — `thumb` and `preview` are mutually exclusive. */
export interface PreviewPropsWithPreview {
  blockId?: string;
  appId?: string;
  title: Array<string | TextObject>;
  description: Array<string | TextObject>;
  preview: { url: string; dimensions?: { width: number; height: number } };
  externalUrl?: string;
  oembedUrl?: string;
  thumb?: never;
  /** Optional `<Context>` block rendered as `footer`. */
  children?: ReactNode;
}

export interface PreviewPropsNoMedia {
  blockId?: string;
  appId?: string;
  title: Array<string | TextObject>;
  description: Array<string | TextObject>;
  thumb?: never;
  preview?: never;
  /** Optional `<Context>` block rendered as `footer`. */
  children?: ReactNode;
}

export type PreviewProps =
  | PreviewPropsWithThumb
  | PreviewPropsWithPreview
  | PreviewPropsNoMedia;

export interface InfoCardProps {
  /** One or more `<InfoCardRow>` children. */
  children: ReactNode;
}

export interface InfoCardRowProps {
  background: 'default' | 'secondary';
  /**
   * Elements to display in the row — `<Mrkdwn>`, `<Plain>`, or
   * `<ImageElement>`. Optionally add one `<IconButton>` which becomes the row
   * `action`.
   */
  children: ReactNode;
}

export interface ConditionalProps {
  engine?: Array<'rocket.chat' | 'livechat'>;
  /** Layout blocks to conditionally render. */
  children: ReactNode;
}

export interface TabNavigationProps {
  /** One or more `<Tab>` elements. */
  children: ReactNode;
}

export interface VideoConferenceProps {
  blockId?: string;
  appId?: string;
  callId: string;
  title?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

/** Renders a set of interactive elements in a horizontal row. */
export const Actions = (props: ActionsProps) => el('actions', props);

/**
 * A flexible block for displaying text, optional fields, and an accessory
 * element.
 */
export const Section = (props: SectionProps) => el('section', props);

/** A labelled input field that wraps a single input element. */
export const Input = (props: InputProps) => el('input', props);

/** Renders a mix of small text and image elements side by side. */
export const Context = (props: ContextProps) => el('context', props);

/** A standalone image block with an optional title. */
export const Image = (props: ImageBlockProps) => el('image_block', props);

/** A horizontal rule that visually separates blocks. */
export const Divider = (props: DividerProps = {}) => el('divider', props);

/** A highlighted callout box with an optional variant and accessory. */
export const Callout = (props: CalloutProps) => el('callout', props);

/**
 * A rich preview block. Supply either `thumb` (thumbnail) or `preview` (full
 * preview image), but not both. An optional `<Context>` child becomes the
 * footer.
 */
export const Preview = (props: PreviewProps) => el('preview', props);

/** A card block composed of one or more `<InfoCardRow>` children. */
export const InfoCard = (props: InfoCardProps) => el('info_card', props);

/** A single row inside an `<InfoCard>`. */
export const InfoCardRow = (props: InfoCardRowProps) =>
  el('info_card_row', props);

/**
 * Conditionally renders its child blocks depending on the hosting engine.
 * This is the only block that can directly contain other layout blocks.
 */
export const Conditional = (props: ConditionalProps) =>
  el('conditional', props);

/**
 * A tab-navigation bar.
 * @experimental This block type may change in future versions.
 */
export const TabNavigation = (props: TabNavigationProps) =>
  el('tab_navigation', props);

/** A video-conference block (only valid in Message surfaces). */
export const VideoConference = (props: VideoConferenceProps) =>
  el('video_conf', props);
