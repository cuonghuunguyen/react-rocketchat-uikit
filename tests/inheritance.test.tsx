/** @jest-environment node */

import React from 'react';
import { render, resetActionIdCounter } from '../src';
import {
  Actions,
  Button,
  Callout,
  Input,
  Option,
  Overflow,
  PlainTextInput,
  Section,
  StaticSelect,
  Tab,
  TabNavigation,
} from '../src';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetActionIdCounter();
});

// ─────────────────────────────────────────────────────────────────────────────
// Inheritance: blockId and appId from parent blocks
// ─────────────────────────────────────────────────────────────────────────────

describe('Inheritance: blockId and appId from parent blocks', () => {
  it('Actions block passes blockId and appId to child elements', () => {
    const blocks = render(
      <Actions blockId="block-1" appId="my-app">
        <Button actionId="btn-1">Click</Button>
        <Button actionId="btn-2">Other</Button>
      </Actions>,
    );
    expect(blocks).toEqual([
      {
        type: 'actions',
        blockId: 'block-1',
        appId: 'my-app',
        elements: [
          {
            type: 'button',
            appId: 'my-app',
            blockId: 'block-1',
            actionId: 'btn-1',
            text: { type: 'plain_text', text: 'Click' },
          },
          {
            type: 'button',
            appId: 'my-app',
            blockId: 'block-1',
            actionId: 'btn-2',
            text: { type: 'plain_text', text: 'Other' },
          },
        ],
      },
    ]);
  });

  it('Input block passes blockId and appId to child element', () => {
    const blocks = render(
      <Input label="Name" blockId="input-block" appId="my-app">
        <PlainTextInput actionId="name-input" placeholder="Enter name" />
      </Input>,
    );
    expect(blocks).toEqual([
      {
        type: 'input',
        blockId: 'input-block',
        appId: 'my-app',
        label: { type: 'plain_text', text: 'Name' },
        element: {
          type: 'plain_text_input',
          appId: 'my-app',
          blockId: 'input-block',
          actionId: 'name-input',
          placeholder: { type: 'plain_text', text: 'Enter name' },
        },
      },
    ]);
  });

  it('Section block passes blockId and appId to accessory', () => {
    const blocks = render(
      <Section text="Pick one" blockId="sec-1" appId="my-app">
        <Button actionId="btn-acc">Go</Button>
      </Section>,
    );
    expect(blocks).toEqual([
      {
        type: 'section',
        blockId: 'sec-1',
        appId: 'my-app',
        text: { type: 'mrkdwn', text: 'Pick one' },
        accessory: {
          type: 'button',
          appId: 'my-app',
          blockId: 'sec-1',
          actionId: 'btn-acc',
          text: { type: 'plain_text', text: 'Go' },
        },
      },
    ]);
  });

  it('Callout block passes blockId and appId to accessory', () => {
    const blocks = render(
      <Callout text="Warning!" blockId="callout-1" appId="my-app">
        <Button actionId="dismiss">Dismiss</Button>
      </Callout>,
    );
    expect(blocks[0]).toMatchObject({
      type: 'callout',
      blockId: 'callout-1',
      appId: 'my-app',
      accessory: {
        type: 'button',
        appId: 'my-app',
        blockId: 'callout-1',
        actionId: 'dismiss',
      },
    });
  });

  it('element-level props override parent block context', () => {
    const blocks = render(
      <Actions blockId="parent-block" appId="parent-app">
        <Button actionId="btn-1" appId="override-app" blockId="override-block">
          Override
        </Button>
      </Actions>,
    );
    const elements = (blocks[0] as unknown as { elements: unknown[] }).elements;
    expect(elements[0]).toMatchObject({
      appId: 'override-app',
      blockId: 'override-block',
      actionId: 'btn-1',
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Auto-generated actionId
// ─────────────────────────────────────────────────────────────────────────────

describe('Auto-generated actionId', () => {
  it('generates actionId when not provided', () => {
    const blocks = render(
      <Actions blockId="b1" appId="app">
        <Button>First</Button>
        <Button>Second</Button>
      </Actions>,
    );
    const elements = (blocks[0] as unknown as { elements: unknown[] }).elements as Array<{ actionId: string }>;
    expect(elements[0]!.actionId).toBe('action_0');
    expect(elements[1]!.actionId).toBe('action_1');
  });

  it('uses provided actionId over auto-generated', () => {
    const blocks = render(
      <Actions blockId="b1" appId="app">
        <Button actionId="custom-id">Click</Button>
      </Actions>,
    );
    const elements = (blocks[0] as unknown as { elements: unknown[] }).elements as Array<{ actionId: string }>;
    expect(elements[0]!.actionId).toBe('custom-id');
  });

  it('auto-generates actionId for input elements', () => {
    const blocks = render(
      <Input label="Field" blockId="b1" appId="app">
        <PlainTextInput />
      </Input>,
    );
    const element = (blocks[0] as unknown as { element: { actionId: string } }).element;
    expect(element.actionId).toBe('action_0');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Backward compatibility: explicit props still work
// ─────────────────────────────────────────────────────────────────────────────

describe('Backward compatibility', () => {
  it('explicit appId, blockId, actionId on element still works', () => {
    const blocks = render(
      <Actions>
        <Button appId="explicit-app" blockId="explicit-block" actionId="explicit-action">
          Click
        </Button>
      </Actions>,
    );
    const elements = (blocks[0] as unknown as { elements: unknown[] }).elements;
    expect(elements[0]).toMatchObject({
      appId: 'explicit-app',
      blockId: 'explicit-block',
      actionId: 'explicit-action',
    });
  });

  it('works with StaticSelect inheriting from Actions', () => {
    const blocks = render(
      <Actions blockId="sel-block" appId="sel-app">
        <StaticSelect actionId="sel-1">
          <Option value="a">Option A</Option>
          <Option value="b">Option B</Option>
        </StaticSelect>
      </Actions>,
    );
    const elements = (blocks[0] as unknown as { elements: unknown[] }).elements;
    expect(elements[0]).toMatchObject({
      type: 'static_select',
      appId: 'sel-app',
      blockId: 'sel-block',
      actionId: 'sel-1',
    });
  });

  it('TabNavigation passes context to Tab children', () => {
    const blocks = render(
      <TabNavigation>
        <Tab actionId="tab-1" appId="app" blockId="nav" title="Home" selected />
        <Tab actionId="tab-2" appId="app" blockId="nav" title="Settings" />
      </TabNavigation>,
    );
    expect(blocks[0]).toMatchObject({
      type: 'tab_navigation',
      tabs: [
        { type: 'tab', actionId: 'tab-1', appId: 'app', blockId: 'nav', title: { type: 'mrkdwn', text: 'Home' }, selected: true },
        { type: 'tab', actionId: 'tab-2', appId: 'app', blockId: 'nav', title: { type: 'mrkdwn', text: 'Settings' } },
      ],
    });
  });
});
