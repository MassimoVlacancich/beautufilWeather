import React from 'react';
import './weather-details-card.css'
import {WeatherRow} from '../weather-row/weather-row'
import {Tabs,Tab} from 'react-bootstrap';
import {WeatherDataService} from '../../services/WeatherDataSerive'
import {convertIconFromOW} from '../../services/UtilsService'

export class WeatherDetailsCard extends React.Component {

  // TODO check: is it okay to have multiple services instances?
  weatherDataService = new WeatherDataService()

  dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  liveDataRefreshRate = 600000 // 10 minutes

  constructor(props){
    super(props)

    // TODO move day details data loading

    this.state = {
      isLoaded: false,
      weather: {},
      mainInfo: {},
      wind: {}
    }

    this.foundWeatherDetails = this.foundWeatherDetails.bind(this)
    this.weatherDetailsNotFound = this.weatherDetailsNotFound.bind(this)
  }

  componentDidMount() {
    if(this.props.isToday){
      this.weatherDataService.getTodayForecastDetaisl(
        this.foundWeatherDetails,
        this.weatherDetailsNotFound
      )
      this.interval = setInterval(() => this.refreshLiveData(), this.liveDataRefreshRate);
    }else{
      this.setState({
        isLoaded: true
      })
    }
    
  }
  
  componentWillUnmount() {
    if(this.props.isToday){
      clearInterval(this.interval);
    }
  }


  refreshLiveData() {
    console.log('Refreshing live data')
    this.weatherDataService.getTodayForecastDetaisl(
      this.foundWeatherDetails,
      this.weatherDetailsNotFound
    )
  }

  foundWeatherDetails(data){
    console.log('New data')
    console.log(data)
    this.setState({
      isLoaded: true,
      weather: data.weather[0], // main, description, icon, id
      mainInfo: data.main,      // feels_like, humidity, pressure, temp, temp_max, temp_min
      wind: data.wind
    })
  }

  weatherDetailsNotFound(){

  }

  render(){

    const date = this.props.forecastDetails.date.toLocaleDateString("en-UK", this.dateOptions)
    const hourlyForecast = this.props.forecastDetails.hourly
    const onHourClick = () => console.log('Clicked hourly current day forecast')
    var weatherMain
    var weatherDescription
    var weatherIcon
    var highTemp
    var lowTemp
    var updateTime

    // custom sections
    var tabs

    // create variables depending on day
    if(this.props.isToday) {
      weatherMain = this.state.weather.main
      weatherDescription = this.state.weather.description
      weatherIcon = 'icons/static/' + convertIconFromOW(this.state.weather.icon) + '.svg'
      highTemp = Math.round((this.state.mainInfo.temp_max - 273.15) * 100) / 100 // Kelvin to Celsius
      lowTemp =  Math.round((this.state.mainInfo.temp_min - 273.15) * 100) / 100
      updateTime = <div><span className="dot"></span> live forecast (updated every 10 minutes)</div>
    
      // unique to live weather
      var currentTemp = Math.round(this.state.mainInfo.temp - 273.15)
      var feelsLike = Math.round(this.state.mainInfo.feels_like - 273.15)

      tabs = (
        <Tabs defaultActiveKey="hourly" id="uncontrolled-tab-day-details">
          <Tab eventKey="hourly" title="Hourly" className="tab">
            <div className="row">
              <WeatherRow
                key="currentDayForecastByHour"
                entries={hourlyForecast}
                onDayCardClick={onHourClick}
              />
            </div>
          </Tab>
          <Tab eventKey="details" title="Details" className="tab">
            <div className="row details">

              <div className="col-md-6 temp-details">
                {/* TODO change feel like to be an icon with tshirt, jumper etc */}
                {/* current icons from https://www.iconfinder.com/iconsets/the-weather-is-nice-today */}
                
                <p>Current Temperature: {currentTemp}°</p>

                <p>Feels Like: {feelsLike}°</p>

                <p>Pressure: {this.state.mainInfo.pressure} hPa </p>

                <p>Humidity: {this.state.mainInfo.humidity} %</p>

              </div>

              <div className="col">
                Wind:
                <p>Speed: {this.state.wind.speed} meters/sec</p>
                
                <p>Angle: {this.state.wind.deg} degrees</p>
              </div>

            </div>
          </Tab>
        </Tabs>
      )


    }else{
      weatherMain = this.props.forecastDetails.main
      weatherDescription = this.props.forecastDetails.description
      highTemp = this.props.forecastDetails.high
      lowTemp = this.props.forecastDetails.low
      weatherIcon = 'icons/static/' + convertIconFromOW(this.props.forecastDetails.iconName) + '.svg'
      updateTime = '24h forecast'

      tabs = (
        <Tabs defaultActiveKey="hourly" id="uncontrolled-tab-day-details" className="tab">
          <Tab eventKey="hourly" title="Hourly">
            <div className="row">
              <WeatherRow
                key="currentDayForecastByHour"
                entries={hourlyForecast}
                onDayCardClick={onHourClick}
              />
            </div>
          </Tab>
        </Tabs>
      )

    }


    if(this.state.isLoaded){

      return(
        <div className="card details-card">
          <div className="card-body">

            <div className="row">
              <div className="col-md-5">
                <p>{date}</p>
                <h1>{weatherMain}</h1>
                <h3>{weatherDescription}</h3>
                <i className="live">{updateTime}</i>
              </div>
              <div className="col-md-3 temperatures">
                <table>
                  <tbody>
                    <tr>
                      <td class="align-middle high-low">
                        <p className="medium-grey high-temp">
                          <span><img alt="h" src="icons/static/high.png"/></span>
                          {highTemp}°
                        </p>
                        <p className="low-grey low-temp">
                          <span><img alt="h" src="icons/static/low.png"/></span>
                          {lowTemp}°
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-4">
              <img className="weather-icon" alt="current_weather" src={weatherIcon} />
              </div>
            </div>
            
            {tabs}

          </div>
        </div>
      )
    }else{
      return(
        <div>
          Loading...
        </div>
      )
    }
    
  }


}

  