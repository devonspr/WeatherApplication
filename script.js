// Weather App Functionality with Enhanced Features
function getWeather() {
  const apiKey = "be91eba7197966ef17718396baea41f3";
  const city = document.getElementById("city").value;

  if (!city) {
    showNotification("Please enter a city", "error");
    return;
  }

  // Show loading state
  showLoadingState(true);

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
      showNotification(
        `Weather data for ${data.name} loaded successfully!`,
        "success"
      );
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      showNotification(
        "Error fetching weather data. Please try again.",
        "error"
      );
    })
    .finally(() => {
      showLoadingState(false);
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p class="error-message">${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Additional weather data
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const feelsLike = Math.round(data.main.feels_like - 273.15);

    const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

    const weatherHtml = `
            <p class="city-name">${cityName}</p>
            <p class="weather-desc">${description}</p>
        `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    // Update weather stats
    updateWeatherStats(humidity, windSpeed, feelsLike);
    showImage();
  }
}

function updateWeatherStats(humidity, windSpeed, feelsLike) {
  document
    .querySelectorAll(".stat-item")[0]
    .querySelector(".stat-value").textContent = `${humidity}%`;
  document
    .querySelectorAll(".stat-item")[1]
    .querySelector(".stat-value").textContent = `${windSpeed} m/s`;
  document
    .querySelectorAll(".stat-item")[2]
    .querySelector(".stat-value").textContent = `${feelsLike}°C`;
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}

function showLoadingState(show) {
  const button = document.querySelector(".search-btn");
  if (show) {
    button.innerHTML =
      '<span class="btn-text">Loading...</span><span class="btn-icon">⏳</span>';
    button.disabled = true;
  } else {
    button.innerHTML =
      '<span class="btn-text">Search</span><span class="btn-icon">⚡</span>';
    button.disabled = false;
  }
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <span class="notification-icon">${
          type === "success" ? "✅" : "❌"
        }</span>
        <span class="notification-text">${message}</span>
    `;

  // Add styles for notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "rgba(34, 197, 94, 0.9)"
            : "rgba(239, 68, 68, 0.9)"
        };
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(10px);
        border: 1px solid ${
          type === "success"
            ? "rgba(34, 197, 94, 0.3)"
            : "rgba(239, 68, 68, 0.3)"
        };
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS for notification animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Modal Update Functionality - Black & Gold Theme
function showUpdateModal() {
  // Check if user has already dismissed the modal
  const modalDismissed = localStorage.getItem("weatherUpdateModalDismissed");

  if (!modalDismissed) {
    const modal = document.getElementById("update-modal");
    modal.style.display = "block";

    // Add pulsing animation to modal
    setTimeout(() => {
      modal.querySelector(".modal-content").classList.add("pulse");
    }, 500);
  }
}

function closeUpdateModal() {
  const modal = document.getElementById("update-modal");
  modal.style.display = "none";

  // Remove pulsing animation
  modal.querySelector(".modal-content").classList.remove("pulse");
}

function dontShowAgain() {
  localStorage.setItem("weatherUpdateModalDismissed", "true");
  closeUpdateModal();

  // Show confirmation message
  const originalWeatherInfo = document.getElementById("weather-info").innerHTML;
  document.getElementById("weather-info").innerHTML = `
        <p style="color:#D4AF37; font-size:14px;">✓ Update tidak akan ditampilkan lagi</p>
    `;

  setTimeout(() => {
    document.getElementById("weather-info").innerHTML = originalWeatherInfo;
  }, 3000);
}

// Event Listeners for Modal
document.addEventListener("DOMContentLoaded", function () {
  // Show modal after a short delay when page loads
  setTimeout(showUpdateModal, 1500);

  // Close modal when clicking the X
  document
    .querySelector(".close-modal")
    .addEventListener("click", closeUpdateModal);

  // Close modal when clicking outside of it
  document
    .getElementById("update-modal")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        closeUpdateModal();
      }
    });

  // Button events
  document.getElementById("got-it").addEventListener("click", closeUpdateModal);
  document
    .getElementById("dont-show-again")
    .addEventListener("click", dontShowAgain);

  // Close with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeUpdateModal();
    }
  });

  // Add hover effects to feature items
  const featureItems = document.querySelectorAll(
    ".update-features li, .update-notes li"
  );
  featureItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Enter key support for search
  document
    .getElementById("city")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        getWeather();
      }
    });

  // Theme toggle functionality (placeholder)
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", function () {
      showNotification("Nunggu Update dulu wak..", "success");
    });
});
