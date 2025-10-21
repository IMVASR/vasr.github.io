// Portfolio Script
class FadeContent {
    constructor(element, options = {}) {
        this.element = element;
        this.blur = options.blur || false;
        this.duration = options.duration || 1000;
        this.easing = options.easing || 'ease-out';
        this.delay = options.delay || 0;
        this.threshold = options.threshold || 0.1;
        this.initialOpacity = options.initialOpacity || 0;
        this.className = options.className || '';
        
        this.inView = false;
    }

    observe() {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.unobserve(this.element);
                    setTimeout(() => {
                        this.inView = true;
                        this.animate();
                    }, this.delay);
                }
            },
            { threshold: this.threshold }
        );

        observer.observe(this.element);
        return observer;
    }

    animate() {
        if (!this.inView) return;

        Object.assign(this.element.style, {
            opacity: this.initialOpacity,
            filter: this.blur ? 'blur(10px)' : 'none',
            transition: `opacity ${this.duration}ms ${this.easing}, filter ${this.duration}ms ${this.easing}`
        });

        setTimeout(() => {
            Object.assign(this.element.style, {
                opacity: '1',
                filter: this.blur ? 'blur(0px)' : 'none'
            });
        }, 10);
    }

    init() {
        this.observe();
    }
}

// BlurText Animation
class BlurText {
    constructor(element, options = {}) {
        this.element = element;
        this.delay = options.delay || 200;
        this.direction = options.direction || 'top';
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '0px';
        this.stepDuration = options.stepDuration || 0.35;
        
        this.inView = false;
        this.originalHTML = element.innerHTML;
    }

    createAnimatedElement() {
        // Parse the original HTML structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.originalHTML;
        
        // Find the light span and the rest of the text
        const lightSpan = tempDiv.querySelector('.light');
        const lightText = lightSpan ? lightSpan.textContent : '';
        const restText = tempDiv.textContent.replace(lightText, '').trim();
        
        // Create animated version preserving structure
        const container = document.createElement('span');
        
        // First line: "For inquiries," with light class
        const firstLineWords = lightText.split(' ');
        firstLineWords.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'light blur-word';
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, filter, opacity';
            span.style.transition = `all ${this.stepDuration}s ease-out`;
            span.style.marginRight = index < firstLineWords.length - 1 ? '0.25em' : '0';
            
            // Initial state (blurred and offset)
            const initialY = this.direction === 'top' ? -50 : 50;
            Object.assign(span.style, {
                filter: 'blur(10px)',
                opacity: '0',
                transform: `translateY(${initialY}px)`
            });

            span.textContent = word;
            container.appendChild(span);
        });
        
        // Add line break
        const br = document.createElement('br');
        container.appendChild(br);
        
        // Second line: "feel free to get in touch"
        const secondLineWords = restText.split(' ');
        secondLineWords.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'blur-word';
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, filter, opacity';
            span.style.transition = `all ${this.stepDuration}s ease-out`;
            span.style.marginRight = index < secondLineWords.length - 1 ? '0.25em' : '0';
            
            // Initial state (blurred and offset)
            const initialY = this.direction === 'top' ? -50 : 50;
            Object.assign(span.style, {
                filter: 'blur(10px)',
                opacity: '0',
                transform: `translateY(${initialY}px)`
            });

            span.textContent = word;
            container.appendChild(span);
        });

        return container;
    }

    animate() {
        if (!this.inView) return;

        const spans = this.element.querySelectorAll('.blur-word');
        
        spans.forEach((span, index) => {
            const delay = (index * this.delay) / 1000;
            
            setTimeout(() => {
                // Step 1: Reduce blur, increase opacity, slight movement
                setTimeout(() => {
                    const step1Y = this.direction === 'top' ? 5 : -5;
                    Object.assign(span.style, {
                        filter: 'blur(5px)',
                        opacity: '0.5',
                        transform: `translateY(${step1Y}px)`
                    });
                }, this.stepDuration * 1000);

                // Step 2: Clear blur, full opacity, final position
                setTimeout(() => {
                    Object.assign(span.style, {
                        filter: 'blur(0px)',
                        opacity: '1',
                        transform: 'translateY(0px)'
                    });
                }, this.stepDuration * 2000);
            }, delay * 1000);
        });
    }

    observe() {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    this.inView = true;
                    this.animate();
                    observer.unobserve(this.element);
                }
            },
            { threshold: this.threshold, rootMargin: this.rootMargin }
        );

        observer.observe(this.element);
        return observer;
    }

    init() {
        // Replace original content with animated version
        const animatedElement = this.createAnimatedElement();
        this.element.innerHTML = '';
        this.element.appendChild(animatedElement);
        
        this.observe();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor (desktop only)
    const cursor = document.querySelector('.custom-cursor');
    const coordsDisplay = document.getElementById('cursor-coords');
    
    if (cursor && coordsDisplay && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            coordsDisplay.textContent = `[X]${Math.round(e.clientX)} [Y]${Math.round(e.clientY)}`;
        });
    }

    // Handle link hover effects for cursor rotation (desktop only)
    if (cursor && window.innerWidth > 1024) {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-link');
            });
            
            link.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-link');
            });
        });
    }

    // Initialize clocks
    const parisTimeDisplay = document.getElementById('paris-time');
    const londonTimeDisplay = document.getElementById('london-time');
    
    if (parisTimeDisplay && londonTimeDisplay) {
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };
        
        function updateClocks() {
            const parisTime = new Date().toLocaleTimeString('en-US', { 
                ...timeOptions, 
                timeZone: 'Europe/Paris' 
            });
            const londonTime = new Date().toLocaleTimeString('en-US', { 
                ...timeOptions, 
                timeZone: 'Europe/London' 
            });
            
            parisTimeDisplay.textContent = `FR, Paris - ${parisTime}`;
            londonTimeDisplay.textContent = `UK, London - ${londonTime}`;
        }
        
        // Update immediately and then every second
        updateClocks();
        setInterval(updateClocks, 1000);
    }

    // Initialize text animation for info page title
    const infoTitle = document.querySelector('.info-title h1');
    if (infoTitle) {
        new BlurText(infoTitle, {
            delay: 150,
            direction: 'top',
            threshold: 0.1
        }).init();
    }


    // Initialize video fade animation
    const videoContainer = document.querySelector('.video-container');
    const videoIframe = document.querySelector('.video-container iframe');
    
    if (videoContainer && videoIframe) {
        let animationTriggered = false;
        
        Object.assign(videoContainer.style, {
            transition: 'opacity 1500ms ease-out'
        });

        const animateVideo = () => {
            if (animationTriggered) return;
            animationTriggered = true;
            
            setTimeout(() => {
                Object.assign(videoContainer.style, { opacity: '1' });
            }, 800);
        };

        videoIframe.addEventListener('load', animateVideo);
        
        setTimeout(() => {
            if (!animationTriggered) animateVideo();
        }, 2500);
    }

    // Page transition animation
    const whiteOverlay = document.querySelector('.white-overlay');
    if (whiteOverlay) {
        setTimeout(() => {
            whiteOverlay.style.display = 'none';
        }, 1000);
    }
});