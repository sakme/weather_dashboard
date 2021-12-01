var userFormEl = document.querySelector("#searchForm");
var userFormHistoryEl = document.querySelector("#search_history");
var locationInputEl = document.querySelector("#searchInput");
var apiKey = "&appid=38b9f7071f9eafef52b0970c1e55a172";
var baseURL = "http://api.openweathermap.org/data/2.5/";
var oneCall = "onecall?";
var cityCall = "weather?q=";
var cCode = ",us";
var units = "&units=imperial";
var latPar = "lat=";
var lonPar = "&lon=";
var exclude = "&exclude=hourly,minutely,alerts";
var city = "";
var state = "";
var searchHistory = [];

var getLocation = function(local) {
    city = local.split(", ")[0];
    state = local.split(", ")[1];
    
    fetch(baseURL + cityCall + city + "," + state + cCode + units + apiKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(locationData) {
                var lat = locationData.coord.lat;
                var lon = locationData.coord.lon;
                getWeather(lat,lon);
            })
        } 
        // else {
        //     document.location.reload()
        // }
    });
};

var getWeather = function(lat,lon) {
    fetch(baseURL + oneCall + latPar + lat + lonPar + lon + exclude + units + apiKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                return(data);
            })
        }
    })
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var local = locationInputEl.value.trim();

    locationInputEl.value = "";

    var button = document.createElement("button");
    button.classList = "col-12 searchHistoryButton";
    button.setAttribute("id", "searchHistoryButton");
    button.setAttribute("type", "submit");
    button.setAttribute("form", "searchHistoryButton");
    button.setAttribute("value", local);
    button.textContent = local;

    var form = document.querySelector("#search_history");
    
    form.appendChild(button);

    searchHistory.push(local);

    if (local) {
        getLocation(local);
    } else {
        alert("Please enter a valid location.");
    }
};

var formHistorySubmitHandler = function(event) {
    // event.preventDefault();

    // console.log(event.target.outerText);

    var locale = event.target.outerText;

    console.log(locale);

    searchHistory.push(locale);

    if (locale) {
        getLocation(locale);
    } else {
        alert("Please enter a valid location.");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
userFormHistoryEl.addEventListener("click", formHistorySubmitHandler);