import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Tag, Select, DatePicker } from 'antd';
import { serviceOffersService, ServiceOffer } from '@/services/serviceOffers';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { categoryService, Category } from '@/services/categories';
import dayjs from 'dayjs';

export default function ServiceOffersPage() {
    const [offers, setOffers] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<ServiceOffer | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await serviceOffersService.getAll();
            setOffers(data);
        } catch (error) {
            message.error('Erreur chargement offres');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleSave = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                promoExpiresAt: values.promoExpiresAt ? values.promoExpiresAt.toISOString() : undefined
            };

            if (editingOffer) {
                await serviceOffersService.update(editingOffer.id, formattedValues);
                message.success('Offre mise à jour');
            } else {
                await serviceOffersService.create(formattedValues);
                message.success('Offre créée');
            }
            setIsModalOpen(false);
            setEditingOffer(null);
            form.resetFields();
            fetchOffers();
        } catch (error) {
            message.error('Erreur sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await serviceOffersService.delete(id);
            message.success('Offre supprimée');
            fetchOffers();
        } catch (error) {
            message.error('Erreur suppression');
        }
    };

    const columns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Badge',
            dataIndex: 'badge',
            key: 'badge',
            render: (badge: string, record: ServiceOffer) => (
                <div className="flex flex-wrap gap-1">
                    {badge && <Tag color="gold">{badge}</Tag>}
                    {record.isPromo && <Tag color="red">PROMO</Tag>}
                    {record.isPack && <Tag color="purple">PACK</Tag>}
                </div>
            )
        },
        {
            title: 'Catégorie',
            dataIndex: ['category', 'name'],
            key: 'category',
            render: (name: string) => name || <Tag>Non classé</Tag>
        },
        {
            title: 'Prix (TND)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => price ? `${price.toFixed(2)} TND` : 'Sur Devis',
        },
        {
            title: 'Durée (min)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Actif',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => active ? 'Oui' : 'Non',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ServiceOffer) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingOffer(record);
                            form.setFieldsValue({
                                ...record,
                                features: record.features || [],
                                promoExpiresAt: record.promoExpiresAt ? dayjs(record.promoExpiresAt) : null
                            });
                            setIsModalOpen(true);
                        }}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ];


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Offres de Services (Drone, Photobooth...)</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingOffer(null);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>Nouvelle Offre</Button>
            </div>

            <Table dataSource={offers} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title={editingOffer ? "Modifier l'offre" : "Nouvelle Offre"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="price" label="Prix (Laisser vide pour Devis)">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="duration" label="Durée (minutes)">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="isActive" label="Actif" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="categoryId" label="Catégorie">
                        <Select
                            placeholder="Sélectionner une catégorie"
                            options={categories.map((c: Category) => ({ label: c.name, value: c.id }))}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name="badge" label="Badge Marketing (ex: Populaire, Promo)">
                        <Input placeholder="Laissez vide si aucun" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="isPromo" label="En Promotion" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="isPack" label="Est un Pack" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.isPromo !== currentValues.isPromo}
                    >
                        {({ getFieldValue }: { getFieldValue: (name: string) => any }) =>
                            getFieldValue('isPromo') ? (
                                <>
                                    <Form.Item name="promoPrice" label="Prix Promotionnel (TND)" rules={[{ required: true, message: 'Requis si promo activée' }]}>
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item name="promoExpiresAt" label="Date de fin de promo">
                                        <DatePicker style={{ width: '100%' }} showTime format="DD/MM/YYYY HH:mm" />
                                    </Form.Item>
                                </>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item name="features" label="Points Forts / Caractéristiques">
                        <Select 
                            mode="tags" 
                            style={{ width: '100%' }} 
                            placeholder="Tapez un texte et appuyez sur 'Entrée' pour ajouter" 
                            tokenSeparators={[',', ';']}
                        />
                    </Form.Item>
                </Form>

            </Modal>
        </div>
    );
}

