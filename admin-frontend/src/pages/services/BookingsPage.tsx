import { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Space, Modal, Input, Form } from 'antd';
import { Link } from 'react-router-dom';
import { bookingsService, Booking, BookingStatus } from '../../services/bookings';
import { format } from 'date-fns';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, CloudUploadOutlined, LinkOutlined, EyeOutlined } from '@ant-design/icons';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingsService.getAll();
            setBookings(data);
        } catch (error) {
            message.error('Erreur lors du chargement des réservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: BookingStatus) => {
        try {
            await bookingsService.updateStatus(id, status);
            message.success(`Statut mis à jour: ${status}`);
            fetchBookings();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await bookingsService.delete(id);
            message.success('Réservation supprimée');
            fetchBookings();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const openDeliveryModal = (booking: Booking) => {
        setSelectedBooking(booking);
        form.setFieldsValue({
            deliveryUrl: booking.deliveryUrl || '',
        });
        setIsDeliveryModalOpen(true);
    };

    const handleDeliverySubmit = async (values: any) => {
        if (!selectedBooking) return;
        try {
            await bookingsService.update(selectedBooking.id, {
                deliveryUrl: values.deliveryUrl,
                status: BookingStatus.COMPLETED
            });
            message.success('Livraison envoyée et réservation marquée comme terminée');
            setIsDeliveryModalOpen(false);
            fetchBookings();
        } catch (error) {
            message.error('Erreur lors de la livraison');
        }
    };

    const columns = [
        {
            title: 'Client',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text: string, record: Booking) => (
                <Space direction="vertical" size={0}>
                    {record.userId ? (
                        <Link to={`/users/${record.userId}`} className="font-black text-gray-950 hover:text-primary-600 transition-colors">
                            {text}
                        </Link>
                    ) : (
                        <span className="font-black text-gray-950">{text}</span>
                    )}
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{record.customerEmail}</div>
                    <div className="text-[10px] font-bold text-gray-500">{record.customerPhone}</div>
                </Space>
            )
        },
        {
            title: 'Service',
            dataIndex: ['serviceOffer', 'title'],
            key: 'service',
        },
        {
            title: 'Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
        },
        {
            title: 'Type / Lieu',
            key: 'type_location',
            render: (_: any, record: Booking) => (
                <Space direction="vertical" size={0}>
                    <Tag color="cyan">{record.eventType || 'N/A'}</Tag>
                    <div className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[150px]">
                        {record.location || 'Non précisé'}
                    </div>
                </Space>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status: BookingStatus) => {
                let color = 'default';
                if (status === BookingStatus.CONFIRMED) color = 'success';
                if (status === BookingStatus.PENDING) color = 'warning';
                if (status === BookingStatus.COMPLETED) color = 'blue';
                if (status === BookingStatus.REJECTED || status === BookingStatus.CANCELLED) color = 'error';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Livraison',
            key: 'delivery',
            render: (_: any, record: Booking) => (
                record.deliveryUrl ? (
                    <a href={record.deliveryUrl} target="_blank" rel="noopener noreferrer">
                        <Tag icon={<LinkOutlined />} color="cyan">Lien</Tag>
                    </a>
                ) : (
                    <span className="text-gray-400 text-xs">Non livré</span>
                )
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Booking) => (
                <Space>
                    <Button 
                        size="small" 
                        icon={<EyeOutlined />} 
                        onClick={() => {
                            setSelectedBooking(record);
                            setIsDetailsModalOpen(true);
                        }}
                    />
                    {record.status === BookingStatus.PENDING && (
                        <>
                            <Popconfirm
                                title="Confirmer le rendez-vous ?"
                                onConfirm={() => handleStatusUpdate(record.id, BookingStatus.CONFIRMED)}
                                okText="Oui"
                                cancelText="Non"
                            >
                                <Button type="primary" size="small" icon={<CheckCircleOutlined />} />
                            </Popconfirm>
                            <Popconfirm
                                title="Refuser le rendez-vous ?"
                                onConfirm={() => handleStatusUpdate(record.id, BookingStatus.REJECTED)}
                                okText="Oui"
                                cancelText="Non"
                                okButtonProps={{ danger: true }}
                            >
                                <Button danger size="small" icon={<CloseCircleOutlined />} />
                            </Popconfirm>
                        </>
                    )}

                    {(record.status === BookingStatus.CONFIRMED || record.status === BookingStatus.COMPLETED) && (
                        <Button
                            size="small"
                            icon={<CloudUploadOutlined />}
                            onClick={() => openDeliveryModal(record)}
                            title="Livrer les fichiers"
                        />
                    )}

                    <Popconfirm
                        title="Supprimer définitivement ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Réservations (Rendez-vous)</h1>
                <Button onClick={fetchBookings}>Actualiser</Button>
            </div>
            <Table
                dataSource={bookings}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Livraison des Fichiers (Photos/Vidéos)"
                open={isDeliveryModalOpen}
                onCancel={() => setIsDeliveryModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleDeliverySubmit}
                >
                    <Form.Item
                        name="deliveryUrl"
                        label="Lien de téléchargement (Google Drive, Dropbox, WeTransfer)"
                        rules={[{ required: true, message: 'Veuillez entrer un lien valide' }, { type: 'url', message: 'URL invalide' }]}
                    >
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-xs text-blue-700">
                        En soumettant ce formulaire, le statut passera automatiquement à <strong>COMPLETED</strong> et le client verra le bouton de téléchargement sur son tableau de bord.
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setIsDeliveryModalOpen(false)}>Annuler</Button>
                        <Button type="primary" htmlType="submit" icon={<CloudUploadOutlined />}>
                            Envoyer la Livraison
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                title="Détails de la Réservation"
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailsModalOpen(false)}>Fermer</Button>
                ]}
                width={600}
            >
                {selectedBooking && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Type d'événement</p>
                                <p className="font-bold text-gray-900">{selectedBooking.eventType || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Durée prévue</p>
                                <p className="font-bold text-gray-900">{selectedBooking.duration || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Lieu / Adresse</p>
                                <p className="font-bold text-gray-900">{selectedBooking.location || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Budget estimé</p>
                                <p className="font-bold text-gray-950 text-lg">{selectedBooking.budget || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-gray-100 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Nombre d'invités</p>
                                <p className="font-bold text-gray-900">{selectedBooking.guests || 'N/A'}</p>
                            </div>
                            <div className="border border-gray-100 p-3 rounded-lg">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Entreprise</p>
                                <p className="font-bold text-gray-900">{selectedBooking.companyName || 'N/A'}</p>
                            </div>
                        </div>

                        {selectedBooking.notes && (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">Notes client</p>
                                <p className="text-sm text-amber-900">{selectedBooking.notes}</p>
                            </div>
                        )}

                        {selectedBooking.dynamicDetails && (
                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Options suppléméntaires</p>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-40">
                                    {JSON.stringify(selectedBooking.dynamicDetails, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

