import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Switch, message, Tag, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SoundOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { announcementsService, Announcement } from '../../services/announcements';
import { PageHeader } from '@/components/PageHeader';

export default function AnnouncementsPage() {
    const [data, setData] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await announcementsService.getAll();
            setData(res);
        } catch (error) {
            message.error("Erreur lors du chargement des annonces");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        // Default values
        form.setFieldsValue({
            isActive: true,
            priority: 0,
            startDate: dayjs(),
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record: Announcement) => {
        setEditingItem(record);
        form.setFieldsValue({
            ...record,
            startDate: record.startDate ? dayjs(record.startDate) : null,
            endDate: record.endDate ? dayjs(record.endDate) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await announcementsService.delete(id);
            message.success("Annonce supprimée");
            loadData();
        } catch (error) {
            message.error("Erreur lors de la suppression");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : undefined,
                endDate: values.endDate ? values.endDate.toISOString() : undefined,
            };

            if (editingItem) {
                await announcementsService.update(editingItem.id, payload);
                message.success("Annonce mise à jour");
            } else {
                await announcementsService.create(payload);
                message.success("Annonce créée");
            }
            setIsModalVisible(false);
            loadData();
        } catch (error) {
            // Form validation error
        }
    };

    const columns = [
        {
            title: 'Priorité',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
            sorter: (a: Announcement, b: Announcement) => b.priority - a.priority,
        },
        {
            title: 'Message',
            dataIndex: 'text',
            key: 'text',
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: 'Code Promo',
            dataIndex: 'code',
            key: 'code',
            render: (code?: string) => code ? <Tag color="green">{code}</Tag> : '-'
        },
        {
            title: 'Lien',
            dataIndex: 'link',
            key: 'link',
        },
        {
            title: 'Dates',
            key: 'dates',
            render: (_: any, record: Announcement) => (
                <div className="text-xs">
                    <div>Du: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
                    {record.endDate && <div>Au: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>}
                </div>
            )
        },
        {
            title: 'Statut',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'blue' : 'default'}>
                    {isActive ? 'Actif' : 'Inactif'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Announcement) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Supprimer cette annonce ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <PageHeader
                title="Gestion des Annonces"
                subtitle="Bannières promo et offres flash"
                icon={<SoundOutlined />}
                action={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Nouvelle annonce
                    </Button>
                }
            />

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingItem ? "Modifier l'annonce" : "Nouvelle annonce"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="text"
                        label="Message de l'annonce"
                        rules={[{ required: true, message: 'Veuillez saisir le message' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Ex: -30% sur tous les albums..." />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="code" label="Code Promo (Optionnel)">
                            <Input placeholder="Ex: SOLDES2024" />
                        </Form.Item>
                        <Form.Item name="link" label="Lien de redirection">
                            <Input placeholder="/catalog" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="startDate" label="Date de début">
                            <DatePicker className="w-full" showTime />
                        </Form.Item>
                        <Form.Item name="endDate" label="Date de fin">
                            <DatePicker className="w-full" showTime />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="priority" label="Priorité">
                            <InputNumber className="w-full" min={0} max={100} />
                        </Form.Item>
                        <Form.Item name="isActive" label="Actif" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
