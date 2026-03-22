import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input, Switch, InputNumber, Upload } from 'antd';
import { partnersService, Partner } from '../../services/partners';
import { mediaService } from '../../services/media';
import { DeleteOutlined, EditOutlined, PlusOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';

export default function PartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const data = await partnersService.getAll();
            setPartners(data);
        } catch (error) {
            message.error('Erreur lors du chargement des partenaires');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleToggleActive = async (record: Partner) => {
        try {
            await partnersService.update(record.id, { isActive: !record.isActive });
            message.success('Statut mis à jour');
            fetchPartners();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await partnersService.delete(id);
            message.success('Partenaire supprimé');
            fetchPartners();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setUploading(true);
            let finalLogoUrl = values.logoUrl;

            // Handle new file upload if available
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const uploadedFile = await mediaService.uploadSingle(fileList[0].originFileObj);
                finalLogoUrl = uploadedFile.url;
            }

            if (!finalLogoUrl && !editingPartner?.logoUrl) {
                message.error('Veuillez uploader un logo ou fournir une URL');
                setUploading(false);
                return;
            }

            const payload = {
                ...values,
                logoUrl: finalLogoUrl
            };

            if (editingPartner) {
                await partnersService.update(editingPartner.id, payload);
                message.success('Partenaire mis à jour');
            } else {
                await partnersService.create(payload);
                message.success('Partenaire créé');
            }
            
            setIsModalOpen(false);
            fetchPartners();
        } catch (error: any) {
            message.error(error.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setUploading(false);
        }
    };

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logoUrl',
            key: 'logoUrl',
            render: (url: string) => {
                const finalUrl = url && url.startsWith('http') ? url : `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${url}`;
                return url ? (
                 <img src={finalUrl} alt="Logo" className="h-10 object-contain" />
            ) : <PictureOutlined className="text-gray-400 text-2xl" />
            }
        },
        {
            title: 'Nom de la Société',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-bold text-gray-900">{text}</span>
        },
        {
            title: 'Ordre d\'Affichage',
            dataIndex: 'displayOrder',
            key: 'displayOrder',
        },
        {
            title: 'Statut',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean, record: Partner) => (
                <Switch 
                    checked={isActive} 
                    onChange={() => handleToggleActive(record)}
                    checkedChildren="Actif"
                    unCheckedChildren="Masqué"
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Partner) => (
                <Space>
                    <Button 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditingPartner(record);
                            setFileList([]); // Clear pending files
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Supprimer ce partenaire ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Partenaires (Logos)</h1>
                    <p className="text-gray-500">Gérez les logos des sociétés affichés sur la page d'accueil.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                        setEditingPartner(null);
                        setFileList([]); // Clear file list on new
                        form.resetFields();
                        form.setFieldsValue({ isActive: true, displayOrder: 0 });
                        setIsModalOpen(true);
                    }}
                >
                    Ajouter un Partenaire
                </Button>
            </div>

            <Table
                dataSource={partners}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={editingPartner ? "Modifier le Partenaire" : "Ajouter un Partenaire"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Enregistrer"
                cancelText="Annuler"
                confirmLoading={uploading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Nom de la société"
                        rules={[{ required: true, message: 'Requis' }]}
                    >
                        <Input placeholder="Ex: Sony" />
                    </Form.Item>

                    <Form.Item label="Fichier Logo (Depuis votre PC)">
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            accept="image/*"
                            onChange={({ fileList }: any) => setFileList(fileList)}
                            beforeUpload={() => false} // Prevent auto upload
                            className="w-full"
                        >
                            {fileList.length === 0 && (
                                <Button icon={<UploadOutlined />} className="w-full">
                                    Sélectionner une image (PNG/SVG)
                                </Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="logoUrl"
                        label="Ou URL du Logo (existant ou web)"
                        help="Laissez vide si vous avez importé un fichier depuis votre PC."
                    >
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <div className="flex gap-8 mt-4">
                        <Form.Item
                            name="displayOrder"
                            label="Ordre d'affichage"
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item
                            name="isActive"
                            label="Afficher sur le site"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
