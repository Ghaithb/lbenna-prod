import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Form, Input, Button, Switch, InputNumber, Tabs, message, Space, Divider, Typography } from 'antd';
import { 
  GlobalOutlined, 
  ContactsOutlined, 
  ShareAltOutlined, 
  SettingOutlined, 
  SafetyCertificateOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import { settingsService, type AppSettings } from '@/services/settings';

const { Title, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getAll();
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Erreur lors du chargement des paramètres');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values: AppSettings) => {
    setSaving(true);
    try {
      await settingsService.update(values);
      message.success('Paramètres enregistrés avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const items = [
    {
      key: 'general',
      label: <span className="flex items-center gap-2"><GlobalOutlined /> Général</span>,
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Card title="Paiement & Facturation" bordered={false} className="shadow-sm border border-gray-100 rounded-2xl">
            <Form.Item name="paymentEnabled" label="Activer le paiement en ligne" valuePropName="checked">
              <Switch checkedChildren="Oui" unCheckedChildren="Non" />
            </Form.Item>
            <Text type="secondary" className="text-xs block -mt-4 mb-6">
              Permet aux clients de payer leurs devis et réservations directement via la plateforme.
            </Text>

            <Divider />

            <Title level={5}>Automatisation Marketing</Title>
            <Form.Item name="marketing_anniversary_automation_enabled" label="Coupons d'Anniversaire" valuePropName="checked">
              <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
            </Form.Item>
            <Text type="secondary" className="text-xs block -mt-4 mb-6">
              Envoie automatiquement un code promo aux clients lors de l'anniversaire de leur premier projet.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="marketing_anniversary_coupon_value" label="Valeur du coupon (%)">
                <InputNumber min={0} max={100} className="w-full rounded-xl" />
              </Form.Item>
              <Form.Item name="marketing_anniversary_coupon_validity_days" label="Durée de validité (jours)">
                <InputNumber min={1} className="w-full rounded-xl" />
              </Form.Item>
            </div>
          </Card>
        </Space>
      )
    },
    {
      key: 'contact',
      label: <span className="flex items-center gap-2"><ContactsOutlined /> Contacts</span>,
      children: (
        <Card title="Coordonnées Publiques" bordered={false} className="shadow-sm border border-gray-100 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <Form.Item name="contact_phone" label="Téléphone" rules={[{ required: true, message: 'Requis' }]}>
              <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="+216 ..." className="rounded-xl h-11" />
            </Form.Item>
            <Form.Item name="contact_email" label="Email de contact" rules={[{ required: true, type: 'email', message: 'Email invalide' }]}>
              <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="contact@..." className="rounded-xl h-11" />
            </Form.Item>
            <Form.Item name="contact_address" label="Adresse Physique" className="md:col-span-2">
              <Input prefix={<EnvironmentOutlined className="text-gray-400" />} placeholder="Rue, Ville, Pays" className="rounded-xl h-11" />
            </Form.Item>
          </div>
        </Card>
      )
    },
    {
      key: 'social',
      label: <span className="flex items-center gap-2"><ShareAltOutlined /> Réseaux Sociaux</span>,
      children: (
        <Card title="Liens Sociaux" bordered={false} className="shadow-sm border border-gray-100 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <Form.Item name="social_facebook" label="Facebook">
              <Input prefix={<FacebookOutlined className="text-[#1877f2]" />} placeholder="https://facebook.com/..." className="rounded-xl h-11" />
            </Form.Item>
            <Form.Item name="social_instagram" label="Instagram">
              <Input prefix={<InstagramOutlined className="text-[#e4405f]" />} placeholder="https://instagram.com/..." className="rounded-xl h-11" />
            </Form.Item>
            <Form.Item name="social_youtube" label="YouTube">
              <Input prefix={<YoutubeOutlined className="text-[#ff0000]" />} placeholder="https://youtube.com/..." className="rounded-xl h-11" />
            </Form.Item>
            <Form.Item name="social_linkedin" label="LinkedIn">
              <Input prefix={<LinkedinOutlined className="text-[#0a66c2]" />} placeholder="https://linkedin.com/in/..." className="rounded-xl h-11" />
            </Form.Item>
          </div>
        </Card>
      )
    },
    {
      key: 'system',
      label: <span className="flex items-center gap-2"><SafetyCertificateOutlined /> Système</span>,
      children: (
        <Space direction="vertical" className="w-full" size="middle">
          <Card title="Configuration API" bordered={false} className="shadow-sm border border-gray-100 rounded-2xl">
            <Form.Item label="Clé API active">
              <Input.Password value="sk_production_lbenna_82h7v92..." disabled className="rounded-xl h-11 bg-gray-50" />
            </Form.Item>
            <Button disabled>Régénérer la clé API</Button>
          </Card>

          <Card title="Sauvegardes & Maintenance" bordered={false} className="shadow-sm border border-gray-100 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Base de données</Text>
                <br />
                <Text type="secondary" className="text-xs">Dernière sauvegarde automatique il y a 4 heures.</Text>
              </div>
              <Button icon={<SaveOutlined />}>Lancer Backup</Button>
            </div>
          </Card>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <SettingOutlined className="text-blue-600" />
            Paramètres
          </h1>
          <p className="text-gray-500 mt-1">Configurez l'ensemble de votre plateforme L Benna Production.</p>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          loading={saving}
          onClick={() => form.submit()}
          className="bg-gray-950 hover:bg-gray-800 rounded-xl px-8 font-bold uppercase tracking-widest text-[10px] h-12 border-none shadow-xl shadow-gray-200"
        >
          Enregistrer tout
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="settings-form"
      >
        <Tabs 
          defaultActiveKey="general" 
          items={items} 
          type="card"
          className="custom-tabs"
        />
      </Form>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-tabs .ant-tabs-nav::before { border-bottom: none !important; }
        .custom-tabs .ant-tabs-tab { border: none !important; background: transparent !important; margin-right: 8px !important; border-radius: 12px !important; padding: 12px 24px !important; font-weight: 600; color: #94a3b8; transition: all 0.3s; }
        .custom-tabs .ant-tabs-tab-active { background: #f8fafc !important; color: #1e293b !important; }
        .custom-tabs .ant-tabs-tab:hover { color: #1e293b; }
      `}} />
    </div>
  );
}