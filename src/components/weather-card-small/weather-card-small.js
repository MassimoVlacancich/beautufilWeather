import React from 'react';
import './weather-card-small.css'
import {convertIconFromOW} from '../../services/UtilsService'

export function WeatherCardSmall(props) {

  const useOWIcons = false;

  return (
    <div onClick={props.onClick} className="card text-center weather-card">
      
      {props.day &&
        <div className="row justify-content-center weather-day">
          {props.day}
        </div>
      }

      {props.time != null &&
        <a className="weather-time">
          {props.time}
        </a>
      }

      {useOWIcons &&
        <div className="row justify-content-center">
          <img alt={props.iconName} src={'http://openweathermap.org/img/wn/'+ props.iconName + '.png'} />
        </div>
      }

      {!useOWIcons &&
        <div className="row justify-content-center">
          <img className="custom-icon" alt={props.iconName} src={'icons/animated/' + convertIconFromOW(props.iconName) + '.svg'} />
        </div>
      }
    
      <div className="row justify-content-center">
        <div>
          <div className="temp-high medium-grey">
            <span>{props.high}</span>°
          </div>
        </div>
        <div>
          <div className="temp-low low-grey">
            <span>{props.low}</span>°
          </div>
        </div>
      </div>

    </div>
  );
}