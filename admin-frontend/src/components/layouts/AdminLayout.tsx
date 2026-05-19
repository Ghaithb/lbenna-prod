import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Breadcrumb, theme, type MenuProps } from 'antd';
import {
  DashboardOutlined, TeamOutlined, CalendarOutlined,
  SettingOutlined, LogoutOutlined, AppstoreOutlined, FileTextOutlined,
  BellOutlined, UserOutlined, MessageOutlined,
  AuditOutlined,
  PictureOutlined,
  UnorderedListOutlined, StarOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const go = (path: string) => () => navigate(path);

  // Sous-menus (pas type: 'group') — les groupes disparaissent quand la sidebar est repliée.
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
      onClick: go('/dashboard'),
    },
    {
      key: 'production',
      icon: <AppstoreOutlined />,
      label: 'Studio & Production',
      children: [
        { key: '/services/bookings', icon: <CalendarOutlined />, label: 'Réservations', onClick: go('/services/bookings') },
        { key: '/services/calendar', icon: <CalendarOutlined />, label: 'Calendrier', onClick: go('/services/calendar') },
        { key: '/services/offers', icon: <AppstoreOutlined />, label: 'Offres & Services', onClick: go('/services/offers') },
        { key: '/services/categories', icon: <UnorderedListOutlined />, label: 'Catégories', onClick: go('/services/categories') },
        { key: '/services/portfolio', icon: <PictureOutlined />, label: 'Portfolio', onClick: go('/services/portfolio') },
        { key: '/services/partners', icon: <ShopOutlined />, label: 'Logos partenaires', onClick: go('/services/partners') },
      ],
    },
    {
      key: 'marketing',
      icon: <MessageOutlined />,
      label: 'Marketing & Com',
      children: [
        { key: '/users', icon: <TeamOutlined />, label: 'Clients', onClick: go('/users') },
        { key: '/marketing/messages', icon: <MessageOutlined />, label: 'Messages', onClick: go('/marketing/messages') },
        { key: '/marketing/reviews', icon: <StarOutlined />, label: 'Avis Clients', onClick: go('/marketing/reviews') },
        { key: '/marketing/faqs', icon: <FileTextOutlined />, label: 'FAQs', onClick: go('/marketing/faqs') },
        { key: '/marketing/announcements', icon: <BellOutlined />, label: 'Annonces', onClick: go('/marketing/announcements') },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: 'Configuration',
      children: [
        { key: '/settings', icon: <SettingOutlined />, label: 'Paramètres', onClick: go('/settings') },
        { key: '/system/audit', icon: <AuditOutlined />, label: 'Audit Logs', onClick: go('/system/audit') },
      ],
    },
  ];

  const selectedKey =
    location.pathname === '/marketing/partners'
      ? '/services/partners'
      : location.pathname;

  const openKeysFromPath = () => {
    if (location.pathname.startsWith('/services') || location.pathname === '/dashboard') return ['production'];
    if (location.pathname.startsWith('/marketing') || location.pathname.startsWith('/users')) return ['marketing'];
    if (location.pathname.startsWith('/system') || location.pathname === '/settings') return ['system'];
    return ['production'];
  };

  const [openKeys, setOpenKeys] = useState<string[]>(openKeysFromPath);

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'Mon Profil',
        icon: <UserOutlined />,
      },
      {
        key: 'settings',
        label: 'Préférences',
        icon: <SettingOutlined />,
        onClick: go('/settings'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        label: 'Déconnexion',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: logout,
      },
    ],
  };

  const breadcrumbs = location.pathname.split('/').filter(i => i).map((item: string, index: number, arr: string[]) => ({
    title: item.charAt(0).toUpperCase() + item.slice(1),
    href: '/' + arr.slice(0, index + 1).join('/'),
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-100 shrink-0">
          <img
            src="/logo-horizontal.png"
            alt="L Benna Production"
            className={`transition-all duration-300 ${collapsed ? 'h-8' : 'h-10'} object-contain`}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }} className="custom-scrollbar">
          <div style={{ paddingBottom: '80px' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              openKeys={collapsed ? undefined : openKeys}
              onOpenChange={(keys: string[]) => setOpenKeys(keys)}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
          <div className="flex items-center">
            <Breadcrumb items={breadcrumbs as any} className="hidden md:flex" />
          </div>

          <div className="flex items-center gap-4">
            <Button type="text" shape="circle" icon={<BellOutlined />} />

            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <div className="hidden md:block text-sm">
                  <div className="font-medium leading-none">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-400">{user?.role}</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: '24px 24px 0', overflow: 'initial' }}>
          <div style={{ padding: 0, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>

        <div className="text-center p-6 text-gray-400 text-xs">
          L&apos;Benna Production Admin &copy; {new Date().getFullYear()}
        </div>
      </Layout>
    </Layout>
  );
}
