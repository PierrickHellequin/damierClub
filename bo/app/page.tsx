"use client";
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';
import { Typography, Button, Table, Space, Spin, message } from 'antd';
import Link from 'next/link';
import { Member } from '@/types/member';
import type { ColumnsType } from 'antd/es/table';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

export default function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin /></div>;
  if (!user) return (
    <Space direction="vertical" style={{ padding: 40 }}>
      <Typography.Title level={3}>Bienvenue</Typography.Title>
      <Typography.Paragraph>Veuillez vous connecter ou créer un compte.</Typography.Paragraph>
      <Space>
        <Link href="/login"><Button type="primary">Connexion</Button></Link>
        <Link href="/register"><Button>Inscription</Button></Link>
      </Space>
    </Space>
  );

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }} size="large">
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Tableau de bord</Typography.Title>
          <Typography.Text>Connecté: {user.name} ({user.email})</Typography.Text>
        </div>
        <Button onClick={logout}>Logout</Button>
      </Space>
    </Space>
  );
}
