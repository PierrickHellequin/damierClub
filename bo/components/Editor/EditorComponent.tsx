'use client';

import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import { Spin } from 'antd';

interface EditorComponentProps {
  value?: string; // JSON string from Editor.js
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function EditorComponent({
  value,
  onChange,
  placeholder = 'Commencez à écrire votre article...',
  readOnly = false,
}: EditorComponentProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!holderRef.current) return;

    // Prevent duplicate initialization
    if (editorRef.current) return;

    const initEditor = async () => {
      try {
        setLoading(true);

        let initialData: OutputData | undefined;
        if (value) {
          try {
            initialData = JSON.parse(value);
          } catch (e) {
            console.error('Failed to parse editor data:', e);
          }
        }

        const editor = new EditorJS({
          holder: holderRef.current!,
          placeholder,
          readOnly,
          data: initialData,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Titre',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph,
              config: {
                placeholder: 'Paragraphe',
              },
            },
            list: {
              class: List,
              config: {
                defaultStyle: 'unordered',
              },
            },
            checklist: {
              class: Checklist,
            },
            quote: {
              class: Quote,
              config: {
                quotePlaceholder: 'Citation',
                captionPlaceholder: 'Auteur',
              },
            },
            code: {
              class: Code,
              config: {
                placeholder: 'Entrez votre code',
              },
            },
            inlineCode: {
              class: InlineCode,
            },
            table: {
              class: Table,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            warning: {
              class: Warning,
              config: {
                titlePlaceholder: 'Titre de l\'avertissement',
                messagePlaceholder: 'Message',
              },
            },
            delimiter: Delimiter,
            marker: {
              class: Marker,
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: '/api/link-preview', // You can implement this endpoint later
              },
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  vimeo: true,
                  twitter: true,
                  instagram: true,
                  facebook: true,
                  github: true,
                },
              },
            },
            image: {
              class: Image,
              config: {
                endpoints: {
                  byFile: '/api/upload-image', // Implement this endpoint
                  byUrl: '/api/fetch-image', // Implement this endpoint
                },
                field: 'image',
                types: 'image/*',
              },
            },
          },
          onChange: async () => {
            if (!readOnly && onChange && editorRef.current) {
              try {
                const savedData = await editorRef.current.save();
                onChange(savedData);
              } catch (e) {
                console.error('Failed to save editor data:', e);
              }
            }
          },
          onReady: () => {
            setIsReady(true);
            setLoading(false);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Editor initialization failed:', error);
        setLoading(false);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Failed to destroy editor:', e);
        }
      }
    };
  }, []); // Only run once on mount

  // Update editor data when value changes externally
  useEffect(() => {
    if (isReady && editorRef.current && value) {
      try {
        const data = JSON.parse(value);
        editorRef.current.render(data);
      } catch (e) {
        console.error('Failed to render editor data:', e);
      }
    }
  }, [value, isReady]);

  return (
    <div style={{ position: 'relative', minHeight: 400 }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}>
          <Spin size="large" tip="Chargement de l'éditeur..." />
        </div>
      )}
      <div
        ref={holderRef}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: 20,
          minHeight: 400,
          backgroundColor: '#fff',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      />
    </div>
  );
}
