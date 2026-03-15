import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectsService, Project } from '../services/projects';

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    projectsService.getBySlug(slug).then((p) => setProject(p)).catch(() => setProject(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!project) return <div className="p-8">Projet introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full rounded-lg mb-6" />}
      <p className="text-lg text-gray-700 mb-4">{project.summary}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: typeof project.content === 'string' ? project.content : JSON.stringify(project.content) }} />
    </div>
  );
}
