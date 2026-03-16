import { useEffect, useState } from 'react';
import { Table, message, Select } from 'antd';
import { Card } from '@/components/ui/Card';
import { categoryService, Category } from '@/services/categories';
import { UnorderedListOutlined } from '@ant-design/icons';

export default function CharacteristicsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            message.error('Erreur chargement des données');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleUpdateFeatures = async (id: string, features: string[]) => {
        try {
            await categoryService.update(id, { defaultFeatures: features });
            message.success('Caractéristiques mises à jour');
            fetchCategories();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const columns = [
        {
            title: 'Catégorie',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (name: string, record: Category) => (
                <div className="flex items-center gap-2">
                    {record.icon && <span>{record.icon}</span>}
                    <span className="font-bold">{name}</span>
                </div>
            )
        },
        {
            title: 'Points Forts / Caractéristiques Suggérées',
            dataIndex: 'defaultFeatures',
            key: 'features',
            render: (features: string[], record: Category) => (
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Ajoutez des caractéristiques..."
                    defaultValue={features || []}
                    onChange={(values: string[]) => handleUpdateFeatures(record.id, values)}
                    tokenSeparators={[',', ';']}
                />
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <UnorderedListOutlined className="text-blue-600" />
                    Gestion des Points Forts / Caractéristiques
                </h1>
                <p className="text-gray-500">
                    Définissez ici les caractéristiques types par catégorie. Elles seront suggérées lors de la création d'une offre de service.
                </p>
            </div>

            <Card className="shadow-sm rounded-xl border-none">
                <Table 
                    dataSource={categories} 
                    columns={columns} 
                    rowKey="id" 
                    loading={loading}
                    pagination={false}
                />
            </Card>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <div className="text-blue-600 mt-1">💡</div>
                <div className="text-sm text-blue-800">
                    <strong>Astuce :</strong> Les caractéristiques que vous ajoutez ici seront automatiquement proposées à l'utilisateur lorsqu'il sélectionne la catégorie correspondante dans la création d'une offre. Cela permet de standardiser vos services (ex: "Drone" aura toujours "Vidéo 4K" et "Stabilité" comme suggestions).
                </div>
            </div>
        </div>
    );
}
