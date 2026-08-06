// Mobile menu toggle functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when any navigation link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Reservation Form Demo Submission
const reservationForm = document.getElementById('reservationForm');
const successMessage = document.getElementById('successMessage');

reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    reservationForm.reset();
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});