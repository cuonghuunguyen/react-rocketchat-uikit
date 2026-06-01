/** @jest-environment node */

import {
  Actions,
  Button,
  Callout,
  ChannelsSelect,
  CheckboxGroup,
  Conditional,
  Context,
  ConversationsSelect,
  DatePicker,
  Divider,
  IconButton,
  Image,
  ImageElement,
  InfoCard,
  InfoCardRow,
  Input,
  LinearScale,
  Mrkdwn,
  MultiChannelsSelect,
  MultiConversationsSelect,
  MultiStaticSelect,
  MultiUsersSelect,
  Option,
  Overflow,
  Plain,
  PlainTextInput,
  Preview,
  RadioButtonGroup,
  Section,
  StaticSelect,
  Tab,
  TabNavigation,
  TimePicker,
  ToggleSwitch,
  UsersSelect,
  VideoConference,
} from '../src';
import { render } from '../src/render';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const APP = 'my.app';
const BLOCK = 'block1';
const ACTION = 'action1';

// ─────────────────────────────────────────────────────────────────────────────
// DividerBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Divider', () => {
  it('renders a divider block', () => {
    const blocks = render(<Divider />);
    expect(blocks).toEqual([{ type: 'divider' }]);
  });

  it('renders with blockId', () => {
    const blocks = render(<Divider blockId="b1" />);
    expect(blocks).toEqual([{ type: 'divider', blockId: 'b1' }]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SectionBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Section', () => {
  it('renders with a text string (mrkdwn)', () => {
    const blocks = render(<Section text="Hello *world*" />);
    expect(blocks).toEqual([
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Hello *world*' },
      },
    ]);
  });

  it('renders with explicit text object', () => {
    const blocks = render(
      <Section text={{ type: 'plain_text', text: 'Plain text' }} />,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        text: { type: 'plain_text', text: 'Plain text' },
      },
    ]);
  });

  it('renders with fields', () => {
    const blocks = render(
      <Section fields={['Field A', { type: 'plain_text', text: 'Field B' }]} />,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: 'Field A' },
          { type: 'plain_text', text: 'Field B' },
        ],
      },
    ]);
  });

  it('renders accessory from a Button child', () => {
    const blocks = render(
      <Section text="Pick one">
        <Button appId={APP} blockId={BLOCK} actionId={ACTION}>
          Click
        </Button>
      </Section>,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Pick one' },
        accessory: {
          type: 'button',
          appId: APP,
          blockId: BLOCK,
          actionId: ACTION,
          text: { type: 'plain_text', text: 'Click' },
        },
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ActionsBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Actions', () => {
  it('renders multiple button children as elements', () => {
    const blocks = render(
      <Actions blockId={BLOCK}>
        <Button appId={APP} blockId={BLOCK} actionId="a1">
          Yes
        </Button>
        <Button appId={APP} blockId={BLOCK} actionId="a2">
          No
        </Button>
      </Actions>,
    );
    expect(blocks).toEqual([
      {
        type: 'actions',
        blockId: BLOCK,
        elements: [
          {
            type: 'button',
            appId: APP,
            blockId: BLOCK,
            actionId: 'a1',
            text: { type: 'plain_text', text: 'Yes' },
          },
          {
            type: 'button',
            appId: APP,
            blockId: BLOCK,
            actionId: 'a2',
            text: { type: 'plain_text', text: 'No' },
          },
        ],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// InputBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Input', () => {
  it('renders with a PlainTextInput child', () => {
    const blocks = render(
      <Input label="Name">
        <PlainTextInput
          appId={APP}
          blockId={BLOCK}
          actionId={ACTION}
          placeholder="Enter name"
        />
      </Input>,
    );
    expect(blocks).toEqual([
      {
        type: 'input',
        label: { type: 'plain_text', text: 'Name' },
        element: {
          type: 'plain_text_input',
          appId: APP,
          blockId: BLOCK,
          actionId: ACTION,
          placeholder: { type: 'plain_text', text: 'Enter name' },
        },
      },
    ]);
  });

  it('includes hint and optional', () => {
    const blocks = render(
      <Input label="Email" hint="Use your work email" optional>
        <PlainTextInput appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Input>,
    );
    expect(blocks[0]).toMatchObject({
      type: 'input',
      hint: { type: 'plain_text', text: 'Use your work email' },
      optional: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ContextBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Context', () => {
  it('renders text and image children as elements', () => {
    const blocks = render(
      <Context>
        <Mrkdwn text="*Bold* note" />
        <ImageElement imageUrl="https://example.com/img.png" altText="img" />
      </Context>,
    );
    expect(blocks).toEqual([
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: '*Bold* note' },
          { type: 'image', imageUrl: 'https://example.com/img.png', altText: 'img' },
        ],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ImageBlock (standalone)
// ─────────────────────────────────────────────────────────────────────────────

describe('Image (block)', () => {
  it('renders a standalone image block', () => {
    const blocks = render(
      <Image imageUrl="https://example.com/photo.jpg" altText="A photo" />,
    );
    expect(blocks).toEqual([
      {
        type: 'image',
        imageUrl: 'https://example.com/photo.jpg',
        altText: 'A photo',
      },
    ]);
  });

  it('renders with a title', () => {
    const blocks = render(
      <Image
        imageUrl="https://example.com/photo.jpg"
        altText="A photo"
        title="My Photo"
      />,
    );
    expect(blocks[0]).toMatchObject({
      title: { type: 'plain_text', text: 'My Photo' },
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CalloutBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Callout', () => {
  it('renders a basic callout', () => {
    const blocks = render(<Callout text="Something went wrong" />);
    expect(blocks).toEqual([
      {
        type: 'callout',
        text: { type: 'mrkdwn', text: 'Something went wrong' },
      },
    ]);
  });

  it('renders with variant and title', () => {
    const blocks = render(
      <Callout
        text="All systems operational"
        title="Status"
        variant="success"
      />,
    );
    expect(blocks[0]).toMatchObject({
      type: 'callout',
      variant: 'success',
      title: { type: 'mrkdwn', text: 'Status' },
    });
  });

  it('renders a Button as accessory', () => {
    const blocks = render(
      <Callout text="Click below">
        <Button appId={APP} blockId={BLOCK} actionId={ACTION}>
          Go
        </Button>
      </Callout>,
    );
    expect((blocks[0] as unknown as { accessory: unknown }).accessory).toMatchObject({
      type: 'button',
      text: { type: 'plain_text', text: 'Go' },
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PreviewBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Preview', () => {
  it('renders with thumb', () => {
    const blocks = render(
      <Preview
        title={['My title']}
        description={['A description']}
        thumb={{ url: 'https://example.com/thumb.png' }}
      />,
    );
    expect(blocks).toEqual([
      {
        type: 'preview',
        title: [{ type: 'mrkdwn', text: 'My title' }],
        description: [{ type: 'mrkdwn', text: 'A description' }],
        thumb: { url: 'https://example.com/thumb.png' },
      },
    ]);
  });

  it('renders with preview image and no thumb', () => {
    const blocks = render(
      <Preview
        title={['My title']}
        description={['Desc']}
        preview={{ url: 'https://example.com/preview.png' }}
        externalUrl="https://example.com"
      />,
    );
    expect(blocks[0]).toMatchObject({
      type: 'preview',
      preview: { url: 'https://example.com/preview.png' },
      externalUrl: 'https://example.com',
    });
    expect((blocks[0] as unknown as { thumb?: unknown }).thumb).toBeUndefined();
  });

  it('renders with a Context footer child', () => {
    const blocks = render(
      <Preview title={['Title']} description={['Desc']}>
        <Context>
          <Plain text="footer text" />
        </Context>
      </Preview>,
    );
    expect((blocks[0] as unknown as { footer: unknown }).footer).toMatchObject({
      type: 'context',
      elements: [{ type: 'plain_text', text: 'footer text' }],
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// InfoCardBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('InfoCard', () => {
  it('renders rows with elements', () => {
    const blocks = render(
      <InfoCard>
        <InfoCardRow background="default">
          <Mrkdwn text="Row content" />
        </InfoCardRow>
      </InfoCard>,
    );
    expect(blocks).toEqual([
      {
        type: 'info_card',
        rows: [
          {
            background: 'default',
            elements: [{ type: 'mrkdwn', text: 'Row content' }],
          },
        ],
      },
    ]);
  });

  it('renders an IconButton as row action', () => {
    const blocks = render(
      <InfoCard>
        <InfoCardRow background="secondary">
          <Mrkdwn text="Row" />
        <IconButton appId={APP} blockId={BLOCK} actionId={ACTION} icon="info" variant="default" />
        </InfoCardRow>
      </InfoCard>,
    );
    const row = (blocks[0] as unknown as { rows: unknown[] }).rows[0] as {
      action: unknown;
    };
    expect(row.action).toMatchObject({ type: 'icon_button' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ConditionalBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('Conditional', () => {
  it('renders nested layout blocks in render field', () => {
    const blocks = render(
      <Conditional engine={['rocket.chat']}>
        <Section text="Only on RC" />
        <Divider />
      </Conditional>,
    );
    expect(blocks).toEqual([
      {
        type: 'conditional',
        when: { engine: ['rocket.chat'] },
        render: [
          { type: 'section', text: { type: 'mrkdwn', text: 'Only on RC' } },
          { type: 'divider' },
        ],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ExperimentalTabNavigation
// ─────────────────────────────────────────────────────────────────────────────

describe('TabNavigation', () => {
  it('renders tabs', () => {
    const blocks = render(
      <TabNavigation>
        <Tab appId={APP} blockId={BLOCK} actionId="tab1" title="Tab A" selected />
        <Tab appId={APP} blockId={BLOCK} actionId="tab2" title="Tab B" />
      </TabNavigation>,
    );
    expect(blocks).toEqual([
      {
        type: 'tab_navigation',
        tabs: [
          {
            type: 'tab',
            appId: APP,
            blockId: BLOCK,
            actionId: 'tab1',
            title: { type: 'mrkdwn', text: 'Tab A' },
            selected: true,
          },
          {
            type: 'tab',
            appId: APP,
            blockId: BLOCK,
            actionId: 'tab2',
            title: { type: 'mrkdwn', text: 'Tab B' },
          },
        ],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VideoConferenceBlock
// ─────────────────────────────────────────────────────────────────────────────

describe('VideoConference', () => {
  it('renders a video_conf block', () => {
    const blocks = render(
      <VideoConference appId={APP} blockId={BLOCK} callId="call123" title="Team Call" />,
    );
    expect(blocks).toEqual([
      {
        type: 'video_conf',
        appId: APP,
        blockId: BLOCK,
        callId: 'call123',
        title: 'Team Call',
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Select elements
// ─────────────────────────────────────────────────────────────────────────────

describe('StaticSelect', () => {
  it('renders options', () => {
    const blocks = render(
      <Actions>
        <StaticSelect appId={APP} blockId={BLOCK} actionId={ACTION} placeholder="Choose">
          <Option value="a">Option A</Option>
          <Option value="b">Option B</Option>
        </StaticSelect>
      </Actions>,
    );
    const el = (blocks[0] as unknown as { elements: unknown[] }).elements[0];
    expect(el).toMatchObject({
      type: 'static_select',
      placeholder: { type: 'plain_text', text: 'Choose' },
      options: [
        { text: { type: 'plain_text', text: 'Option A' }, value: 'a' },
        { text: { type: 'plain_text', text: 'Option B' }, value: 'b' },
      ],
    });
  });
});

describe('Overflow', () => {
  it('renders options', () => {
    const blocks = render(
      <Actions>
        <Overflow appId={APP} blockId={BLOCK} actionId={ACTION}>
          <Option value="edit">Edit</Option>
          <Option value="delete" url="https://example.com">Delete</Option>
        </Overflow>
      </Actions>,
    );
    const el = (blocks[0] as unknown as { elements: unknown[] }).elements[0];
    expect(el).toMatchObject({
      type: 'overflow',
      options: [
        { value: 'edit' },
        { value: 'delete', url: 'https://example.com' },
      ],
    });
  });
});

describe('CheckboxGroup', () => {
  it('renders as checkbox element with options', () => {
    const blocks = render(
      <Input label="Preferences">
        <CheckboxGroup appId={APP} blockId={BLOCK} actionId={ACTION}>
          <Option value="news">News</Option>
          <Option value="updates">Updates</Option>
        </CheckboxGroup>
      </Input>,
    );
    expect((blocks[0] as unknown as { element: unknown }).element).toMatchObject({
      type: 'checkbox',
      options: [{ value: 'news' }, { value: 'updates' }],
    });
  });
});

describe('RadioButtonGroup', () => {
  it('renders as radio_button element with options', () => {
    const blocks = render(
      <Input label="Color">
        <RadioButtonGroup appId={APP} blockId={BLOCK} actionId={ACTION}>
          <Option value="red">Red</Option>
          <Option value="blue">Blue</Option>
        </RadioButtonGroup>
      </Input>,
    );
    expect((blocks[0] as unknown as { element: unknown }).element).toMatchObject({
      type: 'radio_button',
      options: [{ value: 'red' }, { value: 'blue' }],
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Text components
// ─────────────────────────────────────────────────────────────────────────────

describe('Text helpers (Mrkdwn / Plain)', () => {
  it('Mrkdwn appears in Context elements', () => {
    const blocks = render(
      <Context>
        <Mrkdwn text="*hello*" />
      </Context>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toEqual({
      type: 'mrkdwn',
      text: '*hello*',
    });
  });

  it('Plain appears in Context elements', () => {
    const blocks = render(
      <Context>
        <Plain text="plain text" emoji />
      </Context>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toEqual({
      type: 'plain_text',
      text: 'plain text',
      emoji: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fragment / multi-block rendering
// ─────────────────────────────────────────────────────────────────────────────

describe('Fragment rendering', () => {
  it('flattens Fragment siblings into an array', () => {
    const blocks = render(
      <>
        <Divider />
        <Section text="Hello" />
        <Divider />
      </>,
    );
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toMatchObject({ type: 'divider' });
    expect(blocks[1]).toMatchObject({ type: 'section' });
    expect(blocks[2]).toMatchObject({ type: 'divider' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Remaining actionable elements (smoke tests)
// ─────────────────────────────────────────────────────────────────────────────

describe('Actionable elements (smoke)', () => {
  it('DatePicker', () => {
    const blocks = render(
      <Actions>
        <DatePicker appId={APP} blockId={BLOCK} actionId={ACTION} initialDate="2024-01-01" />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'datepicker',
      initialDate: '2024-01-01',
    });
  });

  it('TimePicker', () => {
    const blocks = render(
      <Actions>
        <TimePicker appId={APP} blockId={BLOCK} actionId={ACTION} initialTime="09:30" />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'time_picker',
      initialTime: '09:30',
    });
  });

  it('LinearScale', () => {
    const blocks = render(
      <Actions>
        <LinearScale appId={APP} blockId={BLOCK} actionId={ACTION} minValue={1} maxValue={5} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'linear_scale',
      minValue: 1,
      maxValue: 5,
    });
  });

  it('ToggleSwitch', () => {
    const blocks = render(
      <Actions>
        <ToggleSwitch appId={APP} blockId={BLOCK} actionId={ACTION}>
          <Option value="enabled">Enable notifications</Option>
        </ToggleSwitch>
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'toggle_switch',
      options: [{ text: { type: 'plain_text', text: 'Enable notifications' }, value: 'enabled' }],
    });
  });

  it('UsersSelect', () => {
    const blocks = render(
      <Actions>
        <UsersSelect appId={APP} blockId={BLOCK} actionId={ACTION} placeholder="Pick user" />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'users_select',
    });
  });

  it('MultiUsersSelect', () => {
    const blocks = render(
      <Actions>
        <MultiUsersSelect appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'multi_users_select',
    });
  });

  it('ChannelsSelect', () => {
    const blocks = render(
      <Actions>
        <ChannelsSelect appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'channels_select',
    });
  });

  it('MultiChannelsSelect', () => {
    const blocks = render(
      <Actions>
        <MultiChannelsSelect appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'multi_channels_select',
    });
  });

  it('ConversationsSelect', () => {
    const blocks = render(
      <Actions>
        <ConversationsSelect appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'conversations_select',
    });
  });

  it('MultiConversationsSelect', () => {
    const blocks = render(
      <Actions>
        <MultiConversationsSelect appId={APP} blockId={BLOCK} actionId={ACTION} />
      </Actions>,
    );
    expect((blocks[0] as unknown as { elements: unknown[] }).elements[0]).toMatchObject({
      type: 'multi_conversations_select',
    });
  });

  it('MultiStaticSelect', () => {
    const blocks = render(
      <Input label="Tags">
        <MultiStaticSelect appId={APP} blockId={BLOCK} actionId={ACTION} maxSelectItems={3}>
          <Option value="tag1">Tag 1</Option>
          <Option value="tag2">Tag 2</Option>
        </MultiStaticSelect>
      </Input>,
    );
    expect((blocks[0] as unknown as { element: unknown }).element).toMatchObject({
      type: 'multi_static_select',
      maxSelectItems: 3,
      options: [{ value: 'tag1' }, { value: 'tag2' }],
    });
  });
});
