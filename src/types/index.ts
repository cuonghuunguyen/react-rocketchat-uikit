// ─────────────────────────────────────────────────────────────────────────────
// Common text objects
// ─────────────────────────────────────────────────────────────────────────────

export type PlainText = {
  readonly type: 'plain_text';
  readonly text: string;
  readonly emoji?: boolean;
};

export type Markdown = {
  readonly type: 'mrkdwn';
  readonly text: string;
};

export type TextObject = PlainText | Markdown;

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation dialog (used inside interactive elements)
// ─────────────────────────────────────────────────────────────────────────────

export type ConfirmationDialog = {
  readonly title: PlainText;
  readonly text: TextObject;
  readonly confirm: PlainText;
  readonly deny: PlainText;
  readonly style?: 'primary' | 'danger';
};

export type InputElementDispatchAction =
  | 'on_enter_pressed'
  | 'on_character_entered';

// ─────────────────────────────────────────────────────────────────────────────
// Options (used by select / overflow / checkbox / radio elements)
// ─────────────────────────────────────────────────────────────────────────────

export type OptionObject = {
  readonly type: 'option';
  readonly text: PlainText;
  readonly value: string;
  readonly description?: PlainText;
  readonly url?: string;
};

export type OptionGroupObject = {
  readonly type: 'option_group';
  readonly label: PlainText;
  readonly options: readonly OptionObject[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Actionable base (all interactive elements must extend this)
// ─────────────────────────────────────────────────────────────────────────────

type Actionable = {
  readonly appId: string;
  readonly blockId: string;
  readonly actionId: string;
  readonly confirm?: ConfirmationDialog;
  readonly dispatchActionConfig?: readonly InputElementDispatchAction[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Interactive elements
// ─────────────────────────────────────────────────────────────────────────────

export type ButtonElement = Actionable & {
  readonly type: 'button';
  readonly text: PlainText;
  readonly url?: string;
  readonly value?: string;
  readonly style?: 'primary' | 'danger';
  readonly disabled?: boolean;
};

export type StaticSelectElement = Actionable & {
  readonly type: 'static_select';
  readonly placeholder?: PlainText;
  readonly options: readonly OptionObject[];
  readonly optionGroups?: readonly OptionGroupObject[];
  readonly initialOption?: OptionObject;
};

export type MultiStaticSelectElement = Actionable & {
  readonly type: 'multi_static_select';
  readonly placeholder?: PlainText;
  readonly options: readonly OptionObject[];
  readonly optionGroups?: readonly OptionGroupObject[];
  readonly initialOptions?: readonly OptionObject[];
  readonly maxSelectItems?: number;
};

export type UsersSelectElement = Actionable & {
  readonly type: 'users_select';
  readonly placeholder?: PlainText;
  readonly initialUser?: string;
};

export type MultiUsersSelectElement = Actionable & {
  readonly type: 'multi_users_select';
  readonly placeholder?: PlainText;
  readonly initialUsers?: readonly string[];
  readonly maxSelectItems?: number;
};

export type ChannelsSelectElement = Actionable & {
  readonly type: 'channels_select';
  readonly placeholder?: PlainText;
  readonly initialChannel?: string;
};

export type MultiChannelsSelectElement = Actionable & {
  readonly type: 'multi_channels_select';
  readonly placeholder?: PlainText;
  readonly initialChannels?: readonly string[];
  readonly maxSelectItems?: number;
};

export type ConversationsSelectElement = Actionable & {
  readonly type: 'conversations_select';
  readonly placeholder?: PlainText;
  readonly initialConversation?: string;
  readonly filter?: {
    readonly include?: readonly ('im' | 'mpim' | 'private' | 'public')[];
    readonly excludeExternalSharedChannels?: boolean;
    readonly excludeBotUsers?: boolean;
  };
};

export type MultiConversationsSelectElement = Actionable & {
  readonly type: 'multi_conversations_select';
  readonly placeholder?: PlainText;
  readonly initialConversations?: readonly string[];
  readonly maxSelectItems?: number;
};

export type OverflowElement = Actionable & {
  readonly type: 'overflow';
  readonly options: readonly OptionObject[];
};

export type DatePickerElement = Actionable & {
  readonly type: 'datepicker';
  readonly placeholder?: PlainText;
  readonly initialDate?: string;
};

export type TimePickerElement = Actionable & {
  readonly type: 'timepicker';
  readonly placeholder?: PlainText;
  readonly initialTime?: string;
};

export type LinearScaleElement = Actionable & {
  readonly type: 'linear_scale';
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly initialValue?: number;
  readonly label?: PlainText;
};

export type ToggleSwitchElement = Actionable & {
  readonly type: 'toggle_switch';
  readonly text: PlainText;
  readonly checked?: boolean;
};

export type CheckboxElement = Actionable & {
  readonly type: 'checkboxes';
  readonly options: readonly OptionObject[];
  readonly initialOptions?: readonly OptionObject[];
};

export type RadioButtonElement = Actionable & {
  readonly type: 'radio_buttons';
  readonly options: readonly OptionObject[];
  readonly initialOption?: OptionObject;
};

export type PlainTextInputElement = Actionable & {
  readonly type: 'plain_text_input';
  readonly placeholder?: PlainText;
  readonly initialValue?: string;
  readonly multiline?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
};

/** ImageElement used inside Section / Context — has no title or Actionable fields */
export type ImageElement = {
  readonly type: 'image';
  readonly imageUrl: string;
  readonly altText: string;
};

export type IconButtonElement = Actionable & {
  readonly type: 'icon_button';
  readonly icon: PlainText;
  readonly style?: 'primary' | 'danger' | 'warning' | 'success';
};

export type ExperimentalTabElement = Actionable & {
  readonly type: 'tab';
  readonly title: TextObject;
  readonly disabled?: boolean;
  readonly selected?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Unions used by blocks
// ─────────────────────────────────────────────────────────────────────────────

export type ActionsElement =
  | ButtonElement
  | StaticSelectElement
  | MultiStaticSelectElement
  | ChannelsSelectElement
  | MultiChannelsSelectElement
  | UsersSelectElement
  | MultiUsersSelectElement
  | ConversationsSelectElement
  | MultiConversationsSelectElement
  | OverflowElement
  | DatePickerElement
  | TimePickerElement
  | LinearScaleElement
  | ToggleSwitchElement
  | CheckboxElement
  | RadioButtonElement;

export type SectionAccessory =
  | ButtonElement
  | DatePickerElement
  | ImageElement
  | MultiStaticSelectElement
  | OverflowElement
  | StaticSelectElement;

export type InputElement =
  | PlainTextInputElement
  | StaticSelectElement
  | MultiStaticSelectElement
  | ChannelsSelectElement
  | MultiChannelsSelectElement
  | UsersSelectElement
  | MultiUsersSelectElement
  | ConversationsSelectElement
  | MultiConversationsSelectElement
  | DatePickerElement
  | TimePickerElement
  | LinearScaleElement
  | CheckboxElement
  | RadioButtonElement
  | ToggleSwitchElement;

export type ContextElement = TextObject | ImageElement;

export type CalloutAccessory = ButtonElement | OverflowElement;

// ─────────────────────────────────────────────────────────────────────────────
// Layout Blocks
// ─────────────────────────────────────────────────────────────────────────────

type LayoutBase = {
  readonly appId?: string;
  readonly blockId?: string;
};

export type ActionsBlock = LayoutBase & {
  readonly type: 'actions';
  readonly elements: readonly ActionsElement[];
};

export type SectionBlock = LayoutBase & {
  readonly type: 'section';
  readonly text?: TextObject;
  readonly fields?: readonly TextObject[];
  readonly accessory?: SectionAccessory;
};

export type InputBlock = LayoutBase & {
  readonly type: 'input';
  readonly label: PlainText;
  readonly element: InputElement;
  readonly hint?: PlainText;
  readonly optional?: boolean;
};

export type ContextBlock = LayoutBase & {
  readonly type: 'context';
  readonly elements: readonly ContextElement[];
};

export type ImageBlock = LayoutBase & {
  readonly type: 'image';
  readonly imageUrl: string;
  readonly altText: string;
  readonly title?: PlainText;
};

export type DividerBlock = LayoutBase & {
  readonly type: 'divider';
};

export type CalloutBlock = LayoutBase & {
  readonly type: 'callout';
  readonly text: TextObject;
  readonly title?: TextObject;
  readonly variant?: 'info' | 'danger' | 'warning' | 'success';
  readonly accessory?: CalloutAccessory;
};

type PreviewBlockBase = LayoutBase & {
  readonly type: 'preview';
  readonly title: readonly TextObject[];
  readonly description: readonly TextObject[];
  readonly footer?: ContextBlock;
};

export type PreviewBlockWithThumb = PreviewBlockBase & {
  readonly thumb: { readonly url: string; readonly dimensions?: { readonly width: number; readonly height: number } };
  readonly preview?: never;
};

export type PreviewBlockWithPreview = PreviewBlockBase & {
  readonly preview: { readonly url: string; readonly dimensions?: { readonly width: number; readonly height: number } };
  readonly externalUrl?: string;
  readonly oembedUrl?: string;
  readonly thumb?: never;
};

export type PreviewBlockNoMedia = PreviewBlockBase & {
  readonly thumb?: never;
  readonly preview?: never;
};

export type PreviewBlock = PreviewBlockWithThumb | PreviewBlockWithPreview | PreviewBlockNoMedia;

export type InfoCardRow = {
  readonly background: 'default' | 'secondary';
  readonly elements: readonly (ImageElement | PlainText | Markdown)[];
  readonly action?: IconButtonElement;
};

export type InfoCardBlock = {
  readonly type: 'info_card';
  readonly rows: readonly InfoCardRow[];
};

export type ConditionalBlock = {
  readonly type: 'conditional';
  readonly when?: {
    readonly engine?: readonly ('rocket.chat' | 'livechat')[];
  };
  readonly render: readonly RenderableLayoutBlock[];
};

export type ExperimentalTabNavigationBlock = {
  readonly type: 'tab_navigation';
  readonly tabs: readonly ExperimentalTabElement[];
};

export type VideoConferenceBlock = LayoutBase & {
  readonly type: 'video_conf';
  readonly callId: string;
  readonly title?: string;
};

export type RenderableLayoutBlock =
  | ActionsBlock
  | SectionBlock
  | InputBlock
  | ContextBlock
  | ImageBlock
  | DividerBlock
  | CalloutBlock
  | PreviewBlock
  | InfoCardBlock
  | ConditionalBlock
  | ExperimentalTabNavigationBlock
  | VideoConferenceBlock;

export type LayoutBlock = RenderableLayoutBlock;
