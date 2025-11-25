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
 * Sets a cookie with the given name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 * Retrieves a cookie value by name
 * @param {string} name - Cookie name to retrieve
 * @returns {string|null} - Cookie value or null if not found
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Checks if the current user has already rated a specific service
 * @param {number} serviceId - The ID of the service to check
 * @returns {boolean} - True if user has rated, false otherwise
 */
function hasUserRated(serviceId) {
    const ratedServices = getCookie('rated_services');
    if (!ratedServices) return false;
    return ratedServices.split(',').includes(serviceId.toString());
}

/**
 * Marks a service as rated by the current user
 * Stores the service ID in a cookie to prevent duplicate ratings
 * @param {number} serviceId - The ID of the service to mark as rated
 */
function markServiceAsRated(serviceId) {
    let ratedServices = getCookie('rated_services');
    if (!ratedServices) {
        ratedServices = serviceId.toString();
    } else {
        ratedServices += ',' + serviceId.toString();
    }
    setCookie('rated_services', ratedServices, 30); // Store for 30 days
}

/**
 * Renders the filtered and searched services to the grid
 * Filters services based on current category filter and search term
 * Displays empty state if no services match the criteria
 * Adds click handlers for star ratings
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
        const avgRating = service.ratings.length > 0 ? 
            service.ratings.reduce((a, b) => a + b, 0) / service.ratings.length : 0;
        
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
            </div>
        `;
    }).join('');

    // Add click handlers for stars
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const serviceId = parseInt(starsContainer.dataset.serviceId);
        
        // Only add click handler if user hasn't rated this service
        if (!hasUserRated(serviceId)) {
            starsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('star')) {
                    const rating = parseInt(e.target.dataset.rating);
                    rateService(serviceId, rating);
                }
            });
        }
    });
}

/**
 * Handles rating a service by the user
 * Prevents duplicate ratings and updates the service's rating data
 * @param {number} serviceId - The ID of the service being rated
 * @param {number} rating - The rating value (1-5)
 */
function rateService(serviceId, rating) {
    if (hasUserRated(serviceId)) {
        alert('You have already rated this service!');
        return;
    }

    const service = services.find(s => s.id === serviceId);
    if (service) {
        service.ratings.push(rating);
        service.totalRatings++;
        markServiceAsRated(serviceId);
        renderServices();
    }
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