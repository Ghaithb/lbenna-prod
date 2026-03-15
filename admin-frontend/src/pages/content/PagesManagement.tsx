import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, Tooltip, message } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { pagesService, Page } from '../../services/pages';
import { useNavigate } from 'react-router-dom';

export default function PagesManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchPages = async () => {
        setLoading(true);
        try {
            const data = await pagesService.getAll(true);
            setPages(data);
        } catch (error) {
            message.error('Erreur lors du chargement des pages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleTogglePublish = async (id: string) => {
        try {
            await pagesService.togglePublish(id);
            message.success('Statut de publication mis à jour');
            fetchPages();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Êtes-vous sûr ?',
            content: 'Cette action est irréversible.',
            okText: 'Oui, supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: async () => {
                try {
                    await pagesService.delete(id);
                    message.success('Page supprimée');
                    fetchPages();
                } catch (error) {
                    message.error('Erreur lors de la suppression');
                }
            },
        });
    };

    const columns: any[] = [
        {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => (
                <Space>
                    <FileTextOutlined />
                    <span className="font-semibold">{text}</span>
                </Space>
            ),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (slug: string) => (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{slug}</code>
            ),
        },
        {
            title: 'Statut',
            dataIndex: 'isPublished',
            key: 'isPublished',
            render: (isPublished: boolean) => (
                <Tag color={isPublished ? 'green' : 'orange'}>
                    {isPublished ? 'Publié' : 'Brouillon'}
                </Tag>
            ),
        },
        {
            title: 'Menu',
            dataIndex: 'showInMenu',
            key: 'showInMenu',
            render: (showInMenu: boolean) => (
                <Tag color={showInMenu ? 'blue' : 'default'}>
                    {showInMenu ? 'Affiché' : 'Masqué'}
                </Tag>
            ),
        },
        {
            title: 'Ordre',
            dataIndex: 'menuOrder',
            key: 'menuOrder',
            width: 80,
        },
        {
            title: 'Template',
            dataIndex: 'template',
            key: 'template',
            render: (template: string) => (
                <Tag>{template}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Page) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => navigate(`/content/pages/${record.id}/edit`)}
                        />
                    </Tooltip>
                    <Tooltip title={record.isPublished ? 'Dépublier' : 'Publier'}>
                        <Button
                            icon={record.isPublished ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            size="small"
                            onClick={() => handleTogglePublish(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gestion des Pages</h1>
                    <p className="text-gray-600">Créez et gérez les pages de votre site</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/content/pages/new')}
                >
                    Nouvelle Page
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <Table
                    columns={columns}
                    dataSource={pages}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total: number) => `Total: ${total} pages`,
                    }}
                />
            </div>
        </div>
    );
}
