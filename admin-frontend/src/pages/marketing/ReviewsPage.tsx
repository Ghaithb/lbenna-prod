import { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Space, Modal, Form, Input, Rate, Switch } from 'antd';
import { reviewsService, Review } from '../../services/reviews';
import { format } from 'date-fns';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [form] = Form.useForm();

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewsService.getAll();
            setReviews(data);
        } catch (error) {
            message.error('Erreur lors du chargement des avis');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleToggleActive = async (record: Review) => {
        try {
            await reviewsService.update(record.id, { isActive: !record.isActive });
            message.success('Statut mis à jour');
            fetchReviews();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await reviewsService.delete(id);
            message.success('Avis supprimé');
            fetchReviews();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingReview) {
                await reviewsService.update(editingReview.id, values);
                message.success('Avis mis à jour');
            } else {
                await reviewsService.create(values);
                message.success('Avis créé');
            }
            setIsModalOpen(false);
            fetchReviews();
        } catch (error) {
            message.error('Erreur lors de l\'enregistrement');
        }
    };

    const columns = [
        {
            title: 'Client',
            dataIndex: 'user',
            key: 'user',
            render: (text: string, record: Review) => (
                <Space direction="vertical" size={0}>
                    <span className="font-bold text-gray-900">{text}</span>
                    {record.verified && <Tag color="green" className="text-[10px]">Vérifié</Tag>}
                </Space>
            )
        },
        {
            title: 'Note',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />,
        },
        {
            title: 'Commentaire',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: 'Statut',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean, record: Review) => (
                <Switch 
                    checked={isActive} 
                    onChange={() => handleToggleActive(record)}
                    checkedChildren="Actif"
                    unCheckedChildren="Masqué"
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Review) => (
                <Space>
                    <Button 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingReview(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Supprimer cet avis ?"
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
                <div>
                    <h1 className="text-2xl font-bold">Avis Clients</h1>
                    <p className="text-gray-500">Gérez les témoignages affichés sur la page d'accueil.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                        setEditingReview(null);
                        form.resetFields();
                        form.setFieldsValue({ rating: 5, isActive: true, verified: true });
                        setIsModalOpen(true);
                    }}
                >
                    Ajouter un avis
                </Button>
            </div>

            <Table
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={editingReview ? "Modifier l'avis" : "Ajouter un avis"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Enregistrer"
                cancelText="Annuler"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="user"
                        label="Nom du client"
                        rules={[{ required: true, message: 'Requis' }]}
                    >
                        <Input placeholder="Ex: Sonia B." />
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Note"
                        rules={[{ required: true }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Commentaire"
                        rules={[{ required: true, message: 'Requis' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Texte de l'avis..." />
                    </Form.Item>

                    <div className="flex gap-8 mt-4">
                        <Form.Item
                            name="isActive"
                            label="Afficher sur le site"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            name="verified"
                            label="Badge vérifié"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
