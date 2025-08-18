// Minimal Weather App - Debug Version
class WeatherApp {
  constructor() {
    console.log('🚀 WeatherApp constructor started');
    this.apiKey = "eb8f614379942f8c9a09fbf3ef414743";
    
    // Only initialize basic elements
    this.initializeBasicElements();
    this.bindBasicEvents();
    
    console.log('✅ Constructor completed');
    
    // Test with a simple search
    setTimeout(() => {
      console.log('🔍 Starting test search...');
      this.simpleSearch('London');
    }, 2000);
  }

  initializeBasicElements() {
    console.log('🔧 Initializing basic elements...');
    
    // Only essential elements
    this.searchInput = document.querySelector('.search-input');
    this.loadingOverlay = document.querySelector('.loading-overlay');
    this.wrapper = document.querySelector('.wrapper');
    
    // Basic weather display elements
    this.tempValue = document.querySelector('.temp-value');
    this.locationText = document.querySelector('.location-text');
    this.weatherDescription = document.querySelector('.weather-description');
    
    console.log('✅ Basic elements initialized');
  }

  bindBasicEvents() {
    console.log('🔗 Binding basic events...');
    
    // Only search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && this.searchInput.value.trim()) {
          this.simpleSearch(this.searchInput.value.trim());
        }
      });
    }
    
    console.log('✅ Basic events bound');
  }

  async simpleSearch(city) {
    console.log('🔍 Simple search for:', city);
    this.showLoading();
    
    // Skip API call for now - go straight to demo data
    console.log('🎭 Skipping API call, using demo data directly');
    setTimeout(() => {
      this.useSimpleDemoData(city);
    }, 1000);
  }

  useSimpleDemoData(city) {
    console.log('🎭 Using demo data for:', city);
    
    const demoData = {
      name: city,
      weather: [{ description: 'clear sky' }],
      main: { temp: 22 }
    };
    
    this.updateSimpleDisplay(demoData);
    this.hideLoading();
    this.showApp();
  }

  updateSimpleDisplay(data) {
    console.log('📊 Updating display with:', data);
    
    if (this.tempValue) {
      this.tempValue.textContent = Math.round(data.main.temp);
    }
    
    if (this.locationText) {
      this.locationText.textContent = data.name;
    }
    
    if (this.weatherDescription) {
      this.weatherDescription.textContent = data.weather[0].description;
    }
    
    console.log('✅ Display updated');
  }

  showLoading() {
    console.log('⏳ Showing loading...');
    if (this.loadingOverlay) {
      this.loadingOverlay.removeAttribute('hidden');
    }
  }

  hideLoading() {
    console.log('✅ Hiding loading...');
    if (this.loadingOverlay) {
      this.loadingOverlay.setAttribute('hidden', '');
    }
  }

  showApp() {
    console.log('🎉 Showing app...');
    if (this.wrapper) {
      this.wrapper.classList.add('active');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, creating WeatherApp...');
  new WeatherApp();
});
