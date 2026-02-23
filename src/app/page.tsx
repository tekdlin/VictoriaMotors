import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Card, CardContent } from '@/components/ui';
import { SmoothScrollLink } from '@/components/ui/SmoothScrollLink';
import { getCurrentUser } from '@/server/services/auth.service';
import { SUBSCRIPTION_PLANS, formatCurrency } from '@/lib/stripe/config';
import {
  Shield,
  Clock,
  CreditCard,
  Users,
  CheckCircle,
  ArrowRight,
  Car,
  FileText,
  Wallet,
  Headphones,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { HeroVisual } from '@/components/features';

export default async function HomePage() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <Header user={user ? { email: user.email ?? '' } : null} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-victoria-navy-950">
        <div className="absolute inset-0 bg-victoria-gradient-hero" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-victoria-gold-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-victoria-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-mesh-subtle" />

        <div className="relative container-wide flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          <div className="max-w-3xl flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-victoria-gold-400 text-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ customers
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
              Drive Your Dreams{' '}
              <span className="text-victoria-gold-400">Today!</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Victoria Motors makes vehicle ownership accessible with flexible financing, 
              transparent pricing, and a seamless digital experience. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-stretch sm:flex-wrap">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto min-h-[3.25rem] sm:min-h-[3.5rem] justify-center">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <SmoothScrollLink href="/#how-it-works" className="block">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[3.25rem] sm:min-h-[3.5rem] justify-center border-2 border-white/50 text-white hover:bg-white/15 hover:border-white/70 hover:text-white">
                  Learn More
                </Button>
              </SmoothScrollLink>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/15">
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400 tracking-tight">$50M+</p>
                <p className="text-white/80 text-sm mt-1">Vehicles Financed</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400 tracking-tight">10K+</p>
                <p className="text-white/80 text-sm mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400 tracking-tight">4.9★</p>
                <p className="text-white/80 text-sm mt-1">Customer Rating</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-1 justify-center lg:justify-end items-center min-w-0 max-w-xl xl:max-w-2xl">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-victoria-slate-100">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto leading-relaxed">
              Get started in minutes with our simple, transparent process designed to get you on the road faster.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-8 relative">
            {/* Connector line - visible on desktop */}
            <div className="hidden md:block absolute top-[5.5rem] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-victoria-gold-400/40 via-victoria-gold-400/60 to-victoria-gold-400/40 rounded-full" aria-hidden />

            {[
              {
                step: '01',
                icon: Users,
                title: 'Create Account',
                description: 'Sign up as an individual or business with our quick registration process.',
              },
              {
                step: '02',
                icon: FileText,
                title: 'Upload Documents',
                description: 'Securely upload your identification and verification documents.',
              },
              {
                step: '03',
                icon: Wallet,
                title: 'Pay Deposit',
                description: 'Pay a 10% refundable security deposit on your chosen vehicle value.',
              },
              {
                step: '04',
                icon: Car,
                title: 'Start Driving',
                description: 'Access your customer portal and begin your vehicle ownership journey.',
              },
            ].map((item, index) => (
              <Card key={index} variant="elevated" className="relative overflow-visible card-hover border-victoria-slate-200/60">
                <CardContent className="p-6 lg:p-8 text-center">
                  {/* Step number - large and subtle behind content */}
                  <span className="absolute top-4 right-4 font-display text-5xl font-bold text-victoria-navy-900/10 leading-none">
                    {item.step}
                  </span>
                  {/* Icon container with gold accent */}
                  <div className="relative inline-flex mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-victoria-navy-900 flex items-center justify-center shadow-victoria">
                      <item.icon className="w-8 h-8 text-victoria-gold-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-victoria-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-victoria-navy-900 shadow-victoria">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-victoria-navy-900 mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-victoria-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Why Choose Victoria Motors */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-3">
              The benefits
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4 tracking-tight">
              Why Choose Victoria Motors
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto leading-relaxed">
              We're committed to making your automotive financing experience exceptional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Protected',
                description: 'Your data is encrypted and protected with industry-leading security standards.',
              },
              {
                icon: Clock,
                title: 'Quick Approval',
                description: 'Get approved in minutes, not days. Our streamlined process saves you time.',
              },
              {
                icon: CreditCard,
                title: 'Flexible Payments',
                description: 'Choose monthly or fiscal subscription plans that fit your budget.',
              },
              {
                icon: Wallet,
                title: 'Refundable Deposits',
                description: 'Your security deposit is refundable upon request, less applicable fees.',
              },
              {
                icon: FileText,
                title: 'Digital Portal',
                description: 'Manage your account, view invoices, and track payments online 24/7.',
              },
              {
                icon: Headphones,
                title: 'Expert Support',
                description: 'Our dedicated team is here to help you every step of the way.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                variant="bordered"
                className="group relative overflow-hidden border-victoria-slate-200/70 bg-white transition-all duration-300 hover:shadow-victoria-lg hover:-translate-y-1 hover:border-victoria-gold-400/30"
              >
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-victoria-navy-900 flex items-center justify-center shadow-victoria group-hover:bg-victoria-navy-800 transition-colors">
                      <feature.icon className="w-7 h-7 text-victoria-gold-400" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="font-display text-lg font-semibold text-victoria-navy-900 mb-2 tracking-tight group-hover:text-victoria-navy-800">
                        {feature.title}
                      </h3>
                      <p className="text-victoria-slate-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-victoria-slate-100">
        <div className="container-wide">
          <div className="text-center mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose the subscription plan that works best for you. No hidden fees, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
             <Card
               key={plan.id}
               variant="bordered"
               className={`relative overflow-hidden transition-all duration-300 ${
                 plan.id === 'fiscal' ? 'border-2 border-victoria-gold-500 shadow-victoria-lg' : ''
              }`}
            >
           <div className="bg-emerald-500 text-white text-center py-3.5">
             <p className="text-sm font-bold tracking-wide">7 DAYS FREE TRIAL</p>
             <p className="text-xs opacity-90 mt-0.5">No charge until trial ends</p>
           </div>
    
           {plan.id === 'fiscal' && (
             <div className="absolute top-16 right-4 bg-victoria-gold-500 text-victoria-navy-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-victoria">
             BEST VALUE
            </div>
           )}
          <CardContent className="p-8">
            <h3 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2 tracking-tight">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-6">
             <span className="text-4xl font-display font-bold text-victoria-navy-900 tracking-tight">
             {formatCurrency(plan.price)}
        </span>
        <span className="text-victoria-slate-500">/{plan.interval}</span>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-victoria-slate-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/register" className="block">
        <Button
          variant={plan.id === 'fiscal' ? 'secondary' : 'outline'}
          className="w-full"
          size="lg"
        >
          Start Free Trial
        </Button>
      </Link>
    </CardContent>
  </Card>
))}
          </div>

          <p className="text-center text-victoria-slate-500 text-sm mt-10">
            Plus a one-time refundable security deposit (min. $650, or 10% of your vehicle purchase value).
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-victoria-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-victoria-gradient-hero" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-victoria-gold-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-victoria-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-mesh-subtle" />
        
        <div className="relative container-wide text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of satisfied customers who have made their vehicle ownership dreams a reality with Victoria Motors.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Your Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Headline + contact info */}
            <div>
              <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-3">
                Get in touch
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4 tracking-tight">
                Have Questions?
              </h2>
              <p className="text-victoria-slate-600 mb-10 leading-relaxed max-w-lg">
                Our team is here to help you every step of the way. Reach out and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:contact@victoriamotorsinc.com"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-victoria-slate-200/80 bg-victoria-slate-50/50 hover:border-victoria-navy-200 hover:bg-victoria-navy-50/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-victoria-navy-900 flex items-center justify-center shadow-victoria group-hover:bg-victoria-navy-800 transition-colors">
                    <Mail className="w-6 h-6 text-victoria-gold-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-victoria-navy-900">Email Us</p>
                    <p className="text-victoria-slate-600 text-sm">contact@victoriamotorsinc.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-victoria-slate-200/80 bg-victoria-slate-50/50">
                  <div className="w-12 h-12 rounded-xl bg-victoria-navy-900 flex items-center justify-center shadow-victoria">
                    <Headphones className="w-6 h-6 text-victoria-gold-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-victoria-navy-900">Call Us</p>
                    <p className="text-victoria-slate-600 text-sm">Available Mon–Fri, 9am–5pm CT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <Card variant="bordered" className="border-victoria-slate-200/80 shadow-victoria overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-victoria-gold-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-victoria-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-victoria-navy-900 tracking-tight">Send a message</h3>
                    <p className="text-sm text-victoria-slate-600">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5 tracking-tight">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl border border-victoria-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-400/40 focus:border-victoria-navy-400 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5 tracking-tight">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl border border-victoria-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-400/40 focus:border-victoria-navy-400 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5 tracking-tight">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-victoria-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-400/40 focus:border-victoria-navy-400 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5 tracking-tight">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-victoria-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-400/40 focus:border-victoria-navy-400 resize-none transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
