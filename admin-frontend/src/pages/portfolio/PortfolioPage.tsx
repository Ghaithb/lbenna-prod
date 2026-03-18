import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select, Switch, DatePicker, Tag, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { portfolioService, PortfolioItem } from '../../services/portfolio';
import { EditOutlined, DeleteOutlined, PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Play } from 'lucide-react';
import dayjs from 'dayjs';
import { categoryService, Category } from '../../services/categories';

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();

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
            
            // Basic fields
            const fields = ['title', 'description', 'categoryId', 'category', 'eventDate', 'isActive'];
            fields.forEach(key => {
                const val = values[key];
                if (key === 'eventDate' && val) {
                    formData.append(key, val.toISOString());
                } else if (val !== undefined && val !== null && val !== '') {
                    formData.append(key, String(val));
                }
            });

            // Handle single file (image or video)
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const file = fileList[0].originFileObj;
                if (file.type.startsWith('video/')) {
                    formData.append('video', file);
                } else {
                    formData.append('file', file);
                }
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
            form.resetFields();
            fetchItems();
        } catch (error: any) {
            const data = error?.response?.data;
            console.error('[PORTFOLIO ERROR]', data);
            message.error(data?.message || 'Erreur lors de l\'enregistrement');
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
            render: (url: string, record: PortfolioItem) => {
                const finalUrl = url?.startsWith('http') ? url : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${url}`;
                
                if (record.videoUrl && !url) {
                    return <div className="w-[80px] h-[60px] bg-blue-50 flex items-center justify-center rounded-lg border border-blue-100"><Play size={20} className="text-blue-500" /></div>;
                }

                if (!url) return <div className="w-[80px] h-[60px] bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-lg">VIDE</div>;
                
                return (
                    <div className="w-[80px] h-[60px] overflow-hidden rounded-lg shadow-sm border border-gray-100">
                        <img
                            src={finalUrl}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            }
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
            title: 'Fichier',
            key: 'type',
            render: (_: any, record: PortfolioItem) => (
                record.videoUrl ? <Tag color="blue">VIDÉO</Tag> : <Tag color="green">PHOTO</Tag>
            )
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
                            setFileList([]); 
                            form.setFieldsValue({
                                ...record,
                                eventDate: record.eventDate ? dayjs(record.eventDate) : undefined,
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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio</h1>
                    <p className="text-gray-500 text-sm">Gérez vos photos et vidéos simplement.</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingItem(null);
                    setFileList([]);
                    form.resetFields();
                    setIsModalOpen(true);
                }} className="bg-gray-950 hover:bg-gray-800 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] h-11 border-none">
                    Ajouter un média
                </Button>
            </div>

            <Table dataSource={items} columns={columns} rowKey="id" loading={loading} className="border border-gray-100 rounded-2xl overflow-hidden" />

            <Modal
                title={<span className="text-lg font-black uppercase tracking-tight">{editingItem ? "Modifier le Projet" : "Nouveau Projet"}</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={500}
                centered
                okText="Enregistrer"
                cancelText="Annuler"
                okButtonProps={{ className: "bg-gray-950 hover:bg-gray-800 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-none" }}
                cancelButtonProps={{ className: "rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-gray-200" }}
            >
                <Form form={form} layout="vertical" onFinish={handleSave} className="mt-6">
                    <Form.Item name="title" label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titre du Projet</span>} rules={[{ required: true }]}>
                        <Input placeholder="Nom du projet..." className="rounded-xl h-12 border-gray-100" />
                    </Form.Item>

                    <Form.Item name="categoryId" label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</span>} rules={[{ required: true }]}>
                        <Select 
                            options={categories.map((c: Category) => ({ label: c.name, value: c.id }))} 
                            placeholder="Choisir une catégorie..."
                            className="rounded-xl h-12 border-gray-100"
                        />
                    </Form.Item>

                    <Form.Item label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fichier (Photo ou Vidéo)</span>}>
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            accept="image/*,video/*"
                            onChange={({ fileList }: any) => setFileList(fileList)}
                            beforeUpload={() => false}
                            className="w-full"
                        >
                            {fileList.length === 0 && (
                                <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-gray-300 transition-colors w-full bg-gray-50/50 cursor-pointer">
                                    <CloudUploadOutlined className="text-3xl text-gray-300 mb-2" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Cliquez ici pour sélectionner<br/>une photo ou une vidéo</span>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="eventDate" label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>}>
                            <DatePicker style={{ width: '100%' }} className="rounded-xl h-12 border-gray-100" />
                        </Form.Item>
                        <Form.Item name="isActive" label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visible</span>} valuePropName="checked" initialValue={true}>
                            <Switch className="scale-110" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
