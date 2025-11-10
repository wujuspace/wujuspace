// Project Detail Page - Interactive Features
(function() {
    'use strict';

    function initProjectDetail() {
        const hero3d = document.getElementById('project-hero-3d');
        const hero3dImage = document.getElementById('project-3d-image');
        const galleryMarquee = document.getElementById('gallery-marquee');
        const galleryContainer = document.getElementById('gallery-marquee-container');
        const galleryItems = document.querySelectorAll('[data-gallery-item]');
        const mediaModal = document.getElementById('media-modal');
        const mediaModalBackdrop = document.getElementById('media-modal-backdrop');
        const mediaModalClose = document.getElementById('media-modal-close');
        const mediaModalContent = document.getElementById('media-modal-content');
        const mediaModalMedia = document.getElementById('media-modal-media');
        const body = document.body;

        // Variables for 3D rotation
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let rotationX = 0;
        let rotationY = 0;

        // ============================================
        // 1. 3D Image Rotation (Slight rotation following cursor)
        // ============================================
        if (hero3d && hero3dImage) {
            const hero3dContainer = hero3d.querySelector('.project-3d-container');
            
            // Lerp function for smooth interpolation
            function lerp(start, end, factor) {
                return start + (end - start) * factor;
            }

            // Update mouse position
            function updateMousePosition(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }

            body.addEventListener('mousemove', updateMousePosition);

            // Animate 3D rotation
            function animate3DRotation() {
                if (hero3dContainer) {
                    const rect = hero3dContainer.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const deltaX = mouseX - centerX;
                    const deltaY = mouseY - centerY;
                    
                    // Calculate rotation (slight rotation, max 10 degrees)
                    const targetRotationY = (deltaX / rect.width) * 10; // Max 10 degrees
                    const targetRotationX = -(deltaY / rect.height) * 10; // Max 10 degrees (negative for natural feel)
                    
                    // Smooth interpolation
                    rotationX = lerp(rotationX, targetRotationX, 0.1);
                    rotationY = lerp(rotationY, targetRotationY, 0.1);
                    
                    // Apply transform with perspective
                    hero3dContainer.style.transform = `
                        perspective(1000px)
                        rotateX(${rotationX}deg)
                        rotateY(${rotationY}deg)
                    `;
                }
                requestAnimationFrame(animate3DRotation);
            }

            animate3DRotation();

            // Reset rotation when mouse leaves hero area
            hero3d.addEventListener('mouseleave', () => {
                rotationX = 0;
                rotationY = 0;
            });
        }

        // ============================================
        // 2. Gallery Marquee (Stop on hover, duplicate items for seamless loop)
        // ============================================
        if (galleryMarquee && galleryItems.length > 0) {
            // Duplicate gallery items for seamless marquee
            const originalItems = Array.from(galleryItems);
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                galleryMarquee.appendChild(clone);
            });

            // Pause marquee on hover
            galleryContainer.addEventListener('mouseenter', () => {
                galleryMarquee.classList.add('paused');
            });

            galleryContainer.addEventListener('mouseleave', () => {
                galleryMarquee.classList.remove('paused');
            });
        }

        // ============================================
        // 3. Gallery Item Click - Show Modal
        // ============================================
        function openMediaModal(item) {
            const mediaType = item.getAttribute('data-type');
            const mediaSrc = item.getAttribute('data-src');
            const mediaPoster = item.getAttribute('data-poster');
            
            // Clear previous media
            mediaModalMedia.innerHTML = '';
            
            let mediaElement;
            
            if (mediaType === 'video') {
                mediaElement = document.createElement('video');
                mediaElement.src = mediaSrc;
                mediaElement.controls = true;
                mediaElement.autoplay = true;
                mediaElement.playsInline = true;
                if (mediaPoster) {
                    mediaElement.poster = mediaPoster;
                }
            } else if (mediaType === 'image' || mediaType === 'gif') {
                mediaElement = document.createElement('img');
                mediaElement.src = mediaSrc;
                mediaElement.alt = item.querySelector('.gallery-item-title')?.textContent || 'Gallery media';
            }
            
            if (mediaElement) {
                mediaModalMedia.appendChild(mediaElement);
                mediaModal.classList.add('active');
                body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        }

        function closeMediaModal() {
            // Stop any playing videos
            const video = mediaModalMedia.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            
            mediaModal.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        }

        // Add click handlers to gallery items
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                openMediaModal(item);
            });
        });

        // Close modal handlers
        if (mediaModalClose) {
            mediaModalClose.addEventListener('click', closeMediaModal);
        }

        if (mediaModalBackdrop) {
            mediaModalBackdrop.addEventListener('click', closeMediaModal);
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mediaModal.classList.contains('active')) {
                closeMediaModal();
            }
        });

        // Prevent modal content click from closing modal
        if (mediaModalContent) {
            mediaModalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // ============================================
        // 4. Easy Maintenance - Data Attribute System
        // ============================================
        // The page uses data attributes for easy content updates:
        // - data-project-title: Project title
        // - data-tag: Project tags
        // - data-demo-url: Demo URL
        // - data-description: Project description
        // - data-gallery-item: Gallery items
        // - data-type: Media type (image, video, gif)
        // - data-src: Media source URL
        
        // Function to update project data (for easy maintenance)
        function updateProjectData(data) {
            // Update title
            if (data.title) {
                const titleElement = document.querySelector('[data-project-title]');
                if (titleElement) {
                    titleElement.textContent = data.title;
                }
            }
            
            // Update tags
            if (data.tags && Array.isArray(data.tags)) {
                const tagsContainer = document.querySelector('.project-hero-tags');
                if (tagsContainer) {
                    tagsContainer.innerHTML = '';
                    data.tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'project-tag';
                        tagElement.setAttribute('data-tag', tag.toLowerCase());
                        tagElement.textContent = tag;
                        tagsContainer.appendChild(tagElement);
                    });
                }
            }
            
            // Update 3D image
            if (data.image3d && hero3dImage) {
                hero3dImage.src = data.image3d;
                hero3dImage.alt = data.title || 'Project 3D Model';
            }
            
            // Update demo URL
            if (data.demoUrl) {
                const demoUrlElement = document.querySelector('[data-demo-url]');
                if (demoUrlElement) {
                    demoUrlElement.textContent = data.demoUrl;
                }
                const demoIframe = document.getElementById('demo-iframe');
                if (demoIframe && data.demoUrl) {
                    demoIframe.src = data.demoUrl;
                    demoIframe.classList.add('active');
                    const placeholder = document.querySelector('.demo-placeholder');
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                }
            }
            
            // Update description
            if (data.description) {
                const descriptionElement = document.querySelector('[data-description]');
                if (descriptionElement) {
                    if (typeof data.description === 'string') {
                        descriptionElement.innerHTML = `<p>${data.description}</p>`;
                    } else if (Array.isArray(data.description)) {
                        descriptionElement.innerHTML = data.description.map(p => `<p>${p}</p>`).join('');
                    }
                }
            }
            
            // Update gallery
            if (data.gallery && Array.isArray(data.gallery)) {
                const galleryMarquee = document.getElementById('gallery-marquee');
                if (galleryMarquee) {
                    galleryMarquee.innerHTML = '';
                    data.gallery.forEach(item => {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item';
                        galleryItem.setAttribute('data-gallery-item', '');
                        galleryItem.setAttribute('data-type', item.type);
                        galleryItem.setAttribute('data-src', item.src);
                        if (item.poster) {
                            galleryItem.setAttribute('data-poster', item.poster);
                        }
                        if (item.title) {
                            galleryItem.setAttribute('data-title', item.title);
                        }
                        
                        if (item.type === 'video') {
                            const video = document.createElement('video');
                            video.className = 'gallery-item-video';
                            video.muted = true;
                            video.loop = true;
                            const source = document.createElement('source');
                            source.src = item.src;
                            source.type = 'video/mp4';
                            video.appendChild(source);
                            galleryItem.appendChild(video);
                        } else {
                            const img = document.createElement('img');
                            img.src = item.src;
                            img.alt = item.title || 'Gallery item';
                            img.className = 'gallery-item-image';
                            galleryItem.appendChild(img);
                        }
                        
                        const overlay = document.createElement('div');
                        overlay.className = 'gallery-item-overlay';
                        
                        if (item.type === 'video') {
                            const playButton = document.createElement('button');
                            playButton.className = 'gallery-play-button';
                            playButton.setAttribute('aria-label', 'Play video');
                            playButton.innerHTML = `
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            `;
                            overlay.appendChild(playButton);
                        }
                        
                        if (item.title) {
                            const title = document.createElement('span');
                            title.className = 'gallery-item-title';
                            title.textContent = item.title;
                            overlay.appendChild(title);
                        }
                        
                        galleryItem.appendChild(overlay);
                        galleryItem.addEventListener('click', () => openMediaModal(galleryItem));
                        galleryMarquee.appendChild(galleryItem);
                    });
                    
                    // Duplicate for seamless marquee
                    const items = galleryMarquee.querySelectorAll('[data-gallery-item]');
                    items.forEach(item => {
                        const clone = item.cloneNode(true);
                        clone.addEventListener('click', () => openMediaModal(item));
                        galleryMarquee.appendChild(clone);
                    });
                }
            }
        }
        
        // Expose update function globally for easy maintenance
        window.updateProjectData = updateProjectData;
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectDetail);
    } else {
        initProjectDetail();
    }
})();

