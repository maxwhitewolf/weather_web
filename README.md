# Weatherly - Modern Weather App 🌤️

A beautiful, modern weather application built with vanilla JavaScript, featuring glassmorphism design, interactive maps, and comprehensive weather data visualization.

## ✨ Features

### 🌟 Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent cards with backdrop blur effects
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Micro-interactions and smooth transitions throughout
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🌍 Weather Data
- **Current Weather**: Real-time temperature, feels like, humidity, wind speed
- **Extended Metrics**: Pressure, visibility, UV index, and air quality
- **Sun Times**: Sunrise/sunset with animated sun position indicator
- **7-Day Forecast**: Detailed daily weather predictions
- **24-Hour Chart**: Interactive temperature trend visualization

### 🗺️ Interactive Maps
- **Weather Map**: Interactive map with location markers
- **Layer Controls**: Temperature, precipitation, and wind overlays
- **Real-time Updates**: Map updates with current location

### ⚙️ Personalization
- **Unit Conversion**: Toggle between Celsius and Fahrenheit
- **Theme Colors**: 6 beautiful color themes to choose from
- **Settings Panel**: Comprehensive settings management
- **Local Storage**: Persistent user preferences

### 📱 Smart Features
- **Geolocation**: Automatic current location detection
- **Search**: City search with autocomplete suggestions
- **Loading States**: Beautiful loading animations
- **Error Handling**: Graceful error messages and fallbacks

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- OpenWeatherMap API key

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-username/weather-web-app.git
cd weather-web-app
```

2. Get your API key from [OpenWeatherMap](https://openweathermap.org/api)

3. Update the API key in `js/script.js`:
```javascript
this.apiKey = "YOUR_API_KEY_HERE";
```

4. Open `index.html` in your browser

## 🎨 Design System

### Color Palette
- **Primary**: Customizable primary colors
- **Surface**: Glassmorphism backgrounds
- **Text**: High contrast text hierarchy
- **Status**: Success, warning, error, and info colors

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Responsive font sizing

### Spacing
- **Consistent**: 8px base unit system
- **Responsive**: Adaptive spacing for different screen sizes

## 🔧 Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS with CSS Variables
- **Maps**: Leaflet.js for interactive maps
- **Charts**: Chart.js for data visualization
- **Icons**: Boxicons
- **API**: OpenWeatherMap

## 📊 API Endpoints Used

- Current Weather: `/data/2.5/weather`
- 7-Day Forecast: `/data/2.5/onecall`
- Air Quality: `/data/2.5/air_pollution`
- Geocoding: `/geo/1.0/direct`

## 🎯 Key Features Implementation

### Glassmorphism Effect
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Dark Mode Toggle
```javascript
toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.documentElement.setAttribute('data-theme', 
    this.isDarkMode ? 'dark' : 'light');
}
```

### Interactive Map
```javascript
initializeMap() {
  this.weatherMap = L.map(this.mapContainer).setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(this.weatherMap);
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Clear focus indicators

## 🎨 Customization

### Adding New Themes
1. Add color to CSS variables
2. Create color button in HTML
3. Update theme switching logic

### Adding New Metrics
1. Create metric card in HTML
2. Add data fetching logic
3. Update display functions

## 🐛 Troubleshooting

### Common Issues
- **API Key Error**: Ensure your OpenWeatherMap API key is valid
- **Geolocation**: Check browser permissions for location access
- **Map Not Loading**: Verify internet connection for map tiles

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📈 Performance Optimizations

- **Lazy Loading**: Images and map tiles
- **Caching**: Local storage for user preferences
- **Debouncing**: Search input optimization
- **Minification**: Production-ready assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Leaflet](https://leafletjs.com/) for interactive maps
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Boxicons](https://boxicons.com/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by [Your Name]

