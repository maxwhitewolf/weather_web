// Minimal Weather App - Debug Version
class WeatherApp {
  constructor() {
    this.apiKey = "61e6a953f797da1f6535ad711cde3a01";
    this.unitSystem = 'metric';
    this.state = {};
    this.chart = null;
    this.map = null;
    this.weatherTileLayers = {};
    
    this.initializeBasicElements();
    this.bindBasicEvents();
    this.initSettings(); // Initialize settings panel
    this.setupScrollEffects();
    
    // Auto-hide hero on first interaction
    this.hasInteracted = false;
    
    // Auto-detect user location on page load
    this.autoDetectLocation();
  }

  initializeBasicElements() {
    // Core elements
    this.searchInput = document.querySelector('.search-input');
    this.clearBtn = document.querySelector('.clear-btn');
    this.locationBtn = document.querySelector('.location-btn');
    this.quickCityBtns = document.querySelectorAll('.quick-city');
    this.infoMessage = document.querySelector('.info-message');
    
    // Weather display elements
    this.weatherIcon = document.querySelector('.weather-icon');
    this.tempValue = document.querySelector('.temp-value');
    this.tempUnit = document.querySelector('.temp-unit');
    this.feelsTemp = document.querySelector('.feels-temp');
    this.locationText = document.querySelector('.location-text');
    this.weatherDescription = document.querySelector('.weather-description');
    this.weatherTime = document.querySelector('.weather-time');
    
    // Metrics elements
    this.metrics = {
      humidity: document.querySelector('[data-metric="humidity"] .metric-value'),
      humidityBar: document.querySelector('[data-metric="humidity"] .progress-bar i'),
      wind: document.querySelector('[data-metric="wind"] .metric-value'),
      windDirection: document.querySelector('[data-metric="wind"] .wind-direction i'),
      pressure: document.querySelector('[data-metric="pressure"] .metric-value'),
      visibility: document.querySelector('[data-metric="visibility"] .metric-value'),
      uv: document.querySelector('[data-metric="uv"] .uv-level'),
      air: document.querySelector('[data-metric="air-quality"] .aqi-level')
    };
    
    // Sun times elements
    this.sunriseValue = document.querySelector('.sunrise .time-value');
    this.sunsetValue = document.querySelector('.sunset .time-value');
    this.sunArc = document.querySelector('.sun-arc');
    
    // Map elements
    this.mapContainer = document.getElementById('weather-map');
    this.mapLayerBtns = document.querySelectorAll('.seg-btn[data-layer]');
    
    // Chart elements
    this.hourlyChartCanvas = document.getElementById('hourly-chart');
    
    // Forecast elements
    this.forecastGrid = document.querySelector('.forecast-grid');
    
         // Settings elements
     this.unitBtns = document.querySelectorAll('.unit-btn');
     this.colorBtns = document.querySelectorAll('.color-btn');
    
         // Control elements
     this.themeToggle = document.querySelector('.theme-toggle');
     this.rangeToggleBtns = document.querySelectorAll('.range-toggle');
  }

  bindBasicEvents() {
    // Search events
    if (this.searchInput) {
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.searchCity(this.searchInput.value);
        }
      });
    }
    
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchInput.focus();
      });
    }
    
    if (this.locationBtn) {
      this.locationBtn.addEventListener('click', () => {
        this.useCurrentLocation();
      });
    }
    
    // Quick city events
    this.quickCityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const city = btn.textContent.trim();
        this.searchCity(city);
      });
    });
    
    
    
    // Unit toggle events
    this.unitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setUnitSystem(btn.dataset.units);
      });
    });
    
    // Color theme events
    this.colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setPrimaryColor(btn.dataset.color);
      });
    });
    
    // Theme toggle (always keep dark)
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
    
    // Range toggle events
    this.rangeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setRange(btn.dataset.range);
          // Update active state
          this.rangeToggleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
      });
    });
    
    // Map layer events
    this.mapLayerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchWeatherLayer(btn.dataset.layer);
        // Update ARIA states
        this.mapLayerBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
      });
    });
    
    
  }

  async searchCity(cityName) {
    if (!cityName.trim()) return;
    
    this.showLoading();
    this.infoMessage.textContent = 'Searching...';
    
    try {
      // Get coordinates from city name
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`
      );
      
      if (!geoResponse.ok) throw new Error('Geocoding failed');
      
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('City not found');
      }
      
      const { lat, lon } = geoData[0];
      await this.loadAllData(lat, lon, cityName);
      
    } catch (error) {
      console.error('Search error:', error);
      this.infoMessage.textContent = `Error: ${error.message}`;
      this.hideLoading();
    }
  }

  async useCurrentLocation() {
    if (!navigator.geolocation) {
      this.infoMessage.textContent = 'Geolocation not supported';
      return;
    }
    
    this.infoMessage.textContent = 'Getting location...';
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        await this.loadAllData(lat, lon, 'Current Location');
      },
      (error) => {
        this.infoMessage.textContent = `Location error: ${error.message}`;
      }
    );
  }

  autoDetectLocation() {
    if (!navigator.geolocation) {
      this.infoMessage.textContent = 'Geolocation not supported';
      return;
    }
    
    this.infoMessage.textContent = 'Detecting your location...';
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        await this.loadAllData(lat, lon, 'Your Location');
        this.infoMessage.textContent = 'Location detected!';
      },
      (error) => {
        console.log('Auto-location failed:', error.message);
        this.infoMessage.textContent = 'Search for a city to get started';
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  async loadAllData(lat, lon, cityName) {
    try {
      // Load current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${this.unitSystem}&appid=${this.apiKey}`
      );
      
      if (!weatherResponse.ok) throw new Error('Weather data failed');
      
      const weatherData = await weatherResponse.json();
      this.state.current = weatherData;
      
      // Load One Call API data (hourly, daily, UV)
      try {
        const oneCallResponse = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${this.unitSystem}&exclude=minutely&appid=${this.apiKey}`
        );
        
        if (oneCallResponse.ok) {
          this.state.oneCall = await oneCallResponse.json();
        }
      } catch (error) {
        console.warn('One Call API failed, using fallback:', error);
      }
      
      // Load 3-hour forecast as fallback
      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${this.unitSystem}&appid=${this.apiKey}`
        );
        
        if (forecastResponse.ok) {
          this.state.forecast3h = await forecastResponse.json();
        }
      } catch (error) {
        console.warn('Forecast API failed:', error);
      }
      
      // Load air quality data
      try {
        const aqiResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
        );
        
        if (aqiResponse.ok) {
          this.state.airQuality = await aqiResponse.json();
        }
      } catch (error) {
        console.warn('Air quality API failed:', error);
      }
      
      // Update UI
      this.updateAllDisplays();
      this.ensureMap(lat, lon);
      this.hideLoading();
      this.infoMessage.textContent = `Weather for ${cityName}`;
      
      // Hide hero after first successful search
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.hideHero();
      }
      
    } catch (error) {
      console.error('Data loading error:', error);
      this.infoMessage.textContent = `Error loading data: ${error.message}`;
    this.hideLoading();
    }
  }

  updateAllDisplays() {
    this.renderCurrentWeather();
    this.renderMetrics();
    this.renderSunTimes();
    this.renderHourlyChart();
    this.renderDailyForecast();
  }

  renderCurrentWeather() {
    const c = this.state.current;
    if (!c) return;
    
    if (this.weatherIcon) {
      this.weatherIcon.src = `https://openweathermap.org/img/wn/${c.weather[0].icon}@2x.png`;
      this.weatherIcon.alt = c.weather[0].description;
    }
    
    if (this.tempValue) {
      this.tempValue.textContent = Math.round(c.main.temp);
    }
    
    if (this.tempUnit) {
      this.tempUnit.textContent = this.unitSystem === 'metric' ? '°C' : '°F';
    }
    
    if (this.feelsTemp) {
      const feels = Math.round(c.main.feels_like);
      this.feelsTemp.textContent = `Feels like ${feels}°`;
    }
    
    if (this.locationText) {
      this.locationText.textContent = `${c.name}, ${c.sys.country}`;
    }
    
    if (this.weatherDescription) {
      this.weatherDescription.textContent = c.weather[0].description;
    }
    
    if (this.weatherTime) {
      this.weatherTime.textContent = new Date(c.dt * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }

  renderMetrics() {
    const c = this.state.current;
    if (!c) return;
    
    // Humidity
    const humidity = c.main?.humidity;
    if (this.metrics.humidity) {
      this.metrics.humidity.textContent = humidity != null ? `${humidity}%` : '--';
    }
    if (this.metrics.humidityBar) {
      this.metrics.humidityBar.style.setProperty('--w', String(humidity || 0));
    }
    
    // Wind
    const windUnit = this.unitSystem === 'metric' ? 'm/s' : 'mph';
    if (this.metrics.wind) {
      this.metrics.wind.textContent = c.wind?.speed != null ? `${c.wind.speed} ${windUnit}` : '--';
    }
    if (this.metrics.windDirection && c.wind?.deg != null) {
      this.metrics.windDirection.style.setProperty('--deg', String(c.wind.deg));
    }
    
    // Pressure
    if (this.metrics.pressure) {
      this.metrics.pressure.textContent = c.main?.pressure != null ? `${c.main.pressure} hPa` : '--';
    }
    
    // Visibility
    if (this.metrics.visibility) {
      const vis = c.visibility;
      if (vis != null) {
        const v = this.unitSystem === 'metric' ? 
          (vis / 1000).toFixed(1) + ' km' : 
          (vis / 1609.34).toFixed(1) + ' mi';
        this.metrics.visibility.textContent = v;
      } else {
        this.metrics.visibility.textContent = '--';
      }
    }
    
    // UV Index
    if (this.metrics.uv) {
      this.metrics.uv.textContent = this.state.oneCall?.current?.uvi ?? '--';
    }
    
    // Air Quality
    if (this.metrics.air) {
      const aqi = this.state.airQuality?.list?.[0]?.main?.aqi;
      const label = ['--', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi] || '--';
      this.metrics.air.textContent = aqi ? `${label} (${aqi})` : '--';
    }
  }

  renderSunTimes() {
    const c = this.state.current;
    if (!c) return;
    
    if (this.sunriseValue && c.sys?.sunrise) {
      this.sunriseValue.textContent = new Date(c.sys.sunrise * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    if (this.sunsetValue && c.sys?.sunset) {
      this.sunsetValue.textContent = new Date(c.sys.sunset * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
         // SVG semicircle arc
     if (this.sunArc && c.sys?.sunrise && c.sys?.sunset) {
       const now = Date.now() / 1000;
       const pct = Math.max(0, Math.min(1, (now - c.sys.sunrise) / (c.sys.sunset - c.sys.sunrise)));
       
       const w = this.sunArc.clientWidth || 300;
       const h = 80;
       const r = Math.min(w/2 - 20, 80);
       const cx = w/2;
       const cy = h;
       
       const start = { x: cx - r, y: cy };
       const end = { x: cx + r, y: cy };
       const k = 0.552284749831;
       const cpx1 = cx - r;
       const cpy1 = cy - r * k;
       const cpx2 = cx + r;
       const cpy2 = cy - r * k;
       
       const angle = Math.PI * (1 - pct);
       const dotX = cx + r * Math.cos(angle);
       const dotY = cy - r * Math.sin(angle);
       
       this.sunArc.innerHTML = `
         <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax meet">
           <defs>
             <linearGradient id="sunGrad" x1="0" y1="1" x2="1" y2="0">
               <stop offset="0%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--accent-700') || '#2AA9B8'}"/>
               <stop offset="100%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#4DD0E1'}"/>
             </linearGradient>
           </defs>
           <path d="M ${start.x} ${start.y} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${end.x} ${end.y}" 
                 fill="none" stroke="url(#sunGrad)" stroke-width="4" opacity="0.8" />
           <circle cx="${dotX}" cy="${dotY}" r="4" fill="url(#sunGrad)" />
         </svg>`;
     }
  }

  renderHourlyChart() {
    const labels = [];
    const temps = [];
    const unit = this.unitSystem === 'metric' ? '°C' : '°F';
    
    if (this.state.oneCall?.hourly?.length) {
      this.state.oneCall.hourly.slice(0, 24).forEach((h) => {
        labels.push(new Date(h.dt*1000).getHours()+':00');
        temps.push(Math.round(h.temp));
      });
    } else if (this.state.forecast3h?.list?.length) {
      this.state.forecast3h.list.slice(0, 8).forEach((h) => {
        labels.push(new Date(h.dt*1000).getHours()+':00');
        temps.push(Math.round(h.main.temp));
      });
    }
    
    if (!this.hourlyChartCanvas || labels.length === 0) return;
    
    if (this.chart) this.chart.destroy();
    
    const primary = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#4DD0E1').trim();
    const ctx = this.hourlyChartCanvas.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,0,150);
    grad.addColorStop(0, primary.replace(')', ', 0.35)').replace('rgb', 'rgba'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    
    this.chart = new Chart(this.hourlyChartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Temp (${unit})`,
          data: temps,
          borderColor: primary,
          backgroundColor: grad,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            intersect: false,
            mode: 'index',
            backgroundColor: '#0B0B0C',
            titleColor: '#EDEFF2',
            bodyColor: '#A5A7AE'
          }
        },
        scales: {
          x: { 
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { maxTicksLimit: 8, color: '#A5A7AE' }
          },
          y: { 
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { maxTicksLimit: 6, color: '#A5A7AE' }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
    
    // Force chart resize
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
  }

  renderDailyForecast() {
    if (!this.forecastGrid) return;
    
    let dailyData = this.state.oneCall?.daily || [];
    
    // Fallback to 3-hour forecast if One Call API data is not available
    if (dailyData.length === 0 && this.state.forecast3h?.list?.length > 0) {
      // Convert 3-hour forecast to daily forecast
      const hourlyData = this.state.forecast3h.list;
      const dailyMap = new Map();
      
      hourlyData.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, {
            dt: hour.dt,
            temp: { min: hour.main.temp, max: hour.main.temp },
            weather: [hour.weather[0]]
          });
        } else {
          const existing = dailyMap.get(dayKey);
          existing.temp.min = Math.min(existing.temp.min, hour.main.temp);
          existing.temp.max = Math.max(existing.temp.max, hour.main.temp);
        }
      });
      
      dailyData = Array.from(dailyMap.values());
    }
    
    if (dailyData.length === 0) return;
    
    this.forecastGrid.innerHTML = '';
    
    // Show up to 7 days (including today)
    const daysToShow = Math.min(dailyData.length, 7);
    
    dailyData.slice(0, daysToShow).forEach((day, index) => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString([], { weekday: 'short' });
      const icon = day.weather[0].icon;
      const maxTemp = Math.round(day.temp.max);
      const minTemp = Math.round(day.temp.min);
      
      const dayCard = document.createElement('div');
      dayCard.className = 'forecast-day';
      dayCard.innerHTML = `
        <div class="day-icon">
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}" />
        </div>
        <div class="day-temps">
          <span class="max">${maxTemp}°</span>
          <span class="min">${minTemp}°</span>
        </div>
        <div class="day-name">${dayName}</div>
      `;
      
      this.forecastGrid.appendChild(dayCard);
    });
  }

  ensureMap(lat, lon) {
    if (!this.mapContainer) return;
    
    if (!this.map) {
      this.map = L.map(this.mapContainer).setView([lat, lon], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
      
      const mk = (layer) => L.tileLayer(
        `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
        { opacity: 0.6 }
      );
      
      this.weatherTileLayers = {
        temp: mk('temp_new'),
        precip: mk('precipitation_new'),
        wind: mk('wind_new')
      };
      
      this.weatherTileLayers.temp.addTo(this.map);
      
      // Add red marker at location
      this.locationMarker = L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'location-marker',
          html: '<div style="background: #ff4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(this.map);
    } else {
      this.map.setView([lat, lon], 6);
      
      // Update marker position
      if (this.locationMarker) {
        this.locationMarker.setLatLng([lat, lon]);
      } else {
        // Add marker if it doesn't exist
        this.locationMarker = L.marker([lat, lon], {
          icon: L.divIcon({
            className: 'location-marker',
            html: '<div style="background: #ff4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(this.map);
      }
    }
  }

  switchWeatherLayer(layer) {
    if (!this.map || !this.weatherTileLayers[layer]) return;
    
    // Remove all layers
    Object.values(this.weatherTileLayers).forEach(l => {
      if (this.map.hasLayer(l)) this.map.removeLayer(l);
    });
    
    // Add selected layer
    this.weatherTileLayers[layer].addTo(this.map);
  }

  setUnitSystem(units) {
    this.unitSystem = units;
    
    // Update UI
    this.unitBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.units === units);
    });
    
    // Update header unit display
    const headerUnit = document.querySelector('.quick-actions .unit-btn');
    if (headerUnit) {
      headerUnit.textContent = units === 'metric' ? '°C' : '°F';
    }
    
    // Reload data if we have coordinates
    if (this.state.current?.coord) {
      this.loadAllData(this.state.current.coord.lat, this.state.current.coord.lon, this.state.current.name);
    }
    
    // Save settings
    this.saveSettings();
  }

  setPrimaryColor(color) {
    // Update CSS custom properties
    document.documentElement.style.setProperty('--accent', color);
    
    // Generate lighter/darker variants
    const hsl = this.hexToHsl(color);
    const lighter = this.hslToHex(hsl.h, Math.min(100, hsl.l + 20), hsl.s);
    const darker = this.hslToHex(hsl.h, Math.max(0, hsl.l - 20), hsl.s);
    
    document.documentElement.style.setProperty('--accent-200', lighter);
    document.documentElement.style.setProperty('--accent-700', darker);
    
    // Update active state
    this.colorBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
    
    // Save settings
    this.saveSettings();
    
    // Re-render chart with new colors
    if (this.chart) {
      this.renderHourlyChart();
    }
  }

  toggleTheme() {
    // Always keep dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Update icon
    if (this.themeToggle) {
      this.themeToggle.innerHTML = '<span class="i i-moon"></span>';
    }
    
    // Save settings
    this.saveSettings();
  }



  setRange(range) {
    // Handle 24h vs 48h toggle
    const hours = range === '48h' ? 48 : 24;
    
    // Update chart data if needed
    if (this.state.oneCall?.hourly?.length >= hours) {
      this.renderHourlyChart();
    }
  }

  showLoading() {
    // Add skeleton class to cards
    document.querySelectorAll('.ui-card').forEach(card => {
      card.classList.add('skeleton');
    });
  }

  hideLoading() {
    // Remove skeleton and add revealed
    document.querySelectorAll('.ui-card').forEach(card => {
      card.classList.remove('skeleton');
      card.classList.add('revealed');
    });
  }

  showHero() {
    // Show hero section if it exists
    const hero = document.querySelector('.hero-intro');
    if (hero) {
      hero.style.display = 'block';
    }
  }

  hideHero() {
    // Hide hero section if it exists
    const hero = document.querySelector('.hero-intro');
    if (hero) {
      hero.style.display = 'none';
    }
  }

  setupScrollEffects() {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
    
    // Scroll spy for navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }



  // Utility functions
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 1/3) {
      r = x; g = c; b = 0;
    } else if (1/3 <= h && h < 1/2) {
      r = 0; g = c; b = x;
    } else if (1/2 <= h && h < 2/3) {
      r = 0; g = x; b = c;
    } else if (2/3 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h <= 1) {
      r = c; g = 0; b = x;
    }
    
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
  }

  // Initialize Settings
  initSettings() {
    this.loadSettings();
  }

  // Load Settings from localStorage
  loadSettings() {
    const savedUnits = localStorage.getItem('unitSystem') || 'metric';
    const savedColor = localStorage.getItem('primaryColor') || '#4DD0E1';
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved settings
    this.setUnitSystem(savedUnits);
    this.setPrimaryColor(savedColor);
    this.toggleTheme(); // Always keep dark theme

    // Update UI to reflect saved settings
    this.updateSettingsUI();
  }

  // Update Settings UI
  updateSettingsUI() {
    // Update unit buttons
    this.unitBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.units === this.unitSystem);
    });

    // Update color buttons
    this.colorBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === this.getCurrentAccentColor());
    });
  }

  // Get Current Accent Color
  getCurrentAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  }

  // Save Settings
  saveSettings() {
    localStorage.setItem('unitSystem', this.unitSystem);
    localStorage.setItem('primaryColor', this.getCurrentAccentColor());
    localStorage.setItem('theme', 'dark'); // Always dark
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
  
  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
