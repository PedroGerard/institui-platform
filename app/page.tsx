import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION - Apresentação Limpa e Impactante */}
      <section className="relative bg-white py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Cultura, Inovação e Impacto Social
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Desenvolvimento territorial e fortalecimento comunitário no Ceará.
            </h1>
            <p className="text-lg text-slate-600 mt-4 leading-relaxed">
              O Instituto Incentive atua estruturando soluções integradas de impacto social, econômico e cultural para transformar vidas no semiárido cearense.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/projetos"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                Conhecer Projetos
              </Link>
              <Link
                href="/apoie"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                Apoie nossa Causa
              </Link>
            </div>
          </div>

          <div className="relative h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-xl">
            <OptimizedImage
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
              alt="Paisagem e cultura representativa do Ceará"
              priority={true}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. DADOS DE IMPACTO - Visualidade e Clareza */}
      <section className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">2001</p>
            <p className="text-sm text-emerald-100 mt-1">Ano de Fundação</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">+20</p>
            <p className="text-sm text-emerald-100 mt-1">Anos de Atuação</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">Ceará</p>
            <p className="text-sm text-emerald-100 mt-1">Foco Territorial</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400">OSC</p>
            <p className="text-sm text-emerald-100 mt-1">Organização Social</p>
          </div>
        </div>
      </section>

      {/* 3. PILARES DE ATUAÇÃO - Sem Jargões Burocráticos */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900">Nossos Eixos de Atuação</h2>
          <p className="text-slate-600 mt-2">
            Iniciativas focadas na emancipação das famílias e na valorização das raízes locais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              🌱
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Desenvolvimento Territorial</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Projetos voltados para a sustentabilidade, convivência com o semiárido e fortalecimento das comunidades rurais.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              🎨
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cultura e Artesanato</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Incentivo aos mestres da cultura popular, artesanato tradicional cearense, literatura de cordel e tradição oral.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              💡
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Inovação Social</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mecanismos inovadores de geração de renda, capacitação profissional e inclusão produtiva de jovens e mulheres.
            </p>
          </div>
        </div>
      </section>

      {/* 4. IDENTIDADE CULTURAL DO CEARÁ (Imagens Otimizadas Pexels) */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-emerald-700 text-sm font-semibold uppercase">Tradição & Vida</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">A Riqueza da Nossa Terra</h2>
            </div>
            <Link href="/projetos" className="text-emerald-700 font-semibold hover:underline mt-4 md:mt-0">
              Ver todos os projetos &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <div className="h-64 relative">
                <OptimizedImage
                  src="https://images.pexels.com/photos/7262402/pexels-photo-7262402.jpeg"
                  alt="Artesanato tradicional cearense"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Artesanato & Geração de Renda</h3>
                <p className="text-slate-600 text-sm">
                  Valorização das técnicas tradicionais de tecelagem, palha e cerâmica como fonte autônoma de sustento.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <div className="h-64 relative">
                <OptimizedImage
                  src="https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg"
                  alt="Tradição musical dos violeiros do Ceará"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Tradições Populares & Violeiros</h3>
                <p className="text-slate-600 text-sm">
                  Preservação do patrimônio imaterial, cantoria, cordel e festivais culturais por todo o Ceará.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHAMADA DE AÇÃO (CTA) */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Quer construir essa transformação conosco?</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Conectamos investidores sociais, parceiros governamentais e comunidades para gerar soluções de longo prazo.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contato"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Seja um Parceiro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
