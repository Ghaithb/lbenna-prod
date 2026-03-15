import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { usersService, User } from '@/services/users';

import { useNavigate } from 'react-router-dom';

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll({ page: pagination.current, limit: pagination.pageSize });
      setUsers(data.data);
      setPagination({ ...pagination, total: data.total });
    } catch (error) {
      message.error('Erreur chargement utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersService.delete(id);
      message.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      message.error('Erreur suppression');
    }
  };

  const columns = [
    {
      title: 'Nom',
      key: 'name',
      render: (user: User) => (
        <div>
          <div className="font-semibold">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      )
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => role === 'ADMIN' ? <Tag color="red">ADMIN</Tag> : <Tag color="blue">ÉTUDIANT</Tag>
    },
    {
      title: 'Progression',
      key: 'progress',
      render: (user: User) => (
        <Space direction="vertical" size={0}>
          <Tag color="cyan">Réservations: {user._count?.bookings || 0}</Tag>
          <Tag color="purple">Projets: {user._count?.projects || 0}</Tag>
        </Space>
      )
    },
    {
      title: 'Date Inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: User) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/users/${user.id}`)} />
          <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(user.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Gestion des Utilisateurs</h1>
      <div className="bg-white p-4 rounded-lg shadow border">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) => setPagination({ ...pagination, current: page, pageSize })
          }}
        />
      </div>
    </div>
  );
}