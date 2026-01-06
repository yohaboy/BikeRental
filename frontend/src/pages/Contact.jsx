import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-primary/5 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-display mb-4">Get in <span className="text-primary">Touch</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions about renting or listing a bike? We're here to help!
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                <p className="text-muted-foreground text-sm mb-2">For general inquiries</p>
                                <a href="mailto:hello@addisbike.com" className="text-primary font-medium hover:underline">hello@addisbike.com</a>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                                <p className="text-muted-foreground text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                                <a href="tel:+1234567890" className="text-primary font-medium hover:underline">+1 (555) 123-4567</a>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                                <p className="text-muted-foreground text-sm">
                                    123 Bike Lane,<br />
                                    Cycling City, CC 12345
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-3xl border border-border/50 shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <MessageSquare className="text-primary" size={24} />
                                <h2 className="text-2xl font-bold">Send us a message</h2>
                            </div>

                            {submitted ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                                    <p className="text-emerald-600">Thanks for reaching out. We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-sm font-bold text-emerald-700 hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-shadow"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-shadow"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input-shadow appearance-none"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="support">Customer Support</option>
                                            <option value="listing">Listing a Bike</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                                        <textarea
                                            required
                                            rows="5"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-shadow resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn-primary w-full md:w-auto">
                                        Send Message
                                        <Send size={18} className="ml-2" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
