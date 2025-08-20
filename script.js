// Comparison functionality
let selectedHotels = [];
const maxComparisons = 3;

// Updated restaurant filtering functionality
function setupRestaurantFilters() {
    const filterBtns = document.querySelectorAll('#dining .filter-btn');
    const localFavoritesCheckbox = document.getElementById('localFavorites');
    const kidsMenuCheckbox = document.getElementById('kidsMenu');

    // Ensure the "All Restaurants" button is active by default
    const allRestaurantsBtn = document.querySelector('#dining .filter-btn[data-filter="all"]');
    if (allRestaurantsBtn && !document.querySelector('#dining .filter-btn.active')) {
        allRestaurantsBtn.classList.add('active');
    }

    function filterRestaurants() {
        const activeFilter = document.querySelector('#dining .filter-btn.active')?.dataset.filter || 'all';
        const showLocalOnly = localFavoritesCheckbox?.checked || false;
        const showKidsOnly = kidsMenuCheckbox?.checked || false;
        
        let filteredRestaurants = mockDB.restaurants;

        // Filter by cuisine type
        if (activeFilter !== 'all') {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.cuisine === activeFilter
            );
        }

        // Filter by local favorites
        if (showLocalOnly) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.isLocalFavorite === true
            );
        }

        // Filter by kids menu
        if (showKidsOnly) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.hasKidsMenu === true
            );
        }

        populateRestaurantGallery(filteredRestaurants);
    }

    // Set up filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            filterRestaurants();
        });
    });

    // Set up checkbox event listeners
    if (localFavoritesCheckbox) {
        localFavoritesCheckbox.addEventListener('change', filterRestaurants);
    }
    if (kidsMenuCheckbox) {
        kidsMenuCheckbox.addEventListener('change', filterRestaurants);
    }
}

// Updated restaurant gallery population to match mockDB structure
function populateRestaurantGallery(restaurants = mockDB.restaurants) {
    const gallery = document.getElementById('restaurantGallery');
    if (!gallery) return;

    gallery.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" data-cuisine="${restaurant.cuisine}" data-local="${restaurant.isLocalFavorite}" data-kids="${restaurant.hasKidsMenu}">
            <div class="restaurant-image">
                <div class="placeholder-img">[${restaurant.name} Image]</div>
                ${restaurant.isLocalFavorite ? '<span class="local-badge">Local Favorite</span>' : ''}
            </div>
            <div class="restaurant-info">
                <div class="restaurant-header">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <span class="stars">${'★'.repeat(Math.floor(restaurant.rating))}${'☆'.repeat(5 - Math.floor(restaurant.rating))}</span>
                        <span class="rating-number">${restaurant.rating}</span>
                    </div>
                </div>
                <div class="restaurant-details">
                    <span class="cuisine-type">${restaurant.cuisine}</span>
                    <span class="price-range">${restaurant.priceRange}</span>
                </div>
                <p class="restaurant-description">${restaurant.description}</p>
                <div class="restaurant-meta">
                    <div class="meta-item">
                        <span class="meta-icon">🕒</span>
                        <span>${restaurant.hours}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">📍</span>
                        <span>${restaurant.location}</span>
                    </div>
                    ${restaurant.hasKidsMenu ? '<div class="meta-item"><span class="meta-icon">👶</span><span>Kids Menu</span></div>' : ''}
                </div>
                <button class="cta-btn restaurant-btn">View Details</button>
            </div>
        </div>
    `).join('');
}

// Add accommodation gallery population
function populateAccommodationGallery(accommodations = mockDB.hotels) {
    const gallery = document.getElementById('accommodationGallery');
    if (!gallery) return;

    gallery.innerHTML = accommodations.map(hotel => `
        <div class="accommodation-card-new" data-type="${hotel.type}" data-local="${hotel.isLocalFavorite}" data-kids="${hotel.hasKidsMenu}" data-hotel-id="${hotel.id}">
            <div class="comparison-checkbox-container">
                <label class="comparison-checkbox">
                    <input type="checkbox" class="hotel-compare-checkbox" data-hotel-id="${hotel.id}" ${selectedHotels.includes(hotel.id) ? 'checked' : ''}>
                    <span class="checkbox-label">Compare</span>
                </label>
            </div>
            <div class="accommodation-image">
                <div class="placeholder-img">[${hotel.name} Image]</div>
                ${hotel.isLocalFavorite ? '<span class="local-badge">Local Favorite</span>' : ''}
            </div>
            <div class="accommodation-info">
                <div class="accommodation-header">
                    <h3>${hotel.name}</h3>
                    <div class="accommodation-rating">
                        <span class="rating-number">${hotel.rating}</span>
                    </div>
                </div>
                <div class="star-price-container">
                    <div class="star-rating-inline">
                        ${'★'.repeat(hotel.stars)}${'☆'.repeat(5 - hotel.stars)}
                    </div>
                    <span class="price-range-inline">${hotel.priceRange}</span>
                </div>
                <div class="accommodation-details">
                    <span class="accommodation-type">${hotel.type}</span>
                    <span class="room-count">${hotel.roomCount} rooms</span>
                </div>
                <p class="accommodation-description">${hotel.description}</p>
                <div class="accommodation-meta">
                    <div class="meta-item">
                        <span class="meta-icon">📍</span>
                        <span>${hotel.location}</span>
                    </div>
                    ${hotel.hasKidsMenu ? '<div class="meta-item"><span class="meta-icon">👶</span><span>Kid-Friendly</span></div>' : ''}
                </div>
                <div class="amenities-preview">
                    <h4>Amenities:</h4>
                    <div class="amenities-list" data-hotel-id="${hotel.id}">
                        ${hotel.amenities.slice(0, 4).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                        ${hotel.amenities.length > 4 ? `
                            <span class="amenity-more" data-hotel-id="${hotel.id}" data-all-amenities='${JSON.stringify(hotel.amenities)}'>
                                +${hotel.amenities.length - 4} more
                            </span>
                        ` : ''}
                    </div>
                </div>
                <button class="cta-btn accommodation-btn">View Details & Book</button>
            </div>
        </div>
    `).join('');

    // Set up amenity expansion functionality
    setupAmenityExpansion();
    
    // Set up comparison checkboxes
    setupComparisonCheckboxes();
}

// Setup comparison checkbox functionality
function setupComparisonCheckboxes() {
    const checkboxes = document.querySelectorAll('.hotel-compare-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const hotelId = parseInt(this.dataset.hotelId);

            if (this.checked) {
                if (selectedHotels.length < maxComparisons) {
                    selectedHotels.push(hotelId);
                } else {
                    // Prevent checking if max reached
                    this.checked = false;
                    alert(`You can only compare up to ${maxComparisons} hotels at once.`);
                    return;
                }
            } else {
                selectedHotels = selectedHotels.filter(id => id !== hotelId);
            }

            updateComparisonControls();
        });
    });
}

// Update comparison controls visibility and state
function updateComparisonControls() {
    const comparisonControls = document.getElementById('comparisonControls');
    const selectedCount = document.getElementById('selectedCount');
    const compareBtn = document.getElementById('compareBtn');

    if (selectedHotels.length > 0) {
        comparisonControls.style.display = 'flex';
        selectedCount.textContent = selectedHotels.length;
        compareBtn.disabled = selectedHotels.length < 2;
    } else {
        comparisonControls.style.display = 'none';
    }
}

// Show comparison view
function showComparison() {
    const comparisonView = document.getElementById('comparisonView');
    const comparisonGrid = document.getElementById('comparisonGrid');
    const accommodationGallery = document.getElementById('accommodationGallery');

    // Get selected hotels data
    const selectedHotelsData = mockDB.hotels.filter(hotel => selectedHotels.includes(hotel.id));

    // Generate comparison cards with all amenities expanded
    comparisonGrid.innerHTML = selectedHotelsData.map(hotel => `
        <div class="comparison-card">
            <div class="comparison-card-image">
                <div class="placeholder-img">[${hotel.name} Image]</div>
            </div>
            
            <div class="comparison-card-header">
                <h3>${hotel.name}</h3>
            </div>
            
            <div class="comparison-card-badges">
                <div class="star-rating">
                    ${'★'.repeat(hotel.stars)}${'☆'.repeat(5 - hotel.stars)}
                </div>
                ${hotel.isLocalFavorite ? '<span class="local-badge">Local Favorite</span>' : '<span></span>'}
            </div>
            
            <div class="comparison-details">
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${hotel.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Rating:</span>
                    <span class="detail-value">${hotel.rating}/5</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Price Range:</span>
                    <span class="detail-value">${hotel.priceRange}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Rooms:</span>
                    <span class="detail-value">${hotel.roomCount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${hotel.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Kid-Friendly:</span>
                    <span class="detail-value">${hotel.hasKidsMenu ? 'Yes' : 'No'}</span>
                </div>
            </div>
            
            <div class="comparison-description">
                <h4>Description</h4>
                <p>${hotel.description}</p>
            </div>
            
            <div class="comparison-amenities">
                <h4>All Amenities</h4>
                <div class="amenities-list-comparison">
                    ${hotel.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
            </div>
            
            <button class="cta-btn accommodation-btn">Book ${hotel.name}</button>
        </div>
    `).join('');

    // Show comparison view and hide gallery
    comparisonView.style.display = 'block';
    accommodationGallery.style.display = 'none';

    // Scroll to comparison view
    comparisonView.scrollIntoView({ behavior: 'smooth' });
}

// Close comparison view
function closeComparison() {
    const comparisonView = document.getElementById('comparisonView');
    const accommodationGallery = document.getElementById('accommodationGallery');

    comparisonView.style.display = 'none';
    accommodationGallery.style.display = 'grid';
}

// Clear all selections
function clearComparisons() {
    selectedHotels = [];

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.hotel-compare-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    updateComparisonControls();
    closeComparison();
}

// Setup comparison event listeners
function setupComparisonControls() {
    const compareBtn = document.getElementById('compareBtn');
    const clearComparisonBtn = document.getElementById('clearComparisonBtn');
    const closeComparisonBtn = document.getElementById('closeComparison');

    if (compareBtn) {
        compareBtn.addEventListener('click', showComparison);
    }

    if (clearComparisonBtn) {
        clearComparisonBtn.addEventListener('click', clearComparisons);
    }

    if (closeComparisonBtn) {
        closeComparisonBtn.addEventListener('click', closeComparison);
    }
}

// Function to handle amenity expansion
function setupAmenityExpansion() {
    const amenityMoreButtons = document.querySelectorAll('.amenity-more');
    
    amenityMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotelId = this.dataset.hotelId;
            const allAmenities = JSON.parse(this.dataset.allAmenities);
            const amenitiesList = this.parentElement;
            
            // Check if already expanded
            if (this.classList.contains('expanded')) {
                // Collapse - show only first 4 amenities
                const amenityTags = amenitiesList.querySelectorAll('.amenity-tag');
                amenityTags.forEach((tag, index) => {
                    if (index >= 4) {
                        tag.remove();
                    }
                });
                
                this.textContent = `+${allAmenities.length - 4} more`;
                this.classList.remove('expanded');
            } else {
                // Expand - show all amenities
                const hiddenAmenities = allAmenities.slice(4);
                
                // Remove the "+X more" button temporarily
                this.remove();
                
                // Add all hidden amenities
                hiddenAmenities.forEach(amenity => {
                    const amenityTag = document.createElement('span');
                    amenityTag.className = 'amenity-tag amenity-tag-expanded';
                    amenityTag.textContent = amenity;
                    amenitiesList.appendChild(amenityTag);
                });
                
                // Add a "Show Less" button
                const showLessButton = document.createElement('span');
                showLessButton.className = 'amenity-more expanded';
                showLessButton.dataset.hotelId = hotelId;
                showLessButton.dataset.allAmenities = JSON.stringify(allAmenities);
                showLessButton.textContent = 'Show Less';
                amenitiesList.appendChild(showLessButton);
                
                // Re-setup the click handler for the new button
                showLessButton.addEventListener('click', arguments.callee);
            }
        });
    });
}

// Add sorting functionality
let currentSort = 'default';
let currentAccommodations = mockDB.hotels;

// Function to convert price range to numeric value for sorting
function getPriceValue(priceRange) {
    switch(priceRange) {
        case '$': return 1;
        case '$$': return 2;
        case '$$$': return 3;
        case '$$$$': return 4;
        default: return 0;
    }
}

// Function to sort accommodations
function sortAccommodations(accommodations, sortType) {
    const sortedAccommodations = [...accommodations];
    
    switch(sortType) {
        case 'price-asc':
            return sortedAccommodations.sort((a, b) => getPriceValue(a.priceRange) - getPriceValue(b.priceRange));
        case 'price-desc':
            return sortedAccommodations.sort((a, b) => getPriceValue(b.priceRange) - getPriceValue(a.priceRange));
        case 'rating-asc':
            return sortedAccommodations.sort((a, b) => a.rating - b.rating);
        case 'rating-desc':
            return sortedAccommodations.sort((a, b) => b.rating - a.rating);
        case 'name-asc':
            return sortedAccommodations.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedAccommodations.sort((a, b) => b.name.localeCompare(a.name));
        case 'default':
        default:
            return sortedAccommodations.sort((a, b) => a.id - b.id); // Sort by ID (original order)
    }
}

// Setup sort controls
function setupSortControls() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            
            // Apply current filters and then sort
            const filteredAccommodations = applyCurrentFilters();
            const sortedAccommodations = sortAccommodations(filteredAccommodations, currentSort);
            
            populateAccommodationGallery(sortedAccommodations);
        });
    }
}

// Function to apply current filters (extracted for reuse)
function applyCurrentFilters() {
    const activeFilter = document.querySelector('#accommodations .filter-btn.active')?.dataset.filter || 'all';
    const localFavoritesCheckbox = document.getElementById('localFavoritesAccom');
    const kidsMenuCheckbox = document.getElementById('kidsMenuAccom');
    const showLocalOnly = localFavoritesCheckbox?.checked || false;
    const showKidsOnly = kidsMenuCheckbox?.checked || false;

    let filteredAccommodations = mockDB.hotels;

    // Filter by accommodation type
    if (activeFilter !== 'all') {
        filteredAccommodations = filteredAccommodations.filter(hotel => 
            hotel.type === activeFilter
        );
    }

    // Filter by local favorites
    if (showLocalOnly) {
        filteredAccommodations = filteredAccommodations.filter(hotel => 
            hotel.isLocalFavorite === true
        );
    }

    // Filter by kids menu
    if (showKidsOnly) {
        filteredAccommodations = filteredAccommodations.filter(hotel => 
            hotel.hasKidsMenu === true
        );
    }

    return filteredAccommodations;
}

function setupAccommodationFilters() {
    const filterBtns = document.querySelectorAll('#accommodations .filter-btn');
    const localFavoritesCheckbox = document.getElementById('localFavoritesAccom');
    const kidsMenuCheckbox = document.getElementById('kidsMenuAccom');

    function filterAccommodations() {
        // Apply filters and then sort
        const filteredAccommodations = applyCurrentFilters();
        const sortedAccommodations = sortAccommodations(filteredAccommodations, currentSort);
        
        populateAccommodationGallery(sortedAccommodations);
    }

    // Set up filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            filterAccommodations();
        });
    });

    // Set up checkbox event listeners
    if (localFavoritesCheckbox) {
        localFavoritesCheckbox.addEventListener('change', filterAccommodations);
    }
    if (kidsMenuCheckbox) {
        kidsMenuCheckbox.addEventListener('change', filterAccommodations);
    }
}

// Activities functionality
let currentActivitySort = 'default';

// Function to populate activities gallery
function populateActivitiesGallery(activities = mockDB.activities) {
    const gallery = document.getElementById('activitiesGallery');
    if (!gallery) return;

    gallery.innerHTML = activities.map(activity => `
        <div class="activity-card" data-categories='${JSON.stringify(activity.categories)}' data-price="${activity.price}" data-tags='${JSON.stringify(activity.tags)}'>
            <div class="activity-image">
                <div class="placeholder-img">[${activity.name} Image]</div>
                ${activity.status ? `<div class="activity-status">${activity.status}</div>` : ''}
            </div>
            
            <div class="activity-content">
                <div class="activity-main-info">
                    <div class="activity-header">
                        <h3>${activity.name}</h3>
                        <div class="activity-price-rating">
                            <div class="activity-price ${activity.price === 0 ? 'free' : ''}">
                                ${activity.price === 0 ? 'FREE' : `$${activity.price}`}
                            </div>
                            ${activity.rating > 0 ? `
                                <div class="activity-rating">
                                    <span class="activity-stars">${'★'.repeat(Math.floor(activity.rating))}${'☆'.repeat(5 - Math.floor(activity.rating))}</span>
                                    <span class="activity-rating-number">${activity.rating}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="activity-categories">
                        ${activity.categories.map(category => `<span class="activity-category-tag">${category}</span>`).join('')}
                    </div>
                    
                    <p class="activity-description">${activity.description}</p>
                    
                    <button class="activity-book-btn">${activity.status ? 'Coming Soon' : 'Book Activity'}</button>
                </div>
                
                <div class="activity-details">
                    <h4>Activity Details</h4>
                    <div class="detail-item">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${activity.location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Categories:</span>
                        <span class="detail-value categories">
                            ${activity.categories.map(category => `<span class="detail-category-tag">${category}</span>`).join('')}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Difficulty:</span>
                        <span class="detail-value difficulty-${activity.difficulty.toLowerCase()}">${activity.difficulty}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${activity.duration}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Age Restriction:</span>
                        <span class="detail-value">${activity.ageRestriction}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to apply current activity filters
function applyCurrentActivityFilters() {
    const activeFilter = document.querySelector('#activities .filter-btn.active')?.dataset.filter || 'all';
    const familyFriendlyCheckbox = document.getElementById('familyFriendlyActivities');
    const freeActivitiesCheckbox = document.getElementById('freeActivities');
    const showFamilyFriendlyOnly = familyFriendlyCheckbox?.checked || false;
    const showFreeOnly = freeActivitiesCheckbox?.checked || false;

    let filteredActivities = mockDB.activities;

    // Filter by category
    if (activeFilter !== 'all') {
        filteredActivities = filteredActivities.filter(activity => 
            activity.categories.includes(activeFilter)
        );
    }

    // Filter by family-friendly
    if (showFamilyFriendlyOnly) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.tags.includes('Family-Friendly') || activity.tags.includes('Kid-Friendly')
        );
    }

    // Filter by free activities
    if (showFreeOnly) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.price === 0
        );
    }

    return filteredActivities;
}

// Function to sort activities
function sortActivities(activities, sortType) {
    const sortedActivities = [...activities];
    
    switch(sortType) {
        case 'price-asc':
            return sortedActivities.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedActivities.sort((a, b) => b.price - a.price);
        case 'rating-asc':
            return sortedActivities.sort((a, b) => a.rating - b.rating);
        case 'rating-desc':
            return sortedActivities.sort((a, b) => b.rating - a.rating);
        case 'name-asc':
            return sortedActivities.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedActivities.sort((a, b) => b.name.localeCompare(a.name));
        case 'default':
        default:
            return sortedActivities.sort((a, b) => a.id - b.id);
    }
}

// Setup activity filters
function setupActivityFilters() {
    const filterBtns = document.querySelectorAll('#activities .filter-btn');
    const familyFriendlyCheckbox = document.getElementById('familyFriendlyActivities');
    const freeActivitiesCheckbox = document.getElementById('freeActivities');

    function filterActivities() {
        const filteredActivities = applyCurrentActivityFilters();
        const sortedActivities = sortActivities(filteredActivities, currentActivitySort);
        
        populateActivitiesGallery(sortedActivities);
    }

    // Set up filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterActivities();
        });
    });

    // Set up checkbox event listeners
    if (familyFriendlyCheckbox) {
        familyFriendlyCheckbox.addEventListener('change', filterActivities);
    }
    if (freeActivitiesCheckbox) {
        freeActivitiesCheckbox.addEventListener('change', filterActivities);
    }
}

// Setup activity sort controls
function setupActivitySortControls() {
    const sortSelect = document.getElementById('activitySortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentActivitySort = this.value;
            
            const filteredActivities = applyCurrentActivityFilters();
            const sortedActivities = sortActivities(filteredActivities, currentActivitySort);
            
            populateActivitiesGallery(sortedActivities);
        });
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize restaurant gallery and filters
    populateRestaurantGallery();
    setupRestaurantFilters();

    // Initialize accommodation gallery and filters
    populateAccommodationGallery();
    setupAccommodationFilters();
    setupSortControls();

    // Initialize activities gallery, filters, and sorting
    populateActivitiesGallery();
    setupActivityFilters();
    setupActivitySortControls();

    // Setup comparison controls
    setupComparisonControls();

    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Function to show a specific section
    function showSection(targetId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav link
        const activeLink = document.querySelector(`[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Add click event listener for logo
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('home');
        });
    }

    // Search functionality (basic)
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search-bar');

    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchBar.value.toLowerCase().trim();
            if (searchTerm) {
                alert(`Search functionality would look for: "${searchTerm}"`);
                // In a real implementation, this would search through content
            }
        });

        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate form submission
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you at ${email} soon.`);

            // Reset form
            this.reset();
        });
    }

    // CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();

            // Handle different CTA actions
            switch(buttonText) {
                case 'Book Now':
                    alert('Booking system would open here');
                    break;
                case 'Explore Activities':
                    showSection('activities');
                    break;
                case 'View Accommodations':
                    showSection('accommodations');
                    break;
                case 'Check Availability':
                    alert('Availability checker would open here');
                    break;
                case 'Download Map':
                    alert('Map download would start here');
                    break;
                default:
                    if (buttonText.includes('View')) {
                        alert(`${buttonText} functionality would open here`);
                    }
                    break;
            }
        });
    });

    // Language selector
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLang = this.value;
            alert(`Language would change to: ${selectedLang}`);
            // In a real implementation, this would change the site language
        });
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.highlight-card, .accommodation-card, .dining-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';

    // Initialize with home section active
    showSection('home');
});

// Utility function to simulate loading states
function showLoading(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;

    setTimeout(() => {
        element.textContent = originalText;
        element.disabled = false;
    }, 1500);
}

// Add loading states to certain buttons
document.addEventListener('DOMContentLoaded', function() {
    const loadingButtons = document.querySelectorAll('[data-loading]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            showLoading(this);
        });
    });
});