import React from 'react';
import { ArrowRight, CheckCircle, Users, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 bg-primary"></span>
                            Mission Parameters
                        </div>
                        <h1 className="text-display mb-6 leading-none">
                            Reimagining <span className="text-primary">Urban</span><br />
                            Mobility
                        </h1>
                        <p className="text-body text-lg uppercase tracking-wide max-w-2xl mx-auto">
                            AddisBike is a community-driven platform connecting bike owners with riders. Making city exploration accessible, sustainable, and efficient.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="tech-card hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 border border-primary/30 bg-primary/5 flex items-center justify-center text-primary mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Sustainable Future</h3>
                            <p className="text-body">
                                Reducing carbon footprints. Every ride contributes to a greener planet.
                            </p>
                        </div>
                        <div className="tech-card hover:border-emerald-500/50 transition-colors">
                            <div className="w-12 h-12 border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Community First</h3>
                            <p className="text-body">
                                Empowering local owners. Providing affordable transportation options.
                            </p>
                        </div>
                        <div className="tech-card hover:border-blue-500/50 transition-colors">
                            <div className="w-12 h-12 border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">Safe & Secure</h3>
                            <p className="text-body">
                                Verified community. Insured rides. Your safety is our priority protocol.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative p-4">
                            <div className="tech-border-full p-2 bg-card">
                                <img
                                    src="/assets/bike3.jpg"
                                    alt="Our Story"
                                    className="w-full h-auto hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-heading">Our Journey</h2>
                            <p className="text-body text-lg uppercase tracking-wide">
                                Founded in 2024. AddisBike initiated with a core directive: optimize urban transport assets.
                            </p>
                            <p className="text-body text-lg uppercase tracking-wide">
                                Currently facilitating thousands of rides monthly. Commuter efficiency increased. Tourism exploration expanded.
                            </p>
                            <div className="pt-4">
                                <Link to="/register" className="btn-primary">
                                    Join Network
                                    <ArrowRight className="ml-2 h-4 w-4" />
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
