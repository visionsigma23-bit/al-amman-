import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Project } from '../types/realestate';
import { SafeImage } from './SafeImage';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group bg-white border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 hover:border-[#C5A15B]/60 hover:shadow-md">
      <Link
        to={`/projects/${project.slug}`}
        className="block aspect-[4/3] overflow-hidden bg-[#101B2D]"
      >
        <SafeImage
          src={project.coverImage}
          alt={`${project.name} – ${project.category}`}
          fallbackTitle={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
        <div className="space-y-3">
          {/* Unboxed metadata line per Zero-Pill Discipline */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-[#A98642] font-semibold">{project.status}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.location}</span>
          </div>

          <h3 className="font-display text-2xl font-semibold text-[#101B2D] tracking-tight">
            <Link
              to={`/projects/${project.slug}`}
              className="hover:text-[#A98642] transition-colors"
            >
              {project.name}
            </Link>
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 truncate min-w-0 flex-1">
            {project.plotSizes && project.plotSizes.length > 0
              ? `Plots: ${project.plotSizes.slice(0, 3).join(' · ')}`
              : 'Residential & Commercial Options'}
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#101B2D] group-hover:text-[#A98642] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View Details</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
