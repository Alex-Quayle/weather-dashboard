$("#search-button").on("click", function (e) {
    // Prevents the default behaviour of the page refreshing
    e.preventDefault();
    // Assign the search box content to a variable
    let location = $("#search-input").val();
    // If the input is a city
    // Extract the longitude and latitude from the API
    let geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=5&appid=API"
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
    // Execute the API call, with the variable included
    let query = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=API";
    fetch(query)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(query);
            let temp = data.list[0].main.temp;
            toCelsius(temp);
            let date = dayjs().format('D/M/YYYY');
            let wind = data.list[0].wind.speed;
            let humidity = data.list[0].main.humidity;
        });
    // Append to the page the current forecast (Date, Temp, Wind, Humidity)
    // Append to the page the future forecast (Date, icon?, Temp, Wind, Humidity)
    // If city isn't already on the sidebar
    // Append the city to the history sidebar
    // Else, return 
}

function toCelsius(temp) {
    // Celsius = Kelvin - 273.15
    let celsius = temp - 273.15;
    return celsius;
}