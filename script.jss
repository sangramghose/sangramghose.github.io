// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }
    }
    // Wrap around
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const opacity = (1 - dist / 120) * 0.15;
        ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});
// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});
// ===== TYPING ANIMATION =====
const typedTextEl = document.querySelector('.typed-text');
const roles = [
  'Data Engineer',
  'AI / ML Engineer',
  'Software Developer',
  'Computer Vision Researcher',
  'Problem Solver'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeRole() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedTextEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === current.length) {
    speed = 2000; // Pause at full text
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }
  setTimeout(typeRole, speed);
}
typeRole();
// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});
revealElements.forEach(el => revealObserver.observe(el));
// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
// ===== BACK TO TOP =====
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// ===== CONTACT FORM (Simple handler) =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    
    // Show success message
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = `Thanks, ${name}! Message sent ✓`;
    btn.style.background = 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('.section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--accent-primary)';
    }
  });
});
