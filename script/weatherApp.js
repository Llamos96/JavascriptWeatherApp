
/**
 * API key
 */
const key = 'ecd3ceb929050eaa211f9a29e370e38f';

/**
 * KELVIN constant / For the temperature conversions
 */
const KELVIN = 273;

/**
 * Here goes your location coordinates
 * 
 * For Palma Soriano is...
 */ 
const latitude = 20.211454831870565; 
const longitude = -75.9979261637575;

/**
 * App variables 
 */
let currentWeather = {
        icon: 'unknown',
        description: '',
        temperature: {
            value: '',
            unit: 'K', // API default
        },
        location: ''
    };

let statusbar = document.querySelector('.status-bar p');
let statusled = document.querySelector('.status-led');
statusled.classList.add('status-led-red');

let weatherIcon = document.querySelector('.weatherIcon img');
let weatherDescription = document.querySelector('.weatherDescription');
let weatherTemperature = document.querySelector('.weatherTemperature');
let weatherLocation = document.querySelector('.weatherLocation');

// weatherTemperature.addEventListener('click', () => toggleUnit());

/**
 * Start the app
 * Proceed to execute operations such as check geolocation,
 * get api request and update html components
 */
function startForecast()
{
    this.checkGeolocation();
};

/**
 * From here on each method calls the next one...
 * Step 1
 * First make sure the user's navigator is compatible with geolocation service
 */
function checkGeolocation()
{
    if ('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(assignPosition, showError);
    } else {
        statusbar.innerHTML = 'Your browser is not compatible with geolocation.';
    }
};

/**
 * Step 2
 * Assign geolocation coordinates
 */
function assignPosition(position) 
{
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    statusbar.innerHTML = `Geolocation coordinates: ${latitude}, ${longitude}`;
    statusled.classList.remove('status-led-red');
    statusled.classList.add('status-led-green');

    /**
     * Procceed to execute request to API
     */
    getWeather();
};

/**
 * Step 3
 * Request to Openweather API
 */ 
function getWeather() 
{
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){
        let data = response.json();
        console.log(data);
        return data;
    })
    .then(function(data){
        currentWeather.icon = data.weather[0].icon;
        currentWeather.description = data.weather[0].description;
        currentWeather.temperature.value = Math.floor(data.main.temp);
        currentWeather.location = data.name + ', ' + data.sys.country;
    })
    .then(function(){
        displayWeather();
        setInterval(toggleUnit, 2500);
    });
};

/**
 * Step 4
 * Display weather in index.html
 */
function displayWeather()
{
    weatherIcon.src = 'weatherIcons/' + currentWeather.icon + '.png';
    weatherDescription.innerHTML = `:  ` + currentWeather.description;
    weatherTemperature.innerHTML = currentWeather.temperature.value + currentWeather.temperature.unit; 
    weatherLocation.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i> ` + currentWeather.location;
};

/**
 * Show error
 */
function showError(error) 
{
    console.log(error);
    statusbar.innerHTML = error.message;
    statusled.classList.remove('status-led-green');
    statusled.classList.add('status-led-red');
};

/**
 * Temperature Management Functions
 */
// Toggle from kelvin to celsius
function toggleUnit() 
{

    if(currentWeather.temperature.value != ''){

        if (currentWeather.temperature.unit == '°C') {
            currentWeather.temperature.unit = 'K';
            currentWeather.temperature.value += KELVIN;
        } else if (currentWeather.temperature.unit == 'K') {
            currentWeather.temperature.unit = '°F';
            currentWeather.temperature.value = KelvintoFahrenheit(currentWeather.temperature.value);
        } else {
            currentWeather.temperature.unit = '°C';
            currentWeather.temperature.value = FahrenheittoCelsius(currentWeather.temperature.value);
        }
        currentWeather.temperature.value = Math.floor(currentWeather.temperature.value);
    }
    displayWeather();
};

function KelvintoFahrenheit(value) 
{
    return Math.floor((value - KELVIN) * (9/5) + 32);
};

function FahrenheittoCelsius(value) 
{
    return Math.floor((value - 32) * (5/9));
};


startForecast();