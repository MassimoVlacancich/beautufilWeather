const iconsMap = {

  // day
  '01d': 'day',
  '02d': 'cloudy-day-1',
  '03d': 'cloudy-day-2',
  '04d': 'cloudy',
  '09d': 'rainy-6',
  '10d': 'rainy-3',
  '11d': 'thunder',
  '13d': 'snowy-5',
  '50d': 'fog',
  
  // night
  '01n': 'night',
  '02n': 'cloudy-night-1',
  '03n': 'cloudy-night-2',
  '04n': 'cloudy',
  '09n': 'rainy-6',
  '10n': 'rainy-3',
  '11n': 'thunder',
  '13n': 'snowy-5',
  '50n': 'fog'
}

export function convertIconFromOW(iconNameOpenWeather){
  return iconsMap[iconNameOpenWeather]
}