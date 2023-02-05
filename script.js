
// Rapid api key for Weather API 
let apikey = '0fcd1fd8bbmsh56f0fa94a3c54afp146bcajsn9dd9fef1bf55';
// Base URL for Weather API
const baseURL = "https://weatherapi-com.p.rapidapi.com/current.json";

// return weather data from weather api 
const getWeatherData = async(location) => {
    try{    
        const response = await fetch(`${baseURL}?q=${location}&rapidapi-key=${apikey}`);
        const data = await response.json();
        return data;
    } catch(err){
        console.log(err)
    }
}

// Get location entered in search bar
const getLocation = () => {
    let locationNameSearch = document.getElementById("searchBox").value;
    console.log(locationNameSearch)
    showWeatherDetails(locationNameSearch);
    locationNameSearch.value = '';
}

// Get location of user: latitude & longitude
const getGeoLocation = () => {
    success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        showWeatherDetails(latitude+"%2C"+longitude);
    }
    error = () => {
        showWeatherDetails("Dehradun")
        console.log("Unable to retreive your location");
    }
    if(!navigator.geolocation) {
        console.log("Geolocation not supported");
    } else {
        navigator.geolocation.getCurrentPosition(success,error);
    }
}

// Get the changed format of date to display
const getDate = (adate) =>{
    const bdate = adate.split(" ")[0];
    let [y,m,d] = bdate.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    m = months[m-1]
    if(d<10)
    d=d.split("")[1];
    if(d==1 && d!=11 && d.split("")[1]==1)
    d+="st";
    else if(d==2 && d!=12 && d.split("")[1]==2)
    d+="nd";
    else if(d==3 && d!=13 && d.split("")[1]==3)
    d+="rd";
    else
    d+="th";
    const res = [d,m,y].join(" ");
    return res;
}

// Get the day from the given date
const getDay = (adate) =>{
    let [bdate, time] = adate.split(" ");
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const convertDate = new Date(bdate);
    const currentDay = week[convertDate.getDay()];
    let [hours, minutes] = time.split(":");
    changeWeatherImage(hours);
    if(hours>12){
        hours = hours - 12;
        minutes = minutes + " pm";
    } else if(hours == 12){
        minutes = minutes + " pm";
    } else {
        minutes = minutes + " am";
    }
    return currentDay+" | "+hours+":"+minutes;
}

// Change Weather Image according to morning/night
const changeWeatherImage = (hrs) => {
    if(hrs>=6 && hrs<=17)
    document.getElementById("weatherImage").src =  "images/WeatherIcon - 2-39.svg";
}

// Display all weather details according to location after the search is entered
const showWeatherDetails = (loc) =>{
    const weatherData =  getWeatherData(loc).then(data=>{
        console.log(data.current.temp_c)
        document.getElementById("currentTemp").innerText = Math.round(data.current.temp_c);
        const currentDate = data.location.localtime;
        document.getElementById("date").innerText = getDate(currentDate);
        document.getElementById("day").innerText = getDay(currentDate); 
        document.getElementById("wind-value").innerText = data.current.wind_kph;
        document.getElementById("humidity-value").innerText = data.current.humidity;
        document.getElementById("rain-value").innerText = data.current.precip_mm;
        document.getElementById("location").innerText = data.location.name+", "+data.location.region;
    });
}

// Update temperature according to the unit: celsius or fahrenheit
const updateTemp = (temp_unit) => {
    const loc = document.getElementById("location").innerText;
    const weatherData = getWeatherData(loc).then(data => {
        if(temp_unit == 1)
        document.getElementById("currentTemp").innerText = Math.round(data.current.temp_f);
        else
        document.getElementById("currentTemp").innerText = Math.round(data.current.temp_c);
    })
}

// Change Celsius to Fahrenheit and display change 
const changeUnit1 = () =>{
    updateTemp(1);
    document.getElementById("unit").innerText = "\u00B0F";
    const celsiusDiv = document.getElementById("cDiv")
    celsiusDiv.classList.remove("active");
    const fahrenheitDiv = document.getElementById("fDiv");
    fahrenheitDiv.classList.add("active");
}

// Change Fahrenheit to Celsius and display change
const changeUnit2 = () =>{
    updateTemp(2);
    document.getElementById("unit").innerText = "\u00B0C";
    const celsiusDiv = document.getElementById("cDiv")
    celsiusDiv.classList.add("active");
    const fahrenheitDiv = document.getElementById("fDiv");
    fahrenheitDiv.classList.remove("active");
}


// Expanding and Shrinking search box based on count and call getLocation()
let count = 0;
const expandSearchBar = () =>{
    if(count==0){
        document.getElementById("loc-box").classList.add("remove");
        document.getElementById("searchBox").classList.add("focus");
        document.getElementById("searchBtn").classList.add("focus-search-icon");
        count++;
    } else {
        getLocation();
        document.getElementById("searchBox").classList.remove("focus");
        document.getElementById("searchBox").value = "";
        document.getElementById("searchBtn").classList.remove("focus-search-icon");
        document.getElementById("loc-box").classList.remove("remove");
        count = 0;
    }
}

// EventListener for searching by Enter key
const searchInputDiv = document.getElementById("searchBox");
searchInputDiv.addEventListener('keyup', key);
function key(e){
    if(e.code == "Enter")
    expandSearchBar();
}