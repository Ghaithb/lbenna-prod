import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminProjectsService, AdminProject } from '@/services/projects';

const { Title, Text } = Typography;

export function ProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await adminProjectsService.list();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error: any) {
      message.error(error?.message || 'Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await adminProjectsService.delete(id);
      message.success('Projet supprimé');
      setProjects((prev: AdminProject[]) => prev.filter((p: AdminProject) => p.id !== id));
    } catch (error: any) {
      message.error(error?.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      title: 'Projet',
      key: 'project',
      render: (_: any, record: AdminProject) => (
        <Space size="middle">
          {record.imageUrl && (
            <img
              src={record.imageUrl}
              alt={record.title}
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <div>
            <div className="font-bold">{record.title}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.slug}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Résumé',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: 'Statut',
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'success' : 'default'}>
          {published ? 'Publié' : 'Brouillon'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AdminProject) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/projects/${record.id}/edit`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>Anciens Projets (Legacy)</Title>
          <Text type="secondary">Gestion des archives et projets archivés</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects/new')}
        >
          Créer un projet
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
