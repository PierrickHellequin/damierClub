'use client';
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

let _initialized = false;

export function ensureAntdRenderPatched() {
  if (_initialized) return;
  unstableSetRender((node, container) => {
    // Mémorise / crée un root React 19
    container._reactRoot ||= createRoot(container);
    const root = container._reactRoot;
    root.render(node);
    return async () => {
      // Laisser React finir micro-tâches avant unmount (conseil doc AntD)
      await new Promise(r => setTimeout(r, 0));
      root.unmount();
    };
  });
  _initialized = true;
}
