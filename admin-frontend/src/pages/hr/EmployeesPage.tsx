import { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, InputNumber, message, Statistic, Typography } from 'antd';
import { Card } from '@/components/ui/Card';
import { UserOutlined, TeamOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { usersService } from '../../services/users';
import { employeesService } from '../../services/employees';

const { Title, Text } = Typography;

export default function EmployeesPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await usersService.getAll({ group: 'staff', limit: 100 });
            setStaff(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement du personnel');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: any) => {
        setEditingUserId(user.id);
        form.setFieldsValue({
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // Prefix HR data if profile exists
            ...user.employeeProfile
        });
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // 1. Update User Role
            await usersService.updateRole(editingUserId!, values.role);

            // 2. Update/Create HR Profile (Optional if data provided)
            // Simplified: we update if it exists or user provided basic info
            if (values.position || values.department) {
                await employeesService.update(editingUserId!, {
                    position: values.position,
                    department: values.department,
                    salary: values.salary,
                    status: values.status
                });
            }

            message.success('Mise à jour réussie');
            setIsModalVisible(false);
            fetchStaff();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const roleColors: Record<string, string> = {
        ADMIN: 'red',
        OPERATOR: 'blue',
        HR: 'purple',
        ACCOUNTANT: 'cyan',
        SUPPLY_MANAGER: 'orange'
    };

    const columns = [
        {
            title: 'Membre du Personnel',
            key: 'name',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                        {record.firstName?.[0]}{record.lastName?.[0]}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{record.firstName} {record.lastName}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Rôle Système',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={roleColors[role] || 'default'}>{role}</Tag>,
        },
        {
            title: 'Département / Poste',
            key: 'job',
            render: (_: any, record: any) => (
                record.employeeProfile ? (
                    <div>
                        <div className="text-sm font-medium">{record.employeeProfile.position}</div>
                        <div className="text-xs text-gray-400">{record.employeeProfile.department}</div>
                    </div>
                ) : <Text type="secondary" italic>Accès simple (Pas de profil RH)</Text>
            ),
        },
        {
            title: 'Statut',
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.employeeProfile?.status === 'ACTIVE' ? 'success' : 'default'}>
                    {record.employeeProfile?.status || 'USER'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <Button type="link" icon={<SecurityScanOutlined />} onClick={() => handleEdit(record)}>
                    Gérer l'accès
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2}>Gestion du Personnel</Title>
                    <Text type="secondary">Membres ayant accès à l'interface d'administration</Text>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <Statistic title="Total Staff" value={staff.length} prefix={<TeamOutlined />} />
                </Card>
                <Card>
                    <Statistic title="Administrateurs" value={staff.filter((u: any) => u.role === 'ADMIN').length} valueStyle={{ color: '#cf1322' }} />
                </Card>
                <Card>
                    <Statistic title="Opérateurs" value={staff.filter((u: any) => u.role === 'OPERATOR').length} prefix={<UserOutlined />} />
                </Card>
            </div>

            <Card noPadding>
                <Table
                    columns={columns}
                    dataSource={staff}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    className="border-none"
                />
            </Card>

            <Modal
                title="Paramètres d'Accès & Profil"
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Divider orientation="left">Permissions Système</Divider>
                    <Form.Item name="role" label="Rôle d'administration" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'ADMIN', label: 'Admin (Accès total)' },
                            { value: 'OPERATOR', label: 'Opérateur (Production/Ventes)' },
                            { value: 'HR', label: 'RH (Gestion personnel)' },
                            { value: 'ACCOUNTANT', label: 'Comptable (Finance)' },
                            { value: 'SUPPLY_MANAGER', label: 'Stock (Fournisseurs/Logistique)' },
                            { value: 'CLIENT', label: 'Rétrograder en Client (Supprime l\'accès admin)' },
                        ]} />
                    </Form.Item>

                    <Divider orientation="left">Informations RH (Optionnel)</Divider>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="department" label="Département">
                            <Select options={[
                                { value: 'MANAGEMENT', label: 'Direction' },
                                { value: 'SALES', label: 'Ventes' },
                                { value: 'PRODUCTION', label: 'Production' },
                                { value: 'IT', label: 'Technique' },
                                { value: 'HR', label: 'RH' },
                                { value: 'FINANCE', label: 'Finance' },
                            ]} />
                        </Form.Item>
                        <Form.Item name="position" label="Poste">
                            <Input placeholder="Ex: Photographe Senior" />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="salary" label="Salaire (Est.)">
                            <InputNumber style={{ width: '100%' }} suffix="TND" />
                        </Form.Item>
                        <Form.Item name="status" label="Statut Employé">
                            <Select options={[
                                { value: 'ACTIVE', label: 'Actif' },
                                { value: 'LEAVE', label: 'En congé' },
                                { value: 'TERMINATED', label: 'Contrat terminé' },
                            ]} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

const Divider = ({ children, orientation = "left" }: any) => (
    <div className={`relative flex items-center my-6 ${orientation === 'left' ? 'justify-start' : 'justify-center'}`}>
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{children}</span>
        <div className="flex-grow border-t border-gray-100"></div>
    </div>
);
