// ═══════════════════════════════════════════════════════════════════════
// New Concept Media — Portfolio Site
// Single-page React component
// ═══════════════════════════════════════════════════════════════════════

import { useRef, useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import {
  motion,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Globe,
  TrendingUp,
  Zap,
  Search,
  Calendar,
  RefreshCw,
  Clock,
  Users,
  Shield,
  Star,
  CheckCircle,
  Mail,
  Circle,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// ANIMATION CONFIG
// Custom easing — not ease-in-out. Expo-out feel.
// ═══════════════════════════════════════════════════════════════════════
const EASE = [0.22, 1, 0.36, 1]
const EASE_SOFT = [0.25, 0.46, 0.45, 0.94]

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_SOFT } },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const staggerFast = {
  visible: { transition: { staggerChildren: 0.07 } },
}

// ═══════════════════════════════════════════════════════════════════════
// ANIMATED GROUP — staggered entrance wrapper (ibelick/animated-group)
// ═══════════════════════════════════════════════════════════════════════
function AnimatedGroup({ children, className, variants }) {
  const containerVariants = variants?.container ?? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = variants?.item ?? {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  }
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={className}>
      {children && Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>{child}</motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// NCM LOGO — SVG-based wordmark, works on dark backgrounds
// ═══════════════════════════════════════════════════════════════════════
function NCMLogo({ variant = 'nav' }) {
  const big = variant === 'footer'
  const sz = big ? 30 : 24
  const lineW = big ? 18 : 12
  const tagSz = big ? 7.5 : 6
  const mediaSz = big ? 8 : 6.5

  return (
    <div className="flex flex-col items-center select-none" style={{ lineHeight: 1, gap: big ? 4 : 3 }}>
      {/* NCM lettermark */}
      <div className="flex items-baseline" style={{ letterSpacing: '-0.04em' }}>
        <span className="font-display font-black text-cream" style={{ fontSize: sz, lineHeight: 1 }}>N</span>
        <span
          className="font-display font-black"
          style={{
            fontSize: sz,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #0d3fa0 0%, #1e5fd4 45%, #3d8ef0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >C</span>
        <span className="font-display font-black text-cream" style={{ fontSize: sz, lineHeight: 1 }}>M</span>
      </div>
      {/* Wordmark */}
      <div className="flex flex-col items-center" style={{ gap: 2 }}>
        <div className="flex items-center" style={{ gap: 5 }}>
          <div className="h-px bg-cream/25" style={{ width: lineW }} />
          <span className="font-display font-semibold text-cream/65 uppercase" style={{ fontSize: tagSz, letterSpacing: '0.16em' }}>New Concept</span>
          <div className="h-px bg-cream/25" style={{ width: lineW }} />
        </div>
        <span className="font-display font-semibold uppercase" style={{ fontSize: mediaSz, letterSpacing: '0.22em', color: '#3d8ef0' }}>Media</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ELEGANT SHAPE — floating pill shapes for hero background
// Adapted from shape-landing-hero component (kokonut UI)
// ═══════════════════════════════════════════════════════════════════════

function ElegantShape({ className = '', delay = 0, width = 400, height = 100, rotate = 0, gradient = 'from-white/[0.08]' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// GLOW ORB — pulsing radial gradient used as section backgrounds
// ═══════════════════════════════════════════════════════════════════════
function GlowOrb({ className = '', size = 400, color = '#5B4FE9', opacity = 0.18, duration = 10, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, background: color, filter: `blur(${Math.round(size * 0.14)}px)` }}
      animate={{ opacity: [opacity * 0.65, opacity * 1.55, opacity * 0.65], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// REUSABLE PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════

function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden:  { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

function RevealGroup({ children, className, id }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
    >
      {children}
    </motion.div>
  )
}

function FadeUp({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2em] uppercase ${light ? 'text-accent' : 'text-muted'}`}>
      <span className={`block w-6 h-px ${light ? 'bg-accent' : 'bg-muted'}`} />
      {children}
    </span>
  )
}

function Btn({ href, children, primary = false, className = '' }) {
  return (
    <a
      href={href}
      className={`
        inline-flex items-center gap-2.5 font-medium text-sm transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink
        ${primary
          ? 'bg-accent hover:bg-accent-light text-cream px-6 py-3 rounded-full active:scale-[0.97]'
          : 'text-cream-muted hover:text-cream border border-[#ffffff1a] hover:border-[#ffffff30] px-6 py-3 rounded-full active:scale-[0.97]'
        }
        ${className}
      `}
    >
      {children}
    </a>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// DATA — ALL PLACEHOLDER SECTIONS CLEARLY MARKED
// ═══════════════════════════════════════════════════════════════════════

// PLACEHOLDER: Replace with real project data, images, and metrics
const PORTFOLIO = [
  {
    id: 1,
    name: 'Luminate Aesthetics',
    industry: 'Med Spa',
    metric: '+62% consultation bookings',
    accent: '#A78BFA',
    bg: 'from-violet-900/40 via-indigo-950/60 to-ink',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&fit=crop',
  },
  {
    id: 2,
    name: 'Hartwell Legal Group',
    industry: 'Law Firm',
    metric: '3× qualified lead volume',
    accent: '#93C5FD',
    bg: 'from-blue-900/30 via-slate-900/50 to-ink',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&fit=crop',
  },
  {
    id: 3,
    name: 'Summit Family Dental',
    industry: 'Dental Practice',
    metric: '+48% new patient inquiries',
    accent: '#6EE7B7',
    bg: 'from-emerald-900/30 via-teal-950/50 to-ink',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&fit=crop',
  },
  {
    id: 4,
    name: 'Atlas Home Services',
    industry: 'Home Services',
    metric: '2.1× booking rate',
    accent: '#FCD34D',
    bg: 'from-amber-900/30 via-orange-950/50 to-ink',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80&fit=crop',
  },
  {
    id: 5,
    name: 'Apex Performance',
    industry: 'Fitness Studio',
    metric: '+89% membership conversions',
    accent: '#FCA5A5',
    bg: 'from-rose-900/30 via-pink-950/50 to-ink',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
  },
  {
    id: 6,
    name: 'Meridian Advisory',
    industry: 'Consulting',
    metric: '+55% discovery call bookings',
    accent: '#5EEAD4',
    bg: 'from-teal-900/30 via-cyan-950/50 to-ink',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fit=crop',
  },
]

const SERVICES = [
  {
    Icon: Globe,
    title: 'Custom Website Design',
    desc: 'Built from scratch around your brand, not stretched from a template or adapted from someone else\'s project.',
  },
  {
    Icon: TrendingUp,
    title: 'Conversion-Focused Development',
    desc: 'Every layout, CTA placement, and page flow exists to move visitors toward one action: contacting you.',
  },
  {
    Icon: Zap,
    title: 'Brand & Visual Identity',
    desc: 'Logo, color, typography, a cohesive system that works consistently across every customer touchpoint.',
  },
  {
    Icon: Search,
    title: 'SEO Foundation',
    desc: 'Site architecture, page speed, and on-page signals built in from day one, not bolted on as an afterthought.',
  },
  {
    Icon: Calendar,
    title: 'Booking & Lead Capture',
    desc: 'Schedulers, forms, and CRM integrations wired in so no inquiry falls through the cracks after hours.',
  },
  {
    Icon: RefreshCw,
    title: 'Ongoing Partnership',
    desc: 'Monthly updates, performance reviews, and proactive support, long after your launch day.',
  },
]

// PLACEHOLDER: Replace with real testimonials, client names, and photos
const TESTIMONIALS = [
  {
    name: 'Dr. Sarah K.',
    role: 'Founder, Luminate Aesthetics', // PLACEHOLDER — real client
    text: 'We went from a dated, DIY-feeling website to something we\'re genuinely proud to send every potential client. Consultation bookings jumped 62% in the first two months. They understood our patients better than our last agency did.',
    stars: 5,
    initial: 'S',
  },
  {
    name: 'Michael T.',
    role: 'Managing Partner, Hartwell Legal', // PLACEHOLDER — real client
    text: 'I\'ve worked with three agencies before this. New Concept Media was the first team that pushed back when my instincts were wrong, and they were right. The site drives real inbound now. I can actually track it.',
    stars: 5,
    initial: 'M',
  },
  {
    name: 'Jason R.',
    role: 'Owner, Atlas Home Services', // PLACEHOLDER — real client
    text: 'Finally a contractor site that doesn\'t look like every other contractor site. Booking requests more than doubled in the first month. The ROI was obvious inside 30 days.',
    stars: 5,
    initial: 'J',
  },
]

const PROCESS = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We learn your business, your customers, and what\'s standing between you and consistent growth, before a single wireframe is drawn.',
  },
  {
    num: '02',
    title: 'Strategy & Design',
    desc: 'Full site architecture and high-fidelity designs built around your goals, not our portfolio preferences.',
  },
  {
    num: '03',
    title: 'Build & Launch',
    desc: 'Development, content, QA testing, and a clean launch. No loose ends, no "we\'ll fix it next week."',
  },
  {
    num: '04',
    title: 'Optimize & Grow',
    desc: 'Performance data, iterative improvements, and ongoing partnership, for businesses that want a long-term edge.',
  },
]

const DIFFERENTIATORS = [
  {
    Icon: TrendingUp,
    title: 'Conversion-first, not just beautiful',
    desc: 'Every design decision is evaluated against one question: will this move visitors toward action? Aesthetics serve strategy, not the other way around.',
  },
  {
    Icon: Clock,
    title: '2–3 week delivery',
    desc: 'You shouldn\'t wait three months for a website. We\'re structured for fast, focused execution — without cutting corners on quality.',
  },
  {
    Icon: Users,
    title: 'Ongoing partnership, not one-time projects',
    desc: 'The best-performing websites are maintained and improved over time. We offer monthly retainers for businesses that want a team in their corner.',
  },
  {
    Icon: Shield,
    title: 'Senior work, no hand-offs',
    desc: 'No junior team assignments. No outsourcing. The people you speak with are the people designing and building your site.',
  },
]

const FAQS = [
  {
    q: 'What does a typical project cost?',
    a: 'Projects typically range from $1,000–$5,000 depending on scope, page count, and integrations. We give you a clear, specific number in the first call, no vague "it depends" and no surprise invoices.',
  },
  {
    q: 'How long does a project take?',
    a: 'Most projects go from signed agreement to live site in 2–4 weeks. More complex builds with custom functionality typically take 4–6 weeks. We move fast without sacrificing the details that matter.',
  },
  {
    q: 'What platforms do you build on?',
    a: 'We build on Next.js, Webflow, and WordPress, whichever fits your goals, team, and long-term maintenance needs. We\'ll give you an honest recommendation in the first conversation.',
  },
  {
    q: 'Do you handle hosting and maintenance?',
    a: 'Yes. We offer ongoing maintenance plans covering hosting, security, performance monitoring, software updates, and content changes. We\'re not a project-and-disappear agency.',
  },
  {
    q: 'What\'s included in a website project?',
    a: 'Design, development, mobile optimization, basic SEO setup, booking/form integrations, and full launch support. You\'ll know exactly what\'s included before you commit to anything.',
  },
  {
    q: 'What industries do you work with?',
    a: 'Service businesses of all kinds, med spas, law firms, dental practices, home service companies, financial advisors, fitness studios, clinics, consultancies, boutique brands. If you have clients and want more of them, we\'re a strong fit.',
  },
]

// ═══════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════
function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#work',    label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#why-us',  label: 'Why Us' },
    { href: '#faq',     label: 'FAQ' },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div
          className={`w-full transition-all duration-300 ${
            scrolled
              ? 'max-w-3xl mt-3 px-5 bg-[#0e0d16]/90 backdrop-blur-xl border border-[#ffffff12] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'max-w-7xl px-6 md:px-12 bg-ink/80 backdrop-blur-xl border-b border-[#ffffff0a] rounded-none'
          }`}
        >
        <div className="h-[68px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group" aria-label="New Concept Media">
            <img
              src="/ncm-logo-white-slova.png"
              alt="New Concept Media"
              className="h-12 w-auto"
              style={{ mixBlendMode: 'screen' }}
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-muted hover:text-cream text-sm font-medium transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-cream text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200 active:scale-[0.97]"
          >
            Book a Call
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-cream-muted hover:text-cream p-2 -mr-2 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/96 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
                onClick={() => setOpen(false)}
                className="text-2xl font-display font-semibold text-cream hover:text-accent transition-colors"
              >
                {label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
              onClick={() => setOpen(false)}
              className="mt-4 bg-accent text-cream font-medium px-8 py-3.5 rounded-full"
            >
              Book a Call
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// HERO — HeroGeometric style
// ═══════════════════════════════════════════════════════════════════════
function Hero() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
    }),
  }

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-ink">
      {/* Ambient gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Floating pill shapes — exact positions from HeroGeometric */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3} width={600} height={140} rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5} width={500} height={120} rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4} width={300} height={80} rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6} width={200} height={60} rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7} width={150} height={40} rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
        >
          <Circle className="h-2 w-2 fill-rose-500/80" />
          <span className="text-sm text-white/60 tracking-wide">
            Web Design Studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
          <h1
            className="font-display font-bold leading-[1] tracking-[-0.03em] mb-6 md:mb-8"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 5.5rem)' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              Your website should be
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              your best salesperson.
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
          <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10 tracking-wide">
            We design and build conversion-focused websites for service businesses, delivered in 2–3 weeks, without the agency overhead or the six-month wait.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://calendly.com/newconceptmedia1/30min"
              className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-light text-cream font-medium px-7 py-3.5 rounded-full transition-colors duration-200 active:scale-[0.97] text-sm"
            >
              Book a free strategy call
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2.5 text-white/50 hover:text-white border border-white/[0.12] hover:border-white/[0.25] font-medium px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
            >
              View our work
            </a>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-center gap-3 text-white/30 text-sm">
            <div className="flex -space-x-2">
              {['S', 'M', 'J', 'A'].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-raised border border-white/[0.08] flex items-center justify-center text-[10px] font-medium text-white/50"
                >
                  {l}
                </div>
              ))}
            </div>
            <span>Trusted by service businesses across the US</span>
          </div>
        </motion.div>
      </div>

      {/* Top + bottom vignette — exact from HeroGeometric */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/80 pointer-events-none" />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// PROBLEM / SHIFT
// ═══════════════════════════════════════════════════════════════════════
function Problem() {
  const problems = [
    'Outdated design that signals "we\'re not serious" before a word is read',
    'No clear path to booking, calling, or filling out a form',
    'Built for vanity, looks okay on a screenshot, fails in the real world',
    'Slow on mobile, where most of your potential clients are looking',
  ]

  return (
    <section className="relative bg-[#0F0E17] py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={520} color="#5B4FE9" opacity={0.24} className="top-[-15%] right-[-8%]" duration={12} />
        <GlowOrb size={300} color="#7C3AED" opacity={0.18} className="bottom-[5%] left-[-5%]" duration={9} delay={3} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <Reveal>
            <SectionLabel light>The Problem</SectionLabel>
            <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5 mb-8"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              Most business websites are expensive brochures.
            </h2>
            <p className="text-muted text-lg font-light leading-relaxed mb-6">
              They exist. They have a phone number. They show up somewhere on page two of Google. But they don't sell anything. They don't build trust. They don't move visitors toward action.
            </p>
            <p className="text-muted text-lg font-light leading-relaxed">
              And they're usually the result of hiring the wrong people, using the wrong tools, or trying to build something on a budget that guaranteed mediocrity.
            </p>
          </Reveal>

          {/* Right: problem list */}
          <RevealGroup className="space-y-4">
            {problems.map((p, i) => (
              <FadeUp key={i}>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors duration-200">
                  <div className="w-5 h-5 rounded-full border-2 border-white/[0.15] mt-0.5 flex-shrink-0" />
                  <p className="text-cream/80 font-medium text-[15px] leading-snug">{p}</p>
                </div>
              </FadeUp>
            ))}
            <FadeUp>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-accent border border-accent/80 mt-6">
                <CheckCircle className="w-5 h-5 text-cream mt-0.5 flex-shrink-0" />
                <p className="text-cream font-semibold text-[15px] leading-snug">
                  There's a better way. It starts with a website built specifically to convert your visitors into clients.
                </p>
              </div>
            </FadeUp>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════
function Services() {
  return (
    <section className="relative bg-ink py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={600} color="#5B4FE9" opacity={0.16} className="bottom-[-15%] right-[5%]" duration={14} delay={2} />
        <GlowOrb size={300} color="#7C3AED" opacity={0.14} className="top-[10%] left-[-5%]" duration={11} delay={1} />
        {/* Horizontal beam sweep */}
        <motion.div
          className="absolute top-0 h-full w-[45%]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(91,79,233,0.04), transparent)' }}
          animate={{ x: ['-200%', '400%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 7 }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="mb-16 max-w-2xl">
          <SectionLabel light>What We Do</SectionLabel>
          <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Everything your site needs to compete, nothing it doesn't.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ Icon, title, desc }) => (
            <FadeUp key={title}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(91,79,233,0.35)' }}
                transition={{ duration: 0.25, ease: EASE_SOFT }}
                className="group p-8 rounded-2xl bg-surface border border-[#ffffff0a] hover:bg-raised cursor-default transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-cream text-[17px] tracking-tight mb-3">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// PORTFOLIO
// PLACEHOLDER: All project data, images, and metrics are placeholders
// ═══════════════════════════════════════════════════════════════════════
function Portfolio() {
  return (
    <section id="work" className="relative bg-surface py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={450} color="#5B4FE9" opacity={0.22} className="top-[5%] left-[-5%]" duration={11} />
        <GlowOrb size={350} color="#7C3AED" opacity={0.16} className="bottom-[10%] right-[5%]" duration={13} delay={4} />
        {/* Fine grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Grid fade — vignette to center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 40%, rgba(19,18,26,0.7) 100%)',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <SectionLabel light>Selected Work</SectionLabel>
            <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              Results across industries.
            </h2>
          </div>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Every project is built from scratch. Every metric is real. {/* PLACEHOLDER: swap with real outcomes */}
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function PortfolioCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <FadeUp>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-raised border border-[#ffffff08]"
        style={{ aspectRatio: '4/3' }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.35, ease: EASE_SOFT }}
      >
        {/* Project photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        {/* Dark overlay — ensures text readability and on-brand feel */}
        <div className={`absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/85 transition-opacity duration-500 group-hover:opacity-90`} />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm flex flex-col justify-end p-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: project.accent }}
            />
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase"
              style={{ color: project.accent }}>
              {project.industry}
            </span>
          </div>
          <h3 className="font-display font-bold text-cream text-xl tracking-tight mb-2">
            {project.name}
          </h3>
          <p className="text-cream-muted text-sm">{project.metric}</p>
          <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-medium">
             
          </div>
        </motion.div>

        {/* Always-visible label (bottom of card) */}
        <motion.div
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
        >
          <span
            className="text-[11px] font-medium tracking-[0.12em] uppercase mb-1.5 block"
            style={{ color: project.accent }}
          >
            {project.industry}
          </span>
          <p className="font-display font-semibold text-cream text-[15px] tracking-tight">
            {project.name}
          </p>
        </motion.div>
      </motion.div>
    </FadeUp>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// PROCESS
// ═══════════════════════════════════════════════════════════════════════
function Process() {
  return (
    <section id="process" className="relative bg-ink py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={500} color="#5B4FE9" opacity={0.16} className="top-[20%] left-[25%]" duration={15} delay={1} />
        {/* Vertical scan beam */}
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(91,79,233,0.2) 20%, rgba(91,79,233,0.35) 50%, rgba(91,79,233,0.2) 80%, transparent 100%)' }}
          animate={{ y: ['-100px', '120vh'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-20 max-w-xl mx-auto">
          <SectionLabel light>How We Work</SectionLabel>
          <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            A process designed for speed without shortcuts.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent" />

          {PROCESS.map(({ num, title, desc }, i) => (
            <FadeUp key={num} delay={i * 0.1}>
              <div className="relative p-8 rounded-2xl bg-surface border border-[#ffffff08] hover:border-[#ffffff14] transition-colors duration-300">
                <div className="font-display font-bold text-[40px] leading-none tracking-[-0.04em] text-accent/20 mb-6 select-none">
                  {num}
                </div>
                <h3 className="font-display font-semibold text-cream text-lg tracking-tight mb-3">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// DIFFERENTIATORS
// ═══════════════════════════════════════════════════════════════════════
function Differentiators() {
  return (
    <section id="why-us" className="relative bg-[#100F1A] py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={600} color="#FB7185" opacity={0.16} className="top-[-10%] right-[-5%]" duration={13} delay={1} />
        <GlowOrb size={380} color="#5B4FE9" opacity={0.18} className="bottom-[0%] left-[5%]" duration={10} delay={4} />
        {/* Diagonal beam */}
        <motion.div
          className="absolute top-0 h-full w-[30%]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.03), transparent)' }}
          animate={{ x: ['-200%', '500%'] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear', repeatDelay: 9 }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="mb-16 max-w-xl">
          <SectionLabel light>Why New Concept Media</SectionLabel>
          <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            What makes us different from every other agency you've seen.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIFFERENTIATORS.map(({ Icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3, borderColor: 'rgba(91,79,233,0.35)' }}
                transition={{ duration: 0.25, ease: EASE_SOFT }}
                className="flex gap-5 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.035] transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-cream text-[17px] tracking-tight mb-2">
                    {title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// PLACEHOLDER: All testimonials are fictional — replace before launch
// ═══════════════════════════════════════════════════════════════════════
function Testimonials() {
  return (
    <section className="relative bg-surface py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={700} color="#5B4FE9" opacity={0.16} className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" duration={16} />
        <GlowOrb size={300} color="#7C3AED" opacity={0.14} className="top-[5%] right-[5%]" duration={10} delay={5} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.018) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-16 max-w-xl mx-auto">
          <SectionLabel light>Client Results</SectionLabel>
          <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            What happens after we build your site.
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, text, stars, initial }) => (
            <FadeUp key={name}>
              <div className="p-8 rounded-2xl bg-raised border border-[#ffffff08] flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-cream-muted text-[15px] leading-relaxed flex-1 mb-8">
                  "{text}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* PLACEHOLDER: Replace with real photo */}
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center text-accent font-semibold text-sm font-display flex-shrink-0">
                    {initial}
                  </div>
                  <div>
                    <p className="text-cream font-semibold text-sm">{name}</p>
                    <p className="text-muted text-[12px]">{role}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════
function FAQ() {
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <section id="faq" className="relative bg-ink py-28 md:py-36 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowOrb size={500} color="#5B4FE9" opacity={0.16} className="bottom-[-5%] right-[-5%]" duration={12} delay={2} />
        <GlowOrb size={250} color="#7C3AED" opacity={0.14} className="top-[10%] left-[0%]" duration={9} delay={0} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '100% 80px',
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-16">
          <SectionLabel light>FAQ</SectionLabel>
          <h2 className="font-display font-bold text-cream tracking-[-0.025em] leading-[1.05] mt-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Everything you'll want to know before the call.
          </h2>
        </Reveal>

        <RevealGroup className="space-y-2">
          {FAQS.map(({ q, a }, i) => (
            <FadeUp key={q}>
              <div className="border border-[#ffffff0a] rounded-xl overflow-hidden hover:border-[#ffffff14] transition-colors duration-200">
                <button
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left group"
                  aria-expanded={activeIdx === i}
                >
                  <span className={`font-display font-semibold text-[15px] tracking-tight transition-colors duration-200 ${activeIdx === i ? 'text-accent' : 'text-cream group-hover:text-cream'}`}>
                    {q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeIdx === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: EASE_SOFT }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors duration-200 ${activeIdx === i ? 'text-accent' : 'text-muted'}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_SOFT }}
                      className="overflow-hidden"
                    >
                      <p className="px-7 pb-6 text-muted text-[15px] leading-relaxed">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FINAL CTA
// ═══════════════════════════════════════════════════════════════════════
function FinalCTA() {
  return (
    <section
      id="contact"
      className="bg-accent py-28 md:py-36 relative overflow-hidden"
    >
      {/* Aurora shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(120deg, #4338CA, #5B4FE9, #7C3AED, #5B4FE9, #6D28D9, #4338CA)',
          backgroundSize: '300% 300%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Glow corners */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-300/[0.08] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="text-accent-light text-[11px] font-medium tracking-[0.2em] uppercase mb-6">
            — Free Strategy Call —
          </p>
          <h2 className="font-display font-bold text-cream tracking-[-0.03em] leading-[0.96] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Stop sending people to a website that doesn't sell.
          </h2>
          <p className="text-cream/70 text-lg font-light leading-relaxed max-w-xl mx-auto mb-12">
            Book a 30-minute strategy call. We'll audit your current site, identify what's costing you clients, and show you what a better one looks like.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* PLACEHOLDER: Replace Calendly link with your actual scheduling link */}
            <a
              href="https://calendly.com/newconceptmedia1/30min"
              className="inline-flex items-center gap-2.5 bg-cream text-accent font-semibold px-8 py-4 rounded-full hover:bg-white transition-colors duration-200 text-sm active:scale-[0.97]"
            >
              Book a free strategy call
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:newconceptmedia1@gmail.com"
              className="inline-flex items-center gap-2.5 text-cream/80 hover:text-cream font-medium text-sm transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              {/* PLACEHOLDER: Replace with real email */}
              newconceptmedia1@gmail.com
            </a>
          </div>

          <p className="text-cream/40 text-xs mt-10">
            No commitment. No sales pitch. Just an honest conversation about your website.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════
function Footer() {
  const links = [
    { href: '#work',    label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#why-us',  label: 'Why Us' },
    { href: '#faq',     label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <footer className="bg-[#080710] border-t border-[#ffffff06] py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <img
            src="/ncm-logo-white-slova.png"
            alt="New Concept Media"
            className="h-16 w-auto"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-muted hover:text-cream text-sm transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <a
            href="mailto:newconceptmedia1@gmail.com"  /* PLACEHOLDER */
            className="text-muted hover:text-cream text-sm transition-colors duration-200 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            newconceptmedia1@gmail.com
          </a>
        </div>

        <div className="border-t border-[#ffffff06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} New Concept Media. All rights reserved.
          </p>
          <p className="text-[#3a3a52] text-xs">
            Web Design Studio — Service Businesses
          </p>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <div className="bg-ink text-cream font-sans antialiased overflow-x-hidden">
      <Nav />
      <Hero />
      <Problem />
      <Services />
      <Portfolio />
      <Process />
      <Differentiators />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <Analytics />
    </div>
  )
}
