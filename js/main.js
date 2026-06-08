/**
 * Main Application Module
 * Initializes all sections and manages the app lifecycle.
 */
import ApiService from './api.js';
import {
  buildNavigation,
  buildHeroSection,
  buildNavSkeleton,
  buildHeroSkeleton,
  buildFeaturesSkeleton,
  buildErrorState
} from './components.js';
import Carousel from './carousel.js';

const App = (function () {
  const navContainer = document.getElementById('nav-root');
  const heroContainer = document.getElementById('hero-root');
  const featuresContainer = document.getElementById('features-root');

  /**
   * Shows skeleton loaders in all sections
   */
  function showSkeletons() {
    if (navContainer) {
      navContainer.innerHTML = '';
      navContainer.appendChild(buildNavSkeleton());
    }

    if (heroContainer) {
      heroContainer.innerHTML = '';
      heroContainer.appendChild(buildHeroSkeleton());
    }

    if (featuresContainer) {
      featuresContainer.innerHTML = '';
      featuresContainer.appendChild(buildFeaturesSkeleton());
    }
  }

  /**
   * Loads and renders navigation
   */
  async function loadNavigation() {
    try {
      const navData = await ApiService.getNavigation();

      if (navContainer) {
        navContainer.innerHTML = '';
        const nav = buildNavigation(navData);
        nav.style.opacity = '0';
        navContainer.appendChild(nav);

        requestAnimationFrame(() => {
          nav.style.transition = 'opacity 0.4s ease';
          nav.style.opacity = '1';
        });
      }
    } catch (error) {
      console.error('Failed to load navigation:', error);
      if (navContainer) {
        navContainer.innerHTML = '';
        navContainer.appendChild(
          buildErrorState('Navigation failed to load.', () => {
            navContainer.innerHTML = '';
            navContainer.appendChild(buildNavSkeleton());
            loadNavigation();
          })
        );
      }
    }
  }

  /**
   * Loads and renders hero section
   */
  async function loadHero() {
    try {
      const heroData = await ApiService.getHeroContent();

      if (heroContainer) {
        heroContainer.innerHTML = '';
        const hero = buildHeroSection(heroData);
        hero.style.opacity = '0';
        heroContainer.appendChild(hero);

        requestAnimationFrame(() => {
          hero.style.transition = 'opacity 0.5s ease';
          hero.style.opacity = '1';
        });
      }
    } catch (error) {
      console.error('Failed to load hero:', error);
      if (heroContainer) {
        heroContainer.innerHTML = '';
        heroContainer.appendChild(
          buildErrorState('Hero content failed to load.', () => {
            heroContainer.innerHTML = '';
            heroContainer.appendChild(buildHeroSkeleton());
            ApiService.clearCache();
            loadHero();
          })
        );
      }
    }
  }

  /**
   * Loads and renders features section with carousel
   */
  async function loadFeatures() {
    try {
      const featuresData = await ApiService.getFeaturesContent();

      if (featuresContainer) {
        featuresContainer.innerHTML = '';

        const section = document.createElement('section');
        section.className = 'features';
        section.id = 'features';
        section.setAttribute('aria-label', 'Features');

        const container = document.createElement('div');
        container.className = 'container';

        // Header
        const header = document.createElement('div');
        header.className = 'features__header fade-in';

        const title = document.createElement('h2');
        title.className = 'features__title';
        title.textContent = featuresData.title + ' ';

        const accent = document.createElement('span');
        accent.className = 'gradient-text';
        accent.textContent = featuresData.titleAccent;
        title.appendChild(accent);

        const divider = document.createElement('div');
        divider.className = 'divider';

        const subtitle = document.createElement('p');
        subtitle.className = 'features__subtitle';
        subtitle.textContent = featuresData.subtitle;

        header.appendChild(title);
        header.appendChild(divider);
        header.appendChild(subtitle);

        // Carousel container
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'features__carousel';

        container.appendChild(header);
        container.appendChild(carouselContainer);
        section.appendChild(container);

        section.style.opacity = '0';
        featuresContainer.appendChild(section);

        requestAnimationFrame(() => {
          section.style.transition = 'opacity 0.5s ease';
          section.style.opacity = '1';
        });

        // Initialize carousel after DOM is ready
        requestAnimationFrame(() => {
          new Carousel(carouselContainer, featuresData.products, featuresData.carousel);
        });
      }
    } catch (error) {
      console.error('Failed to load features:', error);
      if (featuresContainer) {
        featuresContainer.innerHTML = '';
        const errorSection = document.createElement('section');
        errorSection.className = 'features';

        const errorContainer = document.createElement('div');
        errorContainer.className = 'container';
        errorContainer.appendChild(
          buildErrorState('Features failed to load.', () => {
            featuresContainer.innerHTML = '';
            featuresContainer.appendChild(buildFeaturesSkeleton());
            ApiService.clearCache();
            loadFeatures();
          })
        );

        errorSection.appendChild(errorContainer);
        featuresContainer.appendChild(errorSection);
      }
    }
  }

  /**
   * Starts the application
   */
  function init() {
    showSkeletons();

    // Load all sections in parallel
    loadNavigation();
    loadHero();
    loadFeatures();
  }

  return { init };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});