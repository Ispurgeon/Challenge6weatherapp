// Global Variables
var apiKey = '3a364a3bf79546ceb25163424230708'
var apiKeyOpenWeather = '1a45e27611d90610642cf73d07313c2a';
var apiBaseUrl = 'https://api.weatherapi.com/v1/'
var apiCurrentUrl = `${apiBaseUrl}current.json`
var apiForecastUrl = `${apiBaseUrl}forecast.json`
var apiFutureUrl = `${apiBaseUrl}future.json`
var fiveDayWeatherArray= [];

// adding pseudo code


// wrap the document in ready function to ensure script does not execute too soon
$(document).ready(function (event) {
    event.preventDefault;
    // get geo location from browser
    getBrowserGeoLocation();
    
       // function to get geo location from the browser
    function getBrowserGeoLocation() {
        // check to see if browser supports geo location
        // console.log('geo location called')
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getCurrentWeatherData(latitude, longitude);
            getFutureWeatherData(latitude, longitude);
            },
        error => {
            console.error('Error getting geolocation', error);
    }
    );
        else {
            console.error('Geolocation not supported by the browser.');}
    }
    // using lat/long from getGeolocation, get weather forecast for search city

    function getCurrentWeatherData(latitude, longitude) {

        const apiUrlWithLocation = `${apiCurrentUrl}?key=${apiKey}&q=${latitude},${longitude}`;
        console.log(`the current api call is: ${apiUrlWithLocation}`);
        // fetch weather data by lat / long
        fetch(apiUrlWithLocation)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').textContent = `Location: ${data.location.name}, ${data.location.country}`;
            document.getElementById('fahrenheit').textContent = `Temperature: ${data.current.temp_f}°F`;
            document.getElementById('celsius').textContent = `Temperature: ${data.current.temp_c}°C`;
            document.getElementById('condition').textContent = `Condition: ${data.current.condition.text}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
            console.log(`the current weather json url is: ${data}`);
            // document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
            // commented out until html is added for these elements
            // document.getElementById('feelslikec').textContent = `Feels Like ${data.current.feelslike_c}°C`;
            // document.getElementById('feelslikef').textContent = `Feels like ${data.current.feelslike_f}°F`;
            // document.getElementById('gustkph').textContent = `Gust ${data.current.gust_kph}KPH`;
            // document.getElementById('gustmph').textContent = `Gust ${data.current.gust_mph}MPH`;
            // document.getElementById('vismiles').textContent = `Visbility ${data.current.vis_miles}Mi`;
            // document.getElementById('viskm').textContent = `Visbility ${data.current.vis_km}KM`;
            // document.getElementById('winddir').textContent = `Wind Direction ${data.current.wind_dir}`;
            // document.getElementById('windkph').textContent = `Wind Speed ${data.current.wind_kph}KPH`;
            // document.getElementById('windmph').textContent = `Wind Speed ${data.current.wind_mph}MPH`;         
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    }
    const buttonEl = document.getElementById('search');
    buttonEl.addEventListener('click', handleSearchClick);
    function handleSearchClick(event) {
        event.preventDefault();

        if (event.target.id === 'search' && $('#customCityInput').val().trim().length > 0) {
            const cityName = $('#customCityInput').val();
            getGeoLocation(cityName);
        }
        else {console.log('please type city name in input box' )}
    }

     // get the geo location by city name
    function getGeoLocation(cityName) {
        // console.log(cityName)
        const apiUrlWithCityName = `${apiCurrentUrl}?key=${apiKey}&q=${cityName}`;
        fetch (apiUrlWithCityName)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                //console.log(`lat is ${[data.location.lat]} and long is ${data.location.lon}`)
            const lat = data.location.lat;
            const lon = data.location.lon;
            getCurrentWeatherData(lat,lon);
            getFutureWeatherData(lat,lon);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            })
    }
      // get next five days of weather from open weather
    function getFutureWeatherData(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKeyOpenWeather}`
        console.log(`the open weather 5 day api url is: ${apiUrl}`)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Extract relevant weather information for the 5-day forecast
                //displayCurrentWeather(data);
                console.log(`the open weather 5 day forecast data is:`, data);
                displayFutureWeather(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            })
    }
      function displayFutureWeather(data) {
        $('#forecast')
        let fiveDayWeather;
        fiveDayWeather = data.daily;
        const iconCodes = []; // Initialize the iconCodes array outside the loop

        for (let i = 0; i < 5; i++) {
            const weather5DayParent = $(`#forecastParentDay${i+1}`);
            fiveDayWeather = data.daily[i + 1]; // get day i +1
            iconCodes[i] = fiveDayWeather.weather[0].icon;

                        //assign and format weather data to the currentDayWeatherArray for display
            fiveDayWeatherArray[0] = dayjs.unix(fiveDayWeather.dt).format('M/D/YYYY');
            fiveDayWeatherArray[1] = `Temp: ${fiveDayWeather.temp.day}°F`; // temp in fahrenheit       
            fiveDayWeatherArray[2] = `Wind: ${fiveDayWeather.wind_speed} MPH`;  // wind speed in miles per hour
            fiveDayWeatherArray[3] = `Humidity: ${fiveDayWeather.humidity} %`;   // relative humidity 

                    // Write the five day weather data to the page
            // Select <p> and <h4> elements within the container
            const childElements = weather5DayParent.find('h4, p');
            fiveDayWeatherArray.forEach((value, index) => {
                childElements.eq(index).text(value);
            })
        }
    }
})

                  
