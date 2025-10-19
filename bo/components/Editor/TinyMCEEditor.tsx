'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Spin } from 'antd';
import type { Editor as TinyMCEEditor } from 'tinymce';

interface TinyMCEEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number;
}

export default function TinyMCEEditorComponent({
  value = '',
  onChange,
  placeholder = 'Commencez à écrire votre article...',
  readOnly = false,
  height = 500,
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorChange = (content: string) => {
    if (onChange && !readOnly) {
      onChange(content);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Editor
        apiKey="no-api-key" // Using TinyMCE in self-hosted mode (free)
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={readOnly}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
            'emoticons',
            'codesample',
            'quickbars',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline strikethrough | ' +
            'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image media table | ' +
            'removeformat code fullscreen | help',
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          quickbars_insert_toolbar: 'quickimage quicktable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              padding: 10px;
            }
            p { margin: 0 0 10px 0; }
            h1, h2, h3, h4, h5, h6 { margin: 20px 0 10px 0; font-weight: 600; }
            ul, ol { padding-left: 20px; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            table td, table th { border: 1px solid #ddd; padding: 8px; }
            table th { background-color: #f0f0f0; }
            code {
              background-color: #f4f4f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            pre {
              background-color: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
            blockquote {
              border-left: 4px solid #ccc;
              margin: 10px 0;
              padding-left: 15px;
              color: #666;
            }
          `,
          placeholder,
          language: 'fr_FR',
          language_url: '/tinymce/langs/fr_FR.js', // Optional: Add French language pack
          skin: 'oxide',
          branding: false,
          promotion: false,
          resize: true,
          block_formats: 'Paragraphe=p; Titre 1=h1; Titre 2=h2; Titre 3=h3; Titre 4=h4; Titre 5=h5; Titre 6=h6; Citation=blockquote; Code=pre',
          // Image upload handler (optional - can be implemented later)
          images_upload_handler: async (blobInfo) => {
            // TODO: Implement image upload to your backend
            // For now, return a data URL
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          // Paste settings
          paste_data_images: true,
          paste_as_text: false,
          paste_enable_default_filters: true,
          // Link settings
          link_assume_external_targets: true,
          link_default_protocol: 'https',
          // Table settings
          table_default_attributes: {
            border: '1',
          },
          table_default_styles: {
            'border-collapse': 'collapse',
            width: '100%',
          },
        }}
      />
    </div>
  );
}
