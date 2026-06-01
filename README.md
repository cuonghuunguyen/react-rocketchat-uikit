# react-rocketchat-uikit

A React-based renderer for Rocket.Chat UiKit blocks. Write UiKit layouts using JSX components and render them to the Rocket.Chat block JSON format.

## Installation

```bash
npm install react-rocketchat-uikit
```

## Quick Start

```tsx
import {
  render,
  Actions,
  Button,
  Section,
  Context,
  Mrkdwn,
} from "react-rocketchat-uikit";

const blocks = render(
  <>
    <Section text="Hello *world*!" />
    <Actions>
      <Button appId="my.app" blockId="b1" actionId="approve">
        Approve
      </Button>
      <Button appId="my.app" blockId="b1" actionId="reject" style="danger">
        Reject
      </Button>
    </Actions>
  </>,
);
// blocks → Rocket.Chat UiKit JSON array
```

## Components

### Layout Blocks

#### `<Divider>`

A horizontal rule that visually separates blocks.

```tsx
<Divider />
<Divider blockId="divider1" />
```

#### `<Section>`

A flexible block for displaying text, optional fields, and an accessory element.

```tsx
// Text only
<Section text="Hello *world*" />

// With fields
<Section fields={['Field A', 'Field B']} />

// With a Button accessory
<Section text="Pick one">
  <Button  blockId="b1" actionId="a1">Click</Button>
</Section>
```

#### `<Actions>`

Renders a set of interactive elements in a horizontal row.

```tsx
<Actions blockId="actions1">
  <Button blockId="actions1" actionId="a1">
    Yes
  </Button>
  <Button blockId="actions1" actionId="a2">
    No
  </Button>
  <DatePicker blockId="actions1" actionId="a3" placeholder="Pick date" />
</Actions>
```

#### `<Input>`

A labelled input field that wraps a single input element.

```tsx
<Input label="Name" hint="Enter your full name" optional>
  <PlainTextInput blockId="b1" actionId="name" placeholder="John Doe" />
</Input>
```

#### `<Context>`

Renders a mix of small text and image elements side by side.

```tsx
<Context>
  <Mrkdwn text="*Bold* note" />
  <ImageElement imageUrl="https://example.com/icon.png" altText="icon" />
  <Plain text="plain note" />
</Context>
```

#### `<Image>`

A standalone image block with an optional title.

```tsx
<Image
  imageUrl="https://example.com/photo.jpg"
  altText="A photo"
  title="My Photo"
/>
```

#### `<Callout>`

A highlighted callout box with an optional variant and accessory.

```tsx
<Callout text="Something went wrong" variant="danger" />

// With a Button accessory
<Callout text="Action needed" variant="warning">
  <Button  blockId="b1" actionId="a1">Fix</Button>
</Callout>
```

#### `<Preview>`

A rich preview block with thumb or preview image.

`title` and `description` accept plain strings, TextObjects, or React text elements (`<Mrkdwn>`, `<Plain>`). Items that cannot be serialized are silently skipped.

```tsx
// Thumbnail variant
<Preview
  title={["Article Title"]}
  description={["A short description"]}
  thumb={{ url: "https://example.com/thumb.png" }}
/>

// Preview-image variant (mutually exclusive with thumb)
<Preview
  title={["Article Title"]}
  description={["A short description"]}
  preview={{ url: "https://example.com/preview.png" }}
  externalUrl="https://example.com"
/>

// No media
<Preview
  title={["Article Title"]}
  description={["A short description"]}
/>

// React text elements in title / description
<Preview
  title={[<Mrkdwn text="*Article Title*" />]}
  description={["Plain prefix — ", <Mrkdwn text="_italic detail_" />]}
  thumb={{ url: "https://example.com/thumb.png" }}
/>

// With a Context footer
<Preview
  title={["Article Title"]}
  description={["A short description"]}
  thumb={{ url: "https://example.com/thumb.png" }}
>
  <Context>
    <Mrkdwn text="Posted by *User*" />
  </Context>
</Preview>
```

#### `<VideoConference>`

A video-conference block (only valid in Message surfaces).

```tsx
<VideoConference callId="call-123" title="Team Standup" blockId="vc1" />
```

#### `<InfoCard>`

A card block composed of one or more `<InfoCardRow>` children.

```tsx
<InfoCard>
  <InfoCardRow background="default">
    <Mrkdwn text="*Label:* value" />
  </InfoCardRow>
  <InfoCardRow background="secondary">
    <Plain text="Another row" />
    <IconButton blockId="b1" actionId="edit" icon="edit" />
  </InfoCardRow>
</InfoCard>
```

#### `<InfoCardRow>`

A single row inside an `<InfoCard>`. Accepts `<Mrkdwn>`, `<Plain>`, or `<ImageElement>` children, plus an optional `<IconButton>` which becomes the row action.

| Prop         | Type                       | Description          |
| ------------ | -------------------------- | -------------------- |
| `background` | `'default' \| 'secondary'` | Row background style |

#### `<Conditional>`

Conditionally renders its child blocks depending on the hosting engine. This is the only block that can contain other layout blocks directly.

```tsx
<Conditional engine={["rocket.chat"]}>
  <Section text="Only shown in Rocket.Chat" />
</Conditional>
```

#### `<TabNavigation>`

A tab-navigation bar containing one or more `<Tab>` elements.

> **Experimental** — this block type may change in future versions.

```tsx
<TabNavigation>
  <Tab blockId="b1" actionId="tab1" title="Overview" selected />
  <Tab blockId="b1" actionId="tab2" title="Details" />
  <Tab blockId="b1" actionId="tab3" title="Settings" disabled />
</TabNavigation>
```

### Interactive Elements

#### `<Button>`

```tsx
<Button blockId="b1" actionId="click" style="primary" value="val">
  Click me
</Button>
```

#### `<StaticSelect>` / `<MultiStaticSelect>`

```tsx
<StaticSelect  blockId="b1" actionId="color" placeholder="Pick">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</StaticSelect>

// With a pre-selected value
<StaticSelect  blockId="b1" actionId="color" placeholder="Pick" initialValue="red">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</StaticSelect>
```

#### `<UsersSelect>` / `<MultiUsersSelect>`

```tsx
<UsersSelect blockId="b1" actionId="user" placeholder="Select user" />
<MultiUsersSelect blockId="b1" actionId="users" placeholder="Select users" />
```

#### `<ChannelsSelect>` / `<MultiChannelsSelect>`

```tsx
<ChannelsSelect blockId="b1" actionId="channel" placeholder="Select channel" />
<MultiChannelsSelect blockId="b1" actionId="channels" placeholder="Select channels" />
```

#### `<ConversationsSelect>` / `<MultiConversationsSelect>`

```tsx
<ConversationsSelect blockId="b1" actionId="conv" />
<MultiConversationsSelect blockId="b1" actionId="convs" />
```

#### `<DatePicker>` / `<TimePicker>`

```tsx
<DatePicker  blockId="b1" actionId="date" initialDate="2024-01-01" />
<TimePicker  blockId="b1" actionId="time" initialTime="09:00" />
```

#### `<PlainTextInput>`

```tsx
<PlainTextInput blockId="b1" actionId="msg" placeholder="Type here" multiline />
```

#### `<Option>`

A selectable item used inside `<StaticSelect>`, `<MultiStaticSelect>`, `<Overflow>`, `<CheckboxGroup>`, `<RadioButtonGroup>`, and `<ToggleSwitch>`. The label is passed as children; `description` accepts a string, TextObject, or a React text element (`<Plain>`, `<Mrkdwn>`).

```tsx
<Option value="red">Red</Option>
<Option value="red" description="A warm colour">Red</Option>
<Option value="red" description={<Plain text="A warm colour" />}>Red</Option>
<Option value="edit" url="https://example.com">Edit</Option>
```

#### `<Overflow>`

```tsx
<Overflow blockId="b1" actionId="more">
  <Option value="edit">Edit</Option>
  <Option value="delete">Delete</Option>
</Overflow>
```

#### `<CheckboxGroup>` / `<RadioButtonGroup>`

```tsx
<CheckboxGroup blockId="b1" actionId="checks">
  <Option value="a">Option A</Option>
  <Option value="b">Option B</Option>
</CheckboxGroup>
```

#### `<ImageElement>`

An inline image for use inside `<Section>` (as accessory) or `<Context>`. This is **not** the standalone `<Image>` block.

```tsx
<ImageElement imageUrl="https://example.com/icon.png" altText="icon" />
```

#### `<IconButton>`

An icon-only button used as the action inside an `<InfoCardRow>`. Requires an `icon` name; use `variant` to control the visual style.

```tsx
<IconButton blockId="b1" actionId="edit" icon="edit" />
<IconButton blockId="b1" actionId="delete" icon="trash" variant="destructive" label="Delete" />
```

#### `<Tab>`

A single tab for use inside `<TabNavigation>`.

> **Experimental** — this element type may change in future versions.

```tsx
<Tab blockId="b1" actionId="tab1" title="Overview" selected />
```

#### `<ToggleSwitch>`

Takes `<Option>` children, each representing one toggle item.

```tsx
<ToggleSwitch blockId="b1" actionId="toggle">
  <Option value="on">Enable feature</Option>
</ToggleSwitch>
```

#### `<LinearScale>`

```tsx
<LinearScale
  blockId="b1"
  actionId="rating"
  minValue={1}
  maxValue={5}
  initialValue={3}
  preLabel="Bad"
  postLabel="Excellent"
/>
```

### Text Objects

#### `<Mrkdwn>`

```tsx
<Mrkdwn text="*Bold* and _italic_" />
```

#### `<Plain>`

```tsx
<Plain text="Just plain text" emoji />
```

---

## Shorthand Components

For common single-element patterns, shorthand components reduce boilerplate by combining a wrapper block and its single child element into one component.

### `<ActionButton>`

An `<Actions>` block with a single `<Button>` — the most common action pattern.

```tsx
// ❌ Verbose
<Actions>
  <Button  blockId="b1" actionId="a1">Click</Button>
</Actions>

// ✅ Shorthand
<ActionButton  blockId="b1" actionId="a1">Click</ActionButton>
```

### `<InputTextInput>`

An `<Input>` block with a single `<PlainTextInput>`.

```tsx
// ❌ Verbose
<Input label="Name">
  <PlainTextInput  blockId="b1" actionId="name" placeholder="Enter name" />
</Input>

// ✅ Shorthand
<InputTextInput label="Name"  blockId="b1" actionId="name" placeholder="Enter name" />
```

### `<InputStaticSelect>`

An `<Input>` block with a single `<StaticSelect>`.

```tsx
// ❌ Verbose
<Input label="Color">
  <StaticSelect  blockId="b1" actionId="color">
    <Option value="red">Red</Option>
    <Option value="blue">Blue</Option>
  </StaticSelect>
</Input>

// ✅ Shorthand
<InputStaticSelect label="Color"  blockId="b1" actionId="color">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</InputStaticSelect>

// With a pre-selected value
<InputStaticSelect label="Color"  blockId="b1" actionId="color" initialValue="red">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</InputStaticSelect>
```

### `<InputDatePicker>`

An `<Input>` block with a single `<DatePicker>`.

```tsx
// ❌ Verbose
<Input label="Birthday">
  <DatePicker  blockId="b1" actionId="bday" initialDate="2000-01-01" />
</Input>

// ✅ Shorthand
<InputDatePicker label="Birthday"  blockId="b1" actionId="bday" initialDate="2000-01-01" />
```

### `<ContextMrkdwn>`

A `<Context>` block with a single `<Mrkdwn>` element.

```tsx
// ❌ Verbose
<Context>
  <Mrkdwn text="*Bold* note" />
</Context>

// ✅ Shorthand
<ContextMrkdwn text="*Bold* note" />
```

### `<ContextPlain>`

A `<Context>` block with a single `<Plain>` text element.

```tsx
// ❌ Verbose
<Context>
  <Plain text="Some text" />
</Context>

// ✅ Shorthand
<ContextPlain text="Some text" />
```

### `<ContextImage>`

A `<Context>` block with a single `<ImageElement>`.

```tsx
// ❌ Verbose
<Context>
  <ImageElement imageUrl="https://example.com/img.png" altText="img" />
</Context>

// ✅ Shorthand
<ContextImage imageUrl="https://example.com/img.png" altText="img" />
```

### `<SectionButton>`

A `<Section>` block with a `<Button>` accessory.

```tsx
// ❌ Verbose
<Section text="Pick one">
  <Button  blockId="b1" actionId="a1">Click</Button>
</Section>

// ✅ Shorthand
<SectionButton text="Pick one"  blockId="b1" actionId="a1">Click</SectionButton>
```

### `<SectionOverflow>`

A `<Section>` block with an `<Overflow>` accessory.

```tsx
// ❌ Verbose
<Section text="Options">
  <Overflow  blockId="b1" actionId="more">
    <Option value="edit">Edit</Option>
    <Option value="delete">Delete</Option>
  </Overflow>
</Section>

// ✅ Shorthand
<SectionOverflow text="Options"  blockId="b1" actionId="more">
  <Option value="edit">Edit</Option>
  <Option value="delete">Delete</Option>
</SectionOverflow>
```

---

## Full Example

```tsx
import {
  render,
  ActionButton,
  InputTextInput,
  InputStaticSelect,
  ContextMrkdwn,
  SectionButton,
  Divider,
  Option,
} from "react-rocketchat-uikit";

const blocks = render(
  <>
    <SectionButton text="Welcome to the form!" blockId="b1" actionId="info">
      Info
    </SectionButton>
    <Divider />
    <InputTextInput
      label="Your Name"
      blockId="b2"
      actionId="name"
      placeholder="Enter your name"
    />
    <InputStaticSelect label="Favorite Color" blockId="b3" actionId="color">
      <Option value="red">Red</Option>
      <Option value="green">Green</Option>
      <Option value="blue">Blue</Option>
    </InputStaticSelect>
    <Divider />
    <ActionButton blockId="b4" actionId="submit" style="primary">
      Submit
    </ActionButton>
    <ContextMrkdwn text="Powered by *Rocket.Chat UiKit*" />
  </>,
);
```

## API Reference

### `render(element: ReactElement): LayoutBlock[]`

Renders JSX elements into Rocket.Chat UiKit block JSON. Accepts a single element or a fragment containing multiple blocks.

### `resetActionIdCounter(): void`

Resets the internal auto-increment counter used when `actionId` is omitted from an element. Call this between independent renders (e.g., in tests) to ensure deterministic IDs.

```ts
import { render, resetActionIdCounter, ActionButton } from 'react-rocketchat-uikit';

resetActionIdCounter();
const blocks = render(<ActionButton  blockId="b1">Click</ActionButton>);
```

## TypeScript Utilities

Two generic helpers are exported for typing custom props that extend the block-kit wire format.

### `Actionable<Block>`

Adds the required actionable fields (`appId`, `blockId`, `actionId`) and optional fields (`confirm`, `dispatchActionConfig`) to any block type. Mirrors `Actionable<Block>` from `@rocket.chat/ui-kit`, which is not part of that package's public API.

```ts
import type { Actionable } from 'react-rocketchat-uikit';

type MyButtonProps = Partial<Actionable<{
  style?: 'primary' | 'danger';
  label: string;
}>>;
```

### `LayoutBlockish<Block>`

Adds the optional `appId` and `blockId` fields to any block type. Mirrors `LayoutBlockish<Block>` from `@rocket.chat/ui-kit`.

```ts
import type { LayoutBlockish } from 'react-rocketchat-uikit';

type MyBlockProps = LayoutBlockish<{
  title: string;
}>;
// → { title: string; appId?: string; blockId?: string }
```

---

## License

MIT
