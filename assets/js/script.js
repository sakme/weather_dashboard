var userFormEl = document.querySelector("#searchForm");
var userFormHistoryEl = document.querySelector("#search_history");
var locationInputEl = document.querySelector("#searchInput");
var cityEL = document.querySelector("#city");
var tempEL = document.querySelector("#temp");
var windEL = document.querySelector("#wind");
var humidityEL = document.querySelector("#humidity");
var uvEL = document.querySelector("#uv");
var uvClass = document.querySelector(".uv");
var apiKey = "&appid=38b9f7071f9eafef52b0970c1e55a172";
var iconURL = "http://openweathermap.org/img/wn/";
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
var weather = [];

// get coordinates from API
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
        } else {
            document.location.reload()
        }
    });

    var city1 = city.split(" ")[0];
    var city2 = city.split(" ")[1];

    if (city2) {
        city = city1.charAt(0).toUpperCase() + city1.slice(1) + 
            " " + city2.charAt(0).toUpperCase() + city2.slice(1);
    } else {
        city = city.charAt(0).toUpperCase() + city.slice(1);
    }

    state = state.charAt(0).toUpperCase() + state.charAt(1).toUpperCase();
    cityEL.textContent = city + ", " + state + "  " + moment().format('l');
};

// get weather from API
var getWeather = function(lat,lon) {
    fetch(baseURL + oneCall + latPar + lat + lonPar + lon + exclude + units + apiKey)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                weather = data;
                console.log(weather);
                console.log(weather.daily.length);

                tempEL.textContent = weather.current.temp + "\u00B0" + "F";
                windEL.textContent = weather.current.wind_speed + " " + "MPH";
                humidityEL.textContent = weather.current.humidity + "%";
                var uv = weather.current.uvi;
                uvEL.textContent = uv;
                
                if (uv <= 3.0) {
                    uvEL.className = "uv_green"
                } else if (uv >= 3.0 && uv < 6.0) {
                    uvEL.className = "uv_yellow"
                } else if (uv >= 6.0 && uv < 8.0) {
                    uvEL.className = "uv_orange"
                } else if (uv >= 8.0 && uv < 11.0) {
                    uvEL.className = "uv_red"
                } else if (uv >= 11.0) {
                    uvEL.className = "uv_purple"
                }

                var todayIcon = weather.current.weather[0].icon + ".png";
                var todayDesc = weather.current.weather[0].description;

                var cityImg = document.createElement("img");
                cityImg.setAttribute("src", iconURL + todayIcon);
                cityImg.setAttribute("alt", iconURL + todayDesc);
                cityEL.appendChild(cityImg);



                document.getElementById("forecast").style.visibility = "visible";
            })
        }
    })
}

// search when search form used
var formSubmitHandler = function(event) {
    event.preventDefault();

    var local = locationInputEl.value.trim();

    locationInputEl.value = "";

    if (local) {
        getLocation(local);
    } else {
        alert("Please enter a valid location.");
    }

    var button = document.createElement("button");
    button.classList = "col-12 searchHistoryButton";
    button.setAttribute("id", "searchHistoryButton");
    button.setAttribute("type", "submit");
    button.setAttribute("form", "searchHistoryButton");
    button.setAttribute("value", local);
    button.textContent = local;

    var form = document.querySelector("#search_history");

    form.appendChild(button);
    
    if (searchHistory.length >= 10) {
        var tempHistory = searchHistory.slice(-9);
        searchHistory = tempHistory;
        searchHistory.push(local);
        saveHistory();
        $(".searchHistoryButton:first-child").remove();
    } else {
        searchHistory.push(local);
        saveHistory();
    }
};

// search when history item clicked
var formHistorySubmitHandler = function(event) {
    event.preventDefault();

    var locale = event.target.outerText;

    if (locale) {
        getLocation(locale);
    } else {
        alert("Please enter a valid location.");
    }
};

// save to local storage
var saveHistory = function() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// load search history
var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistory) {
        searchHistory = [];
        saveHistory();
    }

// loop over object properties
    for (var i = 0; i < searchHistory.length; i++) {
        var local = searchHistory[i];
    
        var button = document.createElement("button");
        button.classList = "col-12 searchHistoryButton";
        button.setAttribute("id", "searchHistoryButton");
        button.setAttribute("type", "submit");
        button.setAttribute("form", "searchHistoryButton");
        button.setAttribute("value", local);
        button.textContent = local;
    
        var form = document.querySelector("#search_history");
        
        form.appendChild(button);
    }
};

document.getElementById("forecast").style.visibility = "hidden";

loadHistory();

userFormEl.addEventListener("submit", formSubmitHandler);
userFormHistoryEl.addEventListener("click", formHistorySubmitHandler);