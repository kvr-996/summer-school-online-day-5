const curr_loc = document.getElementById("current_loc");
let rawLat, rawLon;

function getCurrLoc() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      curr_loc.innerHTML = "Geolocation is not supported by this browser.";
      reject("Geolocation not supported.");
    }
  });
}

function success(position) {
  rawLat = position.coords.latitude;
  rawLon = position.coords.longitude;
}

function error(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      curr_loc.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      curr_loc.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      curr_loc.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      curr_loc.innerHTML = "An unknown error occurred.";
      break;
    default:
      curr_loc.innerHTML = "An unexpected error occurred.";
  }
}

const weather_result = document.getElementById("weather_result");
const latitudeText = document.getElementById("latitudeText");
const longitudeText = document.getElementById("longitudeText");
const weather_desc = document.getElementById("weather_desc");
const temp = document.getElementById("temp");
const temp_max = document.getElementById("temp_max");
const temp_min = document.getElementById("temp_min");
const location_name = document.getElementById("location_name");
const wind_speed = document.getElementById("wind_speed");
const country = document.getElementById("country");
const details = document.getElementsByClassName("details");
const fetched = document.getElementsByClassName("fetch");
const icon = document.getElementById("weather_icon");
async function getWeather() {
  const lat = rawLat;
  const lon = rawLon;
  weather_result.textContent = "Loading...";
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=efe3158b030975060b25b850c3d0bd70&units=metric`,
    {
      headers: { Accept: "application/json" },
    }
  );
  const data = await res.json();
  console.log(data);
  weather_result.textContent = "";
  location_name.textContent = data.name;
  country.textContent = data.sys.country;
  latitudeText.textContent = data.coord.lat;
  longitudeText.textContent = data.coord.lon;
  weather_desc.textContent = data.weather[0].description.toUpperCase();
  temp.textContent = data.main.temp;
  temp_max.textContent = data.main.temp_max + " C";
  temp_min.textContent = data.main.temp_min + " C";
  wind_speed.textContent = data.wind.speed;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  localStorage.setItem("name", data.name);
  localStorage.setItem("country", data.sys.country);
  localStorage.setItem("latitude", data.coord.lat);
  localStorage.setItem("longitude", data.coord.lon);
  localStorage.setItem(
    "weather_desc",
    data.weather[0].description.toUpperCase()
  );
  localStorage.setItem("temp", data.main.temp);
  localStorage.setItem("temp_max", data.main.temp_max);
  localStorage.setItem("temp_min", data.main.temp_min);
  localStorage.setItem("wind_speed", data.wind.speed);
  localStorage.setItem("weather_timestamp", Date.now().toString());

  details[0].style.display = "block";
  fetched[0].style.display = "none";
}

async function combine() {
  const timeStamp = localStorage.getItem("weather_timestamp");
  const now = Date.now();
  if (timeStamp && now - parseInt(timeStamp) < 10 * 60 * 1000) {
    location_name.textContent = localStorage.getItem("name");
    country.textContent = localStorage.getItem("country");
    latitudeText.textContent = localStorage.getItem("latitude");
    longitudeText.textContent = localStorage.getItem("longitude");
    weather_desc.textContent = localStorage.getItem("weather_desc");
    temp.textContent = localStorage.getItem("temp");
    temp_max.textContent = localStorage.getItem("temp_max") + " C";
    temp_min.textContent = localStorage.getItem("temp_min") + " C";
    wind_speed.textContent = localStorage.getItem("wind_speed");
    icon.src = `https://openweathermap.org/img/wn/${localStorage.getItem(
      "icon"
    )}@2x.png`;

    details[0].style.display = "block";
    fetched[0].style.display = "none";
    return;
  }
  try {
    const pos = await getCurrLoc();
    success(pos);
    await getWeather();
  } catch (err) {
    error(err);
  }
}
document.getElementById("weather_fetch").addEventListener("click", combine);
