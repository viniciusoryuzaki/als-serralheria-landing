/**
 * ALS Serralheria e Automação - White Luxury Interactivity, Category Filter & Geolocation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Sticky Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-slate-800"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-slate-800"></i>';
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-slate-800"></i>';
            });
        });
    }

    // 3. Category Filter Tabs in Projects Gallery
    window.filterGallery = function(category) {
        const cards = document.querySelectorAll('#gallery-grid .gallery-card');
        const tabs = document.querySelectorAll('.gallery-tab');

        // Update active tab styles
        tabs.forEach(tab => {
            tab.classList.remove('bg-accent-red', 'border-accent-red', 'text-white', 'active');
            tab.classList.add('bg-white', 'border-slate-300', 'text-slate-700');
        });

        // Find clicked or matching tab
        tabs.forEach(tab => {
            const tabOnClick = tab.getAttribute('onclick');
            if (tabOnClick && tabOnClick.includes(category)) {
                tab.classList.add('bg-accent-red', 'border-accent-red', 'text-white', 'active');
                tab.classList.remove('bg-white', 'border-slate-300', 'text-slate-700');
            }
        });

        // Filter cards with smooth fade
        cards.forEach(card => {
            card.style.transition = 'all 0.4s ease';
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 350);
            }
        });
    };

    // 4. Geolocation & Distance Calculator (Rua Professor José Demeterco, 190, Cajuru, Curitiba)
    const ALS_COORDS = {
        lat: -25.44111,
        lng: -49.22703,
        address: "Rua Professor José Demeterco, 190 - Cajuru, Curitiba - PR"
    };

    const distanceBadge = document.getElementById('distance-badge');
    const distanceValue = document.getElementById('distance-value');
    const distanceTime = document.getElementById('distance-time');
    const geoStatusText = document.getElementById('geo-status-text');
    const getDistanceBtn = document.getElementById('btn-get-distance');

    function computeDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function calculateAndDisplayDistance(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const km = computeDistance(userLat, userLng, ALS_COORDS.lat, ALS_COORDS.lng);

        if (distanceValue) {
            distanceValue.textContent = `${km.toFixed(1)} km`;
        }

        if (distanceTime) {
            const minutes = Math.max(5, Math.round((km / 45) * 60));
            distanceTime.textContent = `Aprox. ${minutes} min de deslocamento até a sua localização`;
        }

        if (geoStatusText) {
            if (km <= 40) {
                geoStatusText.innerHTML = `<span class="text-emerald-700 font-semibold flex items-center gap-1.5"><i class="fa-solid fa-circle-check"></i> Você está na nossa área de atendimento prioritário em Curitiba e Região Metropolitana!</span>`;
            } else {
                geoStatusText.innerHTML = `<span class="text-slate-700 font-semibold flex items-center gap-1.5"><i class="fa-solid fa-truck-fast"></i> Atendemos projetos arquitetônicos especiais na sua região com agendamento prévio.</span>`;
            }
        }

        if (distanceBadge) {
            distanceBadge.classList.remove('hidden');
        }

        if (getDistanceBtn) {
            getDistanceBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs mr-2 text-accent-red"></i> Distância calculada: ${km.toFixed(1)} km`;
        }
    }

    function handleGeoError(error) {
        console.log("Geolocation error:", error);
        if (geoStatusText) {
            geoStatusText.innerHTML = `<span class="text-slate-600">Localização no Cajuru - Atendemos toda Curitiba e Regiões Próximas com frota própria.</span>`;
        }
        if (distanceValue) {
            distanceValue.textContent = "Curitiba & Região";
        }
        if (distanceTime) {
            distanceTime.textContent = "Atendimento presencial em Curitiba e cidades vizinhas";
        }
        if (getDistanceBtn) {
            getDistanceBtn.innerHTML = `<i class="fa-solid fa-location-dot mr-2 text-accent-red"></i> Sede em Curitiba (Cajuru)`;
        }
    }

    if (getDistanceBtn) {
        getDistanceBtn.addEventListener('click', () => {
            if ("geolocation" in navigator) {
                getDistanceBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Estamos verificando a sua distancia de nós...`;
                if (distanceValue) {
                    distanceValue.textContent = "Verificando...";
                }
                if (distanceTime) {
                    distanceTime.textContent = "Estamos verificando a sua distancia de nós";
                }
                navigator.geolocation.getCurrentPosition(
                    calculateAndDisplayDistance,
                    (err) => {
                        handleGeoError(err);
                    },
                    { timeout: 8000 }
                );
            }
        });
    }

    if ("geolocation" in navigator && navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                navigator.geolocation.getCurrentPosition(calculateAndDisplayDistance, handleGeoError);
            }
        }).catch(() => {});
    }

    // 5. File Upload "Anexar Projeto Arquitetônico"
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('projeto-file');
    const fileNameDisplay = document.getElementById('file-name-display');
    const fileNameText = document.getElementById('file-name-text');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const uploadText = document.getElementById('upload-text');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });

        function handleFiles(files) {
            if (files && files.length > 0) {
                const file = files[0];
                fileNameText.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
                fileNameDisplay.classList.remove('hidden');
                uploadText.textContent = "Arquivo selecionado (clique para trocar)";
            }
        }

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.value = '';
                fileNameDisplay.classList.add('hidden');
                uploadText.textContent = "Anexar Projeto Arquitetônico";
            });
        }
    }

    // 7. Hero Scroll-Controlled YouTube Video Playback
    const ytIframe = document.getElementById('hero-youtube-video');
    const heroVideo = document.getElementById('hero-scroll-video');
    const videoStatusBadge = document.getElementById('video-status-badge');
    const videoIndicator = document.getElementById('video-indicator');

    function sendYTCommand(command, args = '') {
        if (ytIframe && ytIframe.contentWindow) {
            ytIframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: args
            }), '*');
        }
    }

    function checkScrollVideo() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY <= 15) {
            // Quando estiver no topo
            if (heroVideo) {
                heroVideo.pause();
                heroVideo.currentTime = 0;
            }
            sendYTCommand('pauseVideo');
            if (videoStatusBadge) videoStatusBadge.textContent = "Vídeo Oficial ALS";
            if (videoIndicator) videoIndicator.innerHTML = '<i class="fa-brands fa-youtube text-accent-red text-sm"></i> <span>ALS Automação</span>';
        } else {
            // Ao rolar para baixo
            if (heroVideo && heroVideo.paused) {
                heroVideo.play().catch(() => {});
            }
            sendYTCommand('playVideo');
            if (videoStatusBadge) videoStatusBadge.textContent = "Reproduzindo";
            if (videoIndicator) videoIndicator.innerHTML = '<i class="fa-solid fa-play text-accent-red text-[10px]"></i> <span>Em Reprodução</span>';
        }
    }

    window.addEventListener('scroll', checkScrollVideo, { passive: true });
    // Executa verificação inicial após carregamento do iframe
    setTimeout(checkScrollVideo, 1000);
});
