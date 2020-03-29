import React from 'react';
import './weather-row.css'
import {WeatherCardSmall} from '../weather-card-small/weather-card-small'
import {WeatherDataService} from '../../services/WeatherDataSerive'

export class WeatherRow extends React.Component {

  weatherDataService = new WeatherDataService()

  constructor(props){
    super(props);
  }

  render(){

    if(this.props.entries.length === 0){
      return(
        <div>
          No data found! :(
        </div>
      )

    }else{
      const days = Object.values(this.props.entries).map(d => 
        <WeatherCardSmall 
          key={d.day+d.iconName+d.time}
          time={d.time}
          day={d.day}
          high={d.high}
          low={d.low}
          iconName={d.iconName}
          onClick={() => this.props.onDayCardClick(d.day, d.date)}
        />
      )

      return(
        <div>
          {days}
        </div>
      )
    }
  }
}
