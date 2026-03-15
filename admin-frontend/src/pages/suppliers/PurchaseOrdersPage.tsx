import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Typography, Badge } from 'antd';
import { Card } from '@/components/ui/Card';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, SendOutlined } from '@ant-design/icons';
import { purchaseOrdersService, PurchaseOrder, PurchaseOrderStatus } from '../../services/purchaseOrders';
import { suppliersService, Supplier } from '../../services/suppliers';
import { format } from 'date-fns';

const { Title, Text } = Typography;

export default function PurchaseOrdersPage() {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersData, suppliersData] = await Promise.all([
                purchaseOrdersService.getAll(),
                suppliersService.getAll()
            ]);
            setOrders(ordersData);
            setSuppliers(suppliersData);
        } catch (error) {
            message.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            await purchaseOrdersService.create(values);
            message.success('Bon de commande créé');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la création');
        }
    };

    const handleUpdateStatus = async (id: string, status: PurchaseOrderStatus) => {
        try {
            await purchaseOrdersService.updateStatus(id, status);
            message.success('Statut mis à jour');
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const columns = [
        {
            title: 'N° Commande',
            dataIndex: 'poNumber',
            key: 'poNumber',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Fournisseur',
            dataIndex: ['supplier', 'name'],
            key: 'supplier',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => <Text strong>{amount.toFixed(2)} TND</Text>
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status: PurchaseOrderStatus) => {
                const colors: Record<PurchaseOrderStatus, string> = {
                    DRAFT: 'default',
                    ORDERED: 'processing',
                    RECEIVED_PARTIAL: 'warning',
                    RECEIVED_FULL: 'success',
                    CANCELLED: 'error'
                };
                return <Tag color={colors[status]}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PurchaseOrder) => (
                <Space>
                    {record.status === 'DRAFT' && (
                        <Button type="link" icon={<SendOutlined />} onClick={() => handleUpdateStatus(record.id, 'ORDERED')}>Commander</Button>
                    )}
                    {record.status === 'ORDERED' && (
                        <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleUpdateStatus(record.id, 'RECEIVED_FULL')}>Réceptionner</Button>
                    )}
                    {record.status !== 'CANCELLED' && record.status !== 'RECEIVED_FULL' && (
                        <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleUpdateStatus(record.id, 'CANCELLED')}>Annuler</Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2}>Bons de Commande (Fournisseurs)</Title>
                    <Text type="secondary">Gérez vos approvisionnements et réceptions de stock</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                    Nouveau Bon de Commande
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    expandable={{
                        expandedRowRender: (record: PurchaseOrder) => (
                            <Table
                                columns={[
                                    { title: 'Description', dataIndex: 'description', key: 'description' },
                                    { title: 'SKU/Ref', dataIndex: 'sku', key: 'sku' },
                                    { title: 'Quantité', dataIndex: 'quantity', key: 'quantity' },
                                    { title: 'Prix Unitaire', dataIndex: 'unitPrice', key: 'unitPrice', render: (val: number) => `${val.toFixed(2)} TND` },
                                    { title: 'Total', dataIndex: 'totalPrice', key: 'totalPrice', render: (val: number) => `${val.toFixed(2)} TND` },
                                ]}
                                dataSource={record.items}
                                pagination={false}
                                rowKey="id"
                                size="small"
                            />
                        )
                    }}
                />
            </Card>

            <Modal
                title="Créer un Bon de Commande"
                open={isCreateModalVisible}
                onOk={handleCreate}
                onCancel={() => setIsCreateModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="supplierId" label="Fournisseur" rules={[{ required: true }]}>
                        <Select
                            placeholder="Sélectionner un fournisseur"
                            options={suppliers.map((s: Supplier) => ({ label: s.name, value: s.id }))}
                        />
                    </Form.Item>

                    <Form.List name="items">
                        {(fields: any[], { add, remove }: { add: any, remove: any }) => (
                            <>
                                {fields.map(({ key, name, ...restField }: { key: number, name: number }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            rules={[{ required: true, message: 'Requis' }]}
                                        >
                                            <Input placeholder="Description" style={{ width: 250 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'sku']}
                                        >
                                            <Input placeholder="SKU (Lien stock)" style={{ width: 120 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'Requis' }]}
                                        >
                                            <InputNumber placeholder="Qté" min={1} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'unitPrice']}
                                            rules={[{ required: true, message: 'Requis' }]}
                                        >
                                            <InputNumber placeholder="Prix U." min={0} step={0.01} />
                                        </Form.Item>
                                        <Badge count={<CloseCircleOutlined style={{ color: '#f5222d', cursor: 'pointer' }} onClick={() => remove(name)} />} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Ajouter un article
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item name="notes" label="Notes">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
