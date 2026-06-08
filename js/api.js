/**
 * API Service Module
 * Handles fetching data from local JSON with simulated network delay.
 */
const ApiService = (function () {
  const DATA_URL = 'data/content.json';
  let cachedData = null;

  /**
   * Simulates network delay
   * @param {number} min - Minimum delay in ms
   * @param {number} max - Maximum delay in ms
   * @returns {Promise}
   */
  function simulateDelay(min = 1000, max = 1500) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Fetches and caches the full content JSON
   * @returns {Promise<Object>}
   */
  async function fetchData() {
    if (cachedData) return cachedData;

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    cachedData = await response.json();
    return cachedData;
  }

  /**
   * Gets navigation content
   * @returns {Promise<Object>}
   */
  async function getNavigation() {
    await simulateDelay(800, 1200);
    const data = await fetchData();
    return data.navigation;
  }

  /**
   * Gets hero section content
   * @returns {Promise<Object>}
   */
  async function getHeroContent() {
    await simulateDelay(1000, 1500);
    const data = await fetchData();
    return data.hero;
  }

  /**
   * Gets features section content
   * @returns {Promise<Object>}
   */
  async function getFeaturesContent() {
    await simulateDelay(1200, 1500);
    const data = await fetchData();
    return data.featuresSection;
  }

  /**
   * Clears cached data (useful for retry functionality)
   */
  function clearCache() {
    cachedData = null;
  }

  return {
    getNavigation,
    getHeroContent,
    getFeaturesContent,
    clearCache
  };
})();

export default ApiService;