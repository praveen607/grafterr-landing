/**
 * Component Factory Module
 * Creates reusable DOM components dynamically.
 */

/**
 * Creates an SVG chevron icon
 * @param {string} direction - 'down', 'left', or 'right'
 * @returns {SVGElement}
 */
export function createChevronIcon(direction = 'down') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  switch (direction) {
    case 'left':
      path.setAttribute('d', 'M15 18l-6-6 6-6');
      break;
    case 'right':
      path.setAttribute('d', 'M9 18l6-6-6-6');
      break;
    case 'down':
    default:
      path.setAttribute('d', 'M6 9l6 6 6-6');
      break;
  }

  svg.appendChild(path);
  return svg;
}

/**
 * Creates an error icon SVG
 * @returns {SVGElement}
 */
export function createErrorIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '12');
  line1.setAttribute('y1', '8');
  line1.setAttribute('x2', '12');
  line1.setAttribute('y2', '12');

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '12');
  line2.setAttribute('y1', '16');
  line2.setAttribute('x2', '12.01');
  line2.setAttribute('y2', '16');

  svg.appendChild(circle);
  svg.appendChild(line1);
  svg.appendChild(line2);
  return svg;
}

/**
 * Creates a product card icon based on product ID
 * @param {string} productId
 * @param {string} color
 * @returns {SVGElement}
 */
export function createProductIcon(productId, color) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', color);
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  let paths = '';

  switch (productId) {
    case 'pos':
      paths = `
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      `;
      break;
    case 'self-service':
      paths = `
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
        <line x1="9" y1="6" x2="15" y2="6"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
      `;
      break;
    case 'kitchen':
      paths = `
        <path d="M3 2l2 18h14l2-18H3z"/>
        <path d="M8 2v3"/>
        <path d="M12 2v3"/>
        <path d="M16 2v3"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      `;
      break;
    default:
      paths = `
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      `;
  }

  svg.innerHTML = paths;
  return svg;
}

/**
 * Builds the navigation bar
 * @param {Object} navData
 * @returns {HTMLElement}
 */
export function buildNavigation(navData) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  const inner = document.createElement('div');
  inner.className = 'nav__inner container';

  // Logo
  const logo = document.createElement('a');
  logo.className = 'nav__logo';
  logo.href = '#';
  logo.setAttribute('aria-label', navData.logo.alt);

  const logoMark = document.createElement('span');
  logoMark.className = 'nav__logo-mark';
  logoMark.textContent = 'G';

  const logoText = document.createElement('span');
  logoText.textContent = 'Grafterr';

  logo.appendChild(logoMark);
  logo.appendChild(logoText);

  // Links
  const linksContainer = document.createElement('ul');
  linksContainer.className = 'nav__links';

  navData.links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'nav__link';
    a.href = link.href;
    a.textContent = link.text;

    if (link.hasDropdown) {
      const chevron = createChevronIcon('down');
      chevron.classList.add('nav__link-chevron');
      a.appendChild(chevron);
    }

    li.appendChild(a);
    linksContainer.appendChild(li);
  });

  // CTA
  const actions = document.createElement('div');
  actions.className = 'nav__actions';

  const ctaBtn = document.createElement('a');
  ctaBtn.className = 'btn btn--primary btn--nav';
  ctaBtn.href = navData.cta.href;
  ctaBtn.textContent = navData.cta.text;

  // Mobile toggle
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'nav__mobile-toggle';
  mobileToggle.setAttribute('aria-label', 'Toggle menu');
  mobileToggle.setAttribute('aria-expanded', 'false');
  for (let i = 0; i < 3; i++) {
    mobileToggle.appendChild(document.createElement('span'));
  }

  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav__mobile-menu';

  navData.links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'nav__link';
    a.href = link.href;
    a.textContent = link.text;
    mobileMenu.appendChild(a);
  });

  const mobileCta = document.createElement('a');
  mobileCta.className = 'btn btn--primary';
  mobileCta.href = navData.cta.href;
  mobileCta.textContent = navData.cta.text;
  mobileMenu.appendChild(mobileCta);

  // Mobile toggle handler
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('nav__mobile-menu--open');
    mobileToggle.classList.toggle('nav__mobile-toggle--active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  actions.appendChild(ctaBtn);
  actions.appendChild(mobileToggle);

  inner.appendChild(logo);
  inner.appendChild(linksContainer);
  inner.appendChild(actions);
  nav.appendChild(inner);
  nav.appendChild(mobileMenu);

  return nav;
}

/**
 * Builds the hero section
 * @param {Object} heroData
 * @returns {HTMLElement}
 */
export function buildHeroSection(heroData) {
  const section = document.createElement('section');
  section.className = 'hero';
  section.id = 'hero';
  section.setAttribute('aria-label', 'Hero');

  const container = document.createElement('div');
  container.className = 'container';

  const content = document.createElement('div');
  content.className = 'hero__content';

  // Headline
  const headline = document.createElement('h1');
  headline.className = 'hero__headline fade-in';

  const prefixText = document.createTextNode(heroData.headlinePrefix + ' ');
  const gradientSpan = document.createElement('span');
  gradientSpan.className = 'gradient-text';
  gradientSpan.textContent = heroData.headlineGradient;

  headline.appendChild(prefixText);
  headline.appendChild(gradientSpan);

  // Subheadline
  const subheadline = document.createElement('p');
  subheadline.className = 'hero__subheadline fade-in fade-in--delay-1';
  subheadline.textContent = heroData.subheadline;

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'hero__cta-wrapper fade-in fade-in--delay-2';

  const ctaBtn = document.createElement('a');
  ctaBtn.className = 'btn btn--primary';
  ctaBtn.href = heroData.cta.href;
  ctaBtn.textContent = heroData.cta.text;

  ctaWrapper.appendChild(ctaBtn);

  content.appendChild(headline);
  content.appendChild(subheadline);
  content.appendChild(ctaWrapper);
  container.appendChild(content);
  section.appendChild(container);

  // Decorative shapes
  if (heroData.decorativeShapes) {
    heroData.decorativeShapes.forEach((shape, index) => {
      const el = document.createElement('div');
      el.className = `hero__shape hero__shape--${shape.type}`;
      el.classList.add(index % 2 === 0 ? 'hero__shape--float' : 'hero__shape--float-reverse');

      el.style.backgroundColor = shape.color;
      el.style.top = shape.position.top || 'auto';
      el.style.right = shape.position.right || 'auto';
      el.style.bottom = shape.position.bottom || 'auto';
      el.style.left = shape.position.left || 'auto';

      if (shape.type === 'circle') {
        el.style.width = `${shape.size}px`;
        el.style.height = `${shape.size}px`;
      } else {
        el.style.width = `${shape.width}px`;
        el.style.height = `${shape.height}px`;
        if (shape.rotation) {
          el.style.setProperty('--rotation', `${shape.rotation}deg`);
        }
      }

      section.appendChild(el);
    });
  }

  return section;
}

/**
 * Builds a product card
 * @param {Object} product
 * @returns {HTMLElement}
 */
export function buildProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.style.setProperty('--card-accent', product.accentColor);

  // Icon
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'product-card__icon';
  iconWrapper.style.backgroundColor = `${product.accentColor}15`;

  const icon = createProductIcon(product.id, product.accentColor);
  iconWrapper.appendChild(icon);

  // Image placeholder
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'product-card__image-wrapper';
  imageWrapper.style.background = `linear-gradient(135deg, ${product.accentColor}10, ${product.accentColor}25)`;

  const productIcon = createProductIcon(product.id, product.accentColor);
  productIcon.style.width = '64px';
  productIcon.style.height = '64px';
  productIcon.style.opacity = '0.6';
  imageWrapper.appendChild(productIcon);

  // Name
  const name = document.createElement('h3');
  name.className = 'product-card__name';
  name.textContent = product.name;

  // Description
  const description = document.createElement('p');
  description.className = 'product-card__description';
  description.textContent = product.description;

  // Features list
  const featuresList = document.createElement('ul');
  featuresList.className = 'product-card__features';

  product.features.forEach(feature => {
    const li = document.createElement('li');
    li.className = 'product-card__feature';

    const dot = document.createElement('span');
    dot.className = 'product-card__feature-dot';
    dot.style.backgroundColor = product.accentColor;

    const text = document.createElement('span');
    text.textContent = feature;

    li.appendChild(dot);
    li.appendChild(text);
    featuresList.appendChild(li);
  });

  card.appendChild(iconWrapper);
  card.appendChild(imageWrapper);
  card.appendChild(name);
  card.appendChild(description);
  card.appendChild(featuresList);

  return card;
}

/**
 * Creates a loading skeleton for the navigation
 * @returns {HTMLElement}
 */
export function buildNavSkeleton() {
  const nav = document.createElement('nav');
  nav.className = 'nav';

  const inner = document.createElement('div');
  inner.className = 'nav__inner container';

  const logoSkeleton = document.createElement('div');
  logoSkeleton.className = 'skeleton';
  logoSkeleton.style.width = '140px';
  logoSkeleton.style.height = '36px';
  logoSkeleton.style.borderRadius = 'var(--radius-sm)';

  const linksSkeleton = document.createElement('div');
  linksSkeleton.style.display = 'flex';
  linksSkeleton.style.gap = 'var(--space-xl)';

  for (let i = 0; i < 4; i++) {
    const link = document.createElement('div');
    link.className = 'skeleton skeleton--nav-link';
    link.style.width = `${60 + Math.random() * 30}px`;
    linksSkeleton.appendChild(link);
  }

  const ctaSkeleton = document.createElement('div');
  ctaSkeleton.className = 'skeleton';
  ctaSkeleton.style.width = '100px';
  ctaSkeleton.style.height = '36px';
  ctaSkeleton.style.borderRadius = 'var(--radius-sm)';

  inner.appendChild(logoSkeleton);
  inner.appendChild(linksSkeleton);
  inner.appendChild(ctaSkeleton);
  nav.appendChild(inner);

  return nav;
}

/**
 * Creates a loading skeleton for the hero section
 * @returns {HTMLElement}
 */
export function buildHeroSkeleton() {
  const section = document.createElement('section');
  section.className = 'hero';

  const container = document.createElement('div');
  container.className = 'container';

  const content = document.createElement('div');
  content.className = 'hero__skeleton';

  const heading1 = document.createElement('div');
  heading1.className = 'skeleton skeleton--heading';

  const heading2 = document.createElement('div');
  heading2.className = 'skeleton skeleton--heading';
  heading2.style.width = '45%';

  const para1 = document.createElement('div');
  para1.className = 'skeleton skeleton--paragraph';
  para1.style.width = '70%';

  const para2 = document.createElement('div');
  para2.className = 'skeleton skeleton--paragraph';
  para2.style.width = '55%';

  const button = document.createElement('div');
  button.className = 'skeleton skeleton--button';

  content.appendChild(heading1);
  content.appendChild(heading2);
  content.appendChild(para1);
  content.appendChild(para2);
  content.appendChild(button);
  container.appendChild(content);
  section.appendChild(container);

  return section;
}

/**
 * Creates a loading skeleton for the features section
 * @returns {HTMLElement}
 */
export function buildFeaturesSkeleton() {
  const section = document.createElement('section');
  section.className = 'features';

  const container = document.createElement('div');
  container.className = 'container';

  const header = document.createElement('div');
  header.className = 'features__skeleton-header';

  const heading = document.createElement('div');
  heading.className = 'skeleton skeleton--heading';

  const headingSm = document.createElement('div');
  heading.className = 'skeleton skeleton--heading-sm';

  const divider = document.createElement('div');
  divider.className = 'skeleton';
  divider.style.width = '60px';
  divider.style.height = '4px';
  divider.style.margin = 'var(--space-md) auto';

  const para = document.createElement('div');
  para.className = 'skeleton skeleton--paragraph';
  para.style.width = '60%';
  para.style.margin = '0 auto';

  header.appendChild(heading);
  header.appendChild(headingSm);
  header.appendChild(divider);
  header.appendChild(para);

  const cards = document.createElement('div');
  cards.className = 'features__skeleton-cards';

  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton skeleton--card';
    cards.appendChild(card);
  }

  container.appendChild(header);
  container.appendChild(cards);
  section.appendChild(container);

  return section;
}

/**
 * Builds an error state component
 * @param {string} message
 * @param {Function} onRetry
 * @returns {HTMLElement}
 */
export function buildErrorState(message, onRetry) {
  const wrapper = document.createElement('div');
  wrapper.className = 'error-state';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'error-state__icon';
  iconWrapper.appendChild(createErrorIcon());

  const title = document.createElement('h3');
  title.className = 'error-state__title';
  title.textContent = 'Something went wrong';

  const msg = document.createElement('p');
  msg.className = 'error-state__message';
  msg.textContent = message || 'We couldn\'t load the content. Please try again.';

  const retryBtn = document.createElement('button');
  retryBtn.className = 'btn btn--retry';
  retryBtn.textContent = 'Try Again';
  retryBtn.addEventListener('click', onRetry);

  wrapper.appendChild(iconWrapper);
  wrapper.appendChild(title);
  wrapper.appendChild(msg);
  wrapper.appendChild(retryBtn);

  return wrapper;
}