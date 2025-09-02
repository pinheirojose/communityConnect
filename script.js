// Global variables
let services = [];
let currentFilter = 'all';
let currentSearch = '';

// Load services data from external JSON file
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

// Cookie utilities
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

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

function hasUserRated(serviceId) {
    const ratedServices = getCookie('rated_services');
    if (!ratedServices) return false;
    return ratedServices.split(',').includes(serviceId.toString());
}

function markServiceAsRated(serviceId) {
    let ratedServices = getCookie('rated_services');
    if (!ratedServices) {
        ratedServices = serviceId.toString();
    } else {
        ratedServices += ',' + serviceId.toString();
    }
    setCookie('rated_services', ratedServices, 30); // Store for 30 days
}

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
                <div class="rating-section">
                    <div class="stars ${hasUserRated(service.id) ? 'rated' : ''}" data-service-id="${service.id}">
                        ${[1, 2, 3, 4, 5].map(star => 
                            `<span class="star ${star <= avgRating ? 'filled' : ''}" data-rating="${star}">★</span>`
                        ).join('')}
                    </div>
                    <div class="rating-info">
                        ${avgRating.toFixed(1)} ⭐ (${service.totalRatings} reviews)
                        ${hasUserRated(service.id) ? '<span class="rated-indicator">• You rated this</span>' : ''}
                    </div>
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

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderServices();
});

// Category filter functionality
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.category;
        renderServices();
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadServicesData();
});