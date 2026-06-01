// All block and element types are sourced from @rocket.chat/ui-kit — the
// single source of truth for the Rocket.Chat block-kit wire format.

export type {
  ActionsBlock, ButtonElement, CalloutBlock, ChannelsSelectElement, CheckboxElement, ConditionalBlock, ConfirmationDialog, ContextBlock, ConversationsSelectElement, DatePickerElement, DividerBlock, ExperimentalTabElement, ExperimentalTabNavigationBlock, FrameableIconElement, IconButtonElement,
  IconElement, ImageBlock, ImageElement, InfoCardBlock, InputBlock, InputElementDispatchAction, LayoutBlock, LinearScaleElement, Markdown, MultiChannelsSelectElement, MultiConversationsSelectElement, MultiStaticSelectElement, MultiUsersSelectElement, Option,
  OptionGroup, OverflowElement, PlainText, PlainTextInputElement, PreviewBlock,
  PreviewBlockBase, PreviewBlockWithPreview, PreviewBlockWithThumb, RadioButtonElement, RenderableLayoutBlock, SectionBlock, StaticSelectElement, TextObject, TimePickerElement, ToggleSwitchElement, UsersSelectElement, VideoConferenceBlock
} from '@rocket.chat/ui-kit';

// Legacy aliases used throughout the codebase.
export type { OptionGroup as OptionGroupObject, Option as OptionObject } from '@rocket.chat/ui-kit';

// Union helpers — not exported by @rocket.chat/ui-kit; derived from block types.
import type {
  ActionsBlock,
  CalloutBlock,
  ConfirmationDialog,
  ContextBlock,
  InfoCardBlock,
  InputBlock,
  InputElementDispatchAction,
  SectionBlock,
} from '@rocket.chat/ui-kit';

export type ActionsElement = ActionsBlock['elements'][number];
export type SectionAccessory = NonNullable<SectionBlock['accessory']>;
export type InputElement = InputBlock['element'];
export type ContextElement = ContextBlock['elements'][number];
export type CalloutAccessory = NonNullable<CalloutBlock['accessory']>;
export type InfoCardRow = InfoCardBlock['rows'][number];

/**
 * Mirrors the Actionable<Block> generic from @rocket.chat/ui-kit (not
 * publicly exported there). Use it to type custom actionable element props.
 */
export type Actionable<Block> = Block & {
  appId: string;
  blockId: string;
  actionId: string;
  confirm?: ConfirmationDialog;
  dispatchActionConfig?: InputElementDispatchAction[];
};

/**
 * Mirrors the LayoutBlockish<Block> generic from @rocket.chat/ui-kit (not
 * publicly exported there). Use it to type custom block props.
 */
export type LayoutBlockish<Block> = Block & {
  appId?: string;
  blockId?: string;
};

