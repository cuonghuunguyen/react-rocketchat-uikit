import type { ReactNode } from 'react';
import type { Instance, TextInstance } from '../reconciler/types';
import type {
    ActionsBlock,
    ActionsElement,
    ButtonElement,
    CalloutAccessory,
    CalloutBlock,
    ChannelsSelectElement,
    CheckboxElement,
    ConditionalBlock,
    ContextBlock,
    ContextElement,
    ConversationsSelectElement,
    DatePickerElement,
    DividerBlock,
    ExperimentalTabElement,
    ExperimentalTabNavigationBlock,
    IconButtonElement,
    IconElement,
    ImageBlock,
    ImageElement,
    InfoCardBlock,
    InfoCardRow,
    InputBlock,
    InputElement,
    LayoutBlock,
    LinearScaleElement,
    Markdown,
    MultiChannelsSelectElement,
    MultiConversationsSelectElement,
    MultiStaticSelectElement,
    MultiUsersSelectElement,
    OptionObject,
    OverflowElement,
    PlainText,
    PlainTextInputElement,
    PreviewBlock,
    RadioButtonElement,
    RenderableLayoutBlock,
    SectionAccessory,
    SectionBlock,
    StaticSelectElement,
    TextObject,
    TimePickerElement,
    ToggleSwitchElement,
    UsersSelectElement,
    VideoConferenceBlock,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────────────────────

export function toMarkdown(value: string | TextObject): Markdown {
  if (typeof value === 'string') return { type: 'mrkdwn', text: value };
  if (value.type === 'mrkdwn') return value;
  return { type: 'mrkdwn', text: value.text };
}

export function toPlainText(value: string | TextObject): PlainText {
  if (typeof value === 'string') return { type: 'plain_text', text: value };
  if (value.type === 'plain_text') return value;
  return { type: 'plain_text', text: value.text };
}

export function toTextObject(value: string | TextObject): TextObject {
  if (typeof value === 'string') return { type: 'mrkdwn', text: value };
  return value;
}

/**
 * Convert a value that may be a string, TextObject, or React element (e.g.
 * `<Mrkdwn text="..." />` or `<Plain text="..." />`) into a TextObject.
 * Returns null for values that cannot be mapped.
 */
function toTextObjectOrNull(value: string | TextObject | ReactNode): TextObject | null {
  if (typeof value === 'string') return { type: 'mrkdwn', text: value };
  if (!value || typeof value !== 'object') return null;

  const v = value as Record<string, unknown>;

  // Already a TextObject
  if ((v['type'] === 'mrkdwn' || v['type'] === 'plain_text') && typeof v['text'] === 'string') {
    return value as TextObject;
  }

  // React component element — call the function to resolve to a host element
  if ('$$typeof' in v && typeof v['type'] === 'function') {
    try {
      return toTextObjectOrNull((v['type'] as (p: unknown) => unknown)(v['props']) as ReactNode);
    } catch {
      return null;
    }
  }

  // React host element created via createElement('mrkdwn'|'plain_text', ...)
  if (typeof v['type'] === 'string' && (v['type'] === 'mrkdwn' || v['type'] === 'plain_text')) {
    const props = (v['props'] ?? {}) as { text?: string };
    if (typeof props.text === 'string') {
      return { type: v['type'] as 'mrkdwn' | 'plain_text', text: props.text };
    }
  }

  return null;
}

/**
 * Collect the combined text content from child text-nodes and `plain_text` /
 * `mrkdwn` host instances.
 */
function childrenToText(children: Array<Instance | TextInstance>): string {
  return children
    .map((child) => {
      if (child.nodeType === 'text') return child.text;
      if (child.type === 'plain_text' || child.type === 'mrkdwn') {
        return String((child.props as { text?: unknown }).text ?? '');
      }
      return '';
    })
    .join('');
}

/**
 * Extract text from a `mrkdwn` or `plain_text` instance.
 * Prefers `props.text` (set via the `text` prop) over children text content.
 */
function instanceText(inst: Instance): string {
  const propText = (inst.props as { text?: unknown }).text;
  if (typeof propText === 'string' && propText.length > 0) return propText;
  return childrenToText(inst.children);
}

// ─────────────────────────────────────────────────────────────────────────────
// Option serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeOption(inst: Instance): OptionObject {
  const props = inst.props as {
    value?: string;
    description?: string | TextObject | ReactNode;
    url?: string;
  };
  const text = childrenToText(inst.children);
  const descTextObj = props.description !== undefined ? toTextObjectOrNull(props.description) : null;
  return {
    text: { type: 'plain_text', text },
    value: props.value ?? '',
    ...(descTextObj !== null ? { description: toPlainText(descTextObj) } : {}),
    ...(props.url !== undefined ? { url: props.url } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Block context — carries parent block's appId/blockId for inheritance
// ─────────────────────────────────────────────────────────────────────────────

interface BlockContext {
  appId?: string;
  blockId?: string;
}

/** Counter used to auto-generate actionIds when not provided. */
let actionIdCounter = 0;

/** Reset the auto-generated actionId counter (useful for deterministic tests). */
export function resetActionIdCounter(): void {
  actionIdCounter = 0;
}

/**
 * Resolve the actionable fields (actionId, appId, blockId) for an element,
 * falling back to parent block context and auto-generation.
 */
function resolveActionable(
  props: { actionId?: string; appId?: string; blockId?: string },
  ctx: BlockContext,
): { actionId: string; appId: string; blockId: string } {
  return {
    actionId: props.actionId ?? `action_${actionIdCounter++}`,
    appId: props.appId ?? ctx.appId ?? '',
    blockId: props.blockId ?? ctx.blockId ?? '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Element serializers
// ─────────────────────────────────────────────────────────────────────────────

function serializeButton(inst: Instance, ctx: BlockContext = {}): ButtonElement {
  const p = inst.props as {
    actionId?: string;
    appId?: string;
    blockId?: string;
    style?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
    url?: string;
    value?: string;
    confirm?: unknown;
  };
  const textContent = childrenToText(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'button',
    actionId,
    appId,
    blockId,
    text: { type: 'plain_text', text: textContent },
    ...(p.style !== undefined ? { style: p.style } : {}),
    ...(p.url !== undefined ? { url: p.url } : {}),
    ...(p.value !== undefined ? { value: p.value } : {}),
    ...(p.confirm !== undefined
      ? { confirm: p.confirm as ButtonElement['confirm'] }
      : {}),
  };
}

function serializeIconButton(inst: Instance, ctx: BlockContext = {}): IconButtonElement {
  const p = inst.props as {
    actionId?: string;
    appId?: string;
    blockId?: string;
    icon: IconElement['icon'];
    variant?: IconElement['variant'];
    label?: string;
    url?: string;
    value?: string;
    confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'icon_button',
    actionId,
    appId,
    blockId,
    icon: { type: 'icon', icon: p.icon, variant: p.variant ?? 'default' },
    ...(p.label !== undefined ? { label: p.label } : {}),
    ...(p.url !== undefined ? { url: p.url } : {}),
    ...(p.value !== undefined ? { value: p.value } : {}),
    ...(p.confirm !== undefined
      ? { confirm: p.confirm as IconButtonElement['confirm'] }
      : {}),
  };
}

function serializeOptions(children: Array<Instance | TextInstance>): OptionObject[] {
  return children
    .filter((c): c is Instance => c.nodeType === 'instance' && c.type === 'option')
    .map(serializeOption);
}

function serializeStaticSelect(inst: Instance, ctx: BlockContext = {}): StaticSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject;
    initialOption?: string;
    confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'static_select',
    actionId, appId, blockId,
    options,
    placeholder: p.placeholder !== undefined ? toPlainText(p.placeholder) : { type: 'plain_text', text: '' },
    ...(p.confirm !== undefined ? { confirm: p.confirm as StaticSelectElement['confirm'] } : {}),
  };
}

function serializeMultiStaticSelect(inst: Instance, ctx: BlockContext = {}): MultiStaticSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject;
    maxSelectItems?: number;
    confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'multi_static_select',
    actionId, appId, blockId,
    options,
    placeholder: p.placeholder !== undefined ? toPlainText(p.placeholder) : { type: 'plain_text', text: '' },
    ...(p.maxSelectItems !== undefined ? { maxSelectItems: p.maxSelectItems } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiStaticSelectElement['confirm'] } : {}),
  };
}

function serializeUsersSelect(inst: Instance, ctx: BlockContext = {}): UsersSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'users_select',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as UsersSelectElement['confirm'] } : {}),
  };
}

function serializeMultiUsersSelect(inst: Instance, ctx: BlockContext = {}): MultiUsersSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'multi_users_select',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiUsersSelectElement['confirm'] } : {}),
  };
}

function serializeChannelsSelect(inst: Instance, ctx: BlockContext = {}): ChannelsSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'channels_select',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as ChannelsSelectElement['confirm'] } : {}),
  };
}

function serializeMultiChannelsSelect(inst: Instance, ctx: BlockContext = {}): MultiChannelsSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'multi_channels_select',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiChannelsSelectElement['confirm'] } : {}),
  };
}

function serializeConversationsSelect(inst: Instance, ctx: BlockContext = {}): ConversationsSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'conversations_select',
    actionId, appId, blockId,
    ...(p.confirm !== undefined ? { confirm: p.confirm as ConversationsSelectElement['confirm'] } : {}),
  };
}

function serializeMultiConversationsSelect(inst: Instance, ctx: BlockContext = {}): MultiConversationsSelectElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'multi_conversations_select',
    actionId, appId, blockId,
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiConversationsSelectElement['confirm'] } : {}),
  };
}

function serializeOverflow(inst: Instance, ctx: BlockContext = {}): OverflowElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'overflow',
    actionId, appId, blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as OverflowElement['confirm'] } : {}),
  };
}

function serializeDatePicker(inst: Instance, ctx: BlockContext = {}): DatePickerElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; initialDate?: string; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'datepicker',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialDate !== undefined ? { initialDate: p.initialDate } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as DatePickerElement['confirm'] } : {}),
  };
}

function serializeTimePicker(inst: Instance, ctx: BlockContext = {}): TimePickerElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; initialTime?: string; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'time_picker',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialTime !== undefined ? { initialTime: p.initialTime } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as TimePickerElement['confirm'] } : {}),
  };
}

function serializeLinearScale(inst: Instance, ctx: BlockContext = {}): LinearScaleElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    minValue?: number; maxValue?: number; initialValue?: number;
    preLabel?: string | TextObject; postLabel?: string | TextObject; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'linear_scale',
    actionId, appId, blockId,
    ...(p.minValue !== undefined ? { minValue: p.minValue } : {}),
    ...(p.maxValue !== undefined ? { maxValue: p.maxValue } : {}),
    ...(p.initialValue !== undefined ? { initialValue: p.initialValue } : {}),
    ...(p.preLabel !== undefined ? { preLabel: toPlainText(p.preLabel) } : {}),
    ...(p.postLabel !== undefined ? { postLabel: toPlainText(p.postLabel) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as LinearScaleElement['confirm'] } : {}),
  };
}

function serializeToggleSwitch(inst: Instance, ctx: BlockContext = {}): ToggleSwitchElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'toggle_switch',
    actionId, appId, blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as ToggleSwitchElement['confirm'] } : {}),
  };
}

function serializeCheckboxGroup(inst: Instance, ctx: BlockContext = {}): CheckboxElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'checkbox',
    actionId, appId, blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as CheckboxElement['confirm'] } : {}),
  };
}

function serializeRadioButtonGroup(inst: Instance, ctx: BlockContext = {}): RadioButtonElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'radio_button',
    actionId, appId, blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as RadioButtonElement['confirm'] } : {}),
  };
}

function serializePlainTextInput(inst: Instance, ctx: BlockContext = {}): PlainTextInputElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    placeholder?: string | TextObject; initialValue?: string;
    multiline?: boolean; minLength?: number; maxLength?: number; confirm?: unknown;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'plain_text_input',
    actionId, appId, blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialValue !== undefined ? { initialValue: p.initialValue } : {}),
    ...(p.multiline !== undefined ? { multiline: p.multiline } : {}),
    ...(p.minLength !== undefined ? { minLength: p.minLength } : {}),
    ...(p.maxLength !== undefined ? { maxLength: p.maxLength } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as PlainTextInputElement['confirm'] } : {}),
  };
}

function serializeImageElement(inst: Instance): ImageElement {
  const p = inst.props as { imageUrl: string; altText: string };
  return { type: 'image', imageUrl: p.imageUrl, altText: p.altText };
}

function serializeTab(inst: Instance, ctx: BlockContext = {}): ExperimentalTabElement {
  const p = inst.props as {
    actionId?: string; appId?: string; blockId?: string;
    title: string | TextObject; disabled?: boolean; selected?: boolean;
  };
  const { actionId, appId, blockId } = resolveActionable(p, ctx);
  return {
    type: 'tab',
    actionId, appId, blockId,
    title: toTextObject(p.title),
    ...(p.disabled !== undefined ? { disabled: p.disabled } : {}),
    ...(p.selected !== undefined ? { selected: p.selected } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Context element serializer (text or image)
// ─────────────────────────────────────────────────────────────────────────────

function serializeContextElement(child: Instance | TextInstance): ContextElement | null {
  if (child.nodeType === 'text') {
    return { type: 'mrkdwn', text: child.text };
  }
  switch (child.type) {
    case 'mrkdwn':
      return { type: 'mrkdwn', text: instanceText(child) };
    case 'plain_text': {
      const emoji = (child.props as { emoji?: unknown }).emoji;
      const result: PlainText = emoji !== undefined
        ? { type: 'plain_text', text: instanceText(child), emoji: Boolean(emoji) }
        : { type: 'plain_text', text: instanceText(child) };
      return result;
    }
    case 'image_element':
      return serializeImageElement(child);
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions-element serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeActionsElement(inst: Instance, ctx: BlockContext = {}): ActionsElement | null {
  switch (inst.type) {
    case 'button':              return serializeButton(inst, ctx);
    case 'static_select':      return serializeStaticSelect(inst, ctx);
    case 'multi_static_select': return serializeMultiStaticSelect(inst, ctx);
    case 'users_select':       return serializeUsersSelect(inst, ctx);
    case 'multi_users_select': return serializeMultiUsersSelect(inst, ctx);
    case 'channels_select':    return serializeChannelsSelect(inst, ctx);
    case 'multi_channels_select': return serializeMultiChannelsSelect(inst, ctx);
    case 'conversations_select': return serializeConversationsSelect(inst, ctx);
    case 'multi_conversations_select': return serializeMultiConversationsSelect(inst, ctx);
    case 'overflow':           return serializeOverflow(inst, ctx);
    case 'datepicker':         return serializeDatePicker(inst, ctx);
    case 'timepicker':         return serializeTimePicker(inst, ctx);
    case 'linear_scale':       return serializeLinearScale(inst, ctx);
    case 'toggle_switch':      return serializeToggleSwitch(inst, ctx);
    case 'checkbox_group':     return serializeCheckboxGroup(inst, ctx);
    case 'radio_button_group': return serializeRadioButtonGroup(inst, ctx);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Input-element serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeInputElement(inst: Instance, ctx: BlockContext = {}): InputElement | null {
  switch (inst.type) {
    case 'plain_text_input':   return serializePlainTextInput(inst, ctx);
    case 'static_select':      return serializeStaticSelect(inst, ctx);
    case 'multi_static_select': return serializeMultiStaticSelect(inst, ctx);
    case 'users_select':       return serializeUsersSelect(inst, ctx);
    case 'multi_users_select': return serializeMultiUsersSelect(inst, ctx);
    case 'channels_select':    return serializeChannelsSelect(inst, ctx);
    case 'multi_channels_select': return serializeMultiChannelsSelect(inst, ctx);
    case 'conversations_select': return serializeConversationsSelect(inst, ctx);
    case 'multi_conversations_select': return serializeMultiConversationsSelect(inst, ctx);
    case 'datepicker':         return serializeDatePicker(inst, ctx);
    case 'timepicker':         return serializeTimePicker(inst, ctx);
    case 'linear_scale':       return serializeLinearScale(inst, ctx);
    case 'checkbox_group':     return serializeCheckboxGroup(inst, ctx);
    case 'radio_button_group': return serializeRadioButtonGroup(inst, ctx);
    case 'toggle_switch':      return serializeToggleSwitch(inst, ctx);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section accessory serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeSectionAccessory(inst: Instance, ctx: BlockContext = {}): SectionAccessory | null {
  switch (inst.type) {
    case 'button':             return serializeButton(inst, ctx);
    case 'datepicker':         return serializeDatePicker(inst, ctx);
    case 'image_element':      return serializeImageElement(inst);
    case 'multi_static_select': return serializeMultiStaticSelect(inst, ctx);
    case 'overflow':           return serializeOverflow(inst, ctx);
    case 'static_select':      return serializeStaticSelect(inst, ctx);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Callout accessory serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeCalloutAccessory(inst: Instance, ctx: BlockContext = {}): CalloutAccessory | null {
  switch (inst.type) {
    case 'button':   return serializeButton(inst, ctx);
    case 'overflow': return serializeOverflow(inst, ctx);
    default:         return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Block serializers
// ─────────────────────────────────────────────────────────────────────────────

function serializeActionsBlock(inst: Instance): ActionsBlock {
  const p = inst.props as { blockId?: string; appId?: string };
  const ctx: BlockContext = { blockId: p.blockId, appId: p.appId };
  const elements = inst.children
    .filter((c): c is Instance => c.nodeType === 'instance')
    .map((c) => serializeActionsElement(c, ctx))
    .filter((e): e is ActionsElement => e !== null);
  return {
    type: 'actions',
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    elements,
  };
}

function serializeSectionBlock(inst: Instance): SectionBlock {
  const p = inst.props as {
    blockId?: string; appId?: string;
    text?: string | TextObject;
    fields?: Array<string | TextObject>;
  };
  const ctx: BlockContext = { blockId: p.blockId, appId: p.appId };
  const elementChildren = inst.children.filter(
    (c): c is Instance => c.nodeType === 'instance',
  );
  const accessory = elementChildren[0]
    ? serializeSectionAccessory(elementChildren[0], ctx) ?? undefined
    : undefined;

  return {
    type: 'section',
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    ...(p.text !== undefined ? { text: toTextObject(p.text) } : {}),
    ...(p.fields !== undefined
      ? { fields: p.fields.map(toTextObject) }
      : {}),
    ...(accessory !== undefined ? { accessory } : {}),
  };
}

function serializeInputBlock(inst: Instance): InputBlock {
  const p = inst.props as {
    blockId?: string; appId?: string;
    label: string | TextObject;
    hint?: string | TextObject;
    optional?: boolean;
  };
  const ctx: BlockContext = { blockId: p.blockId, appId: p.appId };
  const elementChild = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance',
  );
  if (elementChild === undefined) {
    throw new Error(`<Input> requires exactly one child element.`);
  }
  const element = serializeInputElement(elementChild, ctx);
  if (element === null) {
    throw new Error(
      `<Input> child "${elementChild.type}" is not a valid input element.`,
    );
  }
  return {
    type: 'input',
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    label: toPlainText(p.label),
    element,
    ...(p.hint !== undefined ? { hint: toPlainText(p.hint) } : {}),
    ...(p.optional !== undefined ? { optional: p.optional } : {}),
  };
}

function serializeContextBlock(inst: Instance): ContextBlock {
  const p = inst.props as { blockId?: string; appId?: string };
  const elements = inst.children
    .map(serializeContextElement)
    .filter((e): e is ContextElement => e !== null);
  return {
    type: 'context',
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    elements,
  };
}

function serializeImageBlock(inst: Instance): ImageBlock {
  const p = inst.props as {
    blockId?: string; appId?: string;
    imageUrl: string; altText: string; title?: string | TextObject;
  };
  return {
    type: 'image',
    imageUrl: p.imageUrl,
    altText: p.altText,
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    ...(p.title !== undefined ? { title: toPlainText(p.title) } : {}),
  };
}

function serializeDividerBlock(inst: Instance): DividerBlock {
  const p = inst.props as { blockId?: string; appId?: string };
  return {
    type: 'divider',
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
  };
}

function serializeCalloutBlock(inst: Instance): CalloutBlock {
  const p = inst.props as {
    blockId?: string; appId?: string;
    text: string | TextObject;
    title?: string | TextObject;
    variant?: 'info' | 'danger' | 'warning' | 'success';
  };
  const ctx: BlockContext = { blockId: p.blockId, appId: p.appId };
  const elementChild = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance',
  );
  const accessory = elementChild
    ? serializeCalloutAccessory(elementChild, ctx) ?? undefined
    : undefined;

  return {
    type: 'callout',
    text: toTextObject(p.text),
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    ...(p.title !== undefined ? { title: toTextObject(p.title) } : {}),
    ...(p.variant !== undefined ? { variant: p.variant } : {}),
    ...(accessory !== undefined ? { accessory } : {}),
  };
}

function serializePreviewBlock(inst: Instance): PreviewBlock {
  const p = inst.props as {
    blockId?: string; appId?: string;
    title: Array<string | TextObject | ReactNode>;
    description: Array<string | TextObject | ReactNode>;
    thumb?: { url: string; dimensions?: { width: number; height: number } };
    preview?: { url: string; dimensions?: { width: number; height: number } };
    externalUrl?: string;
    oembedUrl?: string;
  };

  // Look for a Context child → footer
  const footerInst = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance' && c.type === 'context',
  );
  const footer = footerInst
    ? serializeContextBlock(footerInst)
    : undefined;

  const base = {
    type: 'preview' as const,
    title: p.title.map(toTextObjectOrNull).filter((t): t is TextObject => t !== null),
    description: p.description.map(toTextObjectOrNull).filter((t): t is TextObject => t !== null),
    ...(footer !== undefined ? { footer } : {}),
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
  };

  if (p.preview !== undefined) {
    return {
      ...base,
      preview: p.preview,
      ...(p.externalUrl !== undefined ? { externalUrl: p.externalUrl } : {}),
      ...(p.oembedUrl !== undefined ? { oembedUrl: p.oembedUrl } : {}),
    } as PreviewBlock;
  }
  if (p.thumb !== undefined) {
    return { ...base, thumb: p.thumb } as PreviewBlock;
  }
  return base as PreviewBlock;
}

function serializeInfoCardBlock(inst: Instance): InfoCardBlock {
  const rows = inst.children
    .filter((c): c is Instance => c.nodeType === 'instance' && c.type === 'info_card_row')
    .map(serializeInfoCardRow);
  return { type: 'info_card', rows };
}

function serializeInfoCardRow(inst: Instance): InfoCardRow {
  const p = inst.props as { background: 'default' | 'secondary' };

  const actionInst = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance' && c.type === 'icon_button',
  );
  const action = actionInst ? serializeIconButton(actionInst) : undefined;

  const elements = inst.children
    .filter((c): c is Instance =>
      c.nodeType === 'instance' && c.type !== 'icon_button',
    )
    .map((child): InfoCardRow['elements'][number] | null => {
      if (child.type === 'mrkdwn') return { type: 'mrkdwn', text: instanceText(child) };
      if (child.type === 'plain_text') return { type: 'plain_text', text: instanceText(child) };
      return null;
    })
    .filter((e): e is InfoCardRow['elements'][number] => e !== null);

  return {
    background: p.background,
    elements,
    ...(action !== undefined ? { action } : {}),
  };
}

function serializeConditionalBlock(inst: Instance): ConditionalBlock {
  const p = inst.props as {
    engine?: Array<'rocket.chat' | 'livechat'>;
  };
  const render = serializeBlocks(inst.children) as RenderableLayoutBlock[];
  return {
    type: 'conditional',
    ...(p.engine !== undefined ? { when: { engine: p.engine } } : {}),
    render,
  };
}

function serializeTabNavigationBlock(inst: Instance): ExperimentalTabNavigationBlock {
  const p = inst.props as { blockId?: string; appId?: string };
  const ctx: BlockContext = { blockId: p.blockId, appId: p.appId };
  const tabs = inst.children
    .filter((c): c is Instance => c.nodeType === 'instance' && c.type === 'tab')
    .map((c) => serializeTab(c, ctx));
  return { type: 'tab_navigation', tabs };
}

function serializeVideoConferenceBlock(inst: Instance): VideoConferenceBlock {
  const p = inst.props as { blockId?: string; appId?: string; callId: string; title?: string };
  return {
    type: 'video_conf',
    callId: p.callId,
    ...(p.blockId !== undefined ? { blockId: p.blockId } : {}),
    ...(p.appId !== undefined ? { appId: p.appId } : {}),
    ...(p.title !== undefined ? { title: p.title } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

function serializeBlock(inst: Instance): LayoutBlock | null {
  switch (inst.type) {
    case 'actions':      return serializeActionsBlock(inst);
    case 'section':      return serializeSectionBlock(inst);
    case 'input':        return serializeInputBlock(inst);
    case 'context':      return serializeContextBlock(inst);
    case 'image_block':  return serializeImageBlock(inst);
    case 'divider':      return serializeDividerBlock(inst);
    case 'callout':      return serializeCalloutBlock(inst);
    case 'preview':      return serializePreviewBlock(inst);
    case 'info_card':    return serializeInfoCardBlock(inst);
    case 'conditional':  return serializeConditionalBlock(inst);
    case 'tab_navigation': return serializeTabNavigationBlock(inst);
    case 'video_conf':   return serializeVideoConferenceBlock(inst);
    default:             return null;
  }
}

export function serializeBlocks(
  nodes: Array<Instance | TextInstance>,
): LayoutBlock[] {
  return nodes
    .filter((n): n is Instance => n.nodeType === 'instance')
    .map(serializeBlock)
    .filter((b): b is LayoutBlock => b !== null);
}
