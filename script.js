// Global variables
let services = [];
let currentFilter = 'all';
let currentSearch = '';

/**
 * Loads services data from the external JSON file
 * Fetches services.json and populates the services array
 * Displays error message if loading fails
 */
async function loadServicesData() {
    try {
        const response = await fetch('services.json');
        if (!response.ok) {
            throw new Error('Failed to load services data');
        }
        services = await response.json();
        renderServices();
    } catch (error) {
        console.error('Error loading services data:', error);
        // Fallback: show error message to user
        const grid = document.getElementById('servicesGrid');
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>Error loading services</h3>
                <p>Could not load services data. Please try refreshing the page.</p>
            </div>
        `;
    }
}

/**
 * Renders the filtered and searched services to the grid
 * Filters services based on current category filter and search term
 * Displays empty state if no services match the criteria
 */
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    const filteredServices = services.filter(service => {
        const matchesCategory = currentFilter === 'all' || service.category === currentFilter;
        const matchesSearch = service.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            service.description.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredServices.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>No services found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredServices.map(service => {
        return `
            <div class="service-card">
                <div class="service-header">
                    <div>
                        <div class="service-name">${service.name}</div>
                        <div class="service-phone">📞 ${service.phone}</div>
                    </div>
                    <div class="service-category">${service.category.toUpperCase()}</div>
                </div>
                <div class="service-info">
                    <div class="service-description">${service.description}</div>
                </div>
                ${service.socialMedia && (service.socialMedia.facebook || service.socialMedia.instagram || service.socialMedia.google || service.socialMedia.website) ? `
                <div class="service-social">
                    ${service.socialMedia.facebook ? `
                    <a href="${service.socialMedia.facebook}" target="_blank" rel="noopener noreferrer" class="social-link facebook-link" aria-label="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    ` : ''}
                    ${service.socialMedia.instagram ? `
                    <a href="${service.socialMedia.instagram}" target="_blank" rel="noopener noreferrer" class="social-link instagram-link" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    ` : ''}
                    ${service.socialMedia.google ? `
                    <a href="${service.socialMedia.google}" target="_blank" rel="noopener noreferrer" class="social-link google-link" aria-label="Google Reviews">
                        <i class="fab fa-google"></i>
                    </a>
                    ` : ''}
                    ${service.socialMedia.website ? `
                    <a href="${service.socialMedia.website}" target="_blank" rel="noopener noreferrer" class="social-link website-link" aria-label="Website">
                        <i class="fas fa-globe"></i>
                    </a>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Event listener for search input field
 * Updates currentSearch and re-renders services as user types
 */
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderServices();
});

/**
 * Event listeners for category filter buttons
 * Updates active button state and filters services by category
 * Excludes the scroll button from category filtering logic
 */
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Skip scroll button - it has its own handler
        if (btn.classList.contains('scroll-btn')) {
            return;
        }
        
        document.querySelectorAll('.category-btn').forEach(b => {
            if (!b.classList.contains('scroll-btn')) {
                b.classList.remove('active');
            }
        });
        e.target.classList.add('active');
        currentFilter = e.target.dataset.category;
        renderServices();
    });
});

/**
 * Event listener for the "Sobre" (About) button
 * Smoothly scrolls the page to the about section in the footer
 */
document.getElementById('scrollToAbout').addEventListener('click', (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('aboutSection');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

/**
 * Initializes the application when the DOM is fully loaded
 * Loads services data from the JSON file
 */
document.addEventListener('DOMContentLoaded', function() {
    loadServicesData();
});