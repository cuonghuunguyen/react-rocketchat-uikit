/** @jest-environment node */

import React from 'react';
import { render } from '../src/render';
import {
  ActionButton,
  ContextImage,
  ContextMrkdwn,
  ContextPlain,
  InputDatePicker,
  InputStaticSelect,
  InputTextInput,
  Option,
  SectionButton,
  SectionOverflow,
} from '../src';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const APP = 'my.app';
const BLOCK = 'block1';
const ACTION = 'action1';

// ─────────────────────────────────────────────────────────────────────────────
// ActionButton
// ─────────────────────────────────────────────────────────────────────────────

describe('ActionButton', () => {
  it('renders an actions block with a single button', () => {
    const blocks = render(
      <ActionButton appId={APP} blockId={BLOCK} actionId={ACTION}>
        Click me
      </ActionButton>,
    );
    expect(blocks).toEqual([
      {
        type: 'actions',
        blockId: BLOCK,
        appId: APP,
        elements: [
          {
            type: 'button',
            appId: APP,
            blockId: BLOCK,
            actionId: ACTION,
            text: { type: 'plain_text', text: 'Click me' },
          },
        ],
      },
    ]);
  });

  it('passes style through', () => {
    const blocks = render(
      <ActionButton appId={APP} blockId={BLOCK} actionId={ACTION} style="danger">
        Delete
      </ActionButton>,
    );
    expect((blocks[0] as any).elements[0].style).toBe('danger');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// InputTextInput
// ─────────────────────────────────────────────────────────────────────────────

describe('InputTextInput', () => {
  it('renders an input block with a plain text input', () => {
    const blocks = render(
      <InputTextInput
        label="Name"
        appId={APP}
        blockId={BLOCK}
        actionId={ACTION}
        placeholder="Enter name"
      />,
    );
    expect(blocks).toEqual([
      {
        type: 'input',
        blockId: BLOCK,
        appId: APP,
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

  it('passes hint and optional', () => {
    const blocks = render(
      <InputTextInput
        label="Email"
        hint="Work email"
        optional
        appId={APP}
        blockId={BLOCK}
        actionId={ACTION}
      />,
    );
    expect(blocks[0]).toMatchObject({
      hint: { type: 'plain_text', text: 'Work email' },
      optional: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// InputStaticSelect
// ─────────────────────────────────────────────────────────────────────────────

describe('InputStaticSelect', () => {
  it('renders an input block with a static select', () => {
    const blocks = render(
      <InputStaticSelect
        label="Color"
        appId={APP}
        blockId={BLOCK}
        actionId={ACTION}
        placeholder="Pick a color"
      >
        <Option value="red">Red</Option>
        <Option value="blue">Blue</Option>
      </InputStaticSelect>,
    );
    expect(blocks).toEqual([
      {
        type: 'input',
        blockId: BLOCK,
        appId: APP,
        label: { type: 'plain_text', text: 'Color' },
        element: {
          type: 'static_select',
          appId: APP,
          blockId: BLOCK,
          actionId: ACTION,
          placeholder: { type: 'plain_text', text: 'Pick a color' },
          options: [
            { type: 'option', text: { type: 'plain_text', text: 'Red' }, value: 'red' },
            { type: 'option', text: { type: 'plain_text', text: 'Blue' }, value: 'blue' },
          ],
        },
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// InputDatePicker
// ─────────────────────────────────────────────────────────────────────────────

describe('InputDatePicker', () => {
  it('renders an input block with a date picker', () => {
    const blocks = render(
      <InputDatePicker
        label="Birthday"
        appId={APP}
        blockId={BLOCK}
        actionId={ACTION}
        initialDate="2000-01-01"
      />,
    );
    expect(blocks).toEqual([
      {
        type: 'input',
        blockId: BLOCK,
        appId: APP,
        label: { type: 'plain_text', text: 'Birthday' },
        element: {
          type: 'datepicker',
          appId: APP,
          blockId: BLOCK,
          actionId: ACTION,
          initialDate: '2000-01-01',
        },
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ContextMrkdwn
// ─────────────────────────────────────────────────────────────────────────────

describe('ContextMrkdwn', () => {
  it('renders a context block with a single mrkdwn element', () => {
    const blocks = render(<ContextMrkdwn text="*Bold* note" />);
    expect(blocks).toEqual([
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: '*Bold* note' }],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ContextPlain
// ─────────────────────────────────────────────────────────────────────────────

describe('ContextPlain', () => {
  it('renders a context block with a single plain_text element', () => {
    const blocks = render(<ContextPlain text="Simple text" />);
    expect(blocks).toEqual([
      {
        type: 'context',
        elements: [{ type: 'plain_text', text: 'Simple text' }],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ContextImage
// ─────────────────────────────────────────────────────────────────────────────

describe('ContextImage', () => {
  it('renders a context block with a single image element', () => {
    const blocks = render(
      <ContextImage imageUrl="https://example.com/img.png" altText="img" />,
    );
    expect(blocks).toEqual([
      {
        type: 'context',
        elements: [
          { type: 'image', imageUrl: 'https://example.com/img.png', altText: 'img' },
        ],
      },
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SectionButton
// ─────────────────────────────────────────────────────────────────────────────

describe('SectionButton', () => {
  it('renders a section block with a button accessory', () => {
    const blocks = render(
      <SectionButton text="Pick one" appId={APP} blockId={BLOCK} actionId={ACTION}>
        Click
      </SectionButton>,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        blockId: BLOCK,
        appId: APP,
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
// SectionOverflow
// ─────────────────────────────────────────────────────────────────────────────

describe('SectionOverflow', () => {
  it('renders a section block with an overflow accessory', () => {
    const blocks = render(
      <SectionOverflow text="Options" appId={APP} blockId={BLOCK} actionId={ACTION}>
        <Option value="opt1">Option 1</Option>
        <Option value="opt2">Option 2</Option>
      </SectionOverflow>,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        blockId: BLOCK,
        appId: APP,
        text: { type: 'mrkdwn', text: 'Options' },
        accessory: {
          type: 'overflow',
          appId: APP,
          blockId: BLOCK,
          actionId: ACTION,
          options: [
            { type: 'option', text: { type: 'plain_text', text: 'Option 1' }, value: 'opt1' },
            { type: 'option', text: { type: 'plain_text', text: 'Option 2' }, value: 'opt2' },
          ],
        },
      },
    ]);
  });
});
