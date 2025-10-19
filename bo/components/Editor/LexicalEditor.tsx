'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';
import type { EditorState, LexicalEditor as LexicalCoreEditor } from 'lexical';
import type { PlayGroundAppProps } from '@pourianof/lexical-playground';

// Import Lexical Playground dynamically to avoid SSR issues
const LexicalPlayground = dynamic<PlayGroundAppProps>(
  () => import('@pourianof/lexical-playground').then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '8px', color: '#666' }}>Chargement de l'editeur...</div>
      </div>
    ),
  }
);

const isHtmlEmpty = (html: string) => {
  if (!html) {
    return true;
  }

  const textContent = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();

  return textContent.length === 0;
};

const parseInitialHtml = (html: string) => {
  if (!html) {
    return undefined;
  }

  return (editor: LexicalCoreEditor) => {
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();

      root.clear();
      nodes.forEach((node) => {
        root.append(node);
      });
    } catch (error) {
      console.error('LexicalEditor: failed to parse initial HTML content', error);
    }
  };
};

const buildEditorKey = (html: string) => {
  if (!html) {
    return 'lexical-editor-empty';
  }

  let hash = 0;
  for (let i = 0; i < html.length; i += 1) {
    hash = (Math.imul(31, hash) + html.charCodeAt(i)) | 0;
  }

  return `lexical-editor-${hash}`;
};

interface LexicalEditorProps {
  value?: string; // HTML string
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number;
}

export default function LexicalEditor({
  value = '',
  onChange,
  placeholder = 'Commencez a ecrire votre article...',
  readOnly = false,
  height = 600,
}: LexicalEditorProps) {
  const [isEditorEmpty, setIsEditorEmpty] = useState<boolean>(isHtmlEmpty(value));
  const initialState = useMemo(() => parseInitialHtml(value), [value]);
  const editorKey = useMemo(() => buildEditorKey(value), [value]);

  useEffect(() => {
    setIsEditorEmpty(isHtmlEmpty(value));
  }, [value]);

  const handleChange = useCallback(
    (editorState: EditorState, editorInstance: LexicalCoreEditor) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editorInstance);
        setIsEditorEmpty(isHtmlEmpty(html));

        if (!readOnly && onChange) {
          onChange(html);
        }
      });
    },
    [onChange, readOnly]
  );

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        overflow: 'hidden',
        minHeight: `${height}px`,
      }}
    >
      {!readOnly && placeholder && isEditorEmpty && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            pointerEvents: 'none',
            color: '#999',
            fontSize: '14px',
          }}
        >
          {placeholder}
        </div>
      )}

      <LexicalPlayground
        key={editorKey}
        initialState={initialState}
        onChange={handleChange}
        readOnly={readOnly}
        hideToolbar={readOnly}
      />
    </div>
  );
}
