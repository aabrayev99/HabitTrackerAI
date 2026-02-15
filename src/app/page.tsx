'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { BarChart3, Bot, Trophy, ClipboardList } from 'lucide-react';

// =============================================
// CUSTOM CURSOR COMPONENT
// =============================================
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Trail particles pool
    const trailPool: HTMLDivElement[] = [];
    for (let i = 0; i < 10; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      document.body.appendChild(trail);
      trailPool.push(trail);
    }
    let trailIndex = 0;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      // Trail effect
      const trail = trailPool[trailIndex % trailPool.length];
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.opacity = '0.6';
      setTimeout(() => { trail.style.opacity = '0'; }, 300);
      trailIndex++;
    };

    const addHover = () => cursor.classList.add('hovering');
    const removeHover = () => cursor.classList.remove('hovering');
    const addClick = () => { cursor.classList.add('clicking'); setTimeout(() => cursor.classList.remove('clicking'), 300); };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', addClick);

    // Observe DOM for dynamically added clickables
    const attachHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label[for]');
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };
    attachHoverListeners();
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', addClick);
      observer.disconnect();
      trailPool.forEach(t => t.remove());
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}

// =============================================
// MINI SVG CHART (Fake line chart with neon glow)
// =============================================
const MiniLineChart = ({ color = '#a855f7', data }: { color?: string; data: number[] }) => {
  const width = 200;
  const height = 60;
  const maxVal = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (v / maxVal) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full neon-glow" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line"
      />
    </svg>
  );
};

// =============================================
// CIRCULAR PROGRESS (Mini donut)
// =============================================
const CircularProgress = ({ percent, size = 44, color = '#a855f7' }: { percent: number; size?: number; color?: string }) => {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// =============================================
// NAVBAR
// =============================================
const Navbar = () => (
  <nav className="fixed w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#030014]/60 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
        Q
      </div>
      <span className="text-white text-lg font-semibold tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Q</span>-Habit</span>
    </div>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
      <a href="#features" className="hover:text-white transition-colors">Возможности</a>
      <a href="#reviews" className="hover:text-white transition-colors">Отзывы</a>
      <a href="#blog" className="hover:text-white transition-colors">Блог</a>
    </div>

    <div className="flex items-center gap-4">
      <Link href="/auth/signin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Войти</Link>
      <Link href="/auth/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
        Регистрация
      </Link>
    </div>
  </nav>
);

// =============================================
// REVIEW CARD (with glow border)
// =============================================
const ReviewCard = ({ name, role, text, avatar }: any) => (
  <div className="glow-border card-pop">
    <div className="glass-card p-6 h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-full ${avatar} flex items-center justify-center text-lg shadow-lg`}>
          {name[0]}
        </div>
        <div>
          <div className="text-white font-medium">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
      <div className="flex text-yellow-500 mb-3 text-xs gap-0.5">
        {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  </div>
);

// =============================================
// BLOG CARD
// =============================================
const BlogCard = ({ title, category, date, imageGradient, slug }: any) => (
  <Link href={`/blog/${slug}`} className="card-pop rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer group block">
    <div className={`h-52 w-full bg-gradient-to-br ${imageGradient} relative`}>
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 font-medium">
        {category}
      </div>
    </div>
    <div className="p-6">
      <div className="text-xs text-gray-500 mb-2 font-medium">{date}</div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors leading-tight">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">
        Узнайте, как современные методики помогают достигать целей быстрее и эффективнее.
      </p>
      <div className="mt-4 flex items-center text-purple-400 text-sm font-semibold group-hover:gap-3 gap-2 transition-all">
        Читать далее <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  </Link>
);

// =============================================
// TRANSFORMATION SECTION
// =============================================
const transformCards = [
  {
    id: 'freedom',
    title: 'Свобода',
    subtitle: 'Разорви цепи старых привычек',
    description: 'Каждая сломанная цепь — это шаг к новой версии себя. Q-Habit помогает освободиться от деструктивных паттернов.',
    image: '/freedom.jpg',
    className: 'card-freedom',
  },
  {
    id: 'evolution',
    title: 'Эволюция',
    subtitle: 'Вырасти из пепла прошлого',
    description: 'Из хаоса рождается порядок. Трансформируй вредные привычки в топливо для роста.',
    image: '/evolution.jpg',
    className: 'card-evolution',
  },
  {
    id: 'clarity',
    title: 'Ясность',
    subtitle: 'Увидь мир без искажений',
    description: 'Когда шум стихает, открывается вселенная возможностей. Осознанность — твоя суперсила.',
    image: '/clarity.jpg',
    className: 'card-clarity',
  },
];

const TransformationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Scroll Reveal via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.scroll-reveal');
    cards?.forEach((card) => observer.observe(card));

    // Parallax mouse tracking
    const handleMouseMove = (e: MouseEvent, card: HTMLDivElement) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = card.querySelector('.card-image-wrap img') as HTMLElement;
      if (img) {
        img.style.transform = `translate(${-x * 15}px, ${-y * 15}px) scale(1.05)`;
      }
    };
    const handleMouseLeave = (card: HTMLDivElement) => {
      const img = card.querySelector('.card-image-wrap img') as HTMLElement;
      if (img) {
        img.style.transform = '';
      }
    };

    cardsRef.current.forEach((card) => {
      if (!card) return;
      const move = (e: MouseEvent) => handleMouseMove(e, card);
      const leave = () => handleMouseLeave(card);
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      (card as any)._parallaxMove = move;
      (card as any)._parallaxLeave = leave;
    });

    return () => {
      observer.disconnect();
      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.removeEventListener('mousemove', (card as any)._parallaxMove);
        card.removeEventListener('mouseleave', (card as any)._parallaxLeave);
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="transformation" className="px-6 max-w-7xl mx-auto mb-32 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center mb-16 scroll-reveal">
        <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Трансформация</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Трансформация <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">жизни</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Три концепции, которые лежат в основе Q-Habit: свобода от прошлого, эволюция сознания и ясность цели.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {transformCards.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className={`transform-card ${card.className} scroll-reveal`}
          >
            {/* Image */}
            <div className="card-image-wrap">
              <img src={card.image} alt={card.title} loading="lazy" />

              {/* Freedom: Floating particles */}
              {card.id === 'freedom' && (
                <div className="particles">
                  {[
                    { l: 22, b: 12, d: 5.2, dl: 0.8, w: 3.1, h: 2.8 },
                    { l: 45, b: 28, d: 4.5, dl: 2.3, w: 2.4, h: 3.5 },
                    { l: 68, b: 8, d: 6.1, dl: 1.1, w: 3.8, h: 2.2 },
                    { l: 33, b: 35, d: 3.8, dl: 3.7, w: 2.1, h: 4.1 },
                    { l: 78, b: 22, d: 5.6, dl: 0.4, w: 4.2, h: 2.6 },
                    { l: 55, b: 15, d: 4.2, dl: 4.1, w: 2.8, h: 3.3 },
                    { l: 18, b: 32, d: 6.5, dl: 1.9, w: 3.5, h: 4.5 },
                    { l: 82, b: 5, d: 3.4, dl: 3.2, w: 2.3, h: 2.4 },
                    { l: 40, b: 38, d: 5.9, dl: 0.2, w: 4.6, h: 3.0 },
                    { l: 62, b: 18, d: 4.8, dl: 2.8, w: 2.6, h: 3.8 },
                    { l: 28, b: 25, d: 3.2, dl: 4.5, w: 3.3, h: 2.1 },
                    { l: 72, b: 30, d: 5.4, dl: 1.5, w: 2.9, h: 4.3 },
                  ].map((p, j) => (
                    <div
                      key={j}
                      className="particle"
                      style={{
                        left: `${p.l}%`,
                        bottom: `${p.b}%`,
                        animationDuration: `${p.d}s`,
                        animationDelay: `${p.dl}s`,
                        width: `${p.w}px`,
                        height: `${p.h}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Evolution: Digital smoke */}
              {card.id === 'evolution' && <div className="smoke-overlay" />}

              {/* Clarity: Scan beam + Galaxy spin */}
              {card.id === 'clarity' && (
                <>
                  <div className="scan-beam" />
                  <div className="galaxy-spin" />
                </>
              )}
            </div>

            {/* Card Text Content */}
            <div className="relative z-10 p-6 -mt-8">
              <p className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">{card.subtitle}</p>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// =============================================
// MAIN PAGE COMPONENT
// =============================================
export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white overflow-hidden">

      <CustomCursor />

      {/* ============================================
          AURORA BOREALIS ANIMATED BACKGROUND
          ============================================ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Aurora Blobs */}
        <div className="aurora-blob-1 absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-600/25 rounded-full blur-[150px]"></div>
        <div className="aurora-blob-2 absolute top-[20%] left-[-15%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[130px]"></div>
        <div className="aurora-blob-3 absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px]"></div>
        <div className="aurora-blob-2 absolute top-[50%] left-[40%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* ============================================
          FLOATING 3D BOKEH SPHERES
          ============================================ */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        {/* Sphere 1 - Large, left */}
        <div className="float-slow absolute top-[15%] left-[5%] w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10 blur-[2px]"></div>
        {/* Sphere 2 - Medium, right top */}
        <div className="float-medium absolute top-[25%] right-[8%] w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/15 to-transparent border border-blue-400/10 blur-[1px]" style={{ animationDelay: '1s' }}></div>
        {/* Sphere 3 - Small, right mid */}
        <div className="float-fast absolute top-[60%] right-[12%] w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/15 to-transparent border border-pink-500/10 blur-[1px]" style={{ animationDelay: '2s' }}></div>
        {/* Sphere 4 - Large, bottom left */}
        <div className="float-medium absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/10 to-transparent border border-indigo-400/10 blur-[2px]" style={{ animationDelay: '3s' }}></div>
        {/* Crystal/Diamond shape */}
        <div className="float-slow absolute top-[40%] left-[3%] w-16 h-16 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rotate-45 blur-[1px]" style={{ animationDelay: '1.5s' }}></div>
        <div className="float-fast absolute bottom-[35%] right-[5%] w-10 h-10 bg-gradient-to-br from-purple-300/10 to-transparent border border-purple-300/5 rotate-12 rounded-lg blur-[1px]" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20">

        {/* ============================================
            HERO SECTION
            ============================================ */}
        <section className="px-6 text-center max-w-5xl mx-auto mb-32">

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1] animate-fade-in-up">
            Ваше вдохновение <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              каждый день
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Современная платформа для отслеживания привычек, анализа продуктивности и поиска мотивации.
            Используйте силу данных для улучшения своей жизни.
          </p>

          {/* CTA Button with Glow */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth/signup" className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all btn-glow text-lg">
              Начать лучшую жизнь
            </Link>
          </div>

          {/* ============================================
                INTERACTIVE DASHBOARD PREVIEW
                ============================================ */}
          <div className="mt-20 rounded-2xl border border-white/10 p-3 bg-white/[0.02] backdrop-blur-sm shadow-2xl animate-fade-in-up transform hover:scale-[1.005] transition-transform duration-700" style={{ animationDelay: '0.45s' }}>
            <div className="rounded-xl overflow-hidden bg-[#08020f]/80 backdrop-blur-md relative">

              {/* Dashboard Top Bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Журнал привычек</div>
                <div className="w-16"></div>
              </div>

              <div className="p-6">
                {/* Row 1: Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="glass-card p-4 flex items-center gap-3">
                    <CircularProgress percent={87} size={40} color="#a855f7" />
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Выполнено</div>
                      <div className="text-lg font-bold text-white">87%</div>
                    </div>
                  </div>
                  <div className="glass-card p-4 flex items-center gap-3">
                    <CircularProgress percent={65} size={40} color="#3b82f6" />
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Стрик</div>
                      <div className="text-lg font-bold text-white">24д</div>
                    </div>
                  </div>
                  <div className="glass-card p-4 flex items-center gap-3">
                    <CircularProgress percent={92} size={40} color="#10b981" />
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Утро</div>
                      <div className="text-lg font-bold text-white">92%</div>
                    </div>
                  </div>
                  <div className="glass-card p-4 flex items-center gap-3">
                    <CircularProgress percent={89} size={40} color="#f59e0b" />
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Спорт</div>
                      <div className="text-lg font-bold text-white">89%</div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Chart + Checklist */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Line Chart Panel */}
                  <div className="col-span-2 glass-card p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Активность за неделю</div>
                      <div className="flex gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>Привычки</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>Цели</span>
                      </div>
                    </div>
                    <div className="h-24 relative">
                      <MiniLineChart color="#a855f7" data={[30, 50, 45, 70, 65, 85, 80]} />
                      <div className="absolute inset-0">
                        <MiniLineChart color="#3b82f6" data={[20, 35, 55, 40, 60, 50, 75]} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] text-gray-600">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>

                  {/* Habit Checklist Panel */}
                  <div className="glass-card p-5">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Сегодня</div>
                    <div className="space-y-3">
                      {[
                        { title: 'Медитация', done: true },
                        { title: 'Чтение', done: true },
                        { title: 'Зарядка', done: false },
                        { title: 'Английский', done: false },
                      ].map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[8px] transition-all ${h.done ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'border border-gray-600'}`}>
                            {h.done && '✓'}
                          </div>
                          <span className={h.done ? 'text-gray-400 line-through' : 'text-gray-200'}>{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            TRANSFORMATION SECTION — «Трансформация жизни»
            ============================================ */}
        <TransformationSection />

        {/* ============================================
            FEATURES SECTION
            ============================================ */}
        <section id="features" className="px-6 max-w-6xl mx-auto mb-32 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Почему <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Q-Habit</span>?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Инструменты, которые действительно помогают формировать привычки</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-transparent" style={{ stroke: 'url(#icon-gradient)' }} />, title: 'Умная аналитика', desc: 'Модели прогнозирования и тепловые карты: вы видите не только прошлое, но и будущее своих привычек.' },
              { icon: <Bot className="w-6 h-6 text-gray-400 group-hover:text-transparent" style={{ stroke: 'url(#icon-gradient)' }} />, title: 'AI-Консультант', desc: 'Персональный тренер, который знает ваши слабые места и даёт точечные рекомендации.' },
              { icon: <Trophy className="w-6 h-6 text-gray-400 group-hover:text-transparent" style={{ stroke: 'url(#icon-gradient)' }} />, title: 'Геймификация', desc: 'Стрики, ачивки, уровни — формирование привычек превращается в увлекательную игру.' },
            ].map((f, i) => (
              <div key={i} className="glow-border card-pop cursor-default group">
                <div className="glass-card p-8 h-full">
                  {/* SVG Gradient Definition for icon hover */}
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================
            REVIEWS SECTION
            ============================================ */}
        <section id="reviews" className="px-6 max-w-7xl mx-auto mb-32 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Что говорят наши пользователи</h2>
            <p className="text-gray-400">Присоединяйтесь к тысячам людей, изменивших свою жизнь</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewCard
              name="Алексей С."
              role="Product Manager, Яндекс"
              text="Потрясающий интерфейс! Это первый трекер, которым я действительно пользуюсь каждый день. Аналитика просто на высоте."
              avatar="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <ReviewCard
              name="Екатерина М."
              role="UX-Дизайнер, Tinkoff"
              text="Как дизайнер, я в восторге от визуального стиля. Тёмная тема идеальна, а геймификация реально мотивирует не прерывать цепочку."
              avatar="bg-gradient-to-br from-pink-500 to-rose-500"
            />
            <ReviewCard
              name="Дмитрий К."
              role="Fullstack Developer"
              text="Функционал превзошел ожидания. API интеграции работают стабильно. Очень удобно отслеживать профессиональные навыки."
              avatar="bg-gradient-to-br from-purple-500 to-indigo-500"
            />
          </div>
        </section>

        {/* ============================================
            BLOG / POSTS SECTION
            ============================================ */}
        <section id="blog" className="px-6 max-w-7xl mx-auto mb-20 scroll-mt-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2">Последние статьи</h2>
              <p className="text-gray-400">Советы по продуктивности и мотивации</p>
            </div>
            <Link href="/blog" className="hidden md:block text-purple-400 hover:text-white transition-colors font-medium">
              Все статьи →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlogCard
              title="Как выработать привычку за 21 день: полный гайд"
              category="Дисциплина"
              date="12 Фев 2024"
              imageGradient="from-purple-600 via-violet-600 to-indigo-700"
              slug="habit-21-days"
            />
            <BlogCard
              title="Секреты утренней рутины успешных людей"
              category="Лайфстайл"
              date="10 Фев 2024"
              imageGradient="from-pink-500 via-rose-500 to-orange-500"
              slug="morning-routine"
            />
            <BlogCard
              title="Дофаминовое голодание: стоит ли пробовать?"
              category="Здоровье"
              date="08 Фев 2024"
              imageGradient="from-emerald-500 via-green-600 to-teal-700"
              slug="dopamine-fasting"
            />
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="text-purple-400 hover:text-white transition-colors font-medium">
              Читать все статьи →
            </Link>
          </div>
        </section>

        {/* ============================================
            FOOTER
            ============================================ */}
        <footer className="border-t border-white/5 pt-16 pb-8 px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Q-Habit. Твой путь к совершенству.</p>
        </footer>

      </main>
    </div>
  )
}
