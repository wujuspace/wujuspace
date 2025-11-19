// Services Page - Multi-Select Filtering, Sorting, and Project Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const platformChips = document.querySelectorAll('.platform-chip[data-filter]');
    const sortChips = document.querySelectorAll('.sort-chip[data-sort]');
    const clientChips = document.querySelectorAll('.client-chip[data-client]');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.querySelector('.services-projects');
    
    const platformContainer = document.getElementById('platform-chips-container');
    const clientContainer = document.getElementById('client-chips-container');
    
    if (!projectCards.length || !projectsContainer) return;
    
    // Store original order for restoring
    const platformOriginalOrder = Array.from(platformChips);
    const clientOriginalOrder = Array.from(clientChips);
    
    // Multi-select state
    let activePlatformFilters = new Set();
    let activeClientFilters = new Set();
    let activeSort = 'newest'; // Default to newest
    
    // Initialize: Set newest as active by default
    const newestChip = document.querySelector('.sort-chip[data-sort="newest"]');
    if (newestChip) {
        newestChip.classList.add('active');
    }
    
    // Sort chips by name initially
    sortChipsByName(platformContainer, platformChips);
    sortChipsByName(clientContainer, clientChips);
    
    // Sort function - sorts chips by text content alphabetically
    function sortChipsByName(container, chips) {
        const sortedChips = Array.from(chips).sort((a, b) => {
            return a.textContent.trim().localeCompare(b.textContent.trim());
        });
        
        // Clear container and re-append in sorted order
        container.innerHTML = '';
        sortedChips.forEach(chip => {
            container.appendChild(chip);
        });
    }
    
    // Move active chips to front
    function moveActiveToFront(container, chips, activeSet, getValue) {
        const activeChips = [];
        const inactiveChips = [];
        
        chips.forEach(chip => {
            const value = getValue(chip);
            if (activeSet.has(value)) {
                activeChips.push(chip);
            } else {
                inactiveChips.push(chip);
            }
        });
        
        // Sort inactive chips by name
        inactiveChips.sort((a, b) => {
            return a.textContent.trim().localeCompare(b.textContent.trim());
        });
        
        // Clear and re-append: active first, then inactive
        container.innerHTML = '';
        activeChips.forEach(chip => container.appendChild(chip));
        inactiveChips.forEach(chip => container.appendChild(chip));
    }
    
    // Platform filter chip click handler (multi-select)
    platformChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Toggle selection
            if (activePlatformFilters.has(filterValue)) {
                activePlatformFilters.delete(filterValue);
                this.classList.remove('active');
            } else {
                activePlatformFilters.add(filterValue);
                this.classList.add('active');
            }
            
            // Reorder chips: active first, then inactive sorted by name
            moveActiveToFront(
                platformContainer,
                Array.from(platformContainer.querySelectorAll('.platform-chip')),
                activePlatformFilters,
                (chip) => chip.getAttribute('data-filter')
            );
            
            applyFilters();
        });
    });
    
    // Sort chip click handler (single select)
    sortChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const sortValue = this.getAttribute('data-sort');
            
            // Remove active class from all sort chips
            sortChips.forEach(c => c.classList.remove('active'));
            
            // Activate clicked chip
            this.classList.add('active');
            activeSort = sortValue;
            
            applyFilters();
        });
    });
    
    // Client filter chip click handler (multi-select)
    clientChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const clientValue = this.getAttribute('data-client');
            
            // Toggle selection
            if (activeClientFilters.has(clientValue)) {
                activeClientFilters.delete(clientValue);
                this.classList.remove('active');
            } else {
                activeClientFilters.add(clientValue);
                this.classList.add('active');
            }
            
            // Reorder chips: active first, then inactive sorted by name
            moveActiveToFront(
                clientContainer,
                Array.from(clientContainer.querySelectorAll('.client-chip')),
                activeClientFilters,
                (chip) => chip.getAttribute('data-client')
            );
            
            applyFilters();
        });
    });
    
    // Main function to apply all filters and sorting
    function applyFilters() {
        const visibleCards = [];
        
        // Filter by platform and client (multi-select)
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardClient = card.getAttribute('data-client');
            
            // If no filters selected, show all
            // Otherwise, card must match at least one selected filter in each category
            let matchesPlatform = activePlatformFilters.size === 0 || activePlatformFilters.has(cardCategory);
            let matchesClient = activeClientFilters.size === 0 || activeClientFilters.has(cardClient);
            
            if (matchesPlatform && matchesClient) {
                visibleCards.push(card);
            } else {
                // Hide non-matching cards with fade out
                card.style.opacity = '0';
                card.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // Sort visible cards
        visibleCards.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            
            if (activeSort === 'newest') {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });
        
        // Reorder cards in DOM and show them
        visibleCards.forEach((card, index) => {
            // Remove from current position
            card.remove();
            
            // Insert at new position
            if (index === 0) {
                projectsContainer.insertBefore(card, projectsContainer.firstChild);
            } else {
                projectsContainer.insertBefore(card, visibleCards[index - 1].nextSibling);
            }
            
            // Show with animation
            setTimeout(() => {
                card.classList.remove('hidden');
                // Force reflow
                void card.offsetHeight;
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 50); // Stagger animation
        });
    }
    
    // Project card microinteractions
    projectCards.forEach(card => {
        // Hover effect enhancement
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'translateX(12px)';
                this.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.12)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'translateX(0)';
                this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }
        });
        
        // Click effect with ripple animation
        card.addEventListener('click', function(e) {
            if (this.classList.contains('hidden')) return;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(139, 92, 246, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '10';
            
            this.appendChild(ripple);
            
            // Click animation
            this.style.transform = 'translateX(8px) scale(0.97)';
            
            setTimeout(() => {
                ripple.remove();
                this.style.transform = '';
                
                // TODO: Add redirect to project page when ready
                // const projectUrl = this.getAttribute('data-url');
                // if (projectUrl) {
                //     window.location.href = projectUrl;
                // }
            }, 300);
        });
        
        // Active state animation
        card.addEventListener('mousedown', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'translateX(6px) scale(0.96)';
            }
        });
        
        card.addEventListener('mouseup', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'translateX(12px) scale(1)';
            }
        });
    });
    
    // Add ripple animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
