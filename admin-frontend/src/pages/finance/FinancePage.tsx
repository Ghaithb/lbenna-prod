import { useEffect, useState } from 'react';
import { Row, Col, Statistic, DatePicker, Button, Spin, Table, Tag, Tabs, Modal, Form, Input, InputNumber, Select, message, Typography } from 'antd';
import { Card } from '@/components/ui/Card';
import { FinanceDashboardData, financeService, MonthlyStat } from '../../services/finance';
import { expensesService, Expense } from '../../services/expenses';
import { DollarOutlined, RiseOutlined, WalletOutlined, FallOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanceDashboardData | null>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().startOf('year'), dayjs().endOf('year')]);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Expenses State
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [expenseForm] = Form.useForm();
    const [loadingExpenses, setLoadingExpenses] = useState(false);

    useEffect(() => {
        fetchData();
        if (activeTab === 'expenses') {
            fetchExpenses();
        }
    }, [dateRange, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const stats = await financeService.getDashboard(dateRange[0].toDate(), dateRange[1].toDate());
            setData(stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        setLoadingExpenses(true);
        try {
            const res = await expensesService.getAll({
                start: dateRange[0].toISOString(),
                end: dateRange[1].toISOString(),
                take: 100
            });
            setExpenses(res);
        } catch (error) {
            message.error('Erreur chargement denses');
        } finally {
            setLoadingExpenses(false);
        }
    };

    const handleCreateExpense = async (values: any) => {
        try {
            await expensesService.create({
                ...values,
                date: values.date ? values.date.toISOString() : new Date().toISOString()
            });
            message.success('Dépense ajoutée');
            setIsExpenseModalVisible(false);
            expenseForm.resetFields();
            fetchExpenses();
            fetchData();
        } catch (error) {
            message.error('Erreur lors de l\'ajout');
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await expensesService.delete(id);
            message.success('Dépense supprimée');
            fetchExpenses();
            fetchData();
        } catch (error) {
            message.error('Erreur suppression');
        }
    };

    if (loading && !data) return <div className="p-12 text-center"><Spin size="large" /></div>;

    const chartData = data?.charts.monthly.map((stat: MonthlyStat, index: number) => ({
        name: MONTHS[index],
        Total: stat.revenue,
        POS: stat.pos,
        Online: stat.online
    }));

    const renderDashboard = () => (
        <>
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Chiffre d'Affaires"
                            value={data?.overview.totalRevenue}
                            precision={2}
                            suffix="TND"
                            prefix={<DollarOutlined />}
                            styles={{ content: { color: '#3f8600' } }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Marge Brute"
                            value={data?.overview.grossProfit}
                            precision={2}
                            suffix="TND"
                            prefix={<RiseOutlined />}
                            styles={{ content: { color: '#1890ff' } }}
                        />
                        <div className="text-gray-500 text-xs mt-1">
                            {data?.overview.margin.toFixed(1)}% du CA
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Résultat Net (Bénéfice)"
                            value={(data?.overview as any)?.netProfit || 0}
                            precision={2}
                            suffix="TND"
                            prefix={<WalletOutlined />}
                            styles={{ content: { color: (data?.overview as any)?.netProfit >= 0 ? '#3f8600' : '#cf1322' } }}
                        />
                        <div className="text-gray-500 text-xs mt-1">
                            Après déduction des charges
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Total Charges & Achats"
                            value={(data?.overview.totalPurchases || 0) + ((data?.overview as any)?.totalExpenses || 0)}
                            precision={2}
                            suffix="TND"
                            prefix={<FallOutlined />}
                            styles={{ content: { color: '#cf1322' } }}
                        />
                        <div className="text-gray-500 text-xs mt-1 flex justify-between">
                            <span>Achats: {data?.overview.totalPurchases.toFixed(0)}</span>
                            <span>Frais: {(data?.overview as any)?.totalExpenses?.toFixed(0) || 0}</span>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} lg={16}>
                    <Card className="shadow-sm">
                        <Title level={4} className="mb-4">Évolution du Chiffre d'Affaires</Title>
                        <div className="h-[350px] w-full" style={{ minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: any) => [`${Number(value).toFixed(2)} TND`, 'Revenue']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="POS" name="Magasin" stackId="a" fill="#1890ff" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Online" name="Site Web" stackId="a" fill="#52c41a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card className="shadow-sm h-full">
                        <Title level={4} className="mb-4">Répartition par Canal</Title>
                        <div className="flex flex-col justify-center h-[350px] gap-6">
                            <div className="text-center">
                                <Statistic
                                    title="Part Magasin"
                                    value={data?.charts.monthly.reduce((acc: number, curr: any) => acc + curr.pos, 0)}
                                    precision={2}
                                    suffix="TND"
                                    styles={{ content: { color: '#1890ff' } }}
                                />
                            </div>
                            <div className="text-center">
                                <Statistic
                                    title="Part Web"
                                    value={data?.charts.monthly.reduce((acc: number, curr: any) => acc + curr.online, 0)}
                                    precision={2}
                                    suffix="TND"
                                    styles={{ content: { color: '#52c41a' } }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const renderExpenses = () => (
        <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <Title level={4} className="m-0">Gestion des Dépenses</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsExpenseModalVisible(true)}>Ajouter une Dépense</Button>
            </div>
            <Table
                dataSource={expenses}
                rowKey="id"
                loading={loadingExpenses}
                columns={[
                    { title: 'Date', dataIndex: 'date', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
                    { title: 'Catégorie', dataIndex: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
                    { title: 'Description', dataIndex: 'description' },
                    { title: 'Montant', dataIndex: 'amount', render: (a: number) => <span className="text-red-600 font-bold">-{a.toFixed(2)} TND</span> },
                    { title: 'Actions', key: 'actions', render: (_: any, record: Expense) => <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteExpense(record.id)} /> }
                ]}
            />
        </Card>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Finance & Comptabilité</h1>
                    <p className="text-gray-500">Vue d'ensemble et gestion des charges</p>
                </div>
                <div className="flex gap-2">
                    <RangePicker
                        value={dateRange}
                        onChange={(dates: any) => {
                            if (dates && dates[0] && dates[1]) {
                                setDateRange([dates[0], dates[1]]);
                            }
                        }}
                    />
                    <Button icon={<DownloadOutlined />} onClick={async () => {
                        const loadingMessage = message.loading('Génération du bilan...', 0);
                        try {
                            const { orders, expenses, purchases } = await financeService.getTransactions(dateRange[0].toDate(), dateRange[1].toDate());

                            let csv = "Date,Type,Reference,Description,Montant TND,Taxe TND\n";

                            orders.forEach((o: any) => {
                                csv += `${dayjs(o.createdAt).format('YYYY-MM-DD')},Vente,${o.orderNumber},Revenue Vente,${o.total.toFixed(2)},${o.tax.toFixed(2)}\n`;
                            });

                            expenses.forEach((e: any) => {
                                csv += `${dayjs(e.date).format('YYYY-MM-DD')},Dépense,${e.category},${e.description},- ${e.amount.toFixed(2)},0.00\n`;
                            });

                            purchases.forEach((p: any) => {
                                csv += `${dayjs(p.createdAt).format('YYYY-MM-DD')},Achat,${p.poNumber},${p.supplier.name},- ${p.totalAmount.toFixed(2)},0.00\n`;
                            });

                            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", `bilan_${dateRange[0].format('YYYYMMDD')}_${dateRange[1].format('YYYYMMDD')}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            message.success('Export réussi');
                        } catch (error) {
                            message.error('Erreur lors de l\'export');
                        } finally {
                            loadingMessage();
                        }
                    }}>Export Bilan</Button>
                </div>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
                { key: 'dashboard', label: 'Tableau de Bord', children: renderDashboard() },
                { key: 'expenses', label: 'Dépenses & Charges', children: renderExpenses() },
            ]} />

            <Modal title="Ajouter une Dépense" open={isExpenseModalVisible} onCancel={() => setIsExpenseModalVisible(false)} footer={null}>
                <Form form={expenseForm} onFinish={handleCreateExpense} layout="vertical">
                    <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'RENT', label: 'Loyer' },
                            { value: 'SALARY', label: 'Salaires' },
                            { value: 'UTILITIES', label: 'Électricité/Eau/Internet' },
                            { value: 'MARKETING', label: 'Marketing/Pub' },
                            { value: 'SOFTWARE', label: 'Logiciels' },
                            { value: 'EQUIPMENT', label: 'Matériel' },
                            { value: 'TAXES', label: 'Impôts & Taxes' },
                            { value: 'OTHER', label: 'Autre' },
                        ]} />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="amount" label="Montant (TND)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item name="date" label="Date">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Enregistrer</Button>
                </Form>
            </Modal>
        </div>
    );
}
