import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Switch, DatePicker, Tag } from 'antd';
import { portfolioService, PortfolioItem, CreatePortfolioItemDto } from '../../services/portfolio';
import { EditOutlined, DeleteOutlined, PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { categoryService, Category } from '../../services/categories';
import BulkUploadModal from '../../components/common/BulkUploadModal';

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form] = Form.useForm();

    const handleBulkSuccess = (urls: string[]) => {
        const currentUrls = form.getFieldValue('galleryUrls') || '';
        const newUrls = currentUrls + (currentUrls ? '\n' : '') + urls.join('\n');
        form.setFieldsValue({ galleryUrls: newUrls });
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await portfolioService.getAll();
            setItems(data);
        } catch (error) {
            message.error('Erreur chargement portfolio');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to categories');
        }
    };

    const handleSave = async (values: any) => {
        try {
            const formattedValues: CreatePortfolioItemDto = {
                ...values,
                eventDate: values.eventDate ? values.eventDate.toISOString() : undefined,
                galleryUrls: values.galleryUrls ? values.galleryUrls.split('\n').filter((u: string) => u.trim()) : [],
            };

            if (editingItem) {
                await portfolioService.update(editingItem.id, formattedValues);
                message.success('Projet mis à jour');
            } else {
                await portfolioService.create(formattedValues);
                message.success('Projet créé');
            }
            setIsModalOpen(false);
            setEditingItem(null);
            form.resetFields();
            fetchItems();
        } catch (error) {
            message.error('Erreur sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await portfolioService.delete(id);
            message.success('Projet supprimé');
            fetchItems();
        } catch (error) {
            message.error('Erreur suppression');
        }
    };

    const columns = [
        {
            title: 'Aperçu',
            dataIndex: 'coverUrl',
            key: 'cover',
            width: 100,
            render: (url: string) => (
                <div className="w-[80px] h-[60px] overflow-hidden rounded-lg shadow-sm border border-gray-100">
                    <img
                        src={url?.startsWith('http') ? url : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${url}`}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        },
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Catégorie',
            dataIndex: ['category', 'name'],
            key: 'category',
            render: (_: any, record: PortfolioItem) => {
                if (typeof record.category === 'object' && record.category?.name) {
                    return record.category.name;
                }
                return record.category || <Tag>Non classé</Tag>;
            }
        },
        {
            title: 'Date',
            dataIndex: 'eventDate',
            key: 'date',
            render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
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
            render: (_: any, record: PortfolioItem) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingItem(record);
                            form.setFieldsValue({
                                ...record,
                                eventDate: record.eventDate ? dayjs(record.eventDate) : undefined,
                                galleryUrls: record.galleryUrls ? record.galleryUrls.join('\n') : '',
                            });
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gestion Portfolio</h1>
                    <p className="text-gray-500 text-sm">Créez et organisez vos réalisations.</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => setIsBulkModalOpen(true)}
                        className="rounded-xl font-bold"
                    >
                        Import en Masse
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setEditingItem(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }} className="bg-gray-950 hover:bg-primary-600 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px]">
                        Nouveau Projet
                    </Button>
                </div>
            </div>

            <Table dataSource={items} columns={columns} rowKey="id" loading={loading} />

            <BulkUploadModal
                open={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onUploadSuccess={handleBulkSuccess}
                title="Ajouter à la Galerie"
            />

            <Modal
                title={editingItem ? "Modifier le Projet" : "Nouveau Projet"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="categoryId" label="Catégorie CMS" rules={[{ required: true }]}>
                        <Select options={categories.map((c: Category) => ({ label: c.name, value: c.id }))} />
                    </Form.Item>
                    <Form.Item name="category" label="Tag Legacy (Texte)">
                        <Input placeholder="ex: WEDDING" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="coverUrl" label="URL Image de Couverture" rules={[{ required: true, type: 'url' }]}>
                        <Input placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="galleryUrls" label="URLs Galerie (une par ligne)">
                        <Input.TextArea rows={4} placeholder="https://...\nhttps://..." />
                    </Form.Item>
                    <Form.Item name="videoUrl" label="URL Vidéo (Youtube/Vimeo)">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="eventDate" label="Date de l'événement">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="isActive" label="Actif" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
