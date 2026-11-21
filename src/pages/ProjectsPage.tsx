import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { SEOHead } from '../components/SEOHead';

const CATEGORY_FILTERS = [
  'All',
  'Residential & Commercial',
  'Residential',
  'Commercial',
  'Mixed-Use',
];

export function ProjectsPage() {
  const { projects, siteContent, dataLoading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <>
      <SEOHead
        title={`Our Projects – ${siteContent.companyName}`}
        description={`Browse all published residential and commercial real estate developments by ${siteContent.companyName}, including AL-Jalil Garden.`}
      />

      {/* Header */}
      <section className="bg-[#101B2D] text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A15B]">
            Development Portfolio
          </p>
          <h1 className="font-display text-balance text-4xl sm:text-5xl font-semibold">
            Our Real Estate Projects
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Every published development is managed through our dynamic portfolio system, making it
            simple to explore active residential and commercial opportunities as our footprint grows.
          </p>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="bg-white border-b border-slate-200 sticky top-16 lg:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Interactive Segmented Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#F6F7F9] border border-slate-200"
          >
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#101B2D] text-white'
                    : 'text-slate-600 hover:text-[#101B2D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project or location..."
              aria-label="Search projects"
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between text-xs text-slate-500">
            <span className="tabular-nums">
              Showing {filteredProjects.length} published{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          {dataLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-200 h-[420px] animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#101B2D]">
                No Matching Projects Found
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                No published projects matched your current category or search filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#101B2D] text-white text-sm font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Future Expansion & Advisory Notice */}
          <div className="mt-16 bg-white border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#A98642]">
                Investor Priority Desk
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#101B2D]">
                Looking for Upcoming Real Estate Launches?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register your investment preferences with our advisory team to receive updates as
                new residential and commercial developments are announced.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium whitespace-nowrap shrink-0 text-center transition-colors"
            >
              Register Interest
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
