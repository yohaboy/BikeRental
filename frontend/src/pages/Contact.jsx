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
            <section className="py-20 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 bg-primary"></span>
                        Communication Channels
                    </div>
                    <h1 className="text-display mb-4">Establish <span className="text-primary">Connection</span></h1>
                    <p className="text-body max-w-2xl mx-auto uppercase tracking-wide">
                        Inquiries regarding rental protocols or fleet listing. Our support grid is active.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="tech-card flex items-start gap-4">
                            <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Digital Mail</h3>
                                <p className="text-muted-foreground text-xs uppercase mb-2">General Inquiries</p>
                                <a href="mailto:hello@addisbike.com" className="text-primary font-bold text-sm hover:underline">hello@addisbike.com</a>
                            </div>
                        </div>

                        <div className="tech-card flex items-start gap-4">
                            <div className="w-10 h-10 border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Voice Link</h3>
                                <p className="text-muted-foreground text-xs uppercase mb-2">Mon-Fri 0800-1700</p>
                                <a href="tel:+1234567890" className="text-primary font-bold text-sm hover:underline">+1 (555) 123-4567</a>
                            </div>
                        </div>

                        <div className="tech-card flex items-start gap-4">
                            <div className="w-10 h-10 border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Physical Node</h3>
                                <p className="text-muted-foreground text-xs uppercase">
                                    123 Bike Lane,<br />
                                    Cycling City, CC 12345
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="tech-card p-8">
                            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                                <MessageSquare className="text-primary" size={24} />
                                <h2 className="text-xl font-bold uppercase tracking-wider">Transmit Message</h2>
                            </div>

                            {submitted ? (
                                <div className="bg-emerald-50 border border-emerald-200 p-8 text-center animate-in fade-in zoom-in">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-emerald-800 mb-2 uppercase tracking-wider">Transmission Successful</h3>
                                    <p className="text-emerald-600 text-sm uppercase">We will respond shortly.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-xs font-bold text-emerald-700 hover:underline uppercase tracking-wider"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Identity Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-shadow"
                                                placeholder="JOHN DOE"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Email Protocol</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-shadow"
                                                placeholder="JOHN@EXAMPLE.COM"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Subject Matter</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input-shadow appearance-none"
                                        >
                                            <option value="">SELECT TOPIC</option>
                                            <option value="support">CUSTOMER SUPPORT</option>
                                            <option value="listing">LISTING INQUIRY</option>
                                            <option value="partnership">PARTNERSHIP</option>
                                            <option value="other">OTHER</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Message Content</label>
                                        <textarea
                                            required
                                            rows="5"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-shadow resize-none"
                                            placeholder="ENTER YOUR MESSAGE..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn-primary w-full md:w-auto">
                                        Transmit
                                        <Send size={16} className="ml-2" />
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
