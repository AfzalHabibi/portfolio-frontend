import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ContactForm } from '../../types';
import Loader from '../../components/Loader';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { settings } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '50vh' }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-content">
                <h1 className="hero-title">Get In Touch</h1>
                <p className="hero-description">
                  Ready to start your next project? Let's discuss your ideas and bring them to life together.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href={settings.cvUrl} download className="btn-primary-custom">
                    <i className="fas fa-download me-2"></i>
                    Download CV
                  </a>
                  <a href={`mailto:${settings.email}`} className="btn-outline-custom">
                    <i className="fas fa-envelope me-2"></i>
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            {/* Contact Information */}
            <div className="col-lg-4 mb-5">
              <div className="animate-on-scroll">
                <h3 className="mb-4">Contact Information</h3>
                
                <div className="custom-card mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="fas fa-envelope text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Email</h5>
                      <a href={`mailto:${settings.email}`} className="text-decoration-none">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="custom-card mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="fas fa-phone text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Phone</h5>
                      <a href={`tel:${settings.phone}`} className="text-decoration-none">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="custom-card mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <i className="fas fa-map-marker-alt text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Location</h5>
                      <span>{settings.location}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="custom-card">
                  <h5 className="mb-3">Follow Me</h5>
                  <div className="d-flex gap-2 flex-wrap">
                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href={settings.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-behance"></i>
                    </a>
                    <a href={settings.socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-dribbble"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="animate-on-scroll">
                <h3 className="mb-4">Send Me a Message</h3>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  {submitStatus === 'success' && (
                    <div className="alert alert-success mb-4">
                      <i className="fas fa-check-circle me-2"></i>
                      Thank you for your message! I'll get back to you soon.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="alert alert-danger mb-4">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      Something went wrong. Please try again later.
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control form-control-custom"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea
                      className="form-control form-control-custom"
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell me about your project or inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding animate-on-scroll" style={{ background: 'var(--secondary-bg)' }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="section-title">Ready to Start Your Project?</h2>
              <p className="lead mb-4 text-muted">
                Let's turn your ideas into reality. Download my CV to learn more about my experience 
                or schedule a call to discuss your project requirements.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href={settings.cvUrl} download className="btn-primary-custom">
                  <i className="fas fa-download me-2"></i>
                  Download CV
                </a>
                <a href={`tel:${settings.phone}`} className="btn-outline-custom">
                  <i className="fas fa-phone me-2"></i>
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
