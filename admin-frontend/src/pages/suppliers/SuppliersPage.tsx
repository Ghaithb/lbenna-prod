import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Modal, Form, Input, Select, message, Statistic } from 'antd';
import { Card } from '@/components/ui/Card';
import { PlusOutlined, ShopOutlined, PhoneOutlined, MailOutlined, ProfileOutlined } from '@ant-design/icons';
import { suppliersService, Supplier } from '../../services/suppliers';

const { TextArea } = Input;

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [data, statsData] = await Promise.all([
                suppliersService.getAll(),
                suppliersService.getStats()
            ]);
            setSuppliers(data);
            setStats(statsData);
        } catch (error) {
            message.error('Erreur lors du chargement des fournisseurs');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Supplier) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await suppliersService.delete(id);
            message.success('Fournisseur supprimé');
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingId) {
                await suppliersService.update(editingId, values);
                message.success('Fournisseur mis à jour');
            } else {
                await suppliersService.create(values);
                message.success('Fournisseur créé');
            }
            setIsModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Supplier) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-xs text-gray-500">{record.taxId}</div>
                </div>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_: any, record: Supplier) => (
                <div className="space-y-1">
                    <div>{record.contactName}</div>
                    {record.email && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MailOutlined /> {record.email}
                        </div>
                    )}
                    {record.phone && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <PhoneOutlined /> {record.phone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => cat ? <Tag color="blue">{cat}</Tag> : '-'
        },
        {
            title: 'Conditions',
            dataIndex: 'paymentTerms',
            key: 'paymentTerms',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Supplier) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Modifier</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>Supprimer</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
                    <p className="text-gray-500">Base de données des fournisseurs et prestataires</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Ajouter un fournisseur
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <Statistic
                        title="Total Fournisseurs"
                        value={stats?.total || 0}
                        prefix={<ShopOutlined />}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Actifs"
                        value={stats?.active || 0}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Commandes d'Achat"
                        value={stats?.purchaseOrders || 0}
                        prefix={<ProfileOutlined />}
                    />
                </Card>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={suppliers}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingId ? "Modifier le fournisseur" : "Nouveau fournisseur"}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="name" label="Raison Sociale" rules={[{ required: true }]}>
                            <Input placeholder="Nom de l'entreprise" />
                        </Form.Item>
                        <Form.Item name="taxId" label="Matricule Fiscal / ID">
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="contactName" label="Nom du contact">
                            <Input />
                        </Form.Item>
                        <Form.Item name="category" label="Catégorie">
                            <Select options={[
                                { value: 'Matières Premières', label: 'Matières Premières' },
                                { value: 'Équipement', label: 'Équipement' },
                                { value: 'Transport', label: 'Transport' },
                                { value: 'Services', label: 'Services' },
                                { value: 'Autre', label: 'Autre' },
                            ]} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Téléphone">
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item name="address" label="Adresse">
                        <Input />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="paymentTerms" label="Conditions de paiement">
                            <Input placeholder="Ex: 30 jours, Comptant" />
                        </Form.Item>
                        <Form.Item name="isActive" label="Statut" initialValue={true}>
                            <Select options={[
                                { value: true, label: 'Actif' },
                                { value: false, label: 'Inactif' },
                            ]} />
                        </Form.Item>
                    </div>

                    <Form.Item name="notes" label="Notes internes">
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
