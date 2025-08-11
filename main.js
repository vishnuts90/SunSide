let currentHeading = 0;
let watchId;
let locationId;

// Function to update the sun position based on vehicle heading and sun position
function updateSunPosition(latitude, longitude, heading) {
    const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
    const sunAzimuth = sunPosition.azimuth * 180 / Math.PI;
    
    // Convert sun azimuth to 0-360 degrees (0 = North, clockwise)
    const sunAzimuthDegrees = (sunAzimuth + 180) % 360;
    
    // Calculate relative position (which side of the vehicle the sun is on)
    const relativeSunPosition = (sunAzimuthDegrees - heading + 360) % 360;
    
    let sunSide;
    let sunClass;
    
    if (relativeSunPosition > 315 || relativeSunPosition <= 45) {
        sunSide = "FRONT";
        sunClass = "sun-front";
    } else if (relativeSunPosition > 45 && relativeSunPosition <= 135) {
        sunSide = "RIGHT";
        sunClass = "sun-right";
    } else if (relativeSunPosition > 135 && relativeSunPosition <= 225) {
        sunSide = "BACK";
        sunClass = "sun-back";
    } else {
        sunSide = "LEFT";
        sunClass = "sun-left";
    }
    
    // Update the UI
    document.getElementById("sunPositionText").innerText = sunSide;
    document.getElementById("compassValue").innerText = Math.round(heading) + "°";
    
    // Update sun indicator position
    const sunIndicator = document.getElementById("sunIndicator");
    sunIndicator.className = "sun-indicator " + sunClass;
    sunIndicator.style.display = "flex";
}

// Function to get the user's current location and heading
function getCurrentLocation() {
    if (navigator.geolocation) {
        document.getElementById("loading").innerText = "Getting your location...";
        
        // Get current position
        locationId = navigator.geolocation.watchPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Get weather data
                getWeather(latitude, longitude);
                
                // Watch device orientation for heading
                if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    // iOS 13+ requires permission
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                startCompass(latitude, longitude);
                            } else {
                                document.getElementById("error").innerText = "Compass permission denied. Please allow access to the compass.";
                                document.getElementById("error").style.display = "block";
                            }
                        })
                        .catch(console.error);
                } else {
                    // Other browsers
                    startCompass(latitude, longitude);
                }
                
                document.getElementById("loading").style.display = "none";
            },
            function(error) {
                handleLocationError(error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        document.getElementById("error").innerText = "Geolocation is not supported by this browser.";
        document.getElementById("error").style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
}

// Function to start compass tracking
function startCompass(latitude, longitude) {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            // For iOS devices
            if (event.webkitCompassHeading) {
                currentHeading = event.webkitCompassHeading;
            } 
            // For Android devices
            else if (event.alpha) {
                currentHeading = 360 - event.alpha;
            }
            
            updateSunPosition(latitude, longitude, currentHeading);
        });
    } else {
        // Fallback to manual heading input if compass is not available
        document.getElementById("error").innerText = "Compass not supported. Enter your heading manually.";
        document.getElementById("error").style.display = "block";
        
        // Simple fallback for testing
        currentHeading = 0;
        updateSunPosition(latitude, longitude, currentHeading);
    }
}

// Get weather from OpenWeatherMap API
function getWeather(latitude, longitude) {
    // Using OpenWeatherMap API (free tier)
    const apiKey = "a97c7811b5ba9aa0df6667e90f2d7f0b"; // Get a free key from openweathermap.org
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
            document.getElementById("conditions").innerText = data.weather[0].main;
            document.getElementById("wind").innerText = Math.round(data.wind.speed) + " km/h";
        })
        .catch(error => {
            console.error("Weather data error:", error);
            document.getElementById("weatherContainer").innerHTML = "<p>Weather data unavailable</p>";
        });
}

// Handle location errors
function handleLocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    
    document.getElementById("error").innerText = errorMessage;
    document.getElementById("error").style.display = "block";
    document.getElementById("loading").style.display = "none";
}

// Initialize the app
window.onload = function() {
    getCurrentLocation();
    
    // For demonstration only - add a manual test button
    const container = document.querySelector(".container");
    const testButton = document.createElement("button");
    testButton.innerText = "Test Different Headings";
    testButton.style.display = "block";
    testButton.style.margin = "20px auto";
    testButton.style.padding = "10px 20px";
    
    testButton.addEventListener("click", function() {
        currentHeading = (currentHeading + 45) % 360;
        const latitude = 40.7128; // New York (default test value)
        const longitude = -74.0060;
        updateSunPosition(latitude, longitude, currentHeading);
    });
    
    container.appendChild(testButton);
};