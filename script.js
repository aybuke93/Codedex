async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block"; //changes the hidden view to shown view.
    const apiKey = "9f0347cd53544d35827eee5bd1de732c"; 

    if (searchInput == "") { //validation for Empty input.
        weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
      }

      //Inner functions that will help us with getting weather info.The functions have the "async" keyword in front of them. We'll be using the companion "await" keyword, along with the "fetch()"" function, to ensure we get valid weather information each time.
      async function getLonAndLat() { //to get a location's longitude and latitude from a typed name via  OpenWeather's GeoCoding API.
        const countryCode = 90; //1 for USA, can be changed.
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`; //API endpoint that includes the countryCode along with the apiKey we defined earlier.
        //To return the longitude and latitude data, we need to fetch it from the API:
        const response = await fetch(geocodeURL); //This returns a response object from the API.
        if (!response.ok) { //error validation
        console.log("Bad response! ", response.status);
        return;
        }
        // Next, we want to get the actual geocode data in JSON. We can use the response object's .json() to do this! And since the data is coming from the response, it is asynchronous and we must use the await keyword:
        const data = await response.json();

        if (data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
              <h2>Invalid Input: "${searchInput}"</h2>
              <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
          } else {
            return data[0];
          }
        }
        //2nd inner function: getWeatherData()
        //The getWeatherData() function accepts a lon and lat parameter that will be used in the API call for the current weather data. This information comes from the getLonAndLat() function we defined earlier.
        async function getWeatherData(lon, lat) {
            //First, define a weatherURL variable and assign the other OpenWeather API endpoint string to it:
            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            //Next, we'll define a response variable and assign to it the object returned by the fetch() function with the weatherURL passed in.
            const response = await fetch(weatherURL);
            if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
            }

            const data = await response.json();
            //## Display Weather Data
            weatherDataSection.style.display = "flex";
            weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
            <div>
              <h2>${data.name}</h2>
              <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}&#176;C</p>
              <p><strong>Description:</strong> ${data.weather[0].description}</p>
            </div>
            `
        }
        document.getElementById("search").value = "";
        const geocodeData = await getLonAndLat();
        getWeatherData(geocodeData.lon, geocodeData.lat);

  }

