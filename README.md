# react-rocketchat-uikit

A React-based renderer for Rocket.Chat UiKit blocks. Write UiKit layouts using JSX components and render them to the Rocket.Chat block JSON format.

## Installation

```bash
npm install react-rocketchat-uikit
```

## Quick Start

```tsx
import { render, Actions, Button, Section, Context, Mrkdwn } from 'react-rocketchat-uikit';

const blocks = render(
  <>
    <Section text="Hello *world*!" />
    <Actions>
      <Button appId="my.app" blockId="b1" actionId="approve">Approve</Button>
      <Button appId="my.app" blockId="b1" actionId="reject" style="danger">Reject</Button>
    </Actions>
  </>
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
  <Button appId="app" blockId="b1" actionId="a1">Click</Button>
</Section>
```

#### `<Actions>`

Renders a set of interactive elements in a horizontal row.

```tsx
<Actions blockId="actions1">
  <Button appId="app" blockId="actions1" actionId="a1">Yes</Button>
  <Button appId="app" blockId="actions1" actionId="a2">No</Button>
  <DatePicker appId="app" blockId="actions1" actionId="a3" placeholder="Pick date" />
</Actions>
```

#### `<Input>`

A labelled input field that wraps a single input element.

```tsx
<Input label="Name" hint="Enter your full name" optional>
  <PlainTextInput appId="app" blockId="b1" actionId="name" placeholder="John Doe" />
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
<Image imageUrl="https://example.com/photo.jpg" altText="A photo" title="My Photo" />
```

#### `<Callout>`

A highlighted callout box with an optional variant and accessory.

```tsx
<Callout text="Something went wrong" variant="danger" />

// With a Button accessory
<Callout text="Action needed" variant="warning">
  <Button appId="app" blockId="b1" actionId="a1">Fix</Button>
</Callout>
```

#### `<Preview>`

A rich preview block with thumb or preview image.

```tsx
<Preview
  title={['Article Title']}
  description={['A short description']}
  thumb={{ url: 'https://example.com/thumb.png' }}
/>
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
    <IconButton appId="app" blockId="b1" actionId="edit">✏️</IconButton>
  </InfoCardRow>
</InfoCard>
```

#### `<InfoCardRow>`

A single row inside an `<InfoCard>`. Accepts `<Mrkdwn>`, `<Plain>`, or `<ImageElement>` children, plus an optional `<IconButton>` which becomes the row action.

| Prop | Type | Description |
|------|------|-------------|
| `background` | `'default' \| 'secondary'` | Row background style |

#### `<Conditional>`

Conditionally renders its child blocks depending on the hosting engine. This is the only block that can contain other layout blocks directly.

```tsx
<Conditional engine={['rocket.chat']}>
  <Section text="Only shown in Rocket.Chat" />
</Conditional>
```

#### `<TabNavigation>`

A tab-navigation bar containing one or more `<Tab>` elements.

> **Experimental** — this block type may change in future versions.

```tsx
<TabNavigation>
  <Tab appId="app" blockId="b1" actionId="tab1" title="Overview" selected />
  <Tab appId="app" blockId="b1" actionId="tab2" title="Details" />
  <Tab appId="app" blockId="b1" actionId="tab3" title="Settings" disabled />
</TabNavigation>
```

### Interactive Elements

#### `<Button>`

```tsx
<Button appId="app" blockId="b1" actionId="click" style="primary" value="val">
  Click me
</Button>
```

#### `<StaticSelect>` / `<MultiStaticSelect>`

```tsx
<StaticSelect appId="app" blockId="b1" actionId="color" placeholder="Pick">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</StaticSelect>
```

#### `<UsersSelect>` / `<MultiUsersSelect>`

```tsx
<UsersSelect appId="app" blockId="b1" actionId="user" placeholder="Select user" />
```

#### `<ChannelsSelect>` / `<MultiChannelsSelect>`

```tsx
<ChannelsSelect appId="app" blockId="b1" actionId="channel" placeholder="Select channel" />
```

#### `<ConversationsSelect>` / `<MultiConversationsSelect>`

```tsx
<ConversationsSelect appId="app" blockId="b1" actionId="conv" placeholder="Select conversation" />
```

#### `<DatePicker>` / `<TimePicker>`

```tsx
<DatePicker appId="app" blockId="b1" actionId="date" initialDate="2024-01-01" />
<TimePicker appId="app" blockId="b1" actionId="time" initialTime="09:00" />
```

#### `<PlainTextInput>`

```tsx
<PlainTextInput appId="app" blockId="b1" actionId="msg" placeholder="Type here" multiline />
```

#### `<Overflow>`

```tsx
<Overflow appId="app" blockId="b1" actionId="more">
  <Option value="edit">Edit</Option>
  <Option value="delete">Delete</Option>
</Overflow>
```

#### `<CheckboxGroup>` / `<RadioButtonGroup>`

```tsx
<CheckboxGroup appId="app" blockId="b1" actionId="checks">
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

An icon-only button used as the action inside an `<InfoCardRow>`.

```tsx
<IconButton appId="app" blockId="b1" actionId="edit" style="primary">✏️</IconButton>
```

#### `<Tab>`

A single tab for use inside `<TabNavigation>`.

> **Experimental** — this element type may change in future versions.

```tsx
<Tab appId="app" blockId="b1" actionId="tab1" title="Overview" selected />
```

#### `<ToggleSwitch>`

```tsx
<ToggleSwitch appId="app" blockId="b1" actionId="toggle" text="Enable feature" />
```

#### `<LinearScale>`

```tsx
<LinearScale appId="app" blockId="b1" actionId="rating" minValue={1} maxValue={5} />
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
  <Button appId="app" blockId="b1" actionId="a1">Click</Button>
</Actions>

// ✅ Shorthand
<ActionButton appId="app" blockId="b1" actionId="a1">Click</ActionButton>
```

### `<InputTextInput>`

An `<Input>` block with a single `<PlainTextInput>`.

```tsx
// ❌ Verbose
<Input label="Name">
  <PlainTextInput appId="app" blockId="b1" actionId="name" placeholder="Enter name" />
</Input>

// ✅ Shorthand
<InputTextInput label="Name" appId="app" blockId="b1" actionId="name" placeholder="Enter name" />
```

### `<InputStaticSelect>`

An `<Input>` block with a single `<StaticSelect>`.

```tsx
// ❌ Verbose
<Input label="Color">
  <StaticSelect appId="app" blockId="b1" actionId="color">
    <Option value="red">Red</Option>
    <Option value="blue">Blue</Option>
  </StaticSelect>
</Input>

// ✅ Shorthand
<InputStaticSelect label="Color" appId="app" blockId="b1" actionId="color">
  <Option value="red">Red</Option>
  <Option value="blue">Blue</Option>
</InputStaticSelect>
```

### `<InputDatePicker>`

An `<Input>` block with a single `<DatePicker>`.

```tsx
// ❌ Verbose
<Input label="Birthday">
  <DatePicker appId="app" blockId="b1" actionId="bday" initialDate="2000-01-01" />
</Input>

// ✅ Shorthand
<InputDatePicker label="Birthday" appId="app" blockId="b1" actionId="bday" initialDate="2000-01-01" />
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
  <Button appId="app" blockId="b1" actionId="a1">Click</Button>
</Section>

// ✅ Shorthand
<SectionButton text="Pick one" appId="app" blockId="b1" actionId="a1">Click</SectionButton>
```

### `<SectionOverflow>`

A `<Section>` block with an `<Overflow>` accessory.

```tsx
// ❌ Verbose
<Section text="Options">
  <Overflow appId="app" blockId="b1" actionId="more">
    <Option value="edit">Edit</Option>
    <Option value="delete">Delete</Option>
  </Overflow>
</Section>

// ✅ Shorthand
<SectionOverflow text="Options" appId="app" blockId="b1" actionId="more">
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
} from 'react-rocketchat-uikit';

const blocks = render(
  <>
    <SectionButton text="Welcome to the form!" appId="app" blockId="b1" actionId="info">
      Info
    </SectionButton>
    <Divider />
    <InputTextInput
      label="Your Name"
      appId="app"
      blockId="b2"
      actionId="name"
      placeholder="Enter your name"
    />
    <InputStaticSelect label="Favorite Color" appId="app" blockId="b3" actionId="color">
      <Option value="red">Red</Option>
      <Option value="green">Green</Option>
      <Option value="blue">Blue</Option>
    </InputStaticSelect>
    <Divider />
    <ActionButton appId="app" blockId="b4" actionId="submit" style="primary">
      Submit
    </ActionButton>
    <ContextMrkdwn text="Powered by *Rocket.Chat UiKit*" />
  </>
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
const blocks = render(<ActionButton appId="app" blockId="b1">Click</ActionButton>);
```

## License

MIT