const API_KEY = '1ec2c5bd119174dfb2e18beb78c4f9ec'; // <-- insert API key




async function fetchWeatherByCoords(lat, lon, units = 'metric'){
try{
showMessage('Loading...');
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
const res = await fetch(url);
if(!res.ok) throw new Error('Failed to fetch weather');
const data = await res.json();
renderWeather(data, units);
showMessage('');
}catch(err){
elements.card.classList.add('hidden');
showMessage(err.message, true);
}
}


function renderWeather(data, units){
const city = data.name;
const country = data.sys.country || '';
const temp = Math.round(data.main.temp);
const desc = data.weather?.[0]?.description || '';
const icon = data.weather?.[0]?.icon || '';
const humidity = data.main.humidity + ' %';
const wind = (data.wind.speed || 0) + (units === 'metric' ? ' m/s' : ' mph');
const pressure = data.main.pressure + ' hPa';


elements.cityName.textContent = city;
elements.country.textContent = country;
elements.temperature.textContent = `${temp} ${units === 'metric' ? '°C' : '°F'}`;
elements.description.textContent = desc;
elements.weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
elements.weatherIcon.alt = desc;
elements.humidity.textContent = humidity;
elements.wind.textContent = wind;
elements.pressure.textContent = pressure;


elements.card.classList.remove('hidden');
}


// Event handlers


elements.searchBtn.addEventListener('click', ()=>{
const city = elements.cityInput.value.trim();
if(!city) return showMessage('Please enter a city name', true);
fetchWeatherByCity(city, elements.unitsSelect.value);
});


elements.cityInput.addEventListener('keydown', (e)=>{
if(e.key === 'Enter') elements.searchBtn.click();
});


elements.unitsSelect.addEventListener('change', ()=>{
// If card is visible, re-fetch for selected units
const city = elements.cityName.textContent;
if(city) fetchWeatherByCity(city, elements.unitsSelect.value);
});


elements.geoBtn.addEventListener('click', ()=>{
if(!navigator.geolocation) return showMessage('Geolocation not supported by your browser', true);
showMessage('Locating...');
navigator.geolocation.getCurrentPosition((pos)=>{
const {latitude, longitude} = pos.coords;
fetchWeatherByCoords(latitude, longitude, elements.unitsSelect.value);
}, (err)=>{
showMessage('Unable to retrieve location', true);
});
});


// Optional: show a default city on load
window.addEventListener('load', ()=>{
// showMessage('Enter a city or use the location button');
});