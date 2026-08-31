/**
 * ALS Serralheria e Automação - White Luxury Interactivity, Category Filter & Geolocation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Reveal Observer (Animação suave de baixo para cima com transparência ao rolar a página)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

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

    // 7. ULTRA-SMOOTH VIDEO SCROLL SCRUBBING ENGINE (hero-video-smooth)
    // - O vídeo "hero-video-smooth" é controlado diretamente pelo scroll do mouse/touch/teclado.
    // - Enquanto o usuário rola a página, a tela permanece fixada na Hero Section (Head do site).
    // - O vídeo avança proporcionalmente ao scroll até ser 100% reproduzido.
    // - Quando o usuário para de rolar, o vídeo para no frame exato.
    // - Ao atingir o final da reprodução (100%), o scroll continua naturalmente para o restante do site.
    (function initVideoScrollScrubbing() {
        const container = document.getElementById('hero-scroll-container');
        const video = document.getElementById('hero-video-smooth') || document.getElementById('hero-scroll-video');
        const scrollHint = document.getElementById('hero-scroll-hint');

        if (!container || !video) return;

        // Garante que o vídeo fique pausado (sem autoplay livre)
        video.pause();

        let targetTime = 0;
        let isSeeking = false;
        let rafId = null;

        function renderFrame() {
            if (!video.duration || isNaN(video.duration)) {
                rafId = null;
                return;
            }

            const diff = targetTime - video.currentTime;

            // Se houver diferença perceptível e o decodificador do navegador não estiver travado
            if (Math.abs(diff) > 0.005) {
                if (!video.seeking) {
                    const step = diff * 0.4;
                    const newTime = Math.abs(diff) < 0.02 ? targetTime : video.currentTime + step;
                    
                    if (typeof video.fastSeek === 'function') {
                        video.fastSeek(newTime);
                    } else {
                        video.currentTime = newTime;
                    }
                }
                rafId = window.requestAnimationFrame(renderFrame);
            } else {
                rafId = null;
            }
        }

        function updateVideoProgress() {
            if (!video.duration || isNaN(video.duration)) return;

            const rect = container.getBoundingClientRect();
            const totalScrollRange = container.offsetHeight - window.innerHeight;

            if (totalScrollRange <= 0) return;

            // Calcula a fração do scroll (0.0 no início do site até 1.0 no término do container de 300vh)
            const rawFraction = -rect.top / totalScrollRange;
            const scrollFraction = Math.max(0, Math.min(1, rawFraction));

            // Mapeia para toda a extensão do vídeo
            targetTime = scrollFraction * Math.max(0, video.duration - 0.02);

            // Oculta gradualmente o hint de scroll
            if (scrollHint) {
                if (scrollFraction > 0.04) {
                    scrollHint.style.opacity = '0';
                    scrollHint.style.pointerEvents = 'none';
                } else {
                    scrollHint.style.opacity = '1';
                }
            }

            if (!rafId) {
                rafId = window.requestAnimationFrame(renderFrame);
            }
        }

        // Listener de busca (seek) para manter a fluidez sem drops
        video.addEventListener('seeking', () => {
            isSeeking = true;
        });

        video.addEventListener('seeked', () => {
            isSeeking = false;
            if (Math.abs(targetTime - video.currentTime) > 0.01 && !rafId) {
                rafId = window.requestAnimationFrame(renderFrame);
            }
        });

        // Inicialização com primeiro frame pronto para exibição
        const onReady = () => {
            if (video.duration && !isNaN(video.duration)) {
                if (video.currentTime === 0) {
                    video.currentTime = 0.001;
                }
                updateVideoProgress();
            }
        };

        video.addEventListener('loadedmetadata', onReady);
        video.addEventListener('loadeddata', onReady);
        video.addEventListener('canplay', onReady);
        video.addEventListener('canplaythrough', onReady);

        if (video.readyState >= 1) {
            onReady();
        }

        // Monitora o scroll da página e o redimensionamento da janela
        window.addEventListener('scroll', updateVideoProgress, { passive: true });
        window.addEventListener('resize', updateVideoProgress, { passive: true });

        // Chamada imediata
        updateVideoProgress();
    })();

    // 8. DYNAMIC PORTÕES SHOWCASE ROTATOR
    // Na seção "Todos os Projetos", o card de destaque de portões alterna dinamicamente
    // entre todas as fotos da categoria "Portões" (Portão Clássico, Portão Monolítico Moderno, etc.),
    // garantindo que a foto nunca seja sempre a mesma.
    (function initPortoesRotator() {
        const showcaseCard = document.getElementById('portao-showcase-card');
        const showcaseImg = document.getElementById('portao-showcase-img');
        const showcaseTitle = document.getElementById('portao-showcase-title');
        const showcaseDesc = document.getElementById('portao-showcase-desc');
        const showcaseCount = document.getElementById('portao-showcase-count');

        if (!showcaseImg) return;

        const portaoModels = [
            {
                src: "assets/portao-classico-luxo.jpg",
                title: "Portão Escultural Clássico",
                desc: "Serralheria artística feita à mão com pintura eletrostática e automação invisível.",
                alt: "Portão Escultural Clássico sob Medida ALS"
            },
            {
                src: "assets/portao-moderno-luxo.jpg",
                title: "Portão Monolítico Horizontal",
                desc: "Design contemporâneo em lâminas horizontais com perfis de ventilação e motor ultrarrápido.",
                alt: "Portão Monolítico Horizontal sob Medida ALS"
            }
        ];

        // Escolhe um índice aleatório no início para nunca iniciar sempre com a mesma foto
        let currentIndex = Math.floor(Math.random() * portaoModels.length);

        function updateCard(index, withTransition = true) {
            const item = portaoModels[index];
            if (!item) return;

            if (withTransition) {
                showcaseImg.style.transition = 'opacity 0.4s ease, transform 0.5s ease';
                showcaseImg.style.opacity = '0.2';
                showcaseImg.style.transform = 'scale(0.96)';

                setTimeout(() => {
                    showcaseImg.src = item.src;
                    showcaseImg.alt = item.alt;
                    if (showcaseTitle) showcaseTitle.textContent = item.title;
                    if (showcaseDesc) showcaseDesc.textContent = item.desc;
                    if (showcaseCount) showcaseCount.textContent = `Modelo ${index + 1} de ${portaoModels.length}`;
                    showcaseImg.style.opacity = '1';
                    showcaseImg.style.transform = 'scale(1)';
                }, 350);
            } else {
                showcaseImg.src = item.src;
                showcaseImg.alt = item.alt;
                if (showcaseTitle) showcaseTitle.textContent = item.title;
                if (showcaseDesc) showcaseDesc.textContent = item.desc;
                if (showcaseCount) showcaseCount.textContent = `Modelo ${index + 1} de ${portaoModels.length}`;
            }
        }

        // Aplicação inicial imediata
        updateCard(currentIndex, false);

        // Rotação contínua e suave a cada 4.5 segundos
        let rotationTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % portaoModels.length;
            updateCard(currentIndex, true);
        }, 4500);

        // Ao clicar no card, avança imediatamente para a próxima foto de portão
        if (showcaseCard) {
            showcaseCard.addEventListener('click', (e) => {
                // Se não clicou no link direto
                if (!e.target.closest('a')) {
                    clearInterval(rotationTimer);
                    currentIndex = (currentIndex + 1) % portaoModels.length;
                    updateCard(currentIndex, true);
                    rotationTimer = setInterval(() => {
                        currentIndex = (currentIndex + 1) % portaoModels.length;
                        updateCard(currentIndex, true);
                    }, 4500);
                }
            });
        }
    })();
});
