import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Switch, DatePicker, Tag, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { portfolioService, PortfolioItem } from '../../services/portfolio';
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([]);
    const [videoFileList, setVideoFileList] = useState<UploadFile[]>([]);
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
            const formData = new FormData();
            
            // Only send fields that exist in the backend DTO (forbidNonWhitelisted: true is active)
            const allowedFields = ['title', 'description', 'category', 'categoryId', 'coverUrl', 'galleryUrls', 'videoUrl', 'eventDate', 'isActive'];
            
            allowedFields.forEach(key => {
                const val = values[key];
                if (key === 'eventDate' && val) {
                    formData.append(key, val.toISOString());
                } else if (key === 'galleryUrls' && val) {
                    const urls = (val as string).split('\n').filter((u: string) => u.trim());
                    urls.forEach((url: string) => formData.append('galleryUrls', url));
                } else if (val !== undefined && val !== null && val !== '') {
                    formData.append(key, String(val));
                }
            });

            // Add the file if selected
            if (fileList.length > 0) {
                formData.append('file', fileList[0].originFileObj as Blob);
            }

            // Add gallery files if selected
            if (galleryFileList.length > 0) {
                galleryFileList.forEach((file: UploadFile) => {
                    if (file.originFileObj) {
                        formData.append('gallery', file.originFileObj as Blob);
                    }
                });
            }

            // Add video file if selected
            if (videoFileList.length > 0 && videoFileList[0].originFileObj) {
                formData.append('video', videoFileList[0].originFileObj as Blob);
            }

            if (editingItem) {
                await portfolioService.update(editingItem.id, formData as any);
                message.success('Projet mis à jour');
            } else {
                await portfolioService.create(formData as any);
                message.success('Projet créé');
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFileList([]);
            setGalleryFileList([]);
            setVideoFileList([]);
            form.resetFields();
            fetchItems();
        } catch (error: any) {
            const detail = error?.response?.data?.message;
            const msg = Array.isArray(detail) ? detail.join(' | ') : (detail || error.message || 'Erreur inconnue');
            console.error('[PORTFOLIO 400 DETAIL]', error?.response?.data);
            message.error(`Erreur: ${msg}`, 6);
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
                            setFileList([]); // Clear file list when editing
                            setGalleryFileList([]); // Clear gallery file list when editing
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
                        setFileList([]);
                        setGalleryFileList([]);
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
                    
                    <Form.Item label="Image de Couverture">
                        <Form.Item name="coverUrl" noStyle>
                            <Input
                                placeholder="URL de l'image (https://...)"
                                disabled={fileList.length > 0}
                                style={{ marginBottom: 8 }}
                            />
                        </Form.Item>
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            onChange={({ fileList }: any) => setFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            {fileList.length === 0 && (
                                <Button icon={<CloudUploadOutlined />}>Choisir depuis mon bureau</Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Médias (Photos & Vidéo)">
                        <Form.Item name="galleryUrls" noStyle>
                            <Input.TextArea
                                rows={2}
                                placeholder="URLs des photos (un par ligne, ex: https://...)"
                                style={{ marginBottom: 8 }}
                            />
                        </Form.Item>
                        <Upload
                            listType="picture-card"
                            multiple
                            accept="image/*"
                            fileList={galleryFileList}
                            onChange={({ fileList }: any) => setGalleryFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            <div className="flex flex-col items-center">
                                <PlusOutlined />
                                <div style={{ marginTop: 4, fontSize: 11 }}>Photo</div>
                            </div>
                        </Upload>
                        <div style={{ marginTop: 12, marginBottom: 4, fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 2 }}>— Vidéo —</div>
                        <Form.Item name="videoUrl" noStyle>
                            <Input
                                placeholder="URL Vidéo (YouTube/Vimeo — laisser vide si upload)"
                                disabled={videoFileList.length > 0}
                                style={{ marginBottom: 8 }}
                            />
                        </Form.Item>
                        <Upload
                            accept="video/*"
                            maxCount={1}
                            fileList={videoFileList}
                            onChange={({ fileList }: any) => setVideoFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            {videoFileList.length === 0 && (
                                <Button icon={<CloudUploadOutlined />}>Uploader une vidéo depuis mon bureau</Button>
                            )}
                        </Upload>
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
