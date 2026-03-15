import { useState } from 'react';
import { Modal, Upload, message, Typography, Button } from 'antd';
import { InboxOutlined, CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

interface BulkUploadModalProps {
    open: boolean;
    onClose: () => void;
    onUploadSuccess: (urls: string[]) => void;
    title?: string;
}

export default function BulkUploadModal({ open, onClose, onUploadSuccess, title = "Importation en Masse" }: BulkUploadModalProps) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file: any) => {
            formData.append('files', file);
        });

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload/bulk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const results = await response.json();
            const urls = results.map((r: { url: string }) => r.url);

            message.success(`${urls.length} fichiers importés avec succès.`);
            onUploadSuccess(urls);
            setFileList([]);
            onClose();
        } catch (error) {
            message.error('Échec de l\'importation en masse.');
        } finally {
            setUploading(false);
        }
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
        multiple: true,
        accept: "image/*,application/pdf",
        capture: false as any,
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <CloudUploadOutlined className="text-primary-600 text-xl" />
                    <span className="font-black uppercase tracking-tight">{title}</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} className="rounded-xl font-bold">
                    Annuler
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={uploading}
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    className="bg-gray-950 rounded-xl font-bold px-8"
                >
                    Démarrer l'importation ({fileList.length})
                </Button>,
            ]}
            width={700}
            centered
        >
            <div className="py-6 space-y-6">
                <Dragger {...props} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 group hover:border-primary-500 transition-all">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined className="text-gray-300 group-hover:text-primary-600 transition-colors" />
                    </p>
                    <p className="text-lg font-black text-gray-900 mb-2">Glissez-déposez vos fichiers ici</p>
                    <p className="text-xs text-gray-400 font-medium px-10">
                        Supports JPG, PNG, PDF et WebP. Maximum 20 fichiers par lot.
                        Qualité recommandée : 300 DPI pour l'impression.
                    </p>
                </Dragger>

                {fileList.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                            {fileList.map((file: UploadFile, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-50">
                                    <div className="flex items-center gap-3 truncate">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <Text className="text-xs font-bold truncate max-w-[400px]">{file.name}</Text>
                                    </div>
                                    <Text className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        {(file.size! / 1024 / 1024).toFixed(2)} MB
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
