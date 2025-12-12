// Apology Modal Functions
function showApology() {
    const modal = document.getElementById('apologyModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Trigger animations
    setTimeout(() => {
        modal.classList.add('show');
        startFloatingHearts();
    }, 100);
}

function closeApology() {
    const modal = document.getElementById('apologyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function showForgiveness() {
    const successModal = document.getElementById('successModal');
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    successTitle.textContent = 'Thank You for Forgiving Me';
    successMessage.textContent = 'Your forgiveness means everything to me. I promise to love you better, treat you with the care you deserve, and never hurt you like this again. You are so precious to me.';
    
    closeApology();
    setTimeout(() => {
        successModal.style.display = 'flex';
        successModal.classList.add('show');
        createHeartExplosion();
    }, 400);
}

function showLove() {
    const successModal = document.getElementById('successModal');
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    successTitle.textContent = 'I Love You Too, Always';
    successMessage.textContent = 'Hearing you say that fills my heart with so much joy. Our love is beautiful, and I promise to treasure it and you every single day. You are my everything.';
    
    closeApology();
    setTimeout(() => {
        successModal.style.display = 'flex';
        successModal.classList.add('show');
        createHeartExplosion();
    }, 400);
}

function closeSuccess() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function startFloatingHearts() {
    const hearts = document.querySelectorAll('.floating-hearts i');
    hearts.forEach((heart, index) => {
        setTimeout(() => {
            heart.style.animation = `floatHeart 3s ease-in-out infinite`;
            heart.style.animationDelay = `${index * 0.2}s`;
        }, index * 200);
    });
}

function createHeartExplosion() {
    const explosion = document.querySelector('.heart-explosion');
    const hearts = explosion.querySelectorAll('i');
    
    hearts.forEach((heart, index) => {
        setTimeout(() => {
            heart.style.animation = `explodeHeart 2s ease-out forwards`;
            heart.style.animationDelay = `${index * 0.1}s`;
        }, 100);
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const apologyModal = document.getElementById('apologyModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === apologyModal) {
        closeApology();
    }
    if (event.target === successModal) {
        closeSuccess();
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeApology();
        closeSuccess();
    }
});