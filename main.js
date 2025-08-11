let currentHeading = 0;
let locationTimeout;

function updateSunPosition(latitude, longitude, heading) {
    const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
    const sunAzimuth = sunPosition.azimuth * 180 / Math.PI;
    const sunAzimuthDegrees = (sunAzimuth + 180) % 360;
    const relativeSunPosition = (sunAzimuthDegrees - heading + 360) % 360;

    let sunSide, sunClass;
    if (relativeSunPosition > 315 || relativeSunPosition <= 45) {
        sunSide = "FRONT"; sunClass = "sun-front";
    } else if (relativeSunPosition > 45 && relativeSunPosition <= 135) {
        sunSide = "RIGHT"; sunClass = "sun-right";
    } else if (relativeSunPosition > 135 && relativeSunPosition <= 225) {
        sunSide = "BACK"; sunClass = "sun-back";
    } else {
        sunSide = "LEFT"; sunClass = "sun-left";
    }

    document.getElementById("sunPositionText").innerText = sunSide;
    document.getElementById("compassValue").innerText = Math.round(heading) + "°";

    const sunIndicator = document.getElementById("sunIndicator");
    sunIndicator.className = "sun-indicator " + sunClass;
    sunIndicator.style.display = "flex";
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError("Geolocation not supported by this browser.");
        document.getElementById("locationDisplay").innerText = "Location not supported";
        return;
    }

    document.getElementById("loading").innerText = "Getting your location...";
    
    // Timeout after 8 seconds if no location
    locationTimeout = setTimeout(() => {
        showError("Unable to get location. Please check permissions.");
        document.getElementById("locationDisplay").innerText = "Location not available";
    }, 8000);

    navigator.geolocation.watchPosition(
        function (position) {
            clearTimeout(locationTimeout); // cancel timeout if location arrives
            console.log("Location obtained:", position.coords);
            const { latitude, longitude } = position.coords;

            getLocationName(latitude, longitude);
            getWeather(latitude, longitude);
            initCompass(latitude, longitude);
            document.getElementById("loading").style.display = "none";
        },
        function (error) {
            clearTimeout(locationTimeout);
            console.error("Location error:", error);
            showError("Unable to get location. Please check settings and permissions.");
            document.getElementById("locationDisplay").innerText = "Location not available";
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function getLocationName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || "Unknown place";
            const country = data.address.country || "";
            document.getElementById("locationDisplay").innerText = `${city}, ${country}`;
        })
        .catch(() => {
            document.getElementById("locationDisplay").innerText = "Location found, name unavailable";
        });
}

function initCompass(latitude, longitude) {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startCompass(latitude, longitude);
                } else {
                    console.warn("Compass permission denied.");
                    showError("Compass permission denied — default heading used.");
                    currentHeading = 0;
                    updateSunPosition(latitude, longitude, currentHeading);
                }
            })
            .catch(err => {
                console.error("Compass permission request failed:", err);
                currentHeading = 0;
                updateSunPosition(latitude, longitude, currentHeading);
            });
    } else {
        startCompass(latitude, longitude);
    }
}

function startCompass(latitude, longitude) {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            if (event.webkitCompassHeading) {
                currentHeading = event.webkitCompassHeading;
            } else if (event.alpha !== null) {
                currentHeading = 360 - event.alpha;
            }
            updateSunPosition(latitude, longitude, currentHeading);
        });
    } else {
        showError("Compass not supported — using default heading.");
        currentHeading = 0;
        updateSunPosition(latitude, longitude, currentHeading);
    }
}

function getWeather(latitude, longitude) {
    const apiKey = "a97c7811b5ba9aa0df6667e90f2d7f0b";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Weather data:", data);
            document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
            document.getElementById("conditions").innerText = data.weather[0].main;
            document.getElementById("wind").innerText = Math.round(data.wind.speed) + " km/h";
        })
        .catch(error => {
            console.error("Weather data error:", error);
            document.getElementById("weatherContainer").innerHTML = "<p>Weather data unavailable</p>";
        });
}

function showError(message) {
    document.getElementById("error").innerText = message;
    document.getElementById("error").style.display = "block";
    document.getElementById("loading").style.display = "none";
}

// Always attach help button immediately
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("helpButton").addEventListener("click", function () {
        const helpText = document.getElementById("helpText");
        helpText.style.display = helpText.style.display === "block" ? "none" : "block";
    });

    // Start getting location after button is ready
    getCurrentLocation();
});
