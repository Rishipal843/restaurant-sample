document.addEventListener("DOMContentLoaded", () => {
    // 1. Helper to highlight the link matching the current page
    const highlightActiveLink = () => {
        // Get current filename (defaults to 'index.html' if at root '/')
        let currentPage = window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll('.nav-link').forEach(link => {
            const rawHref = link.getAttribute('href');
            if (!rawHref) return;

            // Clean href string: remove leading './', '../', or query/anchor parameters
            const cleanHref = rawHref.replace(/^(\.\/|\.\.\/)/, '').split('#')[0].split('?')[0];

            // Reset active state first
            link.classList.remove('active');

            // Check if link matches current page
            if (
                cleanHref === currentPage || 
                (currentPage === 'index.html' && (cleanHref === '' || cleanHref === 'index.html'))
            ) {
                link.classList.add('active');
            }
        });
    };

    // 2. Helper to initialize navbar mobile dropdown & event listeners
    const initNavbarEvents = () => {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        // Apply active page highlighting to the loaded navbar links
        highlightActiveLink();

        if (!hamburger || !navLinks) return;

        // Toggle dropdown open/close on click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close dropdown when clicking any navigation link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Close dropdown if user taps anywhere outside the navbar
        document.addEventListener('click', (e) => {
            const navbarWrapper = document.querySelector('.navbar-wrapper');
            if (navbarWrapper && !navbarWrapper.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    };

    // 3. Dynamic Component Loader using fetch
    const loadComponent = (id, file) => {
        const target = document.getElementById(id);
        if (!target) return Promise.resolve();

        // Standardize pathing relative to site root
        const rootPath = file.startsWith('/') ? file : `./${file.replace(/^\.\//, '')}`;

        return fetch(rootPath)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status} on ${rootPath}`);
                return res.text();
            })
            .then(html => {
                target.innerHTML = html;
            })
            .catch(err => {
                console.warn(`Fetch notice: ${err.message}. Assuming component is static.`);
            });
    };

    // 4. Load dynamic components first, then trigger navbar logic
    Promise.all([
        loadComponent("navbar-placeholder", "components/navbar.html"),
        loadComponent("footer-placeholder", "components/footer.html")
    ]).finally(() => {
        initNavbarEvents();
    });

    // 5. Reservation Form Handling
    const reservationForm = document.getElementById('reservationForm');
    const successMessage = document.getElementById('successMessage');

    if (reservationForm && successMessage) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            reservationForm.reset();
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        });
    }
});


const reservationForm = document.getElementById("reservationForm");

    if (reservationForm) {
        reservationForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent standard page reload

            // 1. Get Values from the Form Inputs
            const name = document.getElementById("resName").value.trim();
            const phone = document.getElementById("resPhone").value.trim();
            const date = document.getElementById("resDate").value;
            const timeInput = document.getElementById("resTimeInput").value.trim();
            
            // Get selected AM / PM
            const ampm = document.querySelector('input[name="ampm"]:checked').value;
            const fullTime = `${timeInput} ${ampm}`;

            const guests = document.getElementById("resGuests").value;

            // 2. Format the message for WhatsApp
            const message = `*New Table Reservation Request*%0A%0A` +
                            `*Name:* ${name}%0A` +
                            `*Phone:* ${phone}%0A` +
                            `*Date:* ${date}%0A` +
                            `*Time:* ${fullTime}%0A` +
                            `*Guests:* ${guests}`;

            // 3. Define the receiving WhatsApp Number
            // NOTE: Replace with your actual restaurant WhatsApp number. 
            // Format: Country code followed by the number (NO plus sign, dashes, or spaces).
            // Example for Canada: 16044861004
            const restaurantWhatsAppNumber = "8437953411"; 

            // 4. Construct the WhatsApp URL
            const whatsappURL = `https://wa.me/${restaurantWhatsAppNumber}?text=${message}`;

            // 5. Show success message on the website
            const successMsg = document.getElementById("successMessage");
            if (successMsg) {
                successMsg.style.display = "block";
            }

            // 6. Open WhatsApp in a new tab
            window.open(whatsappURL, "_blank");

            // Optional: Clear the form after a short delay
            setTimeout(() => {
                reservationForm.reset();
                // Reset AM/PM to default PM
                document.getElementById('timePM').checked = true;
                if (successMsg) successMsg.style.display = "none";
            }, 3000);
        });
    }