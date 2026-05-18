import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Button, Popconfirm, message, Modal, Form, Input,
    InputNumber, Switch, Tag, Select, DatePicker, Tabs, Divider
} from 'antd';
import type { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import { serviceOffersService, ServiceOffer } from '@/services/serviceOffers';
import { EditOutlined, DeleteOutlined, PlusOutlined, UnorderedListOutlined, GiftOutlined, AppstoreOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { categoryService, Category } from '@/services/categories';
import dayjs from 'dayjs';

export default function ServiceOffersPage() {
    const [offers, setOffers] = useState<ServiceOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<ServiceOffer | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await serviceOffersService.getAll();
            setOffers(data);
        } catch {
            message.error('Erreur chargement offres');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch {
            console.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchOffers();
        fetchCategories();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                features: values.features || [],
                promoExpiresAt: values.promoExpiresAt ? values.promoExpiresAt.toISOString() : undefined
            };

            if (editingOffer) {
                await serviceOffersService.update(editingOffer.id, formattedValues);
                message.success('Offre mise à jour !');
            } else {
                await serviceOffersService.create(formattedValues);
                message.success('Offre créée !');
            }
            setIsModalOpen(false);
            setEditingOffer(null);
            form.resetFields();
            fetchOffers();
        } catch {
            message.error('Erreur sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await serviceOffersService.delete(id);
            message.success('Offre supprimée');
            fetchOffers();
        } catch {
            message.error('Erreur suppression');
        }
    };

    const openCreateModal = (isPack = false) => {
        setEditingOffer(null);
        form.resetFields();
        form.setFieldsValue({ isPack, isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (record: ServiceOffer) => {
        setEditingOffer(record);
        form.setFieldsValue({
            ...record,
            features: record.features || [],
            promoExpiresAt: record.promoExpiresAt ? dayjs(record.promoExpiresAt) : null
        });
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: ServiceOffer) => (
                <div>
                    <div className="font-semibold">{text}</div>
                    {record.features && record.features.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">{record.features.length} fonctionnalités</div>
                    )}
                </div>
            )
        },
        {
            title: 'Badges',
            key: 'badges',
            render: (_: any, record: ServiceOffer) => (
                <div className="flex flex-wrap gap-1">
                    {record.badge && <Tag color="gold">{record.badge}</Tag>}
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
            key: 'price',
            render: (_: any, record: ServiceOffer) => {
                if (!record.price) return <span className="text-gray-400">Sur Devis</span>;
                if (record.isPromo && record.promoPrice) return (
                    <div>
                        <span className="line-through text-gray-400 text-xs mr-1">{record.price} TND</span>
                        <span className="text-red-500 font-bold">{record.promoPrice} TND</span>
                    </div>
                );
                return <span className="font-semibold">{record.price.toFixed(2)} TND</span>;
            }
        },
        {
            title: 'Actif',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => <Tag color={active ? 'green' : 'default'}>{active ? 'Actif' : 'Inactif'}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ServiceOffer) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    const filteredOffers = activeTab === 'packs'
        ? offers.filter((o: ServiceOffer) => o.isPack)
        : activeTab === 'services'
        ? offers.filter((o: ServiceOffer) => !o.isPack)
        : offers;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Offres & Packs de Services</h1>
                    <p className="text-gray-500 text-sm">Gérez vos prestations et forfaits (Packs).</p>
                </div>
                <div className="flex gap-3">
                    <Button icon={<UnorderedListOutlined />} onClick={() => navigate('/services/categories')}>
                        Catégories
                    </Button>
                    <Button icon={<AppstoreOutlined />} onClick={() => openCreateModal(false)}>
                        Nouvelle Offre
                    </Button>
                    <Button type="primary" icon={<GiftOutlined />} onClick={() => openCreateModal(true)}>
                        Nouveau Pack
                    </Button>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'all', label: `Tout (${offers.length})` },
                    { key: 'packs', label: `🎁 Packs (${offers.filter((o: ServiceOffer) => o.isPack).length})` },
                    { key: 'services', label: `🎬 Services (${offers.filter((o: ServiceOffer) => !o.isPack).length})` },
                ]}
            />

            <Table
                dataSource={filteredOffers}
                columns={columns}
                rowKey="id"
                loading={loading}
                rowClassName={(record: ServiceOffer) => record.isPack ? 'bg-purple-50' : ''}
            />

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {form.getFieldValue('isPack') ? <GiftOutlined className="text-purple-500" /> : <AppstoreOutlined />}
                        <span>{editingOffer ? 'Modifier' : 'Créer'} {form.getFieldValue('isPack') ? 'un Pack' : 'une Offre'}</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); setEditingOffer(null); form.resetFields(); }}
                onOk={() => form.submit()}
                okText="Sauvegarder"
                cancelText="Annuler"
                destroyOnHidden
                width={640}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    {/* Hidden isPack field */}
                    <Form.Item name="isPack" valuePropName="checked" hidden>
                        <Switch />
                    </Form.Item>

                    <Divider orientation="left" plain>Informations principales</Divider>
                    <Form.Item name="title" label="Titre du Pack / Offre" rules={[{ required: true, message: 'Le titre est requis' }]}>
                        <Input placeholder="Ex: Pack Mariage Prestige, Pack Reportage..." />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Décrivez ce que comprend cette offre ou ce pack..." />
                    </Form.Item>
                    <Form.Item name="badge" label="Badge Marketing">
                        <Input placeholder="Ex: Populaire, Meilleure vente, Nouveau..." />
                    </Form.Item>

                    <Divider orientation="left" plain>Catégorie & Paramètres</Divider>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="categoryId" label="Catégorie">
                            <Select
                                placeholder="Sélectionner..."
                                options={categories.map((c: Category) => ({ label: c.name, value: c.id }))}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item name="duration" label="Durée (minutes)">
                            <InputNumber style={{ width: '100%' }} placeholder="Ex: 120" min={0} />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="isActive" label="Actif" valuePropName="checked" initialValue={true}>
                            <Switch checkedChildren="Publié" unCheckedChildren="Caché" />
                        </Form.Item>
                        <Form.Item name="isPromo" label="En Promotion" valuePropName="checked">
                            <Switch checkedChildren="Promo activée" unCheckedChildren="Prix normal" />
                        </Form.Item>
                    </div>

                    <Divider orientation="left" plain>Tarification</Divider>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="price" label="Prix normal (TND)">
                            <InputNumber style={{ width: '100%' }} placeholder="Laisser vide = Sur Devis" min={0} />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prev, cur) => prev.isPromo !== cur.isPromo}
                        >
                            {({ getFieldValue }: { getFieldValue: (n: string) => any }) =>
                                getFieldValue('isPromo') ? (
                                    <Form.Item name="promoPrice" label="Prix Promotionnel (TND)" rules={[{ required: true, message: 'Requis si promo activée' }]}>
                                        <InputNumber style={{ width: '100%' }} min={0} />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>
                    </div>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) => prev.isPromo !== cur.isPromo}
                    >
                        {({ getFieldValue }: { getFieldValue: (n: string) => any }) =>
                            getFieldValue('isPromo') ? (
                                <Form.Item name="promoExpiresAt" label="Date fin de promo">
                                    <DatePicker style={{ width: '100%' }} showTime format="DD/MM/YYYY HH:mm" />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>

                    <Divider orientation="left" plain>🎁 Fonctionnalités incluses</Divider>
                    <p className="text-gray-400 text-xs mb-3">Ajoutez les éléments inclus dans l'offre ou le pack (affichés sur le site).</p>
                    <Form.List name="features">
                        {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                            <div className="space-y-2">
                                {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                                    <div key={key} className="flex gap-2 items-center">
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            rules={[{ required: true, message: 'Entrez la fonctionnalité ou supprimez-la' }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input placeholder="Ex: Shooting 4h, 200 photos retouchées, Album photo..." />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            className="text-red-400 hover:text-red-600 cursor-pointer text-lg flex-shrink-0"
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Ajouter une fonctionnalité
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
}
