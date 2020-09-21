var apiKey = "467cf563786a4dfcb3435338202109";
var forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=3&q=`;
// Array for getting all forecast data into three days
var forecast = {};

function getData(fullURL) {
  $.get(fullURL, function (data) {
    parseForecast(data.forecast);

    // Cutting off all unnecessary stuff I don't want from data.location.localtime
    var localTime = data.location.localtime;
    var timeString = localTime.toString();
    var correctedTime = timeString.substr(timeString.indexOf(" ") + 1);
    // Changing whether it says night or day based on is_day
    var nightCheck = data.current.is_day;
    var brightness = "day time";
    if (nightCheck == 0) {
      brightness = "night time";
    }
    // Adding the current day stuff into the page
    $(".content").append(
      ` 
        <div id="currentDay">
          <h2>Your Location: ${data.location.name}, ${data.location.region}, ${data.location.country}</h2>
          <img src="${data.current.condition.icon}" class="currentImg"/><span class="logoText">${data.current.condition.text}</span><br><br>
          <p>The time is: ${correctedTime}</p>

          <p>While the current temperature is ${data.current.temp_f}°F / ${data.current.temp_c}°C, it feels like it is ${data.current.feelslike_f}°F / ${data.current.feelslike_c}°C</p>
          <p>The wind is currently blowing ${data.current.wind_dir} at ${data.current.wind_mph} MPH / ${data.current.wind_kph} KPH</p>
          <p>It is currently ${brightness}</p>
          <p>Your latitude is ${data.location.lat} and your longitude is ${data.location.lon}</p>
          <p>The humidity is currently ${data.current.humidity}%</p>
          <p>Cloud coverage is currently ${data.current.cloud}%</p>
          <p>Precipitation is looking to be ${data.current.precip_in} inches / ${data.current.precip_mm} millimeters</p>
          <p>This information was last updated: ${data.current.last_updated}</p>
        </div>
    `
    );
  }).catch(function (error) {
    alert("Your Zip code is invalid");
  });
}

// I looked to combine data into one line where I could to use as little space as possible
function parseForecast(data) {
  var dayNum = 0;
  $.each(data, function (idx, forecastdays) {
    $.each(forecastdays, function (idx, forecastday) {
      // I added this because I thought Day 1, Day 2, Day 3 looked nice
      dayNum++;
      // Adding the 3 day forecast to the page
      $(".forecast-content").append(
        `
          <div id="forecastDay">
            <h2 id="dayHeader">Day ${dayNum}: ${forecastday.date}</h2>
            <p>Sunrise: ${forecastday.astro.sunrise}</p>
            <p>Sunset: ${forecastday.astro.sunset}</p>
            <p>Moonrise: ${forecastday.astro.moonrise}</p>
            <p>Moonset: ${forecastday.astro.moonset}</p>
            <p>Maximum Temperature: ${forecastday.day.maxtemp_f}°F /  ${forecastday.day.maxtemp_c}°C</p>
            <p>Minimum Temperature: ${forecastday.day.mintemp_f}°F /  ${forecastday.day.mintemp_c}°C</p>
            <p>Average Temperature: ${forecastday.day.avgtemp_f}°F /  ${forecastday.day.avgtemp_c}°C</p>
            <p>Maximum Wind Speed: ${forecastday.day.maxwind_mph} MPH /  ${forecastday.day.maxwind_kph} KPH</p>
            <p>Visibility: </p>
          </div>  
        `
      );
    });

    console.log(forecastdays);
  });
}

// When get weather button is clicked, execute the main function getData()
function initListeners() {
  $("#getWeather").click(function () {
    var zip = $("#zipcode").val();
    var fullURL = forecastURL + zip;
    console.log(fullURL);
    getData(fullURL);
  });
}

// This is put at the end to make sure everything loads
$(document).ready(function () {
  initListeners();
});
