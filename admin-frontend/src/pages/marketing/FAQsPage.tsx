import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { faqsService, Faq } from '../../services/faqs';

export default function FAQsPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [form] = Form.useForm();

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const data = await faqsService.getAll(true);
            setFaqs(data);
        } catch (error) {
            message.error('Erreur lors du chargement des FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleOpenModal = (faq?: Faq) => {
        if (faq) {
            setEditingFaq(faq);
            form.setFieldsValue(faq);
        } else {
            setEditingFaq(null);
            form.resetFields();
            form.setFieldsValue({ order: 0, isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (editingFaq) {
                await faqsService.update(editingFaq.id, values);
                message.success('FAQ mise à jour avec succès');
            } else {
                await faqsService.create(values);
                message.success('FAQ créée avec succès');
            }
            handleCloseModal();
            fetchFaqs();
        } catch (error) {
            console.error('Save FAQ error', error);
            message.error('Erreur lors de l’enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Supprimer cette FAQ ?',
            content: 'Cette action est irréversible.',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: async () => {
                try {
                    await faqsService.delete(id);
                    message.success('FAQ supprimée');
                    fetchFaqs();
                } catch (error) {
                    message.error('Erreur lors de la suppression');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Ordre',
            dataIndex: 'order',
            key: 'order',
            width: 80,
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Statut',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Switch checked={isActive} disabled />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Faq) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size="small" />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size="small" />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gestion de la FAQ</h1>
                    <p className="text-gray-600">Gérez les questions fréquentes affichées sur le site</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal()}
                >
                    Nouvelle FAQ
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <Table
                    columns={columns}
                    dataSource={faqs}
                    rowKey="id"
                    loading={loading}
                    expandable={{
                        expandedRowRender: (record: Faq) => (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600 italic">{record.answer}</p>
                            </div>
                        ),
                    }}
                />
            </div>

            <Modal
                title={editingFaq ? 'Modifier la FAQ' : 'Ajouter une FAQ'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ order: 0, isActive: true }}
                >
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Veuillez saisir la question' }]}
                    >
                        <Input placeholder="Ex: Comment réserver ?" />
                    </Form.Item>

                    <Form.Item
                        name="answer"
                        label="Réponse"
                        rules={[{ required: true, message: 'Veuillez saisir la réponse' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Saisissez la réponse détaillée..." />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="order" label="Ordre d'affichage">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>

                        <Form.Item name="isActive" label="Actif" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>

                    <Form.Item className="mb-0 flex justify-end gap-2">
                        <Space>
                            <Button onClick={handleCloseModal}>Annuler</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Enregistrer
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
