// Component loader for GitHub Pages
const BASE_PATH = '/fred';

async function loadComponent(componentName, position = 'afterbegin') {
  try {
    const response = await fetch(`${BASE_PATH}/components/${componentName}.html`);
    if (!response.ok) throw new Error(`Failed to load ${componentName}`);
    const html = await response.text();
    document.body.insertAdjacentHTML(position, html);
    console.log(`✅ Loaded: ${componentName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error loading ${componentName}:`, error);
    return false;
  }
}

async function initComponents() {
  // Load header
  await loadComponent('header', 'afterbegin');
  
  // Initialize navigation after header loads
  const navScript = document.createElement('script');
  navScript.src = `${BASE_PATH}/js/navigation.js`;
  document.head.appendChild(navScript);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}
