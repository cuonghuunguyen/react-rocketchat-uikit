import React from 'react';
import type { TextObject, ConfirmationDialog, InputElementDispatchAction } from '../../types';
import { Actions } from '../blocks';
import { Context } from '../blocks';
import { Input } from '../blocks';
import { Section } from '../blocks';
import { Button } from '../elements';
import { ImageElement } from '../elements';
import { PlainTextInput } from '../elements';
import { StaticSelect } from '../elements';
import { DatePicker } from '../elements';
import { Overflow } from '../elements';
import { Mrkdwn } from '../text';
import { Plain } from '../text';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Actionable props
// ─────────────────────────────────────────────────────────────────────────────

interface ActionableProps {
  actionId?: string;
  appId?: string;
  blockId?: string;
  confirm?: ConfirmationDialog;
  dispatchActionConfig?: readonly InputElementDispatchAction[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionButton — an Actions block containing a single Button
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionButtonProps extends ActionableProps {
  style?: 'primary' | 'danger';
  url?: string;
  value?: string;
  disabled?: boolean;
  /** Button label text. */
  children: React.ReactNode;
}

/**
 * Shorthand: an `<Actions>` block with a single `<Button>`.
 *
 * Instead of:
 * ```tsx
 * <Actions>
 *   <Button appId="app" blockId="b1" actionId="a1">Click</Button>
 * </Actions>
 * ```
 *
 * Use:
 * ```tsx
 * <ActionButton appId="app" blockId="b1" actionId="a1">Click</ActionButton>
 * ```
 */
export function ActionButton({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  style,
  url,
  value,
  disabled,
  children,
}: ActionButtonProps) {
  return (
    <Actions blockId={blockId} appId={appId}>
      <Button
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
        style={style}
        url={url}
        value={value}
        disabled={disabled}
      >
        {children}
      </Button>
    </Actions>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InputTextInput — an Input block wrapping a single PlainTextInput
// ─────────────────────────────────────────────────────────────────────────────

export interface InputTextInputProps extends ActionableProps {
  /** Label shown above the input. */
  label: string | TextObject;
  /** Hint text shown below the input. */
  hint?: string | TextObject;
  optional?: boolean;
  placeholder?: string | TextObject;
  initialValue?: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
}

/**
 * Shorthand: an `<Input>` block with a single `<PlainTextInput>`.
 *
 * Instead of:
 * ```tsx
 * <Input label="Name">
 *   <PlainTextInput appId="app" blockId="b1" actionId="a1" placeholder="Enter name" />
 * </Input>
 * ```
 *
 * Use:
 * ```tsx
 * <InputTextInput label="Name" appId="app" blockId="b1" actionId="a1" placeholder="Enter name" />
 * ```
 */
export function InputTextInput({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  label,
  hint,
  optional,
  placeholder,
  initialValue,
  multiline,
  minLength,
  maxLength,
}: InputTextInputProps) {
  return (
    <Input label={label} hint={hint} optional={optional} blockId={blockId} appId={appId}>
      <PlainTextInput
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
        placeholder={placeholder}
        initialValue={initialValue}
        multiline={multiline}
        minLength={minLength}
        maxLength={maxLength}
      />
    </Input>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InputStaticSelect — an Input block wrapping a single StaticSelect
// ─────────────────────────────────────────────────────────────────────────────

export interface InputStaticSelectProps extends ActionableProps {
  /** Label shown above the input. */
  label: string | TextObject;
  /** Hint text shown below the input. */
  hint?: string | TextObject;
  optional?: boolean;
  placeholder?: string | TextObject;
  /** `<Option>` children define the selectable items. */
  children: React.ReactNode;
}

/**
 * Shorthand: an `<Input>` block with a single `<StaticSelect>`.
 *
 * Instead of:
 * ```tsx
 * <Input label="Color">
 *   <StaticSelect appId="app" blockId="b1" actionId="a1">
 *     <Option value="red">Red</Option>
 *   </StaticSelect>
 * </Input>
 * ```
 *
 * Use:
 * ```tsx
 * <InputStaticSelect label="Color" appId="app" blockId="b1" actionId="a1">
 *   <Option value="red">Red</Option>
 * </InputStaticSelect>
 * ```
 */
export function InputStaticSelect({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  label,
  hint,
  optional,
  placeholder,
  children,
}: InputStaticSelectProps) {
  return (
    <Input label={label} hint={hint} optional={optional} blockId={blockId} appId={appId}>
      <StaticSelect
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
        placeholder={placeholder}
      >
        {children}
      </StaticSelect>
    </Input>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InputDatePicker — an Input block wrapping a single DatePicker
// ─────────────────────────────────────────────────────────────────────────────

export interface InputDatePickerProps extends ActionableProps {
  /** Label shown above the input. */
  label: string | TextObject;
  /** Hint text shown below the input. */
  hint?: string | TextObject;
  optional?: boolean;
  placeholder?: string | TextObject;
  /** Initial date in `YYYY-MM-DD` format. */
  initialDate?: string;
}

/**
 * Shorthand: an `<Input>` block with a single `<DatePicker>`.
 *
 * Instead of:
 * ```tsx
 * <Input label="Birthday">
 *   <DatePicker appId="app" blockId="b1" actionId="a1" initialDate="2000-01-01" />
 * </Input>
 * ```
 *
 * Use:
 * ```tsx
 * <InputDatePicker label="Birthday" appId="app" blockId="b1" actionId="a1" initialDate="2000-01-01" />
 * ```
 */
export function InputDatePicker({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  label,
  hint,
  optional,
  placeholder,
  initialDate,
}: InputDatePickerProps) {
  return (
    <Input label={label} hint={hint} optional={optional} blockId={blockId} appId={appId}>
      <DatePicker
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
        placeholder={placeholder}
        initialDate={initialDate}
      />
    </Input>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContextMrkdwn — a Context block containing a single Mrkdwn text
// ─────────────────────────────────────────────────────────────────────────────

export interface ContextMrkdwnProps {
  blockId?: string;
  appId?: string;
  /** Markdown text content. */
  text: string;
}

/**
 * Shorthand: a `<Context>` block with a single `<Mrkdwn>` element.
 *
 * Instead of:
 * ```tsx
 * <Context>
 *   <Mrkdwn text="*Bold* note" />
 * </Context>
 * ```
 *
 * Use:
 * ```tsx
 * <ContextMrkdwn text="*Bold* note" />
 * ```
 */
export function ContextMrkdwn({ blockId, appId, text }: ContextMrkdwnProps) {
  return (
    <Context blockId={blockId} appId={appId}>
      <Mrkdwn text={text} />
    </Context>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContextPlain — a Context block containing a single Plain text
// ─────────────────────────────────────────────────────────────────────────────

export interface ContextPlainProps {
  blockId?: string;
  appId?: string;
  emoji?: boolean;
  /** Plain text content. */
  text: string;
}

/**
 * Shorthand: a `<Context>` block with a single `<Plain>` text element.
 *
 * Instead of:
 * ```tsx
 * <Context>
 *   <Plain text="Some plain text" />
 * </Context>
 * ```
 *
 * Use:
 * ```tsx
 * <ContextPlain text="Some plain text" />
 * ```
 */
export function ContextPlain({ blockId, appId, emoji, text }: ContextPlainProps) {
  return (
    <Context blockId={blockId} appId={appId}>
      <Plain text={text} emoji={emoji} />
    </Context>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContextImage — a Context block containing a single ImageElement
// ─────────────────────────────────────────────────────────────────────────────

export interface ContextImageProps {
  blockId?: string;
  appId?: string;
  imageUrl: string;
  altText: string;
}

/**
 * Shorthand: a `<Context>` block with a single `<ImageElement>`.
 *
 * Instead of:
 * ```tsx
 * <Context>
 *   <ImageElement imageUrl="https://example.com/img.png" altText="img" />
 * </Context>
 * ```
 *
 * Use:
 * ```tsx
 * <ContextImage imageUrl="https://example.com/img.png" altText="img" />
 * ```
 */
export function ContextImage({ blockId, appId, imageUrl, altText }: ContextImageProps) {
  return (
    <Context blockId={blockId} appId={appId}>
      <ImageElement imageUrl={imageUrl} altText={altText} />
    </Context>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionButton — a Section block with text and a Button accessory
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionButtonProps extends ActionableProps {
  /** Section body text — string is interpreted as Markdown. */
  text: string | TextObject;
  /** Array of text fields — strings are interpreted as Markdown. */
  fields?: Array<string | TextObject>;
  style?: 'primary' | 'danger';
  url?: string;
  value?: string;
  disabled?: boolean;
  /** Button label text. */
  children: React.ReactNode;
}

/**
 * Shorthand: a `<Section>` block with a `<Button>` accessory.
 *
 * Instead of:
 * ```tsx
 * <Section text="Pick one">
 *   <Button appId="app" blockId="b1" actionId="a1">Click</Button>
 * </Section>
 * ```
 *
 * Use:
 * ```tsx
 * <SectionButton text="Pick one" appId="app" blockId="b1" actionId="a1">Click</SectionButton>
 * ```
 */
export function SectionButton({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  text,
  fields,
  style,
  url,
  value,
  disabled,
  children,
}: SectionButtonProps) {
  return (
    <Section text={text} fields={fields} blockId={blockId} appId={appId}>
      <Button
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
        style={style}
        url={url}
        value={value}
        disabled={disabled}
      >
        {children}
      </Button>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionOverflow — a Section block with text and an Overflow accessory
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionOverflowProps extends ActionableProps {
  /** Section body text — string is interpreted as Markdown. */
  text: string | TextObject;
  /** Array of text fields — strings are interpreted as Markdown. */
  fields?: Array<string | TextObject>;
  /** `<Option>` children define the overflow menu items. */
  children: React.ReactNode;
}

/**
 * Shorthand: a `<Section>` block with an `<Overflow>` accessory.
 *
 * Instead of:
 * ```tsx
 * <Section text="Options">
 *   <Overflow appId="app" blockId="b1" actionId="a1">
 *     <Option value="opt1">Option 1</Option>
 *   </Overflow>
 * </Section>
 * ```
 *
 * Use:
 * ```tsx
 * <SectionOverflow text="Options" appId="app" blockId="b1" actionId="a1">
 *   <Option value="opt1">Option 1</Option>
 * </SectionOverflow>
 * ```
 */
export function SectionOverflow({
  actionId,
  appId,
  blockId,
  confirm,
  dispatchActionConfig,
  text,
  fields,
  children,
}: SectionOverflowProps) {
  return (
    <Section text={text} fields={fields} blockId={blockId} appId={appId}>
      <Overflow
        actionId={actionId}
        appId={appId}
        blockId={blockId}
        confirm={confirm}
        dispatchActionConfig={dispatchActionConfig}
      >
        {children}
      </Overflow>
    </Section>
  );
}
