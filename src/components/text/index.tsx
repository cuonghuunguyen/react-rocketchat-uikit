import { createElement, type ReactNode } from 'react';

function el<P>(type: string, props: P) {
  return createElement(type, props as unknown as Record<string, unknown>);
}

export interface MrkdwnProps {
  /** Markdown text — provide either this or children (text takes precedence). */
  text?: string;
  /** Markdown text as JSX children. */
  children?: ReactNode;
}

/** A Markdown text object for use inside `<Context>` or `<InfoCardRow>`. */
export const Mrkdwn = (props: MrkdwnProps) =>
  el('mrkdwn', props);

export interface PlainProps {
  emoji?: boolean;
  /** Plain text — provide either this or children (text takes precedence). */
  text?: string;
  /** Plain text as JSX children. */
  children?: ReactNode;
}

/** A plain-text object for use inside `<Context>` or `<InfoCardRow>`. */
export const Plain = (props: PlainProps) =>
  el('plain_text', props);
