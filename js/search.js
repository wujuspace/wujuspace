// Search functionality for navigation
(function() {
    'use strict';

    function initSearch() {
        const searchButton = document.getElementById('nav-search-button');
        const searchBar = document.getElementById('nav-search-bar');
        const searchInput = document.getElementById('nav-search-input');
        const searchContainer = document.querySelector('.nav-search-container');
        const navMenuRight = document.querySelector('.nav-menu-right');

        if (!searchButton || !searchBar || !searchInput) {
            return;
        }

        function openSearch() {
            searchContainer.classList.add('search-active');
            if (navMenuRight) {
                navMenuRight.classList.add('search-active');
            }
            searchBar.classList.add('active');
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }

        function closeSearch() {
            searchContainer.classList.remove('search-active');
            if (navMenuRight) {
                navMenuRight.classList.remove('search-active');
            }
            searchBar.classList.remove('active');
            searchInput.value = '';
        }

        function isSearchActive() {
            return searchBar.classList.contains('active');
        }

        // Toggle search on button click
        searchButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isSearchActive()) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (isSearchActive() && 
                !searchContainer.contains(e.target) && 
                !searchBar.contains(e.target)) {
                closeSearch();
            }
        });

        // Close search on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isSearchActive()) {
                closeSearch();
            }
        });

        // Prevent search bar click from closing search
        searchBar.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Handle search input (you can add search logic here)
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Add search functionality here
                const query = searchInput.value.trim();
                if (query) {
                    console.log('Searching for:', query);
                    // Implement your search logic here
                }
            }
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();

