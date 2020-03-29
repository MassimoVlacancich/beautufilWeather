import React from 'react';
import './App.css';
import {WeatherRow} from './components/weather-row/weather-row'
import {WeatherDetailsCard} from './components/weather-details-card/weather-details-card'
import {WeatherDataService} from './services/WeatherDataSerive'

export default class App extends React.Component {

  weatherDataService = new WeatherDataService()

  constructor(props){
    super(props)

    this.state = {
      // user location
      coords: {},
      // week data
      isLoaded: false,
      weekForecast: {},
      forecastDetails: {},
      isTodayDetails: true  // by default show the today's card
    }

    this.weatherDataFound = this.weatherDataFound.bind(this)
    this.weatherDataNotFound = this.weatherDataNotFound.bind(this)
    this.dayCardClicked = this.dayCardClicked.bind(this)
  }

  componentDidMount() {

    // TODO alternative call back by city ID
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        coords: position.coords
      })
      this.weatherDataService.getFiveDaysForecastByCoords(
        position.coords,
        this.weatherDataFound,
        this.weatherDataNotFound
      )
    })
  }

  weatherDataFound(data) {
    this.setState({
      isLoaded: true,
      weekForecast: data,
      
      // display today's forecast details
      forecastDetails: Object.values(data)[0]
    });
  }

  weatherDataNotFound() {
    this.setState({
      isLoaded: true
    })
  }

  dayCardClicked(dayName, date){

    this.setState({
      isTodayDetails: this.isToday(date),
      forecastDetails: this.state.weekForecast[dayName]
    })
  }
  
  isToday(someDate) {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }


  render(){

    if(this.state.isLoaded){

      return(
        <div className="">
          <div className="row justify-content-center">
            <WeatherRow 
              key="weekForecast"
              entries={this.state.weekForecast}
              onDayCardClick={this.dayCardClicked}
            />
          </div>
          <div className="row justify-content-center">
            <WeatherDetailsCard
              coords={this.state.coords}
              isToday={this.state.isTodayDetails}
              forecastDetails={this.state.forecastDetails}
            />
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