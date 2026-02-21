import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchArticles, type Article } from '../lib/supabase';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const categories = ['All', 'World', 'National', 'Entertainment', 'Sports', 'Lifestyle', 'Opinion'];

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  async function loadArticles() {
    setLoading(true);
    const data = await fetchArticles({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      limit: 20,
    });
    setArticles(data);
    setLoading(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getExcerpt = (body: string, maxLength: number = 150) => {
    return body.length > maxLength ? body.substring(0, maxLength) + '...' : body;
  };

  return (
    <div className="min-h-screen">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-foreground">
              The Breakdown
            </Link>
            <nav className="hidden md:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/?category=${category}`}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-accent ${
                    selectedCategory === category
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        </div>
      ) : articles.length > 0 ? (
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            {/* Top Story */}
            <div className="mb-16">
              <Link
                to={`/article/${articles[0].id}`}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-lg bg-card/50 border border-border/50">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={articles[0].image_url || '/placeholder.jpg'}
                      alt={articles[0].headline}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-[10px] tracking-[0.15em] uppercase border border-accent/30 text-accent">
                        {articles[0].category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(articles[0].created_at)}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 group-hover:text-accent transition-colors duration-300">
                      {articles[0].headline}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {getExcerpt(articles[0].body, 200)}
                    </p>
                    <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all duration-300">
                      Read Full Story
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article, index) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group block h-full"
                >
                  <article className="h-full bg-card/30 border border-border/50 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 text-[10px] tracking-[0.15em] uppercase border border-accent/30 text-accent">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.created_at)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl font-serif font-semibold mb-3 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-3">
                      {article.headline}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {getExcerpt(article.body, 120)}
                    </p>

                    {/* Read more */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif mb-8">No articles found</h2>
            <p className="text-muted-foreground mb-8">
              Check back later for fresh satire content.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Browse All Categories
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
