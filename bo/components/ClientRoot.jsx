'use client';
import { ConfigProvider, App as AntdApp } from 'antd';
import AuthProvider from './AuthProvider';
import { ensureAntdRenderPatched } from './antdRenderSetup';

export default function ClientRoot({ children }) {
  ensureAntdRenderPatched();
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <AntdApp>
        <AuthProvider>
          {children}
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
