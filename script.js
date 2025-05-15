document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in, .timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => observer.observe(el));

    // Slider initialization (for carousels and testimonials)
    const sliders = document.querySelectorAll('.carousel, .testimonial-slider');
    sliders.forEach(slider => {
        const items = slider.querySelectorAll('.carousel-item, .testimonial-item');
        const prevBtn = slider.querySelector('.carousel-btn.prev');
        const nextBtn = slider.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        function showSlide(index) {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', nextSlide);

        // Auto-slide every 5 seconds
        setInterval(nextSlide, 5000);

        // Show first slide
        showSlide(currentIndex);
    });

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert('Mensagem enviada com sucesso! (Simulação)');
                contactForm.reset();
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }

    // Enhanced Particle effect with stars for sections
    const sections = document.querySelectorAll('.section-midias, .section-contatos, .section-sobre, .section-home');
    sections.forEach(section => {
        const canvas = section.querySelector('.section-particles');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;

            const particles = [];
            const particleCount = 100;
            let mouse = { x: null, y: null, radius: 100 };

            // Mouse movement for interactivity
            section.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            section.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 4 + 1;
                    this.speedX = Math.random() * 1.5 - 0.75;
                    this.speedY = Math.random() * 1.5 - 0.75;
                    this.color = `hsl(${Math.random() * 60 + 240}, 70%, 60%)`; // Shades of purple to blue
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                    // Interaction with mouse
                    if (mouse.x !== null && mouse.y !== null) {
                        let dx = mouse.x - this.x;
                        let dy = mouse.y - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < mouse.radius) {
                            let force = (mouse.radius - distance) / mouse.radius;
                            this.speedX += (dx / distance) * force * 0.5;
                            this.speedY += (dy / distance) * force * 0.5;
                        }
                    }
                }

                draw() {
                    ctx.fillStyle = this.color;
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.beginPath();
                    // Draw a 5-point star
                    const spikes = 5;
                    const outerRadius = this.size;
                    const innerRadius = this.size / 2;
                    let rot = Math.PI / 2 * 3;
                    let x = 0;
                    let y = 0;
                    const step = Math.PI / spikes;

                    ctx.moveTo(0, -outerRadius);
                    for (let i = 0; i < spikes; i++) {
                        x = Math.cos(rot) * outerRadius;
                        y = Math.sin(rot) * outerRadius;
                        ctx.lineTo(x, y);
                        rot += step;

                        x = Math.cos(rot) * innerRadius;
                        y = Math.sin(rot) * innerRadius;
                        ctx.lineTo(x, y);
                        rot += step;
                    }
                    ctx.lineTo(0, -outerRadius);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            }

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            function connectParticles() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        let dx = particles[i].x - particles[j].x;
                        let dy = particles[i].y - particles[j].y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 100) {
                            ctx.strokeStyle = `rgba(100, 80, 153, ${1 - distance / 100})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                connectParticles();
                requestAnimationFrame(animate);
            }

            animate();

            window.addEventListener('resize', () => {
                canvas.width = section.offsetWidth;
                canvas.height = section.offsetHeight;
            });

            // Parallax effect on scroll
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollY + window.innerHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                    const offset = (scrollY - sectionTop) * 0.2;
                    const beforeElement = section.querySelector('::before');
                    if (beforeElement) {
                        beforeElement.style.transform = `translateY(${offset}px)`;
                    }
                }
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const floatingIcons = document.querySelector('.floating-icons');
    if (floatingIcons) {
        setTimeout(() => floatingIcons.classList.add('visible'), 100);
    }
});