// Main JavaScript for Adeife's Sanctuary

// Quote carousel functionality
let currentQuoteIndex = 0;
const quotes = document.querySelectorAll('.quote');
const quoteDots = document.querySelectorAll('.quote-dots .dot');

function currentQuote(n) {
    showQuote(currentQuoteIndex = n - 1);
}

function showQuote(n) {
    if (n >= quotes.length) currentQuoteIndex = 0;
    if (n < 0) currentQuoteIndex = quotes.length - 1;
    
    quotes.forEach(quote => quote.classList.remove('active'));
    quoteDots.forEach(dot => dot.classList.remove('active'));
    
    if (quotes[currentQuoteIndex]) {
        quotes[currentQuoteIndex].classList.add('active');
        quoteDots[currentQuoteIndex].classList.add('active');
    }
}

// Auto-rotate quotes
setInterval(() => {
    currentQuoteIndex++;
    showQuote(currentQuoteIndex);
}, 5000);

// Inspiration carousel functionality
let currentInspirationIndex = 0;
const inspirationQuotes = document.querySelectorAll('.inspiration-quote');

function nextInspiration() {
    currentInspirationIndex++;
    if (currentInspirationIndex >= inspirationQuotes.length) {
        currentInspirationIndex = 0;
    }
    showInspiration();
}

function previousInspiration() {
    currentInspirationIndex--;
    if (currentInspirationIndex < 0) {
        currentInspirationIndex = inspirationQuotes.length - 1;
    }
    showInspiration();
}

function showInspiration() {
    inspirationQuotes.forEach(quote => quote.classList.remove('active'));
    if (inspirationQuotes[currentInspirationIndex]) {
        inspirationQuotes[currentInspirationIndex].classList.add('active');
    }
}

// Auto-rotate inspiration
setInterval(() => {
    nextInspiration();
}, 7000);

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

// Hero video functionality
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Ensure video plays on load
        heroVideo.play().catch(e => {
            console.log('Video autoplay failed:', e);
        });
        
        // Handle video loading
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Hero video loaded successfully');
        });
        
        // Handle video errors
        heroVideo.addEventListener('error', function(e) {
            console.log('Hero video error:', e);
            // Fallback: hide video and show gradient background
            heroVideo.style.display = 'none';
        });
    }
    
    // Initialize quote carousel
    showQuote(0);
    
    // Initialize inspiration carousel
    showInspiration();
    
    // Add visible class to elements in viewport
    document.querySelectorAll('.animate').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
});

// Add CSS class for visible animations
const style = document.createElement('style');
style.textContent = `
    .animate.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);