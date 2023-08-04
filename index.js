const APIkey = '6385010a0cee4a8c82a215908230108';

function weatherForecast() {
  const form = document.createElement('form');
  const placeInput = document.createElement('input');
  const button = document.createElement('button');
  
  const header = document.querySelector('.header');
  
  button.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
  placeInput.placeholder = 'Enter a city'

  header.classList.add('header');
  placeInput.classList.add('place-input');
  button.classList.add('search');
  
  form.append(placeInput, button);
  header.append(form);
  
  window.addEventListener("load", async (e) => { // REMOVE
    const city = 'london';
    const { weatherData, currentTime } = await fetchWeatherAndTime(city);
    renderWeather(weatherData, currentTime);
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = placeInput.value;
    const { weatherData, currentTime } = await fetchWeatherAndTime(city);
    renderWeather(weatherData, currentTime);
  });
  
  function renderWeather(weatherData, time) {
    const mainInfo = document.createElement('div');
    const locationInfo = document.createElement('div');
    const todayWeather = document.createElement('div');
    const weatherForecast = document.createElement('div');
    const locationP = document.createElement('p');

    const main = document.querySelector('.main');
    main.innerText = '';
    
    mainInfo.classList.add('main-info');
    locationInfo.classList.add('location-info');
    todayWeather.classList.add('today-weather');
    weatherForecast.classList.add('weather-forecast');

    let tempUnits = localStorage.getItem("units") ? localStorage.getItem("units") : 'c';

    let weatherDayData = weatherData.forecast.forecastday[0];
    let weatherDataList = weatherData.forecast.forecastday;

    let isDefaultSorting = true;

    renderTodayWeather(weatherDayData);
    renderWeatherForecast(weatherDataList);

    function renderFilters() {
      const controlsBlock = document.createElement('div');
      const sortMetod = document.createElement('p');
      const units = document.createElement('div');

      controlsBlock.classList.add('controls-block');
      sortMetod.classList.add('filter-metod');
      units.classList.add('units-switch');

      units.innerText = `°${tempUnits.toUpperCase()}`;

      function unitsToImperial() {
        units.id = 'f';
        localStorage.setItem("units", "f");
        units.innerText = '°F'
      }
      
      function unitsToMetric() {
        units.id = 'c';
        localStorage.setItem("units", "c");
        units.innerText = '°C'
      }
      
      const selectedUnits = {
        c: unitsToImperial,
        f: unitsToMetric,
      }

      renderSort(sortMetod);

      sortMetod.addEventListener('click', () => {
        isDefaultSorting = isDefaultSorting ? false : true;
        weatherDataList = isDefaultSorting
          ? weatherData.forecast.forecastday
          : temperatureSorting(weatherDataList);
        
        renderWeatherForecast(weatherDataList);
      });

      units.addEventListener('click', () => {
        selectedUnits[tempUnits]();
        renderTodayWeather(weatherDayData);
        renderWeatherForecast(weatherDataList);
      });

      controlsBlock.append(sortMetod, units);
      weatherForecast.prepend(controlsBlock);
    }

    function renderSort(p) {
      p.innerHTML = `Sort metod: ${isDefaultSorting ? 'Date' : 'Downward'}`;
    }

    function renderWeatherForecast(weatherData) {
      weatherForecast.innerText = '';
      weatherDataList = weatherData;
      weatherData.forEach(dailyWeatherForecast => weatherForecast.append(renderWeatherForecastCard(dailyWeatherForecast)));
      renderFilters();
    }

    function renderWeatherForecastCard(dailyWeatherForecast) {
      const img = document.createElement('img');
      const maxTemp = document.createElement('span');
      const minTemp = document.createElement('span');
      const dailyTemp = document.createElement('p');
      const day = document.createElement('p');
      const date = document.createElement('p');
      const text = document.createElement('p');
      const dayAndDate = document.createElement('div');
      const weather = document.createElement('div');
      const textInfoAndDate = document.createElement('div');
      const card = document.createElement('div');

      const icon = dailyWeatherForecast.day.condition.icon;
      tempUnits = localStorage.getItem("units") ? localStorage.getItem("units") : 'c';
      
      day.innerText = getDayFromDate(dailyWeatherForecast.date);
      date.innerText = dailyWeatherForecast.date.split('-').reverse().slice(0, 2).join('.');
      text.innerText = dailyWeatherForecast.day.condition.text;

      maxTemp.innerText = `${dailyWeatherForecast.day[`maxtemp_${tempUnits}`]}°`;
      minTemp.innerText = `\\${dailyWeatherForecast.day[`mintemp_${tempUnits}`]}°`;
      maxTemp.classList.add('max-temp');
      minTemp.classList.add('min-temp');
      dailyTemp.classList.add('daily-temp');
      card.classList.add('daily-forecast-card');
      dayAndDate.classList.add('day-and-date');
      weather.classList.add('weather');
      textInfoAndDate.classList.add('text-info-and-date');
      img.src = icon;
      img.width = 64;
      img.height = 64;

      dailyTemp.append(maxTemp, minTemp);
      weather.append(img, dailyTemp);
      dayAndDate.append(date, day);
      textInfoAndDate.append(text, dayAndDate)
      card.append(weather, textInfoAndDate);

      card.addEventListener('click', (e) => {
        mainInfo.innerText = '';
        renderTodayWeather(dailyWeatherForecast);
      });

      return card
    }

    function renderTodayWeather(dailyWeatherForecast) {
      weatherDayData = dailyWeatherForecast;
      todayWeather.innerText = '';
      locationInfo.innerText = '';
      mainInfo.innerText = '';

      const img = document.createElement('img');
      const maxTemp = document.createElement('span');
      const minTemp = document.createElement('span');
      const dailyTemp = document.createElement('p');
      const weatherInformation = document.createElement('div');
      const weather = document.createElement('div');
      const day = document.createElement('p');
      const date = document.createElement('p');
      const dayAndDate = document.createElement('div');
      const oneDayWeatherInfo = document.createElement('div');
      tempUnits = localStorage.getItem("units") ? localStorage.getItem("units") : 'c';
      
      const dailyChanceOfPrecipitation = dailyWeatherForecast.day.daily_chance_of_rain > dailyWeatherForecast.day.daily_chance_of_snow
        ? dailyWeatherForecast.day.daily_chance_of_rain
        : dailyWeatherForecast.day.daily_chance_of_snow;

      const icon = time >= 21 || time <= 6
        ? dailyWeatherForecast.day.condition.icon.split('day').join('night')
        : dailyWeatherForecast.day.condition.icon;

      const probabilityOfPrecipitation = createTextValueMap('Probability of precipitation: ', `${dailyChanceOfPrecipitation}%`);
      const humidity = createTextValueMap('Humidity: ', `${dailyWeatherForecast.day.avghumidity}%`);
      const precipitation = createTextValueMap('Precipitation: ',
        `${dailyWeatherForecast.day[`totalprecip_${tempUnits === 'c' ? 'mm' : 'in'}`]} ${tempUnits === 'c' ? 'mm' : 'in'}`
      );
      const sunrise = createTextValueMap('Sunrise: ', tempUnits === 'c'
        ? convert12to24(dailyWeatherForecast.astro.sunrise)
        : dailyWeatherForecast.astro.sunrise);
      const sunset = createTextValueMap('Sunset: ', tempUnits === 'c'
        ? convert12to24(dailyWeatherForecast.astro.sunset)
        : dailyWeatherForecast.astro.sunset);

      day.innerText = `${getDayFromDate(dailyWeatherForecast.date)},`;
      date.innerText = dailyWeatherForecast.date.split('-').reverse().slice(0, 2).join('.');

      const location = `${weatherData.location.name}, ${weatherData.location.country}`
      locationP.innerText = location;

      maxTemp.innerText = `${dailyWeatherForecast.day[`maxtemp_${tempUnits}`]}°`;
      minTemp.innerText = `\\${dailyWeatherForecast.day[`mintemp_${tempUnits}`]}°`;
      maxTemp.classList.add('max-temp');
      minTemp.classList.add('min-temp');
      dailyTemp.classList.add('daily-temp');
      weatherInformation.classList.add('weather-information');
      weather.classList.add('weather');
      img.src = icon;
      img.width = 64;
      img.height = 64;

      dailyTemp.append(maxTemp, minTemp);
      weather.append(img, dailyTemp);
      weatherInformation.append(probabilityOfPrecipitation, humidity, precipitation, sunrise, sunset);
      todayWeather.append(weather, weatherInformation);
      dayAndDate.append(day, date);
      locationInfo.append(locationP, dayAndDate);
      oneDayWeatherInfo.append(locationInfo, todayWeather);
      mainInfo.append(oneDayWeatherInfo);
      main.append(mainInfo, weatherForecast);
    }
  }

  async function fetchWeatherAndTime(city) {
    const [weatherData, currentTime] = await Promise.all([
      await fetchWeatherData(city),
      await fetchCurrentTime(city)
    ]);
    return { weatherData, currentTime };
  }
  
  async function fetchCurrentTime(location) {
    return fetch(`https://timezone.abstractapi.com/v1/current_time/?api_key=1d6b91f429bd49b39941825dbcde93a4&location=${location}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error during data retrieval');
        }
      })
      .then(responseTime => responseTime.datetime.split(' ')[1].slice(0, 2))
      .catch((error) => {
        console.error(error);
        return 10;
      })  
  }

  async function fetchWeatherData(city) {
    if (!city) {
      return '';
    }
    const requestBody = {
      locations: [
        {
          q: city,
        },
      ],
    };
    
    const requestBodyString = JSON.stringify(requestBody);
    
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&days=3&q=bulk`;
    
    const options = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBodyString, 
    };
    
    
    return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error during data retrieval');
      }
    })
    .then((data) => {
      if (Object.keys(data.bulk[0].query).length > 2) {
        return data.bulk[0].query;
      } else {
        throw new Error('City not found');
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  }
}

function createTextValueMap(text, value) {
  const p = document.createElement('p');
  const span = document.createElement('span');
  p.classList.add('text-item');
  span.classList.add('value');
  p.innerText = text;
  span.innerText = value;
  p.append(span);
  return p;
}

function convert12to24(time12) {
  const [time, meridiem] = time12.split(' ');
  const [hoursStr, minutesStr] = time.split(':');

  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (meridiem === 'PM' && hours !== 12) {
    return `${hours + 12}:${minutes.toString().padStart(2, '0')}`;
  }

  if (meridiem === 'AM' && hours === 12) {
    return `00:${minutes.toString().padStart(2, '0')}`;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getDayFromDate(date) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const newDate = new Date(date);
  return dayNames[newDate.getDay()]; 
}

function temperatureSorting(arrayForSort) {
  const array = [...arrayForSort]
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j].day.maxtemp_f < array[j + 1].day.maxtemp_f) {
        [array[j + 1], array[j]] = [array[j], array[j + 1]];
      }
    }
  }

  return array;
}

weatherForecast();