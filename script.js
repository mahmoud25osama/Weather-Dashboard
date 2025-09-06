const API_KEY = 'd6fba732d5da4e72a07215900250309'; // WeatherAPI key
const API_BASE = 'https://api.weatherapi.com/v1';

let currentCity = 'Catalonia';

async function fetchSearch(query) {
    try {
        const response = await fetch(`${ API_BASE }/search.json?key=${ API_KEY }&q=${ query }`);
        if (!response.ok) {
            throw new Error('Search failed');
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Error fetching search results:', e);
        return [];
    }
}

async function fetchWeather(city) {
    try {
        showLoading();
        hideError();

        const currentResponse = await fetch(`${API_BASE}/current.json?key=${API_KEY}&q=${city}`);
        const forecastResponse = await fetch(`${API_BASE}/forecast.json?key=${API_KEY}&q=${city}&days=7`);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        updateWeatherDisplay(currentData, forecastData);
        hideLoading();

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Could not fetch weather data. Please check the city name and try again.');
        hideLoading();
    }
}

function updateWeatherDisplay(current, forecast) {
    const { current: weather, location } = current;
    
    // Store data for unit switching
    lastWeatherData.current = current;
    lastWeatherData.forecast = forecast;
    
    // Update main weather with selected units
    document.getElementById('mainTemp').textContent = `${getTemperature(weather)}${getTempUnit()}`;
    document.getElementById('mainCondition').textContent = weather.condition.text;
    document.getElementById('mainIcon').innerHTML =`<img src="${weather.condition.icon}" alt="${weather.condition.text}">`;
    document.getElementById('locationText').textContent = location.name + ', ' + location.country;
    
    // Update temperature details with selected units
    const today = forecast.forecast.forecastday[0].day;
    document.getElementById('minTemp').textContent = `${getTemperature(today, 'mintemp')}${getTempUnit()}`;
    document.getElementById('maxTemp').textContent = `${getTemperature(today, 'maxtemp')}${getTempUnit()}`;
    document.getElementById('feelsLike').textContent = `${getTemperature(weather, 'feelslike')}${getTempUnit()}`;

    // Update search input
    document.getElementById('cityInput').placeholder = `${location.name}, ${location.country}`;

    // Update weather details
    updateWeatherDetails(weather, forecast.forecast.forecastday[0]);

    // Update hourly forecast
    updateHourlyForecast(forecast.forecast.forecastday[0].hour);

    // Update weekly forecast
    updateWeeklyForecast(forecast.forecast.forecastday);
}

function updateWeatherDetails(weather, today) {
    const sunrise = today.astro.sunrise;
    const sunset = today.astro.sunset;
    
    const details = [
        { icon: 'fas fa-cloud-rain', label: 'Chance of rain', value: `${weather.cloud}%` },
        { icon: 'fas fa-wind', label: 'Wind', value: `${getWindSpeed(weather)} ${getWindUnit()}` },
        { icon: 'fas fa-sun', label: 'Sunrise', value: sunrise },
        { icon: 'fas fa-moon', label: 'Sunset', value: sunset },
        { icon: 'fas fa-thermometer-half', label: 'UV Index', value: weather.uv },
        { icon: 'fas fa-tachometer-alt', label: 'Pressure', value: `${weather.pressure_mb} mb` },
        { icon: 'fas fa-tint', label: 'Humidity', value: `${weather.humidity}%` },
        { icon: 'fas fa-flag', label: 'Gusts', value: `${getWindSpeed(weather, 'gust')} ${getWindUnit()}` }
    ];

    const detailsHTML = details.map(detail => `
        <div class="detail-card">
            <div class="detail-icon"><i class="${detail.icon}"></i></div>
            <div class="detail-info">
                <div class="detail-value">${detail.value}</div>
                <div class="detail-label">${detail.label}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('weatherDetails').innerHTML = detailsHTML;
}

function updateHourlyForecast(hourlyData) {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Get next 8 hours starting from current hour
    const nextHours = hourlyData.slice(currentHour, currentHour + 10);
    
    const hourlyHTML = nextHours.map((hour, index) => {
        const time = new Date(hour.time);
        const timeStr = index === 0 ? 'Now' : 
            time.getHours() === 12 ? '12 PM' :
            time.getHours() === 0 ? '12 AM' :
            time.getHours() > 12 ? `${time.getHours() - 12} PM` :
            `${time.getHours()} AM`;
        
        return `
            <div class="hourly-item">
                <div class="hour-time">${timeStr}</div>
                <div class="hour-icon"><img src="${hour.condition.icon}" alt="${hour.condition.text}"></div>
                <div class="hour-temp">${getTemperature(hour)}${getTempUnit()}</div>
            </div>
        `;
    }).join('');

    document.getElementById('hourlyForecast').innerHTML = hourlyHTML;
}

function updateWeeklyForecast(forecastDays) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const weeklyHTML = forecastDays.map((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'TODAY' : days[date.getDay()];
        const dateStr = `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}`;
        
        return `
            <div class="day-card">
                <div class="day-name">${dayName}</div>
                <div class="day-date">${dateStr}</div>
                <div class="day-icon"><img src="${day.day.condition.icon}" alt="${day.day.condition.text}"></div>
                <div class="day-temps">
                    <div class="day-temp">
                        <div class="day-temp-value">${getTemperature(day.day, 'mintemp')}${getTempUnit()}</div>
                        <div class="day-temp-label">min</div>
                    </div>
                    <div class="day-temp">
                        <div class="day-temp-value">${getTemperature(day.day, 'maxtemp')}${getTempUnit()}</div>
                        <div class="day-temp-label">max</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('weeklyForecast').innerHTML = weeklyHTML;
}

function showLoading() {
    document.getElementById('loadingDiv').style.display = 'block';
    document.getElementById('weatherContent').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('weatherContent').style.display = 'block';
}

function showError(message) {
    document.getElementById('errorDiv').textContent = message;
    document.getElementById('errorDiv').style.display = 'block';
}

function hideError() {
    document.getElementById('errorDiv').style.display = 'none';
}

// Function to handle suggestion clicks
function handleSuggestionClick(city, country) {
    currentCity = city;
    document.getElementById('cityInput').value = `${city}, ${country}`;
    document.getElementById('suggestions').classList.remove('show');
    fetchWeather(city);
}

// Event listeners
document.getElementById('cityInput').addEventListener('input', async function(e){
    const query = e.target.value.trim();
    if (query.length < 2) {
        document.getElementById('suggestions').classList.remove('show');
        return;
    }
    try {
        const results = await fetchSearch(query);
    const suggestionsHTML = results.map(city => `
        <li class='searchedCity' data-city='${city.name}' data-country='${city.country}'>${city.name}, ${city.country}</li>
    `).join('');

    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.classList.add('show');
    suggestionsContainer.innerHTML = suggestionsHTML;
    }catch(e){
        console.error('Error in input handler:', e);
        suggestionsContainer.classList.remove('show');
    }
});

// Use event delegation for suggestion clicks
document.getElementById('suggestions').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('searchedCity')) {
        const city = e.target.dataset.city;
        const country = e.target.dataset.country;
        if (city && country) {
            handleSuggestionClick(city, country);
        } else {
            console.error('Missing city or country data');
        }
    }
});
document.getElementById('suggestions').addEventListener('mousedown', function(e) {
    e.preventDefault();
});
// Handle input blur with delay to allow clicks
document.getElementById('cityInput').addEventListener('blur', function () {
    setTimeout(() => {
        document.getElementById('suggestions').classList.remove('show');
    }, 200); // Increased delay to allow suggestion clicks
});

// Handle Enter key press
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const city = this.value.trim();
        if (city) {
            currentCity = city;
            document.getElementById('suggestions').classList.remove('show');
            fetchWeather(city);
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    fetchWeather(currentCity);
    initializeSettings();
});

// Settings Management
const settings = {
    temperatureUnit: localStorage.getItem('temperatureUnit') || 'celsius', // 'celsius' or 'fahrenheit'
    windSpeedUnit: localStorage.getItem('windSpeedUnit') || 'kph' // 'kph' or 'mph'
};

// Store last weather data for unit switching
let lastWeatherData = {
    current: null,
    forecast: null
};

// Initialize settings toggles
function initializeSettings() {
    const tempUnitToggle = document.getElementById('tempUnit');
    const windUnitToggle = document.getElementById('windUnit');
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsDropdown = document.querySelector('.settings-dropdown');
    
    // Set initial toggle states
    tempUnitToggle.checked = settings.temperatureUnit === 'fahrenheit';
    windUnitToggle.checked = settings.windSpeedUnit === 'mph';
    
    // Toggle dropdown visibility
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        settingsDropdown.classList.remove('show');
    });
    
    // Prevent dropdown from closing when clicking inside it
    settingsDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Temperature unit toggle
    tempUnitToggle.addEventListener('change', function() {
        settings.temperatureUnit = this.checked ? 'fahrenheit' : 'celsius';
        localStorage.setItem('temperatureUnit', settings.temperatureUnit);
        // Refresh weather display with new units
        if (lastWeatherData.current && lastWeatherData.forecast) {
            updateWeatherDisplay(lastWeatherData.current, lastWeatherData.forecast);
        }
    });
    
    // Wind speed unit toggle
    windUnitToggle.addEventListener('change', function() {
        settings.windSpeedUnit = this.checked ? 'mph' : 'kph';
        localStorage.setItem('windSpeedUnit', settings.windSpeedUnit);
        // Refresh weather display with new units
        if (lastWeatherData.current && lastWeatherData.forecast) {
            updateWeatherDisplay(lastWeatherData.current, lastWeatherData.forecast);
        }
    });
}

// Helper functions to get temperature and wind speed based on settings
function getTemperature(weather, key = 'temp') {
    if (settings.temperatureUnit === 'fahrenheit') {
        return Math.round(weather[`${key}_f`]);
    }
    return Math.round(weather[`${key}_c`]);
}

function getWindSpeed(weather, key = 'wind') {
    if (settings.windSpeedUnit === 'mph') {
        return Math.round(weather[`${key}_mph`]);
    }
    return Math.round(weather[`${key}_kph`]);
}

function getTempUnit() {
    return settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
}

function getWindUnit() {
    return settings.windSpeedUnit === 'mph' ? 'mph' : 'km/h';
}

// Dark Mode Functionality
function initializeDarkMode() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDarkMode) {
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (isDarkMode) {
        themeToggle.className = 'fas fa-sun';
        themeToggle.style.color='#f39c12';
    } else {
        themeToggle.className = 'fas fa-moon';
        themeToggle.style.color='#3498db';
    }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
});