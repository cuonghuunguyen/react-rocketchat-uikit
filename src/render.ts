import type { ReactNode } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import reconciler from './reconciler';
import { serializeBlocks } from './serializer';
import type { Container } from './reconciler/types';
import type { LayoutBlock } from './types';

/**
 * Renders a React element tree and returns the equivalent array of
 * Rocket.Chat UI Kit {@link LayoutBlock} objects.
 *
 * @example
 * ```tsx
 * const blocks = render(
 *   <>
 *     <Section text="Hello *world*!" />
 *     <Divider />
 *     <Actions>
 *       <Button actionId="btn" appId="myApp" blockId="b1">Click me</Button>
 *     </Actions>
 *   </>,
 * );
 * ```
 */
export function render(element: ReactNode): LayoutBlock[] {
  const container: Container = { nodeType: 'container', children: [] };

  const root = reconciler.createContainer(
    container,
    ConcurrentRoot,
    /* hydrationCallbacks */ null,
    /* isStrictMode */ false,
    /* concurrentUpdatesByDefaultOverride */ null,
    /* identifierPrefix */ '',
    /* onUncaughtError */ (err) => { throw err; },
    /* onCaughtError */ () => undefined,
    /* onRecoverableError */ (err) => { throw err; },
    /* onDefaultTransitionIndicator */ () => undefined,
  );

  reconciler.flushSyncFromReconciler(() => {
    reconciler.updateContainer(element, root, null, null);
  });

  return serializeBlocks(container.children);
}
