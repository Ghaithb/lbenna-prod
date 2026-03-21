import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Breadcrumb, theme, type MenuProps } from 'antd';
import {
  DashboardOutlined, TeamOutlined, CalendarOutlined,
  SettingOutlined, LogoutOutlined, AppstoreOutlined, FileTextOutlined,
  BellOutlined, UserOutlined, MessageOutlined,
  SecurityScanOutlined,
  PictureOutlined, ProjectOutlined,
  UnorderedListOutlined, StarOutlined
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

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'production',
      label: 'Gestion Production',
      type: 'group',
      children: [
        { key: '/services/bookings', icon: <CalendarOutlined />, label: 'Réservations', onClick: () => navigate('/services/bookings') },
        { key: '/services/calendar', icon: <CalendarOutlined />, label: 'Calendrier', onClick: () => navigate('/services/calendar') },
        { key: '/services/offers', icon: <AppstoreOutlined />, label: 'Offres & Services', onClick: () => navigate('/services/offers') },
        { key: '/services/categories', icon: <UnorderedListOutlined />, label: 'Configuration Catégories', onClick: () => navigate('/services/categories') },
      ]
    },
    {
      key: 'galerie',
      label: 'Galerie & Portfolio',
      type: 'group',
      children: [
        { key: '/services/portfolio', icon: <PictureOutlined />, label: 'Portfolio', onClick: () => navigate('/services/portfolio') },
        { key: '/projects', icon: <ProjectOutlined />, label: 'Projets (Détails)', onClick: () => navigate('/projects') },
      ]
    },
    {
      key: 'relations',
      label: 'Clients & Communication',
      type: 'group',
      children: [
        { key: '/users', icon: <TeamOutlined />, label: 'Clients', onClick: () => navigate('/users') },
        { key: '/marketing/messages', icon: <MessageOutlined />, label: 'Contacts / Messages', onClick: () => navigate('/marketing/messages') },
      ]
    },
    {
      key: 'system',
      label: 'Administration',
      type: 'group',
      children: [
        { key: '/content/pages', icon: <FileTextOutlined />, label: 'Gestion Pages', onClick: () => navigate('/content/pages') },
        { key: '/marketing/faqs', icon: <FileTextOutlined />, label: 'FAQs', onClick: () => navigate('/marketing/faqs') },
        { key: '/marketing/announcements', icon: <BellOutlined />, label: 'Annonces / Promo', onClick: () => navigate('/marketing/announcements') },
        { key: '/marketing/reviews', icon: <StarOutlined />, label: 'Avis Clients', onClick: () => navigate('/marketing/reviews') },
        { key: '/settings', icon: <SettingOutlined />, label: 'Paramètres', onClick: () => navigate('/settings') },
        { key: '/system/audit', icon: <SecurityScanOutlined />, label: 'Audit Logs', onClick: () => navigate('/system/audit') },
      ]
    },
  ];

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
      },
      {
        type: 'divider',
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

  // Generate breadcrumbs from location
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
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
          zIndex: 100
        }}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-100">
          <img 
            src="/logo-horizontal.png" 
            alt="L Benna Production" 
            className={`transition-all duration-300 ${collapsed ? 'h-8' : 'h-10'} object-contain`}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['production', 'galerie', 'relations', 'system']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
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
          L'Benna Production Admin &copy; {new Date().getFullYear()} - Version 1.0 (Ready for Success)
        </div>
      </Layout>
    </Layout>
  );
}