import { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, InputNumber, message, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreateInvoiceDto, Invoice, salesService } from '../../services/sales';
import dayjs from 'dayjs';

interface InvoiceFormModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: Invoice | null;
}

export default function InvoiceFormModal({ visible, onCancel, onSuccess, initialData }: InvoiceFormModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                form.setFieldsValue({
                    ...initialData,
                    issuedAt: dayjs(initialData.issuedAt),
                    dueDate: dayjs(initialData.dueDate),
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    issuedAt: dayjs(),
                    dueDate: dayjs().add(30, 'days'),
                    items: [{ description: '', quantity: 1, unitPrice: 0 }]
                });
            }
        }
    }, [visible, initialData, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const dto: CreateInvoiceDto = {
                clientName: values.clientName,
                clientEmail: values.clientEmail,
                userId: values.userId,
                issuedAt: values.issuedAt.toISOString(),
                dueDate: values.dueDate.toISOString(),
                items: values.items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    taxRate: item.taxRate
                })),
                notes: values.notes
            };

            await salesService.createInvoice(dto);
            message.success('Facture créée avec succès');
            onSuccess();
        } catch (error) {
            console.error(error);
            message.error('Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals for display
    const calculateTotals = () => {
        const currentItems = form.getFieldValue('items') || [];
        const subtotal = currentItems.reduce((acc: number, item: any) => acc + (item?.quantity || 0) * (item?.unitPrice || 0), 0);
        const tax = currentItems.reduce((acc: number, item: any) => acc + (item?.quantity || 0) * (item?.unitPrice || 0) * ((item?.taxRate || 0) / 100), 0);
        return { subtotal, tax, total: subtotal + tax };
    };

    return (
        <Modal
            title={initialData ? "Modifier la Facture" : "Nouvelle Facture"}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={900}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ items: [{}] }}>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="clientName" label="Nom du Client/Société" rules={[{ required: true }]}>
                        <Input placeholder="Ex: Société ABC" />
                    </Form.Item>
                    <Form.Item name="clientEmail" label="Email Client" rules={[{ type: 'email' }]}>
                        <Input placeholder="contact@client.com" />
                    </Form.Item>
                </div>

                <Form.Item name="userId" label="ID Utilisateur (Système)" help="ID de l'utilisateur existant à lier (Requis par le système)">
                    <Input placeholder="Requis... (Pour test utiliser un ID existant)" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="issuedAt" label="Date d'émission" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Date d'échéance" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </div>

                <Divider orientation="left">Articles</Divider>

                <Form.List name="items">
                    {(fields: any[], { add, remove }: any) => (
                        <>
                            <table className="w-full mb-4">
                                <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="p-2 font-medium">Description</th>
                                        <th className="p-2 font-medium w-24">Qté</th>
                                        <th className="p-2 font-medium w-32">Prix Unit.</th>
                                        <th className="p-2 font-medium w-24">TVA %</th>
                                        <th className="p-2 font-medium w-32">Total HT</th>
                                        <th className="p-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map(({ key, name, ...restField }: any) => (
                                        <tr key={key}>
                                            <td className="p-1">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    rules={[{ required: true, message: 'Requis' }]}
                                                    className="mb-0"
                                                >
                                                    <Input placeholder="Service ou produit..." />
                                                </Form.Item>
                                            </td>
                                            <td className="p-1">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    rules={[{ required: true }]}
                                                    className="mb-0"
                                                >
                                                    <InputNumber min={1} className="w-full" />
                                                </Form.Item>
                                            </td>
                                            <td className="p-1">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'unitPrice']}
                                                    rules={[{ required: true }]}
                                                    className="mb-0"
                                                >
                                                    <InputNumber min={0} step={0.001} className="w-full" />
                                                </Form.Item>
                                            </td>
                                            <td className="p-1">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'taxRate']}
                                                    initialValue={0}
                                                    className="mb-0"
                                                >
                                                    <InputNumber min={0} max={100} className="w-full" />
                                                </Form.Item>
                                            </td>
                                            <td className="p-1 text-right font-medium text-gray-600">
                                                <Form.Item shouldUpdate className="mb-0">
                                                    {({ getFieldValue }: { getFieldValue: (name: any) => any }) => {
                                                        const items = getFieldValue('items');
                                                        const item = items[name] || {};
                                                        return ((item.quantity || 0) * (item.unitPrice || 0)).toFixed(3);
                                                    }}
                                                </Form.Item>
                                            </td>
                                            <td className="p-1 text-center">
                                                <DeleteOutlined onClick={() => remove(name)} className="text-red-500 cursor-pointer hover:text-red-700" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Ajouter une ligne
                            </Button>
                        </>
                    )}
                </Form.List>

                <div className="flex justify-end mt-6">
                    <Form.Item shouldUpdate className="mb-0 w-64">
                        {() => {
                            const { subtotal, tax, total } = calculateTotals();
                            return (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Sous-total:</span>
                                        <span>{subtotal.toFixed(3)} TND</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>TVA:</span>
                                        <span>{tax.toFixed(3)} TND</span>
                                    </div>
                                    <Divider className="my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>{total.toFixed(3)} TND</span>
                                    </div>
                                </div>
                            );
                        }}
                    </Form.Item>
                </div>

                <Form.Item name="notes" label="Notes / Conditions">
                    <Input.TextArea rows={3} placeholder="Conditions de paiement, notes pour le client..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
