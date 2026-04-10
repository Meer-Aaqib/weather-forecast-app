const inputValue = document.querySelector(".inputBox");
const searchBtn = document.querySelector(".search_btn");
const errorBox = document.querySelector(".city_not_found");
const weatherInfo = document.querySelector(".weather_info");
const firstPage = document.querySelector(".search_city");
const cityName = document.querySelector(".country_txt");
const currentDate = document.querySelector(".date_txt");
const temp = document.querySelector(".temp_text");
const weatherImage = document.querySelector(".weather_summary_image");
const weatherText = document.querySelector(".condition_text");
const humidity = document.querySelector(".humidity_value_text");
const windSpeed = document.querySelector(".wind_value_text");
const cards = document.querySelectorAll(".forecast_item");

const url = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";
const apiKey = "&appid=668a6a872145bea583b4531594a0ec7b";

const weatherConditions = {
  Clouds: "clouds.svg",
  Clear: "clear.svg",
  Drizzle: "drizzle.svg",
  Rain: "rain.svg",
  Snow: "snow.svg",
  Thunderstorm: "thunderstorm.svg",
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const options = { weekday: "short", day: "2-digit", month: "short" };
  const formattedDate = d.toLocaleDateString("en-US", options);
  return formattedDate;
};

const fetchData = async () => {
  const city = inputValue.value.trim();
  try {
    if (!city) {
      throw new Error("Enter City Name!");
    }
    const response = await fetch(url + city + apiKey);
    if (!response.ok) {
      throw new Error("City Not Found!");
    }
    const data = await response.json();
    weatherInfo.style.display = "block";
    firstPage.style.display = "none";
    errorBox.style.display = "none";

    // Current Weather Info
    const current = data.list[0];
    const condition = current.weather[0].main;
    cityName.innerText = data.city.name;
    const dateStr = current.dt_txt;
    const formattedDate = formatDate(dateStr);
    currentDate.innerText = formattedDate;
    weatherText.innerText = condition;
    temp.innerText = Math.round(current.main.temp) + "°C";
    humidity.innerText = current.main.humidity + "%";
    windSpeed.innerText = (current.wind.speed * 3.6).toFixed(2) + " km/h";

    const icon = weatherConditions[condition] || "atmosphere.svg";
    weatherImage.src = `assets/weather/${icon}`;
    inputValue.value = "";

    // 5 Days Forecast Data

    const dailyData = data.list.filter((items) => {
      return items.dt_txt.includes("12:00:00");
    });
    dailyData.forEach((day, index) => {
      if (!cards[index]) return;
      const apiDate = new Date(day.dt_txt);
      const date = apiDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
      const forecastTemp = Math.round(day.main.temp) + "°C";

      cards[index].querySelector(".forecast_date").innerText = date;
      cards[index].querySelector(".forecast_item_temp").innerText =
        forecastTemp;

      const cardCondition = day.weather[0].main;
      const cardIcon = weatherConditions[cardCondition] || "atmosphere.svg";
      cards[index].querySelector(".forecast_item_images").src =
        `assets/weather/${cardIcon}`;
    });
  } catch (error) {
    errorBox.style.display = "block";
    firstPage.style.display = "none";
    weatherInfo.style.display = "none";
    if (error.message === "Failed to fetch") {
      document.querySelector(".error_message").innerText =
        "Oops Something Went Wrong";
    } else {
      document.querySelector(".error_message").innerText = error.message;
    }
    console.log(error);
  }
};

searchBtn.addEventListener("click", fetchData);

inputValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchData();
  }
});
