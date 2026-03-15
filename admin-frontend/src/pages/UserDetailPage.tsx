import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Space, Typography, Skeleton, Empty, Avatar, Divider } from 'antd';
import { Card } from '@/components/ui/Card';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, CameraOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { usersService, type User } from '../services/users';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const { Title, Text } = Typography;

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const data = await usersService.getById(id);
                setUser(data);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <div className="p-6"><Skeleton active /></div>;
    if (!user) return <div className="p-6"><Empty description="Utilisateur non trouvé" /></div>;

    const bookingColumns = [
        {
            title: 'Service',
            dataIndex: ['serviceOffer', 'title'],
            key: 'service',
            render: (text: string) => text || 'Service supprimé',
        },
        {
            title: 'Date',
            dataIndex: 'bookingDate',
            key: 'date',
            render: (date: string) => format(new Date(date), 'PPp', { locale: fr }),
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'CONFIRMED') color = 'success';
                if (status === 'PENDING') color = 'warning';
                if (status === 'COMPLETED') color = 'blue';
                if (status === 'CANCELLED' || status === 'REJECTED') color = 'error';
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];

    const projectColumns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: any) => (
                <Space>
                    {record.imageUrl && <Avatar src={record.imageUrl} shape="square" />}
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Date de création',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => format(new Date(date), 'PP', { locale: fr }),
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/clients')}>
                    Retour à la liste
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="text-center">
                        <Avatar size={100} icon={<UserOutlined />} className="mb-4" />
                        <Title level={3}>{user.firstName} {user.lastName}</Title>
                        <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'} className="mb-4">
                            {user.role}
                        </Tag>

                        <Divider />

                        <div className="text-left space-y-4">
                            <div className="flex items-center gap-3">
                                <MailOutlined className="text-gray-400" />
                                <Text>{user.email}</Text>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneOutlined className="text-gray-400" />
                                <Text>{user.phone || 'Non renseigné'}</Text>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 text-sm">
                                <CalendarOutlined className="text-gray-400" />
                                <span>Inscrit le {format(new Date(user.createdAt), 'PP', { locale: fr })}</span>
                            </div>
                        </div>
                    </Card>

                    {user.addresses && user.addresses.length > 0 ? (
                        <Card title="Adresses" className="mt-6">
                            {user.addresses.map((addr: any, index: number) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    <Text strong>{addr.label || 'Adresse'}</Text>
                                    <div className="text-sm text-gray-600">
                                        <EnvironmentOutlined className="mr-2" />
                                        {addr.street}, {addr.postalCode} {addr.city}
                                    </div>
                                    {addr.isDefault && <Tag color="green" className="mt-1" size="small">Par défaut</Tag>}
                                    {index < user.addresses!.length - 1 && <Divider className="my-3" />}
                                </div>
                            ))}
                        </Card>
                    ) : null}
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card title={<span><CalendarOutlined className="mr-2 text-primary" /> Historique des Réservations</span>}>
                        <Table
                            dataSource={user.bookings}
                            columns={bookingColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'Aucune réservation' }}
                        />
                    </Card>

                    <Card title={<span><CameraOutlined className="mr-2 text-primary" /> Projets Réalisés / Portfolio</span>}>
                        <Table
                            dataSource={user.projects}
                            columns={projectColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'Aucun projet' }}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
