import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminProjectsService } from '@/services/projects';
import { mediaService } from '@/services/media';

export default function ProjectsEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [published, setPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminProjectsService.get(id).then((p: any) => {
      setTitle(p.title || ''); setSlug(p.slug || ''); setSummary(p.summary || ''); setPublished(!!p.published);
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploaded = await mediaService.uploadSingle(imageFile);
        imageUrl = uploaded.url;
      }

      if (id) await adminProjectsService.update(id, { title, slug, summary, imageUrl, published });
      navigate('/projects');
    } catch (err: any) {
      alert(err?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Éditer un projet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Résumé</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="inline-flex items-center"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="mr-2" /> Publier</label>
        </div>
        <div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
        </div>
      </form>
    </div>
  );
}
