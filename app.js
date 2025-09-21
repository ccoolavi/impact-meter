// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeCounters();
    initializeCharts();
    initializeFormHandling();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Animated counters for statistics
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = easeOutQuart(progress);
        const currentValue = startValue + (target - startValue) * easedProgress;
        
        // Format the number appropriately
        if (target >= 1000000) {
            element.textContent = (currentValue / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            element.textContent = Math.round(currentValue).toLocaleString();
        } else {
            element.textContent = currentValue.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Final value formatting
            if (target >= 1000000) {
                element.textContent = (target / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                element.textContent = Math.round(target).toLocaleString();
            } else {
                element.textContent = target.toString();
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Chart initialization
function initializeCharts() {
    // Impact Trends Chart
    const impactChartCanvas = document.getElementById('impactChart');
    if (impactChartCanvas) {
        createImpactChart(impactChartCanvas);
    }
    
    // Materials Comparison Chart
    const materialsChartCanvas = document.getElementById('materialsChart');
    if (materialsChartCanvas) {
        createMaterialsChart(materialsChartCanvas);
    }
}

function createImpactChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Sample data for the impact trends chart
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Cement Production (Million Tons)',
                data: [4100, 4180, 4250, 4320, 4400],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'CO2 Emissions (Million Tons)',
                data: [2870, 2920, 2975, 3025, 3080],
                borderColor: '#B4413C',
                backgroundColor: 'rgba(180, 65, 60, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Life Years Lost (Millions)',
                data: [6.8, 7.0, 7.1, 7.3, 7.5],
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Global Cement Production and Health Impact (2020-2024)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Million Tons'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Life Years Lost (Millions)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function createMaterialsChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    const data = {
        labels: [
            'Traditional Concrete',
            'Green Concrete (30% fly ash)',
            'Recycled Aggregate Concrete',
            'Geopolymer Concrete',
            'Hempcrete',
            'Carbon-Capture Concrete'
        ],
        datasets: [{
            label: 'CO2 Emissions (kg per ton)',
            data: [410, 287, 360, 82, -110, -150],
            backgroundColor: [
                '#B4413C',
                '#DB4545',
                '#964325',
                '#5D878F',
                '#059669',
                '#1FB8CD'
            ],
            borderColor: [
                '#B4413C',
                '#DB4545',
                '#964325',
                '#5D878F',
                '#059669',
                '#1FB8CD'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Environmental Impact: CO2 Emissions by Construction Material',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'CO2 Emissions (kg per ton)'
                    },
                    grid: {
                        drawBorder: true,
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return '#000';
                            }
                            return 'rgba(0,0,0,0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                },
                y: {
                    display: true,
                    ticks: {
                        crossAlign: 'far'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const value = context.parsed.x;
                            if (value < 0) {
                                return 'Carbon Negative - Absorbs CO2';
                            } else {
                                return 'Carbon Positive - Emits CO2';
                            }
                        }
                    }
                }
            }
        }
    });
}

// Form handling
function initializeFormHandling() {
    const earlyAccessForm = document.querySelector('.early-access-form');
    
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (emailInput && emailInput.value) {
                // Simulate form submission
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <div style="color: var(--color-success); margin-top: 16px; font-weight: 500;">
                            ✓ Thank you! You've been added to our early access list.
                        </div>
                    `;
                    
                    this.parentNode.appendChild(successMessage);
                    
                    // Reset form
                    emailInput.value = '';
                    submitButton.textContent = 'Get Early Access';
                    submitButton.disabled = false;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (successMessage.parentNode) {
                            successMessage.parentNode.removeChild(successMessage);
                        }
                    }, 5000);
                }, 1500);
            }
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Add scroll-triggered animations for cards and elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.stat-card, .finding-card, .alternative-card, .cta-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: var(--color-primary) !important;
        font-weight: var(--font-weight-semibold);
    }
    
    .success-message {
        text-align: center;
        padding: var(--space-16);
        border-radius: var(--radius-base);
        background: rgba(var(--color-success-rgb), 0.1);
        border: 1px solid rgba(var(--color-success-rgb), 0.2);
    }
`;
document.head.appendChild(style);

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading states and error handling
function showLoadingState(element, message = 'Loading...') {
    element.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid var(--color-border); border-radius: 50%; border-top-color: var(--color-primary); animation: spin 1s ease-in-out infinite;"></div>
            <p style="margin-top: 10px; color: var(--color-text-secondary);">${message}</p>
        </div>
    `;
}

// Add spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(spinnerStyle);

// Enhanced navigation for mobile
function initializeMobileMenu() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', debounce(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 10));
}

// Initialize mobile menu functionality
initializeMobileMenu();

// Add viewport detection for enhanced mobile experience
function detectViewport() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('tablet-view', isTablet);
}

window.addEventListener('resize', debounce(detectViewport, 250));
detectViewport(); // Initial call

// Performance optimization - lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy-load');
        imageObserver.observe(img);
    });
}

// Add lazy loading styles
const lazyLoadStyle = document.createElement('style');
lazyLoadStyle.textContent = `
    .lazy-load {
        transition: opacity 0.3s ease;
        opacity: 0.7;
    }
    
    .lazy-load.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(lazyLoadStyle);

// Initialize lazy loading
initializeLazyLoading();

// Export functions for potential external use
window.ImpactMeter = {
    initializeCounters,
    animateCounter,
    createImpactChart,
    createMaterialsChart,
    showLoadingState
};