"use client";
import { Form, Input, Button, Typography, Card, App } from 'antd';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const { message } = App.useApp();
  const router = useRouter();

  useEffect(() => { if (!loading && user) router.replace('/'); }, [user, loading, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success('Connecté');
      router.push('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur de connexion';
      message.error(msg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Card style={{ maxWidth: 420, width: '100%' }} title="Connexion">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email requis' }, { type: 'email', message: 'Email invalide' }]}>
            <Input />

          </Form.Item>
          <Form.Item name="password" label="Mot de passe" rules={[{ required: true, message: 'Mot de passe requis' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Se connecter</Button>
          </Form.Item>
          <Typography.Text>Pas de compte ? <Link href="/register">Créer un compte</Link></Typography.Text>
        </Form>
      </Card>
    </div>
  );
}
