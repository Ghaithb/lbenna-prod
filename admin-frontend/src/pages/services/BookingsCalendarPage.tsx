import { useState, useEffect } from 'react';
import { Calendar, Button, Tag, Typography, Drawer, Space, Divider, Avatar } from 'antd';
import { ReloadOutlined, CalendarOutlined, UserOutlined, MailOutlined, PhoneOutlined, FileTextOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { bookingsService } from '@/services/bookings';

dayjs.locale('fr');
const { Paragraph } = Typography;

interface BookingEvent {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceOffer: {
        title: string;
        color?: string;
    };
    status: string;
    bookingDate: string;
    notes?: string;
}

export default function BookingsCalendarPage() {
    const [bookings, setBookings] = useState<Record<string, BookingEvent[]>>({});
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState<BookingEvent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCalendarData(selectedDate);
    }, [selectedDate.month(), selectedDate.year()]);

    const fetchCalendarData = async (date: Dayjs) => {
        setLoading(true);
        try {
            const response = await bookingsService.getCalendar(
                date.month() + 1,
                date.year()
            );
            setBookings(response.bookings || {});
        } catch (error) {
            console.error('Erreur lors du chargement du calendrier', error);
        } finally {
            setLoading(false);
        }
    };

    const getListData = (value: Dayjs) => {
        const dateStr = value.format('YYYY-MM-DD');
        return bookings[dateStr] || [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <div className="flex flex-col gap-1 overflow-hidden h-full py-1">
                {listData.slice(0, 3).map((item: BookingEvent) => (
                    <div
                        key={item.id}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold truncate transition-all flex items-center gap-1
                            ${item.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border border-green-100' :
                                item.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                    'bg-slate-50 text-slate-600 border border-slate-100'}`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'CONFIRMED' ? 'bg-green-500' : item.status === 'PENDING' ? 'bg-orange-500' : 'bg-slate-400'}`} />
                        {item.serviceOffer.title}
                    </div>
                ))}
                {listData.length > 3 && (
                    <div className="text-[10px] text-slate-400 font-black px-2">
                        + {listData.length - 3} autres
                    </div>
                )}
            </div>
        );
    };

    const handleSelect = (date: Dayjs) => {
        const isDifferentMonth = date.month() !== selectedDate.month() || date.year() !== selectedDate.year();

        if (isDifferentMonth) {
            setSelectedDate(date);
        } else {
            // Same month, just show bookings for that day
            const listData = getListData(date);
            setSelectedBookings(listData);
            if (listData.length > 0) {
                setDrawerOpen(true);
            }
        }
    };

    const getStatusTag = (status: string) => {
        const config: Record<string, { color: string; icon: any }> = {
            PENDING: { color: 'warning', icon: <ClockCircleOutlined /> },
            CONFIRMED: { color: 'success', icon: <CheckCircleOutlined /> },
            COMPLETED: { color: 'processing', icon: <CheckCircleOutlined /> },
            CANCELLED: { color: 'error', icon: <ClockCircleOutlined /> },
        };
        const item = config[status] || { color: 'default', icon: null };
        return <Tag color={item.color} icon={item.icon}>{status}</Tag>;
    };

    return (
        <div className="space-y-8 min-h-[calc(100vh-10rem)]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-950 tracking-tight">Calendrier de Production</h1>
                    <p className="text-gray-500 font-medium">Visualisez et gérez le planning de vos sessions.</p>
                </div>
                <Space>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 mr-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-50">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-[10px] font-black uppercase text-gray-400">Confirmé</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-black uppercase text-gray-400">En attente</span>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ReloadOutlined spin={loading} />}
                        onClick={() => fetchCalendarData(selectedDate)}
                        className="bg-gray-950 hover:bg-primary-600 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] flex items-center"
                    >
                        Actualiser
                    </Button>
                </Space>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <style>{`
                    .ant-picker-calendar-full .ant-picker-panel { background: rgba(255,255,255,0.7); }
                    .ant-picker-cell-inner { height: 120px !important; }
                    .ant-picker-calendar-date-value { font-weight: 900; font-size: 1.1rem; opacity: 0.3; }
                    .ant-picker-cell-selected .ant-picker-calendar-date-value { opacity: 1; color: #f97316 !important; }
                    .ant-picker-cell-today .ant-picker-calendar-date-value { background: #f97316; color: white !important; border-radius: 4px; padding: 2px 6px; opacity: 1; }
                `}</style>
                <Calendar
                    value={selectedDate}
                    cellRender={(current: Dayjs, info: { type: string; originNode: React.ReactNode }) => {
                        if (info.type === 'date') return dateCellRender(current);
                        return info.originNode;
                    }}
                    onSelect={handleSelect}
                    headerRender={({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => (
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <CalendarOutlined className="text-2xl text-primary-600" />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                                    {value.format('MMMM YYYY')}
                                </h2>
                            </div>
                            <Space size="middle">
                                <Button
                                    onClick={() => {
                                        const newValue = value.add(-1, 'month');
                                        onChange(newValue);
                                        setSelectedDate(newValue);
                                    }}
                                    className="rounded-lg border-slate-200"
                                >
                                    Précédent
                                </Button>
                                <Button
                                    onClick={() => {
                                        const newValue = dayjs();
                                        onChange(newValue);
                                        setSelectedDate(newValue);
                                    }}
                                    className="rounded-lg border-slate-200 font-bold"
                                >
                                    Aujourd'hui
                                </Button>
                                <Button
                                    onClick={() => {
                                        const newValue = value.add(1, 'month');
                                        onChange(newValue);
                                        setSelectedDate(newValue);
                                    }}
                                    className="rounded-lg border-slate-200"
                                >
                                    Suivant
                                </Button>
                            </Space>
                        </div>
                    )}
                />
            </div>

            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                            <CalendarOutlined size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Planning du jour</p>
                            <h3 className="text-lg font-black text-gray-950 tracking-tight leading-none uppercase">
                                {selectedDate.format('DD MMMM YYYY')}
                            </h3>
                        </div>
                    </div>
                }
                placement="right"
                size="large"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                styles={{
                    header: { borderBottom: '1px solid #f1f5f9', padding: '24px 32px' },
                    body: { padding: '32px' }
                }}
            >
                <div className="space-y-8">
                    {selectedBookings.map((booking: BookingEvent, idx: number) => (
                        <div key={booking.id} className="animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:border-primary-500/30 transition-all hover:shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50 inline-block font-black text-primary-600 uppercase tracking-widest text-[10px]">
                                        {booking.serviceOffer.title}
                                    </div>
                                    {getStatusTag(booking.status)}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar size={48} icon={<UserOutlined />} className="bg-gray-950" />
                                        <div>
                                            <p className="text-xl font-black text-gray-950 leading-tight">{booking.customerName}</p>
                                            <p className="text-sm font-medium text-gray-500 font-outfit">Lead Client</p>
                                        </div>
                                    </div>

                                    <Divider className="my-0 border-slate-100" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <MailOutlined /> Email
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{booking.customerEmail}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <PhoneOutlined /> Téléphone
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">{booking.customerPhone}</p>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="bg-white p-6 rounded-2xl border border-slate-50 space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileTextOutlined /> Brief du projet
                                            </p>
                                            <Paragraph className="text-sm text-gray-600 font-medium font-outfit italic m-0">
                                                "{booking.notes}"
                                            </Paragraph>
                                        </div>
                                    )}

                                    <Button
                                        block
                                        size="large"
                                        className="h-14 rounded-2xl bg-gray-950 text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all flex items-center justify-center gap-3"
                                        onClick={() => window.location.href = `/services/bookings/${booking.id}`}
                                    >
                                        Gérer la réservation <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    );
}
