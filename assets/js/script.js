var apiKey = "&appid=38b9f7071f9eafef52b0970c1e55a172";
var baseURL = "http://api.openweathermap.org/data/2.5/";
var oneCall = "onecall?";
var cityCall = "weather?q=";
var cCode = ",us";
var units = "&units=imperial";
var latPar = "lat=";
var lonPar = "&lon=";
var exclude = "&exclude=hourly,minutely";

var getLocation = function(local) {
    fetch(baseURL + cityCall + local + cCode + units + apiKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(locationData) {
                var lat = locationData.coord.lat;
                var lon = locationData.coord.lon;
                getWeather(lat,lon);
            })
        }
    });
};

var getWeather = function(lat,lon) {
    fetch(baseURL + oneCall + latPar + lat + lonPar + lon + exclude + units + apiKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        }
    })
}

getLocation("columbus,oh");
