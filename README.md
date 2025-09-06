# Weather Dashboard

A modern, responsive weather dashboard application with a beautiful glass-morphism design, featuring real-time weather data, forecasts, and customizable settings.

[Weather Dashboard Preview](https://mahmoud25osama.github.io/Weather-Dashboard/)

## Features

- **Real-time Weather Data**: Current weather conditions with detailed information
- **7-Day Forecast**: Weekly weather forecast with min/max temperatures
- **Hourly Forecast**: Next 10 hours weather prediction
- **Search Functionality**: Search for weather in any city worldwide with auto-suggestions
- **Unit Toggle**: Switch between metric (°C, km/h) and imperial (°F, mph) units
- **Dark Mode**: Beautiful dark theme with purple accents for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glass-morphism UI**: Modern design with blur effects and transparency

## Weather Information Displayed

- Current temperature with feels-like temperature
- Weather condition with animated icons
- Min/Max temperatures for the day
- Wind speed and gusts
- Humidity percentage
- UV Index
- Atmospheric pressure
- Sunrise and sunset times
- Chance of rain

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, grid, flexbox, and animations
- **JavaScript (ES6+)**: Dynamic functionality and API integration
- **WeatherAPI**: Real-time weather data provider
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Open `index.html` in your web browser or use a local server.

3. The application uses a default API key. For production use, you should:
   - Sign up for a free API key at [WeatherAPI.com](https://www.weatherapi.com/)
   - Replace the API key in `script.js` (line 1):
     ```javascript
     const API_KEY = 'your_api_key_here';
     ```

## Project Structure

```
weather-dashboard/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styles with dark mode support
├── script.js           # JavaScript functionality
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## Key Features Implementation

### Settings Dropdown
- Temperature unit toggle (Celsius/Fahrenheit)
- Wind speed unit toggle (km/h/mph)
- Settings persist using localStorage

### Dark Mode
- Automatic theme detection
- Manual toggle with smooth transitions
- Optimized colors for reduced eye strain

### Search with Auto-suggestions
- Real-time city search
- Dropdown suggestions
- Keyboard navigation support

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Weather maps integration
- Weather alerts and notifications
- Multiple location bookmarks
- Historical weather data
- Air quality index
- More detailed astronomical data

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.


## Credits

- Weather data provided by [WeatherAPI](https://www.weatherapi.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Font by [Google Fonts](https://fonts.google.com/)


##  Author

**Mahmoud Osama**
🔗 [GitHub Profile](https://github.com/mahmoud25osama)


---

