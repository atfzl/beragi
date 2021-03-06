// naming this file like this so that import auto sort keeps it at the top

import { Events } from '#/models/Events';
import { FiberRoot, Renderer } from '#/models/React';
import * as nanoid from 'nanoid';

const renderers: Record<string, Renderer> = {};

(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: (renderer: Renderer) => {
    const rendererId = nanoid();

    renderers[rendererId] = renderer;

    return rendererId;
  },
  onCommitFiberRoot: (rendererId: string, fiberRoot: FiberRoot) => {
    const renderer = renderers[rendererId];

    Events.onCommitFiberRoot.emit(document, {
      rendererId,
      renderer,
      fiberRoot,
    });
  },
  onCommitFiberUnmount: () => null,
};
