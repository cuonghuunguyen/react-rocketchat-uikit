import type {
  ActionsBlock,
  ActionsElement,
  ButtonElement,
  CalloutBlock,
  CalloutAccessory,
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
import type { Instance, TextInstance } from '../reconciler/types';

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
    description?: string | TextObject;
    url?: string;
  };
  const text = childrenToText(inst.children);
  return {
    type: 'option',
    text: { type: 'plain_text', text },
    value: props.value ?? '',
    ...(props.description !== undefined
      ? { description: toPlainText(props.description) }
      : {}),
    ...(props.url !== undefined ? { url: props.url } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Element serializers
// ─────────────────────────────────────────────────────────────────────────────

function serializeButton(inst: Instance): ButtonElement {
  const p = inst.props as {
    actionId: string;
    appId: string;
    blockId: string;
    style?: 'primary' | 'danger';
    url?: string;
    value?: string;
    disabled?: boolean;
    confirm?: unknown;
  };
  const textContent = childrenToText(inst.children);
  return {
    type: 'button',
    actionId: p.actionId,
    appId: p.appId,
    blockId: p.blockId,
    text: { type: 'plain_text', text: textContent },
    ...(p.style !== undefined ? { style: p.style } : {}),
    ...(p.url !== undefined ? { url: p.url } : {}),
    ...(p.value !== undefined ? { value: p.value } : {}),
    ...(p.disabled !== undefined ? { disabled: p.disabled } : {}),
    ...(p.confirm !== undefined
      ? { confirm: p.confirm as ButtonElement['confirm'] }
      : {}),
  };
}

function serializeIconButton(inst: Instance): IconButtonElement {
  const p = inst.props as {
    actionId: string;
    appId: string;
    blockId: string;
    style?: 'primary' | 'danger' | 'warning' | 'success';
    confirm?: unknown;
  };
  const iconText = childrenToText(inst.children);
  return {
    type: 'icon_button',
    actionId: p.actionId,
    appId: p.appId,
    blockId: p.blockId,
    icon: { type: 'plain_text', text: iconText },
    ...(p.style !== undefined ? { style: p.style } : {}),
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

function serializeStaticSelect(inst: Instance): StaticSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject;
    initialOption?: string;
    confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  return {
    type: 'static_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    options,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as StaticSelectElement['confirm'] } : {}),
  };
}

function serializeMultiStaticSelect(inst: Instance): MultiStaticSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject;
    maxSelectItems?: number;
    confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  return {
    type: 'multi_static_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    options,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.maxSelectItems !== undefined ? { maxSelectItems: p.maxSelectItems } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiStaticSelectElement['confirm'] } : {}),
  };
}

function serializeUsersSelect(inst: Instance): UsersSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialUser?: string; confirm?: unknown;
  };
  return {
    type: 'users_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialUser !== undefined ? { initialUser: p.initialUser } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as UsersSelectElement['confirm'] } : {}),
  };
}

function serializeMultiUsersSelect(inst: Instance): MultiUsersSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; maxSelectItems?: number; confirm?: unknown;
  };
  return {
    type: 'multi_users_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.maxSelectItems !== undefined ? { maxSelectItems: p.maxSelectItems } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiUsersSelectElement['confirm'] } : {}),
  };
}

function serializeChannelsSelect(inst: Instance): ChannelsSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialChannel?: string; confirm?: unknown;
  };
  return {
    type: 'channels_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialChannel !== undefined ? { initialChannel: p.initialChannel } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as ChannelsSelectElement['confirm'] } : {}),
  };
}

function serializeMultiChannelsSelect(inst: Instance): MultiChannelsSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; maxSelectItems?: number; confirm?: unknown;
  };
  return {
    type: 'multi_channels_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.maxSelectItems !== undefined ? { maxSelectItems: p.maxSelectItems } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiChannelsSelectElement['confirm'] } : {}),
  };
}

function serializeConversationsSelect(inst: Instance): ConversationsSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialConversation?: string;
    filter?: ConversationsSelectElement['filter']; confirm?: unknown;
  };
  return {
    type: 'conversations_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialConversation !== undefined ? { initialConversation: p.initialConversation } : {}),
    ...(p.filter !== undefined ? { filter: p.filter } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as ConversationsSelectElement['confirm'] } : {}),
  };
}

function serializeMultiConversationsSelect(inst: Instance): MultiConversationsSelectElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; maxSelectItems?: number; confirm?: unknown;
  };
  return {
    type: 'multi_conversations_select',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.maxSelectItems !== undefined ? { maxSelectItems: p.maxSelectItems } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as MultiConversationsSelectElement['confirm'] } : {}),
  };
}

function serializeOverflow(inst: Instance): OverflowElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  return {
    type: 'overflow',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as OverflowElement['confirm'] } : {}),
  };
}

function serializeDatePicker(inst: Instance): DatePickerElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialDate?: string; confirm?: unknown;
  };
  return {
    type: 'datepicker',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialDate !== undefined ? { initialDate: p.initialDate } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as DatePickerElement['confirm'] } : {}),
  };
}

function serializeTimePicker(inst: Instance): TimePickerElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialTime?: string; confirm?: unknown;
  };
  return {
    type: 'timepicker',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.placeholder !== undefined ? { placeholder: toPlainText(p.placeholder) } : {}),
    ...(p.initialTime !== undefined ? { initialTime: p.initialTime } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as TimePickerElement['confirm'] } : {}),
  };
}

function serializeLinearScale(inst: Instance): LinearScaleElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    minValue?: number; maxValue?: number; initialValue?: number;
    label?: string | TextObject; confirm?: unknown;
  };
  return {
    type: 'linear_scale',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    ...(p.minValue !== undefined ? { minValue: p.minValue } : {}),
    ...(p.maxValue !== undefined ? { maxValue: p.maxValue } : {}),
    ...(p.initialValue !== undefined ? { initialValue: p.initialValue } : {}),
    ...(p.label !== undefined ? { label: toPlainText(p.label) } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as LinearScaleElement['confirm'] } : {}),
  };
}

function serializeToggleSwitch(inst: Instance): ToggleSwitchElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    text: string | TextObject; checked?: boolean; confirm?: unknown;
  };
  return {
    type: 'toggle_switch',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    text: toPlainText(p.text),
    ...(p.checked !== undefined ? { checked: p.checked } : {}),
    ...(p.confirm !== undefined ? { confirm: p.confirm as ToggleSwitchElement['confirm'] } : {}),
  };
}

function serializeCheckboxGroup(inst: Instance): CheckboxElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  return {
    type: 'checkboxes',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as CheckboxElement['confirm'] } : {}),
  };
}

function serializeRadioButtonGroup(inst: Instance): RadioButtonElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string; confirm?: unknown;
  };
  const options = serializeOptions(inst.children);
  return {
    type: 'radio_buttons',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
    options,
    ...(p.confirm !== undefined ? { confirm: p.confirm as RadioButtonElement['confirm'] } : {}),
  };
}

function serializePlainTextInput(inst: Instance): PlainTextInputElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    placeholder?: string | TextObject; initialValue?: string;
    multiline?: boolean; minLength?: number; maxLength?: number; confirm?: unknown;
  };
  return {
    type: 'plain_text_input',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
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

function serializeTab(inst: Instance): ExperimentalTabElement {
  const p = inst.props as {
    actionId: string; appId: string; blockId: string;
    title: string | TextObject; disabled?: boolean; selected?: boolean;
  };
  return {
    type: 'tab',
    actionId: p.actionId, appId: p.appId, blockId: p.blockId,
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

function serializeActionsElement(inst: Instance): ActionsElement | null {
  switch (inst.type) {
    case 'button':              return serializeButton(inst);
    case 'static_select':      return serializeStaticSelect(inst);
    case 'multi_static_select': return serializeMultiStaticSelect(inst);
    case 'users_select':       return serializeUsersSelect(inst);
    case 'multi_users_select': return serializeMultiUsersSelect(inst);
    case 'channels_select':    return serializeChannelsSelect(inst);
    case 'multi_channels_select': return serializeMultiChannelsSelect(inst);
    case 'conversations_select': return serializeConversationsSelect(inst);
    case 'multi_conversations_select': return serializeMultiConversationsSelect(inst);
    case 'overflow':           return serializeOverflow(inst);
    case 'datepicker':         return serializeDatePicker(inst);
    case 'timepicker':         return serializeTimePicker(inst);
    case 'linear_scale':       return serializeLinearScale(inst);
    case 'toggle_switch':      return serializeToggleSwitch(inst);
    case 'checkbox_group':     return serializeCheckboxGroup(inst);
    case 'radio_button_group': return serializeRadioButtonGroup(inst);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Input-element serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeInputElement(inst: Instance): InputElement | null {
  switch (inst.type) {
    case 'plain_text_input':   return serializePlainTextInput(inst);
    case 'static_select':      return serializeStaticSelect(inst);
    case 'multi_static_select': return serializeMultiStaticSelect(inst);
    case 'users_select':       return serializeUsersSelect(inst);
    case 'multi_users_select': return serializeMultiUsersSelect(inst);
    case 'channels_select':    return serializeChannelsSelect(inst);
    case 'multi_channels_select': return serializeMultiChannelsSelect(inst);
    case 'conversations_select': return serializeConversationsSelect(inst);
    case 'multi_conversations_select': return serializeMultiConversationsSelect(inst);
    case 'datepicker':         return serializeDatePicker(inst);
    case 'timepicker':         return serializeTimePicker(inst);
    case 'linear_scale':       return serializeLinearScale(inst);
    case 'checkbox_group':     return serializeCheckboxGroup(inst);
    case 'radio_button_group': return serializeRadioButtonGroup(inst);
    case 'toggle_switch':      return serializeToggleSwitch(inst);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section accessory serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeSectionAccessory(inst: Instance): SectionAccessory | null {
  switch (inst.type) {
    case 'button':             return serializeButton(inst);
    case 'datepicker':         return serializeDatePicker(inst);
    case 'image_element':      return serializeImageElement(inst);
    case 'multi_static_select': return serializeMultiStaticSelect(inst);
    case 'overflow':           return serializeOverflow(inst);
    case 'static_select':      return serializeStaticSelect(inst);
    default:                   return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Callout accessory serializer
// ─────────────────────────────────────────────────────────────────────────────

function serializeCalloutAccessory(inst: Instance): CalloutAccessory | null {
  switch (inst.type) {
    case 'button':   return serializeButton(inst);
    case 'overflow': return serializeOverflow(inst);
    default:         return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Block serializers
// ─────────────────────────────────────────────────────────────────────────────

function serializeActionsBlock(inst: Instance): ActionsBlock {
  const p = inst.props as { blockId?: string; appId?: string };
  const elements = inst.children
    .filter((c): c is Instance => c.nodeType === 'instance')
    .map(serializeActionsElement)
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
  const elementChildren = inst.children.filter(
    (c): c is Instance => c.nodeType === 'instance',
  );
  const accessory = elementChildren[0]
    ? serializeSectionAccessory(elementChildren[0]) ?? undefined
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
  const elementChild = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance',
  );
  if (elementChild === undefined) {
    throw new Error(`<Input> requires exactly one child element.`);
  }
  const element = serializeInputElement(elementChild);
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
  const elementChild = inst.children.find(
    (c): c is Instance => c.nodeType === 'instance',
  );
  const accessory = elementChild
    ? serializeCalloutAccessory(elementChild) ?? undefined
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
    title: Array<string | TextObject>;
    description: Array<string | TextObject>;
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
    title: p.title.map(toTextObject),
    description: p.description.map(toTextObject),
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
      if (child.type === 'image_element') return serializeImageElement(child);
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
  const tabs = inst.children
    .filter((c): c is Instance => c.nodeType === 'instance' && c.type === 'tab')
    .map(serializeTab);
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
