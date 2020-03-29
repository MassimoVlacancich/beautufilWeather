export class WeatherDataService {

  days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

  cityId = '2643743';
  appId = '137f8186025fe85b02a1a256bb1bca4b'; // TODO move to config
  herokuCors = 'https://cors-anywhere.herokuapp.com/'

  // Default URLS to London
  fiveDaysForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/forecast?id=${this.cityId}&appid=${this.appId}`;

  todayForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/weather?id=${this.cityId}&appid=${this.appId}`;


  fetchFiveDaysThreeHoursData(apiUrl){
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          var week = result.list

          week = week.map(d => {
            const date = new Date(d.dt * 1000);
            return {
              date: date,
              day: this.days[date.getDay()],
              time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              high: Math.ceil(this.kelvinToCelsius(d.main.temp_max)),
              low: Math.floor(this.kelvinToCelsius(d.main.temp_min)),
              main: d.weather[0].main,
              description: d.weather[0].description,
              iconName: d.weather[0].icon
            }
          })

          return week
        },
        (error) => {
          console.log(error)
          return null
        }
      )
  }

  fetchFiveDaysForecast(apiUrl) {
    return this.fetchFiveDaysThreeHoursData(apiUrl)
      .then(hourly => {

        // forecast by hour for each day
        const daysForecast = {}
        hourly.forEach(hourEntry => {
          if(daysForecast[hourEntry.day] !== undefined && daysForecast[hourEntry.day]['hourly']){
            // group all hour entries belonging to same day
            const dayEntries = daysForecast[hourEntry.day]['hourly'] // get currently added hours
            dayEntries.push(hourEntry) // add newly found hour forecast
            daysForecast[hourEntry.day]['hourly'] = dayEntries // update hourly forecats for day
          }else{
            daysForecast[hourEntry.day] = {}
            daysForecast[hourEntry.day]['hourly'] = [hourEntry] // create hourly forecast list
          }
        })
        

        // Forecast for each day on average across the day
        // the overall day forecast description and icon
        // should be based on the 5 central data points
        // if these are available, else the most common among all
        // high and low instead should always be an average of all
        // available data points
        for (const [dayKey, dayForecast] of Object.entries(daysForecast)) {
          
          const dayHours = dayForecast['hourly']
          
          // first find high and low temperature across all data points
          const highs = []
          const lows = []

          dayHours.forEach(hour => {
            highs.push(hour.high)
            lows.push(hour.low)
          })
          const dailyHigh = Math.max(...highs)
          const dailyLow = Math.min(...lows)

          // then, if possible, get the core day hours - 8 data points (8 * 3 = 24)
          // from these extract the main, description and icon
          const iconNames = []
          const mains_descriptions = []

          if(dayHours.length === 8) {
            const coreHours = dayHours.slice(2,7)
            coreHours.forEach(hour => {
              // ensure main and description are treated together
              mains_descriptions.push(hour.main + '-' + hour.description)
              iconNames.push(hour.iconName)
            })
          }else{
            dayHours.forEach(hour => {
              mains_descriptions.push(hour.main + '-' + hour.description)
              iconNames.push(hour.iconName)
            })
          }
          
          const dayIconName = this.mode(iconNames)
          const main_description = this.mode(mains_descriptions)
          const dayMain = main_description.split('-')[0]
          const dayDescription = main_description.split('-')[1]

          daysForecast[dayKey]['date'] = dayForecast.hourly[0].date
          daysForecast[dayKey]['day'] = dayKey
          daysForecast[dayKey]['main'] = dayMain
          daysForecast[dayKey]['description'] = dayDescription
          daysForecast[dayKey]['high'] = dailyHigh
          daysForecast[dayKey]['low'] = dailyLow
          daysForecast[dayKey]['iconName'] = dayIconName
        }

        // remove the day key-value from the hour object
        Object.values(daysForecast).forEach(day => {
          day.hourly.forEach(hour => delete hour.day)          
        })

        return daysForecast
      })
  }

  getFiveDaysForecast(apiUrl, foundCallBack, notFoundCallBack) {
    this.fetchFiveDaysForecast(apiUrl)
      .then(res => {
        if(res != null){
          foundCallBack(res)
        }else{
          notFoundCallBack()
        }
      })
  }

  getFiveDaysForecastByCityId(cityId, foundCallBack, notFoundCallBack) {
    // change the url to api and call the function
    this.fiveDaysForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${this.appId}`;

    this.getFiveDaysForecast(this.fiveDaysForecastUrl, foundCallBack, notFoundCallBack)
  }

  getFiveDaysForecastByCoords(coords, foundCallBack, notFoundCallBack) {
    // change the url to api and call the function
    this.fiveDaysForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.appId}`;
    this.getFiveDaysForecast(this.fiveDaysForecastUrl, foundCallBack, notFoundCallBack)
  }

  // TODAY FORECAST

  fetchTodayForecast(apiUrl) {
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          return result
        },
        (error) => {
          console.log(error)
          return null
        }
      )
  }

  getTodayForecastDetails(apiUrl, foundCallBack, notFoundCallBack) {
    this.fetchTodayForecast(apiUrl)
      .then(res => {
        console.log(res)
        if(res != null){
          foundCallBack(res)
        }else(
          notFoundCallBack()
        )
      })
  }

  getTodayForecastDetailsByCityId(cityId, foundCallBack, notFoundCallBack){
    this.todayForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${this.appId}`;
    this.getTodayForecastDetails(this.todayForecastUrl, foundCallBack, notFoundCallBack)
  }

  getTodayForecastDetailsByCoords(coords, foundCallBack, notFoundCallBack){
    this.todayForecastUrl = 
    `${this.herokuCors}http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.appId}`;
    this.getTodayForecastDetails(this.todayForecastUrl, foundCallBack, notFoundCallBack)
  }


  // Utils

  kelvinToCelsius(kelvinDeg){
    return kelvinDeg - 273.15
  }

  mode(array)
  {
      if(array.length === 0)
          return null;
      var modeMap = {};
      var maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++)
      {
          var el = array[i];
          if(modeMap[el] == null)
              modeMap[el] = 1;
          else
              modeMap[el]++;  
          if(modeMap[el] > maxCount)
          {
              maxEl = el;
              maxCount = modeMap[el];
          }
      }
      return maxEl;
  }

}