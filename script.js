// Self-invoking function to encapsulate logic and avoid polluting the global scope.
(function() {
    // --- DOM Element References ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
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
