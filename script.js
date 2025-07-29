// Self-invoking function to encapsulate logic and avoid polluting the global scope.
(function() {
    // --- DOM Element References ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    // New form-specific elements
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Modal-specific elements
    const openModalBtn = document.getElementById('open-profiles-modal');
    const closeModalBtn = document.getElementById('close-profiles-modal');
    const profilesModal = document.getElementById('profiles-modal');


    // --- Theme Toggling Logic ---
    /**
     * Applies the specified theme ('light' or 'dark') to the body.
     * @param {string} theme - The theme to apply.
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }

    // Add click listener to the theme toggle button
    themeToggleBtn.addEventListener('click', () => {
        // Determine the new theme by checking the body's current class
        const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
        // Save the user's preference to localStorage for persistence
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu Logic ---
    // Add click listener to the mobile menu (hamburger) button
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
    
    // Add a listener to the mobile menu itself to close it when a link is clicked.
    // This improves user experience on single-page applications.
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.remove('open');
        }
    });

    // --- Profiles Modal Logic ---
     // --- New Contact Form Logic ---
    /**
     * Handles the contact form submission asynchronously.
     * @param {Event} event - The form submission event.
     */
    async function handleFormSubmit(event) {
        event.preventDefault(); // Prevent the default page reload
        const form = event.target;
        const data = new FormData(form);
        
        try {
            // Use fetch to send the form data to Formspree
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // If submission is successful
                formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                formStatus.className = 'success';
                form.reset(); // Clear the form fields
            } else {
                // If there's a server-side error
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = "Oops! There was a problem submitting your form.";
                }
                formStatus.className = 'error';
            }
        } catch (error) {
            // If there's a network error
            formStatus.textContent = "Oops! There was a problem submitting your form.";
            formStatus.className = 'error';
        }
        
        // Make the status message visible
        formStatus.style.display = 'block';

        // Hide the message after a few seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 6000);
    }

    // Attach the submission handler to the form's submit event
    contactForm.addEventListener("submit", handleFormSubmit);

    // Open the modal when the 'Explore Profiles' link is clicked.
    openModalBtn.addEventListener('click', () => {
        profilesModal.classList.add('open');
    });

    // Close the modal when the close button (x) is clicked.
    closeModalBtn.addEventListener('click', () => {
        profilesModal.classList.remove('open');
    });

    // Close the modal if the user clicks on the dark overlay area.
    profilesModal.addEventListener('click', (e) => {
        // Check if the clicked element is the overlay itself, not the content inside it.
        if (e.target === profilesModal) {
            profilesModal.classList.remove('open');
        }
    });

    // --- Initialization on Page Load ---
    /**
     * Sets the initial theme based on user's saved preference or OS setting.
     */
    function initialize() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            // If a theme is saved in localStorage, use it.
            applyTheme(savedTheme);
        } else if (prefersDark) {
            // Otherwise, if the user's OS prefers dark mode, use it.
            applyTheme('dark');
        } else {
            // Default to light mode.
            applyTheme('light');
        }
    }

    // Run the initialization function when the script loads.
    initialize();
})();
