import './style.css';
import './animations.css';
import { initAnimations } from './animations.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Element References
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  const contactForm = document.getElementById('contactForm');
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const toastContainer = document.getElementById('toastContainer');

  // 2. Dark / Light Mode Theme Persistence
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  });

  // 3. Mobile Hamburger Menu Toggle
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // 4. Sticky Navbar & Scroll Events
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Back to Top smooth scroll
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 5. Active Section Navigation Observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { threshold: 0.3 };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 6. Skill Card Progress Bar Fill Observer
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserverOptions = { threshold: 0.2 };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, skillObserverOptions);

  skillCards.forEach(card => skillObserver.observe(card));

  // 5. Number Counter Animation (User-specified snippet)
  const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = `${target}+`;
        element.classList.add('count-done');
        clearInterval(timer);
      } else {
        element.textContent = `${Math.floor(current)}+`;
      }
    }, 16);
  };

  // 7. Achievement Counter Stat Animation Observer
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10);
          animateCounter(stat, target, 2000);
        });
      }
    });
  }, { threshold: 0.3 });

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection) statsObserver.observe(achievementsSection);

  // 8. Skill Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.94)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // 9. Project Category Filter Tabs
  const projectTabBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const ptab = btn.getAttribute('data-ptab');
      projectCards.forEach(card => {
        const pcat = card.getAttribute('data-pcat');
        if (ptab === 'all' || pcat === ptab) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.94)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // 10. Interactive Project Details & Live Demo Modal
  const projectData = {
    phishing: {
      title: "Autonomous Multi-Agent AI Phishing Email Detection & Threat Intelligence System",
      category: "Multi-Agent AI & Cyber Defense",
      description: "A production-grade, multi-agent cyber defense pipeline combining specialized LLM agents (GPT-4o-mini), real-time threat intelligence APIs (VirusTotal v3, URLhaus), WHOIS domain age analysis, SQLite persistent threat memory, and a variance-based confidence calculation engine.",
      highlights: [
        "Heterogeneous 3-specialist multi-agent system (Content Semantics, Link Intelligence, Domain Reputation) coordinated by a central agent",
        "Variance-based mathematical agent agreement confidence engine based on score standard deviation",
        "Zero-day typosquatting & homograph defense tool using Levenshtein distance string algorithms",
        "Resilient dual-mode offline heuristic fallback when external APIs encounter rate limits",
        "Persistent self-learning threat database in SQLite to instantly cache and flag recurring threats"
      ],
      tech: ["Python", "OpenAI GPT-4o-mini", "Multi-Agent Systems", "VirusTotal v3", "URLhaus", "WHOIS", "Levenshtein Distance", "SQLite", "Gradio"],
      demoUrl: "https://github.com/Janhaviadmane07/email-phishing-detector",
      demoLabel: "View GitHub Repository"
    },
    vital: {
      title: "Smart ICU Vital Monitoring System",
      category: "Full-Stack Healthcare & MERN",
      description: "A full-stack clinical patient vital monitoring system implementing 9 comprehensive modules including Doctor/Nurse Dashboards, automated vitals threshold checking, real-time alert triggers, and digital ICU charts.",
      highlights: [
        "Full-stack MERN architecture covering 9 end-to-end clinical workflow modules",
        "Real-time automated threshold-checking engine with instant critical alert triggers",
        "Automated missed-observation reminders via scheduled node-cron background jobs",
        "Role-Based Access Control (RBAC) with JWT auth and immutable audit logging",
        "Interactive digital ICU vital charting rendered using Recharts"
      ],
      tech: ["React (Vite)", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Recharts", "JWT Auth", "Node-cron", "REST APIs"],
      demoUrl: "https://github.com/AtharvaSuryas/vital-monitoring",
      demoLabel: "View GitHub Repository"
    },
    bank: {
      title: "NewGen Digital Banking Platform",
      category: "Full-Stack Web & Fintech",
      description: "A modern full-stack digital banking platform engineered for seamless user authentication, secure account management, real-time fund transfers, dynamic ledger tracking, and interactive financial dashboard analytics.",
      highlights: [
        "Secure user onboarding, encrypted authentication, and session management",
        "Real-time funds transfer workflow with account validation and transaction ledger",
        "Interactive financial dashboard for tracking balances, expenses, and transaction logs",
        "Clean, responsive UI built with high security and accessibility considerations"
      ],
      tech: ["JavaScript", "Node.js", "HTML5/CSS3", "REST APIs", "Fintech", "User Auth"],
      demoUrl: "https://github.com/Janhaviadmane07/new-gen-bank",
      demoLabel: "View GitHub Repository"
    },
    officehours: {
      title: "Faculty Office Hour Appointment Booking System",
      category: "Full-Stack Web Application",
      description: "An automated academic scheduling platform enabling university students to book office hours with professors, eliminating scheduling conflicts with dynamic time-slot allocation and real-time confirmations.",
      highlights: [
        "Conflict-free time slot reservation engine preventing overlapping appointments",
        "Dual-role interface for faculty schedule management and student appointment booking",
        "Automated appointment status management (Confirmed, Rescheduled, Completed, Cancelled)",
        "Pre-meeting agenda submission to enhance student-professor advising sessions"
      ],
      tech: ["JavaScript", "Web Development", "Node.js", "Appointment Scheduling", "RESTful APIs"],
      demoUrl: "https://github.com/Janhaviadmane07/faculty-office-hour-booking",
      demoLabel: "View GitHub Repository"
    },
    watertank: {
      title: "System and Method for Automated Water Tank Level Monitoring and Pump Control Using IoT",
      category: "Indian Patent Office Publication (App: 202521126628 A)",
      image: "/patent/patent_page_2.png",
      description: "An officially published Indian Patent (Journal Issue No. 01/2026, Published on 02/01/2026) for a computer-implemented automated liquid monitoring system. Utilizes contactless ultrasonic distance measurement and microcontroller-controlled relay switching circuits to prevent mechanical wear and optimize pump lifecycle.",
      highlights: [
        "Official Patent Application No: 202521126628 A (Journal No. 01/2026, Page 427)",
        "Filing Date: 13/12/2025 | Publication Date: 02/01/2026",
        "Applicant: Symbiosis International (Deemed University)",
        "Inventors: Dr. Deepak Suresh Asudani, Soumya Bajirao, Janhavi Admane (Co-Inventor), Arindam Anand",
        "Contactless ultrasonic distance sensing eliminating mechanical float sensor wear",
        "Continuous percentage level conversion and automated relay control logic"
      ],
      tech: ["IoT", "Ultrasonic Sensors", "Embedded C", "Microcontrollers", "Relay Automation", "Indian Patent"],
      demoUrl: "/patent/patent_publication_202521126628.pdf",
      demoLabel: "Download Official Patent PDF",
      viewGazette: true
    },
    gnn: {
      title: "Link Prediction Using Graph Neural Network (GNN)",
      category: "Artificial Intelligence & Network Analysis",
      image: "/project_game.jpg",
      description: "A deep learning Graph Neural Network framework that analyzes complex structural relationships between graph nodes to learn node embeddings, identify hidden or missing connections, and predict future link formation.",
      highlights: [
        "Graph representation learning with node embedding optimization",
        "Predicts missing edges and future network connections with high accuracy",
        "Evaluated on graph benchmark datasets using ROC-AUC and precision metrics",
        "Built using Python, PyTorch Geometric, and NetworkX"
      ],
      tech: ["Python", "Graph Neural Networks", "Deep Learning", "PyTorch", "NetworkX"],
      demoUrl: "https://github.com/Janhaviadmane07",
      demoLabel: "View GitHub Repository"
    },
    cloudml: {
      title: "ML-Driven Cost Optimization & Auto-Scaling Framework",
      category: "Machine Learning & Cloud Infrastructure",
      image: "/project_ecommerce.jpg",
      description: "An intelligent cloud infrastructure management system that leverages machine learning models to forecast server resource utilization trends and make proactive auto-scaling decisions to optimize cloud expenditure.",
      highlights: [
        "Machine Learning time-series forecasting for CPU and RAM load prediction",
        "Reduces cloud hosting costs by preventing unnecessary resource over-provisioning",
        "Supports dynamic threshold adjustment based on historical workload spikes",
        "Integration with Ansible automation & cloud monitoring tools"
      ],
      tech: ["Python", "Machine Learning", "Cloud Auto-Scaling", "Predictive Analytics", "Ansible"],
      demoUrl: "https://github.com/Janhaviadmane07",
      demoLabel: "View GitHub Repository"
    }
  };

  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-heading);">${data.title}</h2>
          <span style="padding: 4px 14px; background: var(--gradient-hero); color: #fff; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">${data.category}</span>
        </div>

        <p style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 20px; line-height: 1.7;">${data.description}</p>

        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-heading); margin-bottom: 10px;">Key Technical Highlights:</h4>
        <ul style="margin-left: 20px; margin-bottom: 24px; color: var(--text-main); line-height: 1.8;">
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;">
          ${data.tech.map(t => `<span class="tag-pill" style="font-size: 0.85rem; padding: 6px 14px;">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="${data.demoUrl}" target="_blank" rel="noopener" class="btn btn-gradient">
            <i class="${data.viewGazette ? 'fas fa-file-pdf' : 'fab fa-github'}"></i> ${data.demoLabel || 'View Repository'}
          </a>
          ${data.viewGazette ? `
          <button class="btn btn-primary-outline" id="viewGazetteBtn">
            <i class="fas fa-eye"></i> View Gazette Document
          </button>
          ` : ''}
          <button class="btn btn-secondary-outline" id="closeModalInnerBtn">
            Close Preview
          </button>
        </div>
      `;

      projectModal.classList.remove('hidden');
      document.getElementById('closeModalInnerBtn')?.addEventListener('click', closeModal);
      if (data.viewGazette) {
        document.getElementById('viewGazetteBtn')?.addEventListener('click', () => {
          closeModal();
          openCertLightbox('patent_pub');
        });
      }
    });
  });

  function closeModal() {
    projectModal.classList.add('hidden');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
  });

  // 11. Contact Form Real-Time Validation & AJAX Submit
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const nameGroup = nameInput.parentElement;
      const emailGroup = emailInput.parentElement;
      const subjectGroup = subjectInput.parentElement;
      const messageGroup = messageInput.parentElement;

      // Reset error states
      [nameGroup, emailGroup, subjectGroup, messageGroup].forEach(g => g.classList.remove('error'));

      if (!nameInput.value.trim()) {
        nameGroup.classList.add('error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('error');
        isValid = false;
      }

      if (!subjectInput.value.trim()) {
        subjectGroup.classList.add('error');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageGroup.classList.add('error');
        isValid = false;
      }

      if (!isValid) return;

      // Submit Button Loading State
      const submitBtn = document.getElementById('submitFormBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      btnText.textContent = "Sending...";
      btnIcon.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://formsubmit.co/ajax/1851.janhavi@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            _subject: subjectInput.value.trim() ? `[Portfolio] ${subjectInput.value.trim()}` : `[Portfolio] New message from ${nameInput.value.trim()}`,
            message: messageInput.value.trim(),
            _replyto: emailInput.value.trim(),
            _template: "table"
          })
        });

        const data = await response.json().catch(() => ({}));

        btnText.textContent = "Message Sent!";
        btnSpinner.classList.add('hidden');
        btnIcon.classList.remove('hidden');
        btnIcon.className = "fas fa-check btn-icon";

        // Confetti Celebration Effect!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        showToast("ðŸŽ‰ Thank you! Your message has been sent directly to Janhavi's email.", "success");
        contactForm.reset();
      } catch (err) {
        console.error("Submission error:", err);
        btnText.textContent = "Message Sent!";
        btnSpinner.classList.add('hidden');
        btnIcon.classList.remove('hidden');
        btnIcon.className = "fas fa-check btn-icon";

        showToast("ðŸŽ‰ Thank you! Your message was submitted.", "success");
        contactForm.reset();
      } finally {
        setTimeout(() => {
          btnText.textContent = "Send Message";
          btnIcon.className = "fas fa-paper-plane btn-icon";
          submitBtn.disabled = false;
        }, 3500);
      }
    });
  }

  // 12. Resume Download Trigger
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      showToast("ðŸ“„ Downloading Janhavi Admane's Resume PDF!", "success");
    });
  }

  // 13. Toast Notification Helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
  // 14. Certificate Lightbox Viewer
  const certLightbox = document.getElementById('certLightbox');
  const certLightboxImg = document.getElementById('certLightboxImg');
  const certLightboxTitle = document.getElementById('certLightboxTitle');
  const certLightboxPdfBtn = document.getElementById('certLightboxPdfBtn');
  const certLightboxClose = document.getElementById('certLightboxClose');
  const certLightboxDismiss = document.getElementById('certLightboxDismiss');

  // Map each data-cert key to its display name and file paths
  const certData = {
    python_ad141: {
      name: 'Red Hat Python I: Scripting with Python (AD141 - RHA)',
      img: '/certificates/python_redhat_ad141.png',
      pdf: '/certificates/python_redhat_ad141.pdf'
    },
    dsa_python: {
      name: 'Data Structures and Algorithms using Python - Part 1',
      img: '/certificates/dsa_python_infosys.png',
      pdf: '/certificates/dsa_python_infosys.pdf'
    },
    ansible_do457: {
      name: 'Network Automation with Red Hat Ansible (DO457 - RHA)',
      img: '/certificates/network_automation_ansible_do457.png',
      pdf: '/certificates/network_automation_ansible_do457.pdf'
    },
    rh124: {
      name: 'Red Hat System Administration I (RH124 - RHA)',
      img: '/certificates/redhat_system_administration_rh124.png',
      pdf: '/certificates/redhat_system_administration_rh124.pdf'
    },
    agentic_ai: {
      name: 'Mastering Agentic AI: From Prompt to Protocols to Production',
      img: '/certificates/mastering_agentic_ai_udemy.png',
      pdf: '/certificates/mastering_agentic_ai_udemy.pdf'
    },
    patent_pub: {
      name: 'Official Patent Journal Publication - App No: 202521126628 A (Govt. of India)',
      img: '/patent/patent_page_2.png',
      pdf: '/patent/patent_publication_202521126628.pdf'
    }
  };

  function openCertLightbox(certKey) {
    const cert = certData[certKey];
    if (!cert || !certLightbox) return;
    certLightboxImg.src = cert.img;
    certLightboxImg.alt = cert.name;
    certLightboxTitle.textContent = cert.name;
    certLightboxPdfBtn.href = cert.pdf;
    certLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertLightbox() {
    if (!certLightbox) return;
    certLightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Reset after transition
    setTimeout(() => {
      certLightboxImg.src = '';
    }, 350);
  }

  // Attach click handlers to all "View" buttons in the certificates section
  document.querySelectorAll('.btn-cert-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const certKey = btn.getAttribute('data-cert');
      openCertLightbox(certKey);
    });
  });

  // Also attach click to thumbnail wrapper overlays
  document.querySelectorAll('.cert-thumbnail-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const certKey = wrapper.getAttribute('data-cert');
      openCertLightbox(certKey);
    });
    wrapper.style.cursor = 'pointer';
  });

  if (certLightboxClose) certLightboxClose.addEventListener('click', closeCertLightbox);
  if (certLightboxDismiss) certLightboxDismiss.addEventListener('click', closeCertLightbox);
  if (certLightbox) {
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox) closeCertLightbox();
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certLightbox && certLightbox.classList.contains('active')) {
      closeCertLightbox();
    }
  });

  // 15. Hero Dynamic Typing Effect
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const roles = [
      'Full Stack Development',
      'AI & Machine Learning',
      'Agentic Cyber Defense',
      'IoT Patent Innovation',
      'Graph Neural Networks'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 90;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 45;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typeDelay = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, typeDelay);
    }

    typeLoop();
  }

  // 16. Ambient Hero Constellation Particle Canvas (No cursor tracking)
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = Math.min(45, Math.max(25, Math.floor((width * height) / 22000)));

    window.addEventListener('resize', () => {
      if (!canvas.offsetWidth || !canvas.offsetHeight) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.16 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // 17. Universal Scroll-Driven Reveal Observer
  const revealTargets = document.querySelectorAll(
    '.section-header, .about-text-column, .about-image-column, .info-card, .project-card, .skill-card, .cert-card-enhanced, .patent-showcase-card, .patent-doc-card, .stat-card, .timeline-content, .contact-card-btn, .contact-form-card, .hobby-card, .skills-filter-tabs, .projects-filter-tabs'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal');
  });

  const scrollRevealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        entry.target.classList.add('animate');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => scrollRevealObserver.observe(el));

  // 18. 3D Perspective Card Tilt & Dynamic Cursor Spotlight
  const interactiveCards = document.querySelectorAll(
    '.project-card, .cert-card-enhanced, .skill-card, .info-card, .patent-showcase-card, .stat-card, .hobby-card, .contact-card-btn, .contact-form-card'
  );

  // 18. Mind-Blowing Interactive Cyber Photo Activator
  const holoPortals = document.querySelectorAll('.holo-portal-wrapper, .avatar-card-wrapper');
  holoPortals.forEach(portal => {
    portal.addEventListener('click', (e) => {
      const rect = portal.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      // Cosmic Neon Confetti Explosion
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: originX, y: originY },
        colors: ['#667eea', '#ec4899', '#38bdf8', '#fbbf24', '#ffffff']
      });

      portal.classList.add('overdrive-active');
      showToast('⚡ Neural Hologram Overdrive Active • Janhavi Admane AI Core', 'info');

      setTimeout(() => {
        portal.classList.remove('overdrive-active');
      }, 4000);
    });
  });

  // Initialize the full animation system
  initAnimations();

});
