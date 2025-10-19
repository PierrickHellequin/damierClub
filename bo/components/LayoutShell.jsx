'use client';
import { Layout, Menu, Avatar, Typography, Spin } from 'antd';
import { HomeOutlined, TeamOutlined, UserOutlined, BankOutlined, FileTextOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useMemo, useEffect } from 'react';

const { Sider, Header, Content } = Layout;

export default function LayoutShell({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const selectedKeys = useMemo(() => {
    if (pathname === '/') return ['home'];
    if (pathname.startsWith('/members')) return ['members'];
    if (pathname.startsWith('/clubs')) return ['clubs'];
    if (pathname.startsWith('/articles')) return ['articles'];
    return [];
  }, [pathname]);

  // Redirection (hook toujours appelé, plus dans un if)
  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Cas non authentifié sur page protégée: attendre redirection
  if (!user && pathname !== '/login' && pathname !== '/register') {
    return null;
  }
  // Cas pages publiques (login/register)
  if (!user) {
    return children;
  }

  const firstName = user.firstName || user.name || 'Utilisateur';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="light" style={{ borderRight: '1px solid #eee' }}>
        <div style={{ padding: '16px 12px', fontWeight: 600, fontSize: 18 }}>Damier Club</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={(info) => {
            if (info.key === 'home') router.push('/');
            if (info.key === 'members') router.push('/members');
            if (info.key === 'clubs') router.push('/clubs');
            if (info.key === 'articles') router.push('/articles');
          }}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: 'Homepage' },
            { key: 'clubs', icon: <BankOutlined />, label: 'Clubs' },
            { key: 'members', icon: <TeamOutlined />, label: 'Members' },
            { key: 'articles', icon: <FileTextOutlined />, label: 'Articles' }
          ]}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size={38} icon={<UserOutlined />} style={{ background: '#1677ff' }}>
            {firstName.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <Typography.Text strong>{firstName}</Typography.Text><br />
            <Typography.Text style={{ fontSize: 11, display: 'block' }}>{user.name && user.firstName ? `(@${user.name})` : ''}</Typography.Text>
            <Typography.Link onClick={logout} style={{ fontSize: 12 }}>Logout</Typography.Link>
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
