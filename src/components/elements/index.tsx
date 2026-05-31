import { createElement, type ReactNode } from 'react';
import type {
  ConfirmationDialog,
  ConversationsSelectElement,
  InputElementDispatchAction,
  TextObject,
} from '../../types';

// Internal helper — lets us create custom host elements with typed React props
// without fighting the JSX intrinsic-element type system.
function el<P>(type: string, props: P) {
  return createElement(type, props as unknown as Record<string, unknown>);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Actionable props
// ─────────────────────────────────────────────────────────────────────────────

interface ActionableProps {
  /**
   * Unique identifier for this interactive element's action.
   * If omitted, an auto-generated ID based on the element's index will be used.
   */
  actionId?: string;
  /**
   * The app that owns this element. If omitted, inherits from the parent block's `appId`.
   */
  appId?: string;
  /**
   * The block this element belongs to. If omitted, inherits from the parent block's `blockId`.
   */
  blockId?: string;
  confirm?: ConfirmationDialog;
  dispatchActionConfig?: readonly InputElementDispatchAction[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Option
// ─────────────────────────────────────────────────────────────────────────────

export interface OptionProps {
  value: string;
  /** Description text shown below the option label. */
  description?: string | TextObject;
  /** URL to open when the option is selected (overflow only). */
  url?: string;
  /** The option label — text content of this element. */
  children: ReactNode;
}

/** A selectable option inside a select element, overflow, checkbox, or radio group. */
export const Option = (props: OptionProps) =>
  el('option', props);

// ─────────────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────────────

export interface ButtonProps extends ActionableProps {
  style?: 'primary' | 'danger';
  url?: string;
  value?: string;
  disabled?: boolean;
  /** Button label — text content of this element. */
  children: ReactNode;
}

/** A clickable button element. */
export const Button = (props: ButtonProps) =>
  el('button', props);

// ─────────────────────────────────────────────────────────────────────────────
// Icon button (used as InfoCardRow action)
// ─────────────────────────────────────────────────────────────────────────────

export interface IconButtonProps extends ActionableProps {
  style?: 'primary' | 'danger' | 'warning' | 'success';
  /** Icon character / emoji — text content of this element. */
  children: ReactNode;
}

/**
 * An icon-only button used as the `action` of an `<InfoCardRow>`.
 * Place it inside `<InfoCardRow>` alongside other elements.
 */
export const IconButton = (props: IconButtonProps) =>
  el('icon_button', props);

// ─────────────────────────────────────────────────────────────────────────────
// Static select
// ─────────────────────────────────────────────────────────────────────────────

export interface StaticSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  /** `<Option>` children define the selectable items. */
  children: ReactNode;
}

/** A single-option dropdown backed by a static list of options. */
export const StaticSelect = (props: StaticSelectProps) =>
  el('static_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Multi static select
// ─────────────────────────────────────────────────────────────────────────────

export interface MultiStaticSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  maxSelectItems?: number;
  /** `<Option>` children define the selectable items. */
  children: ReactNode;
}

/** A multi-option dropdown backed by a static list of options. */
export const MultiStaticSelect = (props: MultiStaticSelectProps) =>
  el('multi_static_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Users select
// ─────────────────────────────────────────────────────────────────────────────

export interface UsersSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  initialUser?: string;
}

/** A dropdown that lets the user pick a single workspace user. */
export const UsersSelect = (props: UsersSelectProps) =>
  el('users_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Multi users select
// ─────────────────────────────────────────────────────────────────────────────

export interface MultiUsersSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  maxSelectItems?: number;
}

/** A dropdown that lets the user pick multiple workspace users. */
export const MultiUsersSelect = (props: MultiUsersSelectProps) =>
  el('multi_users_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Channels select
// ─────────────────────────────────────────────────────────────────────────────

export interface ChannelsSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  initialChannel?: string;
}

/** A dropdown that lets the user pick a single channel. */
export const ChannelsSelect = (props: ChannelsSelectProps) =>
  el('channels_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Multi channels select
// ─────────────────────────────────────────────────────────────────────────────

export interface MultiChannelsSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  maxSelectItems?: number;
}

/** A dropdown that lets the user pick multiple channels. */
export const MultiChannelsSelect = (props: MultiChannelsSelectProps) =>
  el('multi_channels_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Conversations select
// ─────────────────────────────────────────────────────────────────────────────

export interface ConversationsSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  initialConversation?: string;
  filter?: ConversationsSelectElement['filter'];
}

/** A dropdown that lets the user pick a single conversation. */
export const ConversationsSelect = (props: ConversationsSelectProps) =>
  el('conversations_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Multi conversations select
// ─────────────────────────────────────────────────────────────────────────────

export interface MultiConversationsSelectProps extends ActionableProps {
  placeholder?: string | TextObject;
  maxSelectItems?: number;
}

/** A dropdown that lets the user pick multiple conversations. */
export const MultiConversationsSelect = (props: MultiConversationsSelectProps) =>
  el('multi_conversations_select', props);

// ─────────────────────────────────────────────────────────────────────────────
// Overflow
// ─────────────────────────────────────────────────────────────────────────────

export interface OverflowProps extends ActionableProps {
  /** `<Option>` children define the overflow menu items. */
  children: ReactNode;
}

/** An overflow menu element. */
export const Overflow = (props: OverflowProps) =>
  el('overflow', props);

// ─────────────────────────────────────────────────────────────────────────────
// Date / Time pickers
// ─────────────────────────────────────────────────────────────────────────────

export interface DatePickerProps extends ActionableProps {
  placeholder?: string | TextObject;
  /** Initial date in `YYYY-MM-DD` format. */
  initialDate?: string;
}

/** A date-picker input. */
export const DatePicker = (props: DatePickerProps) =>
  el('datepicker', props);

export interface TimePickerProps extends ActionableProps {
  placeholder?: string | TextObject;
  /** Initial time in `HH:mm` format. */
  initialTime?: string;
}

/** A time-picker input. */
export const TimePicker = (props: TimePickerProps) =>
  el('timepicker', props);

// ─────────────────────────────────────────────────────────────────────────────
// Linear scale
// ─────────────────────────────────────────────────────────────────────────────

export interface LinearScaleProps extends ActionableProps {
  minValue?: number;
  maxValue?: number;
  initialValue?: number;
  label?: string | TextObject;
}

/** A horizontal numeric scale slider. */
export const LinearScale = (props: LinearScaleProps) =>
  el('linear_scale', props);

// ─────────────────────────────────────────────────────────────────────────────
// Toggle switch
// ─────────────────────────────────────────────────────────────────────────────

export interface ToggleSwitchProps extends ActionableProps {
  /** Label for the switch — string is converted to `plain_text`. */
  text: string | TextObject;
  checked?: boolean;
}

/** A boolean on/off toggle switch. */
export const ToggleSwitch = (props: ToggleSwitchProps) =>
  el('toggle_switch', props);

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox group
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckboxGroupProps extends ActionableProps {
  /** `<Option>` children define the checkbox items. */
  children: ReactNode;
}

/** A group of checkboxes where multiple items can be selected. */
export const CheckboxGroup = (props: CheckboxGroupProps) =>
  el('checkbox_group', props);

// ─────────────────────────────────────────────────────────────────────────────
// Radio button group
// ─────────────────────────────────────────────────────────────────────────────

export interface RadioButtonGroupProps extends ActionableProps {
  /** `<Option>` children define the radio button items. */
  children: ReactNode;
}

/** A group of radio buttons where exactly one item can be selected. */
export const RadioButtonGroup = (props: RadioButtonGroupProps) =>
  el('radio_button_group', props);

// ─────────────────────────────────────────────────────────────────────────────
// Plain text input
// ─────────────────────────────────────────────────────────────────────────────

export interface PlainTextInputProps extends ActionableProps {
  placeholder?: string | TextObject;
  initialValue?: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
}

/** A free-text input field. */
export const PlainTextInput = (props: PlainTextInputProps) =>
  el('plain_text_input', props);

// ─────────────────────────────────────────────────────────────────────────────
// Image element (used inside Section / Context — not a standalone block)
// ─────────────────────────────────────────────────────────────────────────────

export interface ImageElementProps {
  imageUrl: string;
  altText: string;
}

/**
 * An inline image element for use inside `<Section>` (as accessory) or
 * `<Context>`. This is **not** the standalone `<Image>` block.
 */
export const ImageElement = (props: ImageElementProps) =>
  el('image_element', props);

// ─────────────────────────────────────────────────────────────────────────────
// Tab element (used inside TabNavigation)
// ─────────────────────────────────────────────────────────────────────────────

export interface TabProps extends ActionableProps {
  /** Tab title — string is converted to a text object. */
  title: string | TextObject;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * A single tab for use inside `<TabNavigation>`.
 * @experimental This element type may change in future versions.
 */
export const Tab = (props: TabProps) =>
  el('tab', props);
