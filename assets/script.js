const current = $('#today');
const future = $('#forecast')
const sidebar = $('#history');
// Makes cityName a global variable
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
    let geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid="
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
    let query = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=";
    fetch(query)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            let temp = data.list[0].main.temp;
            // Appends the city name, date, temperature, wind speed, and humidity to the today's forecast container
            let currentForecast = $(`<h2>${cityName} (${dayjs().format('D/M/YYYY')})</h2><p>Temp: ${toCelsius(temp)} &deg;C</p><p>Wind: ${data.list[0].wind.speed} KPH</p><p>Humidity: ${data.list[0].main.humidity} %</p>`);
            $(current).append(currentForecast);
            // Iterates over the length of the JSON list, adding 8 to each index (to return the data at midnight of every new day)
            for (let i = 3; i < data.list.length; i += 8) {
                futureForecast = $(`<div><h4>${dayjs().format('D/M/YYYY')}</h4><p>Temp: ${toCelsius(data.list[i].main.temp)} &deg;C</p><p>Wind: ${data.list[i].wind.speed} KPH</p><p>Humidity: ${data.list[i].main.humidity} %</p></div>`);
                $(future).append(futureForecast);
            }
            // Checks to see if the city currently exists in the sidebar
            if ($(sidebar).find(`button:contains(${cityName})`).length === 0) {
                // Creates and appends a button with the city name to the sidebar
                previousCities = $(`<button type="submit">${cityName}</button>`)
                $(sidebar).append(previousCities);
            }
        })
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