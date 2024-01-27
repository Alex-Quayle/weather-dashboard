const current = $('#today');
const future = $('#forecast')
const sidebar = $('#history');
// Makes cityName a global variable
let cityName;

$("#search-button").on("click", function (e) {
    // Prevents the default behaviour of the page refreshing
    e.preventDefault();
    // Assigns the search box content to a variable
    cityName = $("#search-input").val();
    // TODO: If the input is a city
    // Extracts the longitude and latitude using the search input
    let geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=API"
    // API call that retrieves and stores the longitude/latitude for use in the getWeather function
    fetch(geoQuery)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            getWeather(latitude, longitude);
        });
})

function getWeather(latitude, longitude) {
    // Utilises the longitude/latiude variables to access the city's weather
    let query = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=API";
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
        })
}
// If city isn't already on the sidebar
// let previousCity = $(`<btn></btn>`)
// $(sidebar).append(previousCity);
// Append to the page the future forecast (Date, icon?, Temp, Wind, Humidity)
// Append the city to the history sidebar
// Else, return 

function toCelsius(temp) {
    // Celsius = Kelvin - 273.15
    let celsius = temp - 273.15;
    return celsius.toFixed(2);
}