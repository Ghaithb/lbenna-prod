import { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Select, message, Card } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { pagesService } from '../../services/pages';

const { TextArea } = Input;

export default function PageEditor() {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            loadPage();
        }
    }, [id]);

    const loadPage = async () => {
        try {
            const page: any = await pagesService.getOne(id!);
            form.setFieldsValue({
                ...page,
                content: JSON.stringify(page.content, null, 2),
            });
        } catch (error) {
            message.error('Erreur lors du chargement de la page');
        } finally {
        }
    };

    const handleSubmit = async (values: any) => {
        setSaving(true);
        try {
            const data = {
                ...values,
                content: JSON.parse(values.content || '{"blocks":[]}'),
            };

            if (isEdit) {
                await pagesService.update(id!, data);
                message.success('Page mise à jour avec succès');
            } else {
                await pagesService.create(data);
                message.success('Page créée avec succès');
            }

            navigate('/content/pages');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/content/pages')}
                    className="mb-4"
                >
                    Retour
                </Button>
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Modifier la Page' : 'Nouvelle Page'}
                </h1>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    isPublished: false,
                    showInMenu: true,
                    menuOrder: 0,
                    template: 'default',
                    content: '{"blocks":[]}',
                }}
            >
                {/* @ts-ignore */}
                <Card title="Informations Générales" className="mb-4">
                    <Form.Item
                        name="title"
                        label="Titre"
                        rules={[{ required: true, message: 'Le titre est requis' }]}
                    >
                        <Input
                            placeholder="Ex: À Propos"
                            onChange={(e: any) => {
                                if (!isEdit) {
                                    form.setFieldValue('slug', generateSlug(e.target.value));
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="Slug (URL)"
                        rules={[{ required: true, message: 'Le slug est requis' }]}
                    >
                        <Input placeholder="a-propos" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Contenu (JSON)"
                        rules={[{ required: true, message: 'Le contenu est requis' }]}
                    >
                        <TextArea
                            rows={10}
                            placeholder='{"blocks":[]}'
                            className="font-mono text-sm"
                        />
                    </Form.Item>
                </Card>

                {/* @ts-ignore */}
                <Card title="SEO" className="mb-4">
                    <Form.Item name="metaTitle" label="Meta Titre">
                        <Input placeholder="Titre pour les moteurs de recherche" />
                    </Form.Item>

                    <Form.Item name="metaDescription" label="Meta Description">
                        <TextArea
                            rows={3}
                            placeholder="Description pour les moteurs de recherche"
                            maxLength={160}
                            showCount
                        />
                    </Form.Item>
                </Card>

                {/* @ts-ignore */}
                <Card title="Options" className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="template" label="Template">
                            <Select>
                                {/* @ts-ignore */}
                                <Select.Option value="default">Par défaut</Select.Option>
                                {/* @ts-ignore */}
                                <Select.Option value="fullwidth">Pleine largeur</Select.Option>
                                {/* @ts-ignore */}
                                <Select.Option value="landing">Landing Page</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="menuOrder" label="Ordre dans le menu">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="showInMenu" label="Afficher dans le menu" valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Form.Item name="isPublished" label="Publié" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button onClick={() => navigate('/content/pages')}>
                        Annuler
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={saving}
                    >
                        {isEdit ? 'Mettre à jour' : 'Créer'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
