import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, DatePicker, Select, Input, message, Typography, Badge } from 'antd';
import { Card } from '@/components/ui/Card';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { employeesService, Employee } from '../../services/employees';
import { format } from 'date-fns';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function LeaveManagementPage() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leavesData, employeesData] = await Promise.all([
                employeesService.getLeaves(),
                employeesService.getAll()
            ]);
            setLeaves(leavesData);
            setEmployees(employeesData.data);
        } catch (error) {
            message.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                startDate: values.dates[0].format('YYYY-MM-DD'),
                endDate: values.dates[1].format('YYYY-MM-DD'),
            };
            delete payload.dates;
            await employeesService.createLeave(payload);
            message.success('Demande de congé enregistrée');
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la création');
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await employeesService.updateLeaveStatus(id, { status });
            message.success('Statut mis à jour');
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la mise à jour');
        }
    };

    const columns = [
        {
            title: 'Employé',
            key: 'employee',
            render: (_: any, record: any) => (
                <Text strong>{record.employee.firstName} {record.employee.lastName}</Text>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color="blue">{type}</Tag>
        },
        {
            title: 'Période',
            key: 'period',
            render: (_: any, record: any) => (
                <span>{format(new Date(record.startDate), 'dd/MM/yyyy')} au {format(new Date(record.endDate), 'dd/MM/yyyy')}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors: any = { PENDING: 'orange', APPROVED: 'green', REJECTED: 'red' };
                return <Badge status={colors[status] === 'green' ? 'success' : colors[status] === 'red' ? 'error' : 'warning'} text={status} />;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.status === 'PENDING' && (
                        <>
                            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleUpdateStatus(record.id, 'APPROVED')}>Approuver</Button>
                            <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleUpdateStatus(record.id, 'REJECTED')}>Refuser</Button>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2}>Gestion des Congés & Absences</Title>
                    <Text type="secondary">Suivi des demandes et planning des équipes</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Nouvelle Demande
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={leaves}
                    rowKey="id"
                    loading={loading}
                />
            </Card>

            <Modal
                title="Enregistrer un Congé"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="employeeId" label="Employé" rules={[{ required: true }]}>
                        <Select
                            placeholder="Sélectionner l'employé"
                            options={employees.map((e: Employee) => ({ label: `${e.firstName} ${e.lastName}`, value: e.id }))}
                        />
                    </Form.Item>
                    <Form.Item name="type" label="Type de Congé" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Annuel', value: 'ANNUAL' },
                                { label: 'Maladie', value: 'SICK' },
                                { label: 'Personnel', value: 'PERSONAL' },
                                { label: 'Autre', value: 'OTHER' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="dates" label="Dates" rules={[{ required: true }]}>
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="reason" label="Raison / Notes">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
