/**
 * Carousel Module
 * Handles carousel logic including navigation, touch/swipe, and responsive behavior.
 */
import { createChevronIcon, buildProductCard } from './components.js';

export default class Carousel {
  constructor(container, products, config = {}) {
    this.container = container;
    this.products = products;
    this.config = {
      transitionDuration: config.transitionDuration || 300,
      itemsPerView: config.itemsPerView || { mobile: 1, tablet: 2, desktop: 3 },
      showArrows: config.showArrows !== false,
      ...config
    };

    this.currentIndex = 0;
    this.itemsInView = this.getItemsPerView();

    // Touch handling state
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.startTranslate = 0;
    this.currentTranslate = 0;

    this.elements = {};

    this.init();
    this.bindEvents();
  }

  /**
   * Determines items per view based on current viewport width
   * @returns {number}
   */
  getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 768) return this.config.itemsPerView.mobile;
    if (width <= 1024) return this.config.itemsPerView.tablet;
    return this.config.itemsPerView.desktop;
  }

  /**
   * Calculates maximum index the carousel can slide to
   * @returns {number}
   */
  getMaxIndex() {
    return Math.max(0, this.products.length - this.itemsInView);
  }

  /**
   * Initializes the carousel DOM structure
   */
  init() {
    this.container.innerHTML = '';
    this.container.className = 'carousel';

    // Viewport
    const viewport = document.createElement('div');
    viewport.className = 'carousel__viewport';

    // Track
    const track = document.createElement('div');
    track.className = 'carousel__track';
    track.style.transition = `transform ${this.config.transitionDuration}ms ease`;

    // Build slides
    this.products.forEach((product, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel__slide';
      this.updateSlideWidth(slide);

      const card = buildProductCard(product);
      card.style.opacity = '0';
      card.style.animation = `fadeInUp 0.5s ease ${index * 0.15}s forwards`;

      slide.appendChild(card);
      track.appendChild(slide);
    });

    viewport.appendChild(track);
    this.container.appendChild(viewport);

    // Controls
    if (this.config.showArrows || this.products.length > this.itemsInView) {
      const controls = this.buildControls();
      this.container.appendChild(controls);
    }

    this.elements = {
      viewport,
      track,
      slides: track.querySelectorAll('.carousel__slide')
    };

    this.updatePosition();
    this.updateArrowStates();
  }

  /**
   * Sets slide width class based on current viewport
   * @param {HTMLElement} slide
   */
  updateSlideWidth(slide) {
    slide.classList.remove(
      'carousel__slide--desktop',
      'carousel__slide--tablet',
      'carousel__slide--mobile'
    );

    const width = window.innerWidth;
    if (width <= 768) {
      slide.classList.add('carousel__slide--mobile');
    } else if (width <= 1024) {
      slide.classList.add('carousel__slide--tablet');
    } else {
      slide.classList.add('carousel__slide--desktop');
    }
  }

  /**
   * Builds carousel navigation controls (arrows and dots)
   * @returns {HTMLElement}
   */
  buildControls() {
    const controls = document.createElement('div');
    controls.className = 'carousel__controls';

    // Previous arrow
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel__arrow carousel__arrow--prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.appendChild(createChevronIcon('left'));
    prevBtn.addEventListener('click', () => this.prev());

    // Dots
    const dots = document.createElement('div');
    dots.className = 'carousel__dots';

    const totalDots = this.getMaxIndex() + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      if (i === 0) dot.classList.add('carousel__dot--active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      dots.appendChild(dot);
    }

    // Next arrow
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel__arrow carousel__arrow--next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.appendChild(createChevronIcon('right'));
    nextBtn.addEventListener('click', () => this.next());

    this.elements.prevBtn = prevBtn;
    this.elements.nextBtn = nextBtn;
    this.elements.dots = dots;

    controls.appendChild(prevBtn);
    controls.appendChild(dots);
    controls.appendChild(nextBtn);

    return controls;
  }

  /**
   * Binds window resize and touch events
   */
  bindEvents() {
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.handleResize(), 200);
    });

    // Touch events for mobile swipe
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // Mouse drag support for desktop
    this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.container.addEventListener('mouseup', () => this.handleMouseUp());
    this.container.addEventListener('mouseleave', () => this.handleMouseUp());
  }

  /**
   * Navigates to the previous slide
   */
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updatePosition();
      this.updateArrowStates();
      this.updateDots();
    }
  }

  /**
   * Navigates to the next slide
   */
  next() {
    if (this.currentIndex < this.getMaxIndex()) {
      this.currentIndex++;
      this.updatePosition();
      this.updateArrowStates();
      this.updateDots();
    }
  }

  /**
   * Navigates to a specific slide index
   * @param {number} index
   */
  goTo(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.getMaxIndex()));
    this.updatePosition();
    this.updateArrowStates();
    this.updateDots();
  }

  /**
   * Updates the track transform to reflect current position
   */
  updatePosition() {
    if (!this.elements.track) return;
    const slideWidth = 100 / this.itemsInView;
    const offset = -(this.currentIndex * slideWidth);
    this.elements.track.style.transform = `translateX(${offset}%)`;
  }

  /**
   * Updates the enabled/disabled state of navigation arrows
   */
  updateArrowStates() {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();
    }
  }

  /**
   * Highlights the active dot indicator
   */
  updateDots() {
    if (!this.elements.dots) return;

    const dots = this.elements.dots.querySelectorAll('.carousel__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === this.currentIndex);
    });
  }

  /**
   * Handles window resize: recalculates items per view and rebuilds if needed
   */
  handleResize() {
    const newItemsPerView = this.getItemsPerView();

    if (newItemsPerView !== this.itemsInView) {
      this.itemsInView = newItemsPerView;
      this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
      this.init();
    }
  }

  // ---- Touch/Swipe Handlers ----

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.isDragging = true;
    this.elements.track.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    this.touchEndX = e.touches[0].clientX;
    const diff = this.touchEndX - this.touchStartX;
    const slideWidth = 100 / this.itemsInView;
    const currentOffset = -(this.currentIndex * slideWidth);
    const dragOffset = (diff / this.container.offsetWidth) * 100;

    this.elements.track.style.transform = `translateX(${currentOffset + dragOffset}%)`;

    // Prevent vertical scroll while swiping horizontally
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
  }

  handleTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.elements.track.style.transition = `transform ${this.config.transitionDuration}ms ease`;

    const diff = this.touchEndX - this.touchStartX;
    const threshold = this.container.offsetWidth * 0.2;

    if (diff < -threshold) {
      this.next();
    } else if (diff > threshold) {
      this.prev();
    } else {
      this.updatePosition();
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  // ---- Mouse Drag Handlers ----

  handleMouseDown(e) {
    this.touchStartX = e.clientX;
    this.isDragging = true;
    this.elements.track.style.transition = 'none';
    this.container.style.cursor = 'grabbing';
    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    this.touchEndX = e.clientX;
    const diff = this.touchEndX - this.touchStartX;
    const slideWidth = 100 / this.itemsInView;
    const currentOffset = -(this.currentIndex * slideWidth);
    const dragOffset = (diff / this.container.offsetWidth) * 100;

    this.elements.track.style.transform = `translateX(${currentOffset + dragOffset}%)`;
  }

  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.elements.track.style.transition = `transform ${this.config.transitionDuration}ms ease`;
    this.container.style.cursor = '';

    const diff = this.touchEndX - this.touchStartX;
    const threshold = this.container.offsetWidth * 0.15;

    if (diff < -threshold) {
      this.next();
    } else if (diff > threshold) {
      this.prev();
    } else {
      this.updatePosition();
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  /**
   * Cleans up event listeners and DOM
   */
  destroy() {
    this.container.innerHTML = '';
  }
}