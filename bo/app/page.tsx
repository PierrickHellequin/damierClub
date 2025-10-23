"use client";
import { useAuth } from '@/components/AuthProvider';
import { useNotes } from '@/hooks/useNotes';
import { useEffect, useState } from 'react';
import { Typography, Button, Space, Spin, Card, Row, Col, Tag, Empty } from 'antd';
import Link from 'next/link';
import { Note } from '@/types/note';
import dayjs from 'dayjs';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { notes, loading: notesLoading } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user && notes) {
      // Filter notes based on user's club role and visibility
      const filtered = notes.filter((note) => {
        // Show private notes only if author
        if (note.visibility === 'PRIVATE') {
          return note.author?.id === user.id;
        }
        // Show club notes if user is in same club or has admin role
        if (note.visibility === 'CLUB') {
          if (user.role === 'ROLE_SUPER_ADMIN' || user.role === 'ROLE_ADMIN') return true;
          return note.club?.id === user.club?.id;
        }
        // Show members notes to all authenticated users
        if (note.visibility === 'MEMBERS') {
          return user.id !== null;
        }
        return false;
      }).filter(note => note.pinned); // Only show pinned notes on dashboard

      setFilteredNotes(filtered);
    }
  }, [user, notes]);

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
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography.Title level={2} style={{ margin: 0 }}>Tableau de bord</Typography.Title>
            <Typography.Text>Bienvenue {user.name} ({user.email})</Typography.Text>
            {user.clubName && <Typography.Text type="secondary" style={{ display: 'block' }}>Club: {user.clubName}</Typography.Text>}
          </div>
          <Link href="/login">
            <Button onClick={() => user && console.log(user)}>Déconnexion</Button>
          </Link>
        </div>

        <Card>
          <Typography.Title level={3}>Notes épinglées</Typography.Title>
          {notesLoading ? (
            <Spin />
          ) : filteredNotes.length === 0 ? (
            <Empty description="Aucune note épinglée" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredNotes.map((note) => (
                <Col key={note.id} xs={24} sm={12} md={8}>
                  <Link href={`/notes/${note.id}`}>
                    <Card
                      hoverable
                      style={{
                        backgroundColor: note.color || '#FFE082',
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <div>
                        <Typography.Title level={5} style={{ margin: '0 0 8px 0' }}>
                          {note.title}
                        </Typography.Title>
                        <Typography.Paragraph
                          ellipsis={{ rows: 3 }}
                          style={{ margin: 0, minHeight: '60px', fontSize: 12 }}
                        >
                          {note.content}
                        </Typography.Paragraph>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                          {dayjs(note.updatedAt).format('DD/MM/YYYY')}
                        </Typography.Text>
                        <Tag color={note.visibility === 'PRIVATE' ? 'blue' : 'green'}>
                          {note.visibility}
                        </Tag>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </Space>
    </div>
  );
}
