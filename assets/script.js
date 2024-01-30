$(document).ready(function () {
    localStorageLoad();
});

const current = $('#today');
const future = $('#forecast')
const sidebar = $('#history');
// Makes the following variables global
let cityName;
let previousCities;

$("#search-button").on("click", function (e) {
    // Prevents the default behaviour of the page refreshing
    e.preventDefault();
    // Clears any existing current and future forecasts on the page
    $(current).empty();
    $(future).empty();
    // Assigns the search box content to a variable
    cityName = $("#search-input").val();
    getCoordinates(cityName);
})

function getCoordinates(cityName) {
    // Extracts the longitude and latitude using the search input
    let geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=b7c9e5e51445e96e06f7ad6de3a1054d"
    // API call that retrieves and stores the latitude/longitude for use in the getWeather function
    fetch(geoQuery)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // Checks whether the city's latitude/longitude was found
            if (data.length === 0) {
                alert("Please enter a valid city name (check the spelling!)");
                return;
            }
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            getWeather(latitude, longitude);
        });
}

function getWeather(latitude, longitude) {
    // Utilises the longitude/latiude variables to access the city's weather
    let query = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=b7c9e5e51445e96e06f7ad6de3a1054d";
    fetch(query)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            let temp = data.list[0].main.temp;
            // Appends the city name, date, temperature, wind speed, and humidity to the today's forecast container
            let currentForecast = $(`<h2>${cityName} (${dayjs().format('D/M/YYYY')})</h2><p>Temp: ${toCelsius(temp)} &deg;C</p><p>Wind: ${data.list[0].wind.speed} KPH</p><p>Humidity: ${data.list[0].main.humidity} %</p>`);
            $(current).append(currentForecast);
            // Appends the title for the 5-day forecast
            futureForecast = $(`<h3>5-Day Forecast:</h3>`)
            $(future).append(futureForecast);
            // Iterates over the length of the JSON list, adding 8 to each index (to return the data at midnight of every new day)
            for (let i = 3; i < data.list.length; i += 8) {
                futureForecast = $(`<div class="col-2"><h4>${data.list[i].dt_txt[8]}${data.list[i].dt_txt[9]}${dayjs().format('/M/YYYY')}</h4><p>Temp: ${toCelsius(data.list[i].main.temp)} &deg;C</p><p>Wind: ${data.list[i].wind.speed} KPH</p><p>Humidity: ${data.list[i].main.humidity} %</p></div>`);
                $(future).append(futureForecast);
            }
            // Checks to see if the city currently exists in the sidebar
            if ($(sidebar).find(`button:contains(${cityName})`).length === 0) {
                // Creates and appends a button with the city name to the sidebar
                previousCities = $(`<button type="submit">${cityName}</button>`)
                $(sidebar).append(previousCities);
                localStorageUpdate();
            }
        })
}

function localStorageUpdate() {
    let sidebarCities = [];
    // Retrieves each button from the sidebar in turn
    $(sidebar).find('button').each(function () {
        // Assigns the text within the button (the city) to the new array
        sidebarCities.push($(this).text());
    });
    // Saves the array to local storage, using stringify to send the data to the web server as a string
    localStorage.setItem('sidebarCities', JSON.stringify(sidebarCities));
}

function localStorageLoad() {
    let storedCities = localStorage.getItem('sidebarCities');
    // Checks to see if there are any existing cities in local storage, not running if there is none found
    if (storedCities) {
        // Converts the cities into an object
        let cityArray = JSON.parse(storedCities);
        // Retrieves each button from the sidebar in turn
        for (let i = 0; i < cityArray.length; i++) {
            let storedCity = $(`<button type="submit">${cityArray[i]}</button>`);
            // Places the button(s) back on to the page
            $(sidebar).append(storedCity);
        }
    }
}

$(sidebar).on('click', 'button', function (e) {
    e.preventDefault();
    $(current).empty();
    $(future).empty();
    // Assigns the cityName to the text of the clicked button
    cityName = $(this).text();
    getCoordinates(cityName);
});

function toCelsius(temp) {
    // Celsius = Kelvin - 273.15
    let celsius = temp - 273.15;
    return celsius.toFixed(2);
}