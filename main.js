const pollutionScale = [
  {
    scale: [0, 50],
    quality: "Sans danger",
    src: "happy",
    background: "linear-gradient(to right, #45B649, #DCE35B)",
  },
  {
    scale: [51, 100],
    quality: "Modérée",
    src: "thinking",
    background: "linear-gradient(to right, #F3F9A7, #CAC531)",
  },
  {
    scale: [101, 150],
    quality: "Mauvais pour la santé",
    src: "unhealthy",
    background: "linear-gradient(to right, #F16529, #E44D26)",
  },
  {
    scale: [151, 200],
    quality: "Mauvais",
    src: "bad",
    background: "linear-gradient(to right, #ef473a, #cb2d3e)",
  },
  {
    scale: [201, 300],
    quality: "Très mauvais",
    src: "mask",
    background: "linear-gradient(to right, #8E54E9, #4776E6)",
  },
  {
    scale: [301, 500],
    quality: "Terrible",
    src: "terrible",
    background: "linear-gradient(to right, #7a2828, #a73737)",
  },
];

const loader = document.querySelector(".loader");
const emojiLogo = document.querySelector(".emoji-logo");
const userInformation = document.querySelector(".user-information");

async function getPollutionData(city = null, state = null, country = "France") {
    try {
      let url = "https://api.airvisual.com/v2/nearest_city?key=edbab99d-6a71-41d7-84f6-df605d3cf43a";
      if (city) {
        url = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=edbab99d-6a71-41d7-84f6-df605d3cf43a`;
      }
      
      const response = await fetch(url).catch(error => {
        throw new Error(error); 
      });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    } else {
      const responseData = await response.json();
      const aqi = responseData.data.current.pollution.aqius;
      
      const sortedData = {
        city: responseData.data.city,
        aqi,
        ...pollutionScale.find(obj => aqi >= obj.scale[0] && aqi <= obj.scale[1])
      };
      populateUI(sortedData);
    }
  } catch (error) {
    loader.classList.remove("active");
    emojiLogo.src = "./ressources/browser.svg";
    userInformation.textContent = error.message;
  }
}

getPollutionData();

const cityName = document.querySelector(".city-name");
const pollutionInfo = document.querySelector(".pollution-info");
const pollutionValue = document.querySelector(".pollution-value");
const backgroundLayer = document.querySelector(".background-layer");

function populateUI(data) {
  emojiLogo.src = `ressources/${data.src}.svg`;
  userInformation.textContent = `Voici la situation de ${data.city}.`;
  cityName.textContent = data.city;
  pollutionInfo.textContent = `${data.quality}`;
  pollutionValue.textContent = `${data.aqi}`;
  backgroundLayer.style.backgroundImage = data.background;
  loader.classList.remove("active");
  
  pointerPlacement(data.aqi);
}

const locationPointer = document.querySelector(".location-pointer");

function pointerPlacement(AQIValue) {
  const parentWidth = locationPointer.parentElement.scrollWidth;
  locationPointer.style.transform = `translateX(${(AQIValue / 500) * parentWidth}px) rotate(180deg)`;
}

// Ajout de la recherche par ville
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () => {
  const cityInput = document.getElementById("city-input").value;
  if (cityInput) {
    loader.classList.add("active");
    getPollutionData(cityInput);
  }
});