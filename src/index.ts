// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

// render
export { render } from './render';

// Block components
export {
  Actions,
  Callout,
  Conditional,
  Context,
  Divider,
  Image,
  InfoCard,
  InfoCardRow,
  Input,
  Preview,
  Section,
  TabNavigation,
  VideoConference,
} from './components/blocks';

// Element components
export {
  Button,
  ChannelsSelect,
  CheckboxGroup,
  ConversationsSelect,
  DatePicker,
  IconButton,
  ImageElement,
  LinearScale,
  MultiChannelsSelect,
  MultiConversationsSelect,
  MultiStaticSelect,
  MultiUsersSelect,
  Option,
  Overflow,
  PlainTextInput,
  RadioButtonGroup,
  StaticSelect,
  Tab,
  TimePicker,
  ToggleSwitch,
  UsersSelect,
} from './components/elements';

// Text helper components
export { Mrkdwn, Plain } from './components/text';

// Types — note: ImageElement and InfoCardRow are also exported as components
// above. Import their block-type counterparts using a named alias when both
// are needed in the same file.
export type {
  ActionsBlock,
  ActionsElement,
  ButtonElement,
  CalloutAccessory,
  CalloutBlock,
  ChannelsSelectElement,
  CheckboxElement,
  ConfirmationDialog,
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
  // ImageElement — omitted here because the name collides with the component.
  // Import from './types' directly if you need the block type.
  InfoCardBlock,
  // InfoCardRow — omitted here because the name collides with the component.
  // Import from './types' directly if you need the block type.
  InputBlock,
  InputElement,
  InputElementDispatchAction,
  LayoutBlock,
  LinearScaleElement,
  Markdown,
  MultiChannelsSelectElement,
  MultiConversationsSelectElement,
  MultiStaticSelectElement,
  MultiUsersSelectElement,
  OptionGroupObject,
  OptionObject,
  OverflowElement,
  PlainText,
  PlainTextInputElement,
  PreviewBlock,
  PreviewBlockWithPreview,
  PreviewBlockWithThumb,
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
} from './types';

// Props types
export type {
  ActionsProps,
  CalloutProps,
  ConditionalProps,
  ContextProps,
  DividerProps,
  ImageBlockProps,
  InfoCardProps,
  InfoCardRowProps,
  InputProps,
  PreviewProps,
  PreviewPropsNoMedia,
  PreviewPropsWithPreview,
  PreviewPropsWithThumb,
  SectionProps,
  TabNavigationProps,
  VideoConferenceProps,
} from './components/blocks';

export type {
  ButtonProps,
  ChannelsSelectProps,
  CheckboxGroupProps,
  ConversationsSelectProps,
  DatePickerProps,
  IconButtonProps,
  ImageElementProps,
  LinearScaleProps,
  MultiChannelsSelectProps,
  MultiConversationsSelectProps,
  MultiStaticSelectProps,
  MultiUsersSelectProps,
  OptionProps,
  OverflowProps,
  PlainTextInputProps,
  RadioButtonGroupProps,
  StaticSelectProps,
  TabProps,
  TimePickerProps,
  ToggleSwitchProps,
  UsersSelectProps,
} from './components/elements';

export type { MrkdwnProps, PlainProps } from './components/text';
