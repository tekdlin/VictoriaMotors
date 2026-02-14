import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Card, CardContent } from '@/components/ui';
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
} from 'lucide-react';

export default async function HomePage() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <Header user={user ? { email: user.email ?? '' } : null} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-victoria-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-victoria-gold-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-victoria-gold-500/10 rounded-full blur-3xl" />

        <div className="relative container-wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-victoria-gold-400 text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ customers
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Drive Your Dreams{' '}
              <span className="text-victoria-gold-400">Today</span>
            </h1>
            
            <p className="text-xl text-victoria-slate-300 mb-8 max-w-2xl">
              Victoria Motors makes vehicle ownership accessible with flexible financing, 
              transparent pricing, and a seamless digital experience. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400">$50M+</p>
                <p className="text-victoria-slate-400 text-sm mt-1">Vehicles Financed</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400">10K+</p>
                <p className="text-victoria-slate-400 text-sm mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400">4.9★</p>
                <p className="text-victoria-slate-400 text-sm mt-1">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4">
              How It Works
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our simple, transparent process designed to get you on the road faster.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
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
              <div key={index} className="relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-victoria-slate-200" />
                )}
                <div className="relative bg-white">
                  <div className="w-24 h-24 mx-auto mb-6 bg-victoria-navy-50 rounded-2xl flex items-center justify-center relative">
                    <item.icon className="w-10 h-10 text-victoria-navy-700" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-victoria-gold-500 rounded-full flex items-center justify-center text-sm font-bold text-victoria-navy-900">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-victoria-navy-900 mb-2 text-center">
                    {item.title}
                  </h3>
                  <p className="text-victoria-slate-600 text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-victoria-slate-50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4">
              Why Choose Victoria Motors
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto">
              We're committed to making your automotive financing experience exceptional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                description: 'Choose monthly or yearly subscription plans that fit your budget.',
              },
              {
                icon: Wallet,
                title: 'Refundable Deposits',
                description: 'Your security deposit is fully refundable when you complete your agreement.',
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
              <Card key={index} variant="elevated" className="card-hover">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-victoria-navy-100 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-victoria-navy-700" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-victoria-navy-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-victoria-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-victoria-slate-600 max-w-2xl mx-auto">
              Choose the subscription plan that works best for you. No hidden fees, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => (
             <Card
               key={plan.id}
               variant="bordered"
               className={`relative overflow-hidden ${
                 plan.id === 'yearly' ? 'border-2 border-victoria-gold-500' : ''
              }`}
>
           {/* 7 Days Free Banner */}
           <div className="bg-emerald-500 text-white text-center py-3">
             <p className="text-lg font-bold">7 DAYS FREE TRIAL</p>
             <p className="text-sm opacity-90">No charge until trial ends</p>
           </div>
    
           {plan.id === 'yearly' && (
             <div className="absolute top-16 right-4 bg-victoria-gold-500 text-victoria-navy-900 text-xs font-bold px-3 py-1 rounded-full">
             BEST VALUE
            </div>
           )}
          <CardContent className="p-8">
            <h3 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-6">
             <span className="text-4xl font-display font-bold text-victoria-navy-900">
             {formatCurrency(plan.price)}
        </span>
        <span className="text-victoria-slate-500">/{plan.interval}</span>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-victoria-slate-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/register" className="block">
        <Button
          variant={plan.id === 'yearly' ? 'secondary' : 'outline'}
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

          <p className="text-center text-victoria-slate-500 mt-8">
            Plus a one-time refundable security deposit of 10% of your vehicle purchase value.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-victoria-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-victoria-gold-500/20 rounded-full blur-3xl" />
        
        <div className="relative container-wide text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-victoria-slate-300 max-w-2xl mx-auto mb-8">
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
      <section id="contact" className="section-padding bg-victoria-slate-50">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-victoria-navy-900 mb-4">
                Have Questions?
              </h2>
              <p className="text-victoria-slate-600 mb-8">
                Our team is here to help you every step of the way. Reach out to us and we'll get back to you within 24 hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-victoria-navy-700" />
                  </div>
                  <div>
                    <p className="font-medium text-victoria-navy-900">Call Us</p>
                    <p className="text-victoria-slate-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-victoria-navy-700" />
                  </div>
                  <div>
                    <p className="font-medium text-victoria-navy-900">Email Us</p>
                    <p className="text-victoria-slate-600">support@victoriamotors.com</p>
                  </div>
                </div>
              </div>
            </div>

            <Card variant="elevated">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-victoria-navy-800 mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 resize-none"
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
