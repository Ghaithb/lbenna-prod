import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Tag } from 'antd';
import { categoryService, Category } from '@/services/categories';
import { EditOutlined, DeleteOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            message.error('Erreur chargement des catégories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (values: any) => {
        try {
            // Handle parentId: convert empty string to null
            const formattedValues = {
                ...values,
                parentId: values.parentId === '' ? null : values.parentId
            };

            if (editingCategory) {
                await categoryService.update(editingCategory.id, formattedValues);
                message.success('Catégorie mise à jour');
            } else {
                await categoryService.create(formattedValues);
                message.success('Catégorie créée');
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            form.resetFields();
            fetchCategories();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await categoryService.delete(id);
            message.success('Catégorie supprimée');
            fetchCategories();
        } catch (error) {
            message.error('Erreur lors de la suppression (Vérifiez si elle contient des sous-catégories, des offres ou des projets)');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: any) => (
                <div className="flex items-center">
                    {record.icon && <span className="mr-2">{record.icon}</span>}
                    <span className="font-medium">{name}</span>
                </div>
            )
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (slug: string) => <Tag color="blue">{slug}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Compteur',
            key: 'counts',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Tag color="cyan">Offres: {record._count?.serviceOffers || 0}</Tag>
                    <Tag color="geekblue">Portfolio: {record._count?.portfolioItems || 0}</Tag>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Category) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingCategory(record);
                            form.setFieldsValue({
                                ...record,
                                parentId: record.parentId || undefined
                            });
                            setIsModalOpen(true);
                        }}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm 
                        title="Voulez-vous vraiment supprimer cette catégorie ?" 
                        description="Assurez-vous qu'elle n'est pas utilisée ailleurs."
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <UnorderedListOutlined className="text-2xl text-blue-600" />
                    <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingCategory(null);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>Nouvelle Catégorie</Button>
            </div>

            <Table 
                dataSource={categories} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item 
                        name="name" 
                        label="Nom de la catégorie" 
                        rules={[{ required: true, message: 'Le nom est obligatoire' }]}
                    >
                        <Input placeholder="Ex: Photographie de Mariage, Drone..." />
                    </Form.Item>

                    <Form.Item name="description" label="Description (Optionnelle)">
                        <Input.TextArea placeholder="Décrivez en quelques mots ce que contient cette catégorie" />
                    </Form.Item>

                    <Form.Item 
                        name="slug" 
                        label="Lien (Slug)" 
                        help="Laissez vide pour le générer automatiquement à partir du nom"
                    >
                        <Input placeholder="ex: photographie-mariage" />
                    </Form.Item>

                    <Form.Item name="parentId" label="Catégorie Parente">
                        <Select
                            placeholder="Sélectionner une catégorie parente (facultatif)"
                            allowClear
                            options={categories
                                .filter((c: Category) => !editingCategory || c.id !== editingCategory.id)
                                .map((c: Category) => ({ label: c.name, value: c.id }))
                            }
                        />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="icon" label="Emoji / Icône">
                            <Input placeholder="Ex: 📸, 🚁" />
                        </Form.Item>
                        <Form.Item name="color" label="Couleur (Code Hex)">
                            <Input placeholder="Ex: #1890ff" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
