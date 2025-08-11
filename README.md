Sun Position Tracker for Vehicles
Overview
Sun Position Tracker is a web application that shows users which side of their vehicle the sun will be on during travel, along with current weather conditions. This app helps drivers anticipate sun glare and prepare accordingly, improving driving comfort and safety.
Features

* Real-time Sun Position Tracking: Shows if the sun is on the left, right, front, or back of your vehicle
* Visual Sun Indicator: Clear visual representation of sun position relative to your vehicle
* Compass Heading Display: Shows your current travel direction in degrees
* Weather Information: Displays current temperature, weather conditions, and wind speed
* Responsive Design: Works on both iOS and Android mobile devices
* No Installation Required: Runs directly in web browsers
* Offline Capability: Core sun position calculations work without internet (weather requires connection)

Installation
Option 1: Direct Use (No Installation)

1. Visit the app at: [Your-Deployed-URL]
2. Allow location and device orientation permissions when prompted
3. Bookmark the page for easy access

Option 2: Local Installation

1. 
Download the project files:
git clone https://github.com/yourusername/sun-position-tracker.git

Or download ZIP file directly

2. 
Navigate to the project folder
cd sun-position-tracker


3. 
Open index.html in any text editor and replace YOUR_API_KEY with your OpenWeatherMap API key

4. 
Deploy to a web server or open locally in a browser


Getting an OpenWeatherMap API Key

1. Register for a free account at OpenWeatherMap
2. Navigate to API Keys section in your account
3. Copy your API key
4. Replace YOUR_API_KEY in the JavaScript code

Usage

1. Grant location permissions when prompted
2. On iOS, grant motion & orientation access when prompted
3. Hold your device in the same orientation as your travel direction
4. The app will display which side of your vehicle the sun is currently on
5. Weather information appears at the bottom of the screen

Note: For most accurate results, mount your phone in a car holder facing the direction of travel.
Technical Details
How It Works
This app uses:

* SunCalc.js: Calculates sun position based on time and geolocation
* Geolocation API: Gets your current coordinates
* Device Orientation API: Determines which way your device is pointing
* OpenWeatherMap API: Retrieves current weather conditions

Calculations
The app performs these key calculations:

1. Gets device geolocation (latitude/longitude)
2. Gets device compass heading (direction of travel)
3. Calculates sun azimuth (horizontal angle) using SunCalc
4. Computes the relative angle between vehicle direction and sun position
5. Determines which vehicle side faces the sun based on this angle:

Front: 315-45 degrees
Right: 45-135 degrees
Back: 135-225 degrees
Left: 225-315 degrees



Customization
Changing Units
To switch from metric (°C, km/h) to imperial (°F, mph):

1. Find the weather API call in the JavaScript code
2. Change units=metric to units=imperial

Adding Features
To add sunset/sunrise times:

1. 
Add this to the HTML in the weather card:
htmlDownloadCopy code Wrap<div class="weather-item">
    <div class="weather-icon"><i class="fas fa-sunset"></i></div>
    <div id="sunset" class="weather-value">--:--</div>
    <div class="weather-label">Sunset</div>
</div>

2. 
Add this to the JavaScript getWeather function:
javascriptDownloadCopy code Wrapconst sunset = new Date(data.sys.sunset * 1000);
document.getElementById("sunset").innerText = 
    sunset.getHours() + ":" + 
    (sunset.getMinutes() < 10 ? '0' : '') + 
    sunset.getMinutes();


Browser Compatibility

* Chrome/Android: Full support
* Safari/iOS: Requires HTTPS for device orientation
* Firefox: Full support
* Edge: Full support

Troubleshooting
Location Not Working

* Ensure location services are enabled on your device
* Check that you've granted location permissions to the browser
* Try refreshing the page

Compass Not Working

* On iOS, ensure you've allowed motion & orientation access
* Make sure you're using HTTPS (required for iOS)
* Try calibrating your device compass (wave in figure-8 pattern)

Weather Not Showing

* Check your internet connection
* Verify your OpenWeatherMap API key is correct
* API calls may be limited on free tier (1,000 per day)

Privacy
This app:

* Does not store your location data
* Does not track your movements
* Makes API calls directly from your device to OpenWeatherMap
* Does not collect any personal information

License
This project is licensed under the MIT License - see the LICENSE file for details.
Credits

* SunCalc.js: Created by Vladimir Agafonkin
* Weather Data: Provided by OpenWeatherMap
* Icons: Font Awesome


Feel free to contribute to this project by submitting issues or pull requests!
