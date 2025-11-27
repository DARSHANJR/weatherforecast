const apiKey = 'b91a361956c986b8783c3cf8a426baf2';

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityinput").value.trim();
    if (city) {
        getWeather(city);
        localStorage.setItem("lastCity", city);
    } else {
        getLocationWeather();
    }
});

document.getElementById("locateBtn").addEventListener("click", () => {
    getLocationWeather();
});

window.onload = () => 
    {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) document.body.classList.add("dark");
    updateThemeIcon();

    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
    } else {
        getLocationWeather();
    }
};

function updateThemeIcon() {
    const btn = document.getElementById("themeToggle");
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
    updateThemeIcon();
});
function getLocationWeather()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(position =>
        {
            const{latitude,longitude}=position.coords;
            const url=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            fetch(url)
            .then(res=>res.json())
            .then(data=>
            {
                getWeather(data.name);
            }
            )
            .catch(()=> alert("unable to detect location weather."));
        },
        ()=> alert("location access denied.please search manually.")
        );
    }
    else
    {
        alert("geolocation is not supported by this browser.");
    }
}
function getWeather(city) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    fetch(weatherURL)
        .then(response => {
            if (!response.ok) throw new Error("city not found");
            return response.json();
        })
        .then(data => {
            const main = data.weather[0].main;
            document.getElementById("cityName").innerText = data.name;
            document.getElementById("temp").innerText = `🌡️ Temp:${data.main.temp}°C`;
            document.getElementById("condition").innerText = `☁️  Condition: ${data.weather[0].description}`;
            document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById("wind").innerText = `💨 Wind:${data.wind.speed} m/s`;
            document.body.style.background = pickBackground(main);
            setWeatherIcon(main);
        })
        .catch(err => alert(err.message));
        fetch(forecastURL)
        .then(res => res.json())
        .then(data => {
            const forecastEl = document.getElementById("forecast");
            forecastEl.innerHTML = "";
            const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            daily.slice(0, 5).forEach(day => {
                const date = new Date(day.dt_txt);
                const iconMap = {
                    Clear: "wi-day-sunny",
                    Clouds: "wi-cloudy",
                    Rain: "wi-rain",
                    Snow: "wi-snow",
                    Thunderstorm: "wi-thunderstorm",
                    Drizzle: "wi-sprinkle",
                    Mist: "wi-fog"
                };
                const iconClass = iconMap[day.weather[0].main] || "wi-na";
                const html = `
                <div class="forecast-day">
                    <p><strong>${date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</strong></p>
                    <i class="wi ${iconClass}" style="font-size:32px;"></i>
                    <p>🌡️ Temp: ${day.main.temp.toFixed(1)}°C</p>
                    <p>☁️ ${day.weather[0].description}</p>
                    <p>💧 Humidity: ${day.main.humidity}%</p>
                    <p>💨 Wind: ${day.wind.speed} m/s</p>
                </div>`;
                forecastEl.innerHTML += html;
            });
        });
}
function pickBackground(condition)
{
    switch(condition)
    {
    case "Clear": return "linear-gradient(to right,#f9d423,#ff4e50)";
    case "Clouds": return "linear-gradient(to right,#bdc3c7,#2c3e50)";
    case "Rain": return "linear-gradient(to right,#00c6ff,#0072ff)";
    case "Snow": return "linear-gradient(to right,#83a4d4,#b6fbff)";
    case "Thunderstorm": return "linear-gradient(to right,#141E30,#243B55)";
    default: return "linear-gradient(to right,#89f7fe,#66a6ff)";
    }
}
function setWeatherIcon(condition) {
    const icon = document.getElementById("weathericon");
    const map = {
        Clear: "wi-day-sunny",
        Clouds: "wi-cloudy",
        Rain: "wi-rain",
        Snow: "wi-snow",
        Thunderstorm: "wi-thunderstorm",
        Drizzle: "wi-sprinkle",
        Mist: "wi-fog"
    };
    icon.className = `wi ${map[condition] || "wi-na"}`;
}