document.getElementById("searchBtn").addEventListener("click", function () {
    const countryName = document.getElementById("countrySearch").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }
    fetchCountryData(countryName);
});

// Fetch country data from REST Countries API
async function fetchCountryData(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        if (!response.ok) throw new Error("Country not found");
        const data = await response.json();
        displayCountries(data);
    } catch (error) {
        alert("Error fetching country data: " + error.message);
    }
}

// Display country data as cards
function displayCountries(countries) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    countries.forEach((country) => {
        const countryCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common}">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text">Region: ${country.region}</p>
                        <button class="btn btn-info more-details" data-country="${country.name.common}">More Details</button>
                    </div>
                </div>
            </div>
        `;
        resultDiv.innerHTML += countryCard;
    });

    document.querySelectorAll(".more-details").forEach((button) => {
        button.addEventListener("click", function () {
            const countryName = this.getAttribute("data-country");
            fetchCountryDetails(countryName);
        });
    });
}

// Fetch detailed country and weather data
async function fetchCountryDetails(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        if (!response.ok) throw new Error("Country details not found");
        const data = await response.json();
        const countryData = data[0];

        if (!countryData.latlng || countryData.latlng.length < 2) {
            alert("Latitude and Longitude not available for this country.");
            return;
        }

        const [lat, lon] = countryData.latlng;
        console.log("Latitude:", lat, "Longitude:", lon); // Debugging line

        const weather = await fetchWeatherData(lat, lon);

        alert(`
            Country: ${countryData.name.common}
            Capital: ${countryData.capital ? countryData.capital[0] : "N/A"}
            Population: ${countryData.population}
            Area: ${countryData.area} km²
            Weather: ${weather.weather[0].description}, ${weather.main.temp}°C
        `);
    } catch (error) {
        alert("Error fetching country details or weather data: " + error.message);
    }
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(lat, lon) {
    const apiKey = "9661803bf28e495ba2935408240312"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log("Weather API Request URL:", url); // Debugging line

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error Response from Weather API:", errorData); // Log error response for more info
            throw new Error(errorData.message || "Weather data not found");
        }
        return await response.json();
    } catch (error) {
        alert("Error fetching weather data: " + error.message);
        throw error;
    }
}
