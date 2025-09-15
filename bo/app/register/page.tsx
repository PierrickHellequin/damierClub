"use client";
import { Form, Input, Button, Typography, Card, App } from 'antd';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();

  useEffect(() => { if (!loading && user) router.replace('/'); }, [user, loading, router]);

  const onFinish = async (values: { name: string; email: string; password: string; confirm: string }) => {
    try {
      await register(values.name, values.email, values.password);
      message.success('Compte créé');
      router.push('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erreur d'inscription";
      message.error(msg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Card style={{ maxWidth: 460, width: '100%' }} title="Inscription">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nom" rules={[{ required: true, message: 'Nom requis' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email requis' }, { type: 'email', message: 'Email invalide' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mot de passe" rules={[{ required: true, message: 'Mot de passe requis' }, { min: 6, message: '6 caractères min.' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirm" label="Confirmation" dependencies={['password']} rules={[{ required: true, message: 'Confirmer le mot de passe' }, ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) return Promise.resolve();
              return Promise.reject(new Error('Les mots de passe diffèrent'));
            }
          })]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>S'inscrire</Button>
          </Form.Item>
          <Typography.Text>Déjà un compte ? <Link href="/login">Connexion</Link></Typography.Text>
        </Form>
      </Card>
    </div>
  );
}
