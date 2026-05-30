/** Internal representation of a host element node in the reconciler tree. */
export type Instance = {
  readonly nodeType: 'instance';
  readonly type: string;
  props: Record<string, unknown>;
  readonly children: Array<Instance | TextInstance>;
};

/** Internal representation of a raw text node (e.g. `<Button>Click me</Button>`). */
export type TextInstance = {
  readonly nodeType: 'text';
  readonly type: '#text';
  text: string;
  readonly children: never[];
};

/** Root container that collects top-level block instances. */
export type Container = {
  readonly nodeType: 'container';
  children: Array<Instance | TextInstance>;
};

export type HostContext = Record<never, never>;
