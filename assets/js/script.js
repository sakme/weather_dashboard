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
};

// get weather from API
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

loadHistory();


userFormEl.addEventListener("submit", formSubmitHandler);
userFormHistoryEl.addEventListener("click", formHistorySubmitHandler);