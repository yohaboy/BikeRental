import React from 'react';
import { ArrowRight, CheckCircle, Users, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-display mb-6">
                            Reimagining Urban <span className="text-primary">Mobility</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            AddisBike is more than just a rental service. We're a community-driven platform connecting bike owners with riders, making city exploration accessible, sustainable, and fun.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Sustainable Future</h3>
                            <p className="text-muted-foreground">
                                We believe in a greener planet. Every ride taken on a bike is one less car on the road, reducing carbon footprints one pedal at a time.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community First</h3>
                            <p className="text-muted-foreground">
                                We empower local bike owners to earn extra income while providing riders with affordable and convenient transportation options.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
                            <p className="text-muted-foreground">
                                Your safety is our priority. All rides are insured, and our community is verified to ensure a secure experience for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/20 rounded-[2rem] rotate-3 blur-2xl opacity-50"></div>
                            <img
                                src="/assets/bike3.jpg"
                                alt="Our Story"
                                className="relative z-10 w-full rounded-[2rem] shadow-xl"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Our Journey</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Founded in 2024, AddisBike started with a simple idea: why let bikes sit idle in garages when they could be exploring the city? What began as a small neighborhood experiment has grown into a city-wide network of passionate riders and owners.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Today, we're proud to facilitate thousands of rides every month, helping locals commute efficiently and tourists discover hidden gems off the beaten path.
                            </p>
                            <div className="pt-4">
                                <Link to="/register" className="btn-primary">
                                    Join Our Community
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
