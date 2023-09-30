function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

getLocation()

async function showPosition(position) {
  const first = document.getElementById('first')
  const second = document.getElementById('second')
  const third = document.getElementById('third')
  const fourth = document.getElementById('fourth')
  const icon = document.getElementById('icon')
  const fifth = document.getElementById('fifth')

  let latitudePosition =  position.coords.latitude 
  let longitudePosition = position.coords.longitude
  let positionAccuracy = position.coords.accuracy

  //var URL = `https://api.weatherapi.com/v1/forecast.json?key=a5164a293dd7496e988134536232809&q=London`
  var URL = `https://api.weatherapi.com/v1/forecast.json?key=a5164a293dd7496e988134536232809&q=${latitudePosition},${longitudePosition}&days=6`
  var res = await fetch(`${URL}`)
  var data = await res.json()
  console.log(data)

  let forecast = data.forecast.forecastday

  first.innerHTML = data.location.name
  second.innerHTML = "Temperature: " + data.current.temp_c + "℃"
  third.innerHTML = "Humidity: " + data.current.humidity
  fourth.innerHTML = 'Wind Speed: ' + data.current.wind_kph + "km/h"
  icon.innerHTML = `<img src=https:${data.current.condition.icon} alt="icon">`
  fifth.innerHTML = 'Condition: ' + data.current.condition.text

  loadForecast(forecast)
  //console.log(forecast)
  //console.log(latitudePosition, longitudePosition, positionAccuracy)
}

function loadForecast(fore) {
  const bottom = document.getElementById('bottom')

  for(let idx = 1; idx < fore.length; idx++) {
    let cardList = document.createElement('div')
    cardList.classList.add('weather-card')
    cardList.innerHTML = 
    `
      <div class="top-two" id="firstIcon">
        <img src='https:${fore[idx].day.condition.icon}' alt="icon">
      </div>
      <div class="bottom-two">
        <p class="date">Date: ${fore[idx].date}</p>
        <p class="condition">Condition: ${fore[idx].day.condition.text}</p>
        <p class="temperature">Temperature: ${fore[idx].day.avgtemp_c}℃</p>
        <p class="wind">Wind-speed: ${fore[idx].day.maxwind_kph}</p>
        <p class="humidity">Humidity: ${fore[idx].day.avghumidity}</p>
      </div>
    `
    bottom.appendChild(cardList)
  }
}

function getSearchTerm() {
  const input = document.getElementById('input')
  const result = document.getElementById('result')
  
  let searchTerm = input.value

  if(searchTerm.length > 0) {
    result.style.display = 'block'
    result.innerHTML = ''
  } else {
    result.style.display = 'none'
  }

  loadCities(searchTerm)

  //console.log(searchTerm)

  //inputButton.addEventListener('click', console.log(searchTerm))
}

getSearchTerm()

async function loadCities(searchTerm) {
  var URL = `https://api.weatherapi.com/v1/search.json?key=a5164a293dd7496e988134536232809&q=${searchTerm}`
  var res = await fetch(`${URL}`)
  var dataTwo = await res.json()
  //console.log(dataTwo)

  displayCities(dataTwo)
}

function displayCities(dataTwo) {
  const result = document.getElementById('result')

  for(let idx = 0; idx < dataTwo.length; idx++) {
    let resultList = document.createElement('p')
    resultList.classList.add('text') 
    resultList.innerHTML = `${dataTwo[idx].name}` + ' ' + `<span>${dataTwo[idx].country}</span>`

    let cityName = `${dataTwo[idx].name}`

    result.appendChild(resultList)
    //console.log(cityName)
    loadCityWeather()
  }
  
}

function loadCityWeather() {
  const cities = result.querySelectorAll('.text')

  cities.forEach(city => {
    city.addEventListener('click', async (event) => {
      result.style.display = 'none'
      input.value = ''


      const cityName = city.textContent.trim()

      const answer = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a5164a293dd7496e988134536232809&q=${cityName}&days=6`)
      const cityDetails = await answer.json()

      console.log(cityName)
      console.log(cityDetails)

      showWet(cityDetails)

      city.removeEventListener('click', event.target)
    })
  });
}

function showWet(details) {
  const first = document.getElementById('first')
  const second = document.getElementById('second')
  const third = document.getElementById('third')
  const fourth = document.getElementById('fourth')
  const icon = document.getElementById('icon')
  const fifth = document.getElementById('fifth')

  first.innerHTML = details.location.name
  second.innerHTML = "Temperature: " + details.current.temp_c + "℃"
  third.innerHTML = "Humidity: " + details.current.humidity
  fourth.innerHTML = 'Wind Speed: ' + details.current.wind_kph + "km/h"
  icon.innerHTML = `<img src=https:${details.current.condition.icon} alt="icon">`
  fifth.innerHTML = 'Condition: ' + details.current.condition.text

  let forecast = details.forecast.forecastday

  displayWet(forecast)
}

function displayWet(fore) {
  const bottom = document.getElementById('bottom')
  bottom.innerHTML = ''

  for(let idx = 1; idx < fore.length; idx++) {
    let cardList = document.createElement('div')
    cardList.classList.add('weather-card')
    cardList.innerHTML = 
    `
      <div class="top-two" id="firstIcon">
        <img src='https:${fore[idx].day.condition.icon}' alt="icon">
      </div>
      <div class="bottom-two">
        <p class="date">Date: ${fore[idx].date}</p>
        <p class="condition">Condition: ${fore[idx].day.condition.text}</p>
        <p class="temperature">Temperature: ${fore[idx].day.avgtemp_c}℃</p>
        <p class="wind">Wind-speed: ${fore[idx].day.maxwind_kph}</p>
        <p class="humidity">Humidity: ${fore[idx].day.avghumidity}</p>
      </div>
    `
    bottom.appendChild(cardList)
  }
}

window.addEventListener('click', (event) => {
  const result = document.getElementById('result')

  if (event.target.className != 'input') {
    result.style.display = 'none'
  }
})