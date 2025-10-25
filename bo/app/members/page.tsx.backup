"use client";
import { useState } from 'react';
import { Table, Typography, Space } from 'antd';
import { Member } from '@/types/member';
import useMembers from '@/hooks/useMembers';
import Link from 'next/link';

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { members, loading, total, error } = useMembers({ enabled: true, page, pageSize });

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Members
          </Typography.Title>
        </Space>
        <Table<Member>
          size="small"
          loading={loading}
          dataSource={members}
          rowKey={m => m.id}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            onChange: (p, ps) => { setPage(p); setPageSize(ps); }
          }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 70 },
            { title: 'Pseudo', dataIndex: 'name' },
            { title: 'Prénom', dataIndex: 'firstName' },
            { title: 'Nom', dataIndex: 'lastName' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Ville', dataIndex: 'city', width: 120 },
            { title: 'Taux', dataIndex: 'rate', width: 90 },
            {
              title: 'Actions', width: 110,
              render: (_, record) => (
                <Space size="small">
                  <Link href={`/profil/${record.id}`}><span style={{ color: '#1677ff', cursor: 'pointer' }}>Profil</span></Link>
                </Space>
              )
            }
          ]}
        />
      </Space>
    </>
  );
}
