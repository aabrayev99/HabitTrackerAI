'use client';

import Link from 'next/link';

// Full articles database
const articles = [
    {
        slug: 'habit-21-days',
        title: 'Как выработать привычку за 21 день: полный гайд',
        category: 'Дисциплина',
        date: '12 Фев 2024',
        imageGradient: 'from-purple-600 via-violet-600 to-indigo-700',
        excerpt: 'Миф о 21 дне: откуда он взялся и что говорит наука? Пошаговая методика формирования устойчивых привычек с конкретными примерами.',
    },
    {
        slug: 'morning-routine',
        title: 'Секреты утренней рутины успешных людей',
        category: 'Лайфстайл',
        date: '10 Фев 2024',
        imageGradient: 'from-pink-500 via-rose-500 to-orange-500',
        excerpt: 'Что делают Тим Кук, Опра и Илон Маск в первые 2 часа после пробуждения? Разбираем науку за утренними ритуалами.',
    },
    {
        slug: 'dopamine-fasting',
        title: 'Дофаминовое голодание: стоит ли пробовать?',
        category: 'Здоровье',
        date: '08 Фев 2024',
        imageGradient: 'from-emerald-500 via-green-600 to-teal-700',
        excerpt: 'Тренд из Кремниевой долины или научно обоснованная практика? Разбираемся в механизмах дофаминовой системы.',
    },
    {
        slug: 'productivity-systems',
        title: 'Системы продуктивности: GTD, ZTD и другие',
        category: 'Продуктивность',
        date: '05 Фев 2024',
        imageGradient: 'from-blue-500 via-sky-600 to-cyan-700',
        excerpt: 'Сравнение популярных систем управления задачами. Какая подойдёт именно вам?',
    },
    {
        slug: 'meditation-guide',
        title: 'Медитация для начинающих: с чего начать',
        category: 'Осознанность',
        date: '02 Фев 2024',
        imageGradient: 'from-amber-500 via-orange-500 to-red-600',
        excerpt: 'Научные исследования подтверждают: 10 минут медитации в день снижают стресс на 40%. Простой гайд для старта.',
    },
    {
        slug: 'sleep-optimization',
        title: 'Оптимизация сна: хакнуть свой циркадный ритм',
        category: 'Здоровье',
        date: '28 Янв 2024',
        imageGradient: 'from-indigo-600 via-purple-700 to-fuchsia-800',
        excerpt: 'Температура, свет, хронотип — все факторы, влияющие на качество сна, и как их контролировать.',
    },
];

export default function BlogArchivePage() {
    return (
        <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="aurora-blob-1 absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"></div>
                <div className="aurora-blob-2 absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="fixed w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#030014]/60 backdrop-blur-2xl border-b border-white/5">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                        Q
                    </div>
                    <span className="text-white text-lg font-semibold tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Q</span>-Habit</span>
                </Link>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← На главную</Link>
            </header>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог</h1>
                    <p className="text-gray-400 text-lg">Статьи о продуктивности, привычках и саморазвитии</p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className="card-pop rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 group block"
                        >
                            <div className={`h-52 w-full bg-gradient-to-br ${article.imageGradient} relative`}>
                                {/* Abstract 3D shapes overlay */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-md"></div>
                                    <div className="absolute bottom-4 left-8 w-12 h-12 rounded-lg bg-black/20 rotate-45 blur-sm"></div>
                                    <div className="absolute top-12 left-12 w-6 h-6 rounded-full bg-white/20"></div>
                                </div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 font-medium">
                                    {article.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs text-gray-500 mb-2 font-medium">{article.date}</div>
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-tight">{article.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{article.excerpt}</p>
                                <div className="mt-4 flex items-center text-purple-400 text-sm font-semibold group-hover:gap-3 gap-2 transition-all">
                                    Читать далее <span className="transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="border-t border-white/5 pt-8 pb-8 px-6 text-center text-gray-500 text-sm relative z-10">
                <p>&copy; {new Date().getFullYear()} Q-Habit. Твой путь к совершенству.</p>
            </footer>
        </div>
    );
}
