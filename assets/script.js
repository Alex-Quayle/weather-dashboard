$("#search-button").on("click", function (e) {
    // Prevents the default behaviour of the page refreshing
    e.preventDefault();
    // Assign the search box content to a variable
    let location = $("#search-input").val();
    // If the input is a city
    // Extract the longitude and latitude from the API
    let query = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=5&appid=APIKEY"
    fetch(query)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
    let latitude= data[0].lat;
    let longitude = data[0].lon;
    console.log(latitude);
    console.log(longitude);
  });







    // Execute the API call, with the variable included
    // Append to the page the current forecast (Date, Temp, Wind, Humidity)
    // Append to the page the future forecast (Date, icon?, Temp, Wind, Humidity)
    // If city isn't already on the sidebar
        // Append the city to the history sidebar
    // Else, return 
})
