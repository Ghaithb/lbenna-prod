import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { usersService, User } from '@/services/users';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

const { Title, Text } = Typography;

export default function ClientsPage() {
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
            const data = await usersService.getAll({
                page: pagination.current,
                limit: pagination.pageSize,
                group: 'client' // Specific group for this page
            });
            setUsers(data.data);
            setPagination({ ...pagination, total: data.total });
        } catch (error) {
            message.error('Erreur chargement clients');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await usersService.delete(id);
            message.success('Client supprimé');
            fetchUsers();
        } catch (error) {
            message.error('Erreur suppression');
        }
    };

    const columns = [
        {
            title: 'Nom du Client',
            key: 'name',
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <UserOutlined />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                if (role === 'B2B') return <Tag color="purple">B2B / Entreprise</Tag>;
                return <Tag color="blue">Particulier</Tag>;
            }
        },
        {
            title: 'Activité',
            key: 'progress',
            render: (user: User) => (
                <Space size={4}>
                    <Tag color="cyan">Réservations: {user._count?.bookings || 0}</Tag>
                    <Tag color="orange">Projets: {user._count?.projects || 0}</Tag>
                </Space>
            )
        },
        {
            title: 'Inscription',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <Text type="secondary">{new Date(date).toLocaleDateString()}</Text>
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, user: User) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/users/${user.id}`)}>
                        Détails
                    </Button>
                    <Popconfirm title="Supprimer définitivement ce compte ?" onConfirm={() => handleDelete(user.id)} okText="Oui" cancelText="Non">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <Title level={2}>Base Clients</Title>
                    <Text type="secondary">Gestion des comptes particuliers et professionnels (B2B)</Text>
                </div>
            </div>

            <Card noPadding>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: false,
                        onChange: (page: number) => setPagination({ ...pagination, current: page })
                    }}
                    className="border-none"
                />
            </Card>
        </div>
    );
}
