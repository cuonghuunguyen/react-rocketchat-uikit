import { createContext, type Context } from 'react';
import ReactReconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import type { Container, HostContext, Instance, TextInstance } from './types';

// React 19 requires a HostTransitionContext to be provided.
// We don't support transitions, so we use a null context.
const HostTransitionContext: Context<null> = createContext<null>(null);

// Internal event-priority state (no-op for a synchronous builder renderer).
let currentEventPriority = DefaultEventPriority;

const hostConfig: ReactReconciler.HostConfig<
  /* Type             */ string,
  /* Props            */ Record<string, unknown>,
  /* Container        */ Container,
  /* Instance         */ Instance,
  /* TextInstance     */ TextInstance,
  /* SuspenseInstance */ never,
  /* HydratableInstance */ never,
  /* FormInstance     */ never,
  /* PublicInstance   */ Instance,
  /* HostContext      */ HostContext,
  /* ChildSet         */ never,
  /* TimeoutHandle    */ ReturnType<typeof setTimeout>,
  /* NoTimeout        */ -1,
  /* TransitionStatus */ null
> = {
  // ── Mode flags ──────────────────────────────────────────────────────────────
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  // ── Instance creation ────────────────────────────────────────────────────────
  createInstance(type, props) {
    // Strip `children` from props — children are tracked in the children array.
    const { children: _children, ...rest } = props;
    return { nodeType: 'instance', type, props: rest, children: [] };
  },

  createTextInstance(text) {
    return { nodeType: 'text', type: '#text', text, children: [] };
  },

  clearContainer(container) {
    container.children = [];
  },

  // ── Tree manipulation ────────────────────────────────────────────────────────
  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child);
  },

  appendChild(parentInstance, child) {
    parentInstance.children.push(child);
  },

  appendChildToContainer(container, child) {
    container.children.push(child);
  },

  removeChild(parentInstance, child) {
    const idx = parentInstance.children.indexOf(child);
    if (idx !== -1) parentInstance.children.splice(idx, 1);
  },

  removeChildFromContainer(container, child) {
    const idx = container.children.indexOf(child);
    if (idx !== -1) container.children.splice(idx, 1);
  },

  insertBefore(parentInstance, child, beforeChild) {
    const idx = parentInstance.children.indexOf(beforeChild);
    if (idx !== -1) {
      parentInstance.children.splice(idx, 0, child);
    } else {
      parentInstance.children.push(child);
    }
  },

  insertInContainerBefore(container, child, beforeChild) {
    const idx = container.children.indexOf(beforeChild);
    if (idx !== -1) {
      container.children.splice(idx, 0, child);
    } else {
      container.children.push(child);
    }
  },

  // ── Updates ─────────────────────────────────────────────────────────────────
  commitUpdate(instance, _type, _prevProps, nextProps) {
    const { children: _children, ...rest } = nextProps;
    instance.props = rest;
  },

  commitTextUpdate(textInstance: TextInstance, _prevText: string, nextText: string) {
    textInstance.text = nextText;
  },

  resetTextContent(_instance: Instance) {
    // No-op: we don't track text content directly on instances.
  },

  // ── Finalisation & context ───────────────────────────────────────────────────
  finalizeInitialChildren: () => false,

  getPublicInstance(instance: Instance | TextInstance) {
    if (instance.nodeType === 'text') {
      return instance as unknown as Instance;
    }
    return instance;
  },

  prepareForCommit: () => null,
  resetAfterCommit: () => undefined,

  getRootHostContext: () => ({}),
  getChildHostContext: (_parentHostContext: unknown) => ({}),

  shouldSetTextContent: () => false,

  // ── Lifecycle no-ops ─────────────────────────────────────────────────────────
  detachDeletedInstance: () => undefined,
  beforeActiveInstanceBlur: () => undefined,
  afterActiveInstanceBlur: () => undefined,
  preparePortalMount: () => undefined,
  prepareScopeUpdate: () => undefined,
  getInstanceFromScope: () => null,
  getInstanceFromNode: () => null,

  // ── Timer stubs ──────────────────────────────────────────────────────────────
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1 as const,

  // ── Renderer identity ────────────────────────────────────────────────────────
  isPrimaryRenderer: false,
  warnsIfNotActing: false,

  // ── React 19 event priority ──────────────────────────────────────────────────
  setCurrentUpdatePriority(newPriority: number) {
    currentEventPriority = newPriority;
  },
  getCurrentUpdatePriority: () => currentEventPriority,
  resolveUpdatePriority: () => currentEventPriority,

  // ── React 19 form support (not applicable) ───────────────────────────────────
  resetFormInstance: () => undefined,

  // ── React 19 paint / scheduling hooks (no-ops) ──────────────────────────────
  requestPostPaintCallback: () => undefined,
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: () => undefined,
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1,

  // ── React 19 suspend-commit protocol (no suspension needed) ─────────────────
  maySuspendCommit: () => false,
  preloadInstance: () => true,
  startSuspendingCommit: () => undefined,
  suspendInstance: () => undefined,
  waitForCommitToBeReady: () => null,

  // ── React 19 transition context ──────────────────────────────────────────────
  NotPendingTransition: null,
  // React.Context<null> is structurally identical to ReactContext<TransitionStatus>
  // at runtime — both are plain objects with the same internal fields.
  // The `as any` cast is the minimal workaround for the opaque generic mismatch
  // between `@types/react` (Context<T>) and `@types/react-reconciler`
  // (ReactContext<T>); no runtime risk, purely a TypeScript limitation.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HostTransitionContext: HostTransitionContext as any,
};

export default hostConfig;
