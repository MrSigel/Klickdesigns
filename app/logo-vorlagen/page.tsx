import Header from '../components/Header'
import Footer from '../components/Footer'
import { createClient as createServerClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

type LogoTemplate = {
  id: string
  title: string
  description: string | null
  png_path: string
  svg_path: string
  category?: string
}

const categoryOptions = [
  { value: 'all', label: 'Alle' },
  { value: 'business', label: 'Business' },
  { value: 'creator', label: 'Creator' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'verein', label: 'Verein' },
  { value: 'handwerk', label: 'Handwerk' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'food', label: 'Food' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'other', label: 'Sonstiges' },
]

async function getTemplates(kategorie: string) {
  const supabase = await createServerClient()
  let q = supabase
    .from('logo_templates')
    .select('id, title, description, png_path, svg_path, category')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (kategorie && kategorie !== 'all') {
    q = q.eq('category', kategorie)
  }
  const { data } = await q
  return (data || []) as LogoTemplate[]
}

export default async function LogoVorlagenPage({ searchParams }: { searchParams: Promise<{ kategorie?: string }> }) {
  const params = await searchParams
  const kategorie = params.kategorie || 'all'
  const templates = await getTemplates(kategorie)

  const LogoVorlagenInteractive = dynamic(() => import('./LogoVorlagenInteractive'), { ssr: false })

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ruby">
            Kostenlos
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] font-bold tracking-[-0.04em] text-anthracite sm:text-[3.2rem]">
            Kostenlose Logo-Vorlagen
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-[16px] text-anthracite/65">
            Lade fertige Logo-Vorlagen als PNG und SVG herunter. Einfach E-Mail angeben und sofort loslegen.
          </p>
        </div>

        {/* Server rendered filter as links for SEO and crawler */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categoryOptions.map((cat) => {
            const isActive = kategorie === cat.value
            const href = cat.value === 'all' ? '/logo-vorlagen' : `/logo-vorlagen?kategorie=${cat.value}`
            return (
              <a
                key={cat.value}
                href={href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all border ${
                  isActive
                    ? 'bg-ruby text-offwhite border-ruby shadow-sm'
                    : 'border-anthracite/15 text-anthracite/70 hover:border-ruby/30 hover:text-anthracite bg-white'
                }`}
              >
                {cat.label}
              </a>
            )
          })}
        </div>

        {templates.length === 0 ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-12 text-center">
            <p className="text-anthracite/70">Aktuell werden neue kostenlose Logo-Vorlagen vorbereitet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const pngUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logo-vorlagen/${tpl.png_path}`
              return (
                <div key={tpl.id} className="rounded-xl border border-anthracite/10 bg-white overflow-hidden flex flex-col">
                  <div className="bg-offwhite p-6 flex items-center justify-center h-56">
                    <img 
                      src={pngUrl} 
                      alt="Kostenlose Logo-Vorlage von Klickdesigns" 
                      className="max-h-44 object-contain" 
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      {/* Client interactive for modal/download */}
                      <LogoVorlagenInteractive tpl={tpl} type="png" />
                      <LogoVorlagenInteractive tpl={tpl} type="svg" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
