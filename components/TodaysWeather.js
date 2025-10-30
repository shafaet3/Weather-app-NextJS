import moment from "moment-timezone";
import React from "react";
import Image from "next/image";

function TodaysWeather({ city, weather, timezone }) {
  // Handle sunrise/sunset safely
  const sunrise =
    weather.sys && weather.sys.sunrise
      ? weather.sys.sunrise
      : weather.sunrise || null;

  const sunset =
    weather.sys && weather.sys.sunset
      ? weather.sys.sunset
      : weather.sunset || null;

  const tempMax = weather.main?.temp_max || weather.temp?.max;
  const tempMin = weather.main?.temp_min || weather.temp?.min;

  return (
    <div className="today">
      <div className="today__inner">
        <div className="today__left-content">
          <h1>
            {city.name} ({city.country})
          </h1>
          <h2>
            <span>{tempMax?.toFixed(0)}&deg;C</span>
            <span>{tempMin?.toFixed(0)}&deg;C</span>
          </h2>

          <div className="today__sun-times">
            <div>
              <span>Sunrise</span>
              <span>
                {sunrise
                  ? moment.unix(sunrise).tz(timezone).format("LT")
                  : "--"}
              </span>
            </div>

            <div>
              <span>Sunset</span>
              <span>
                {sunset
                  ? moment.unix(sunset).tz(timezone).format("LT")
                  : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="today__right-content">
        <div className="today__icon-wrapper">
          <div className="relative w-[100px] h-[100px]">
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              fill
              sizes="100px"
              className="object-contain"
            />
          </div>
        </div>
        <h3 className="capitalize">{weather.weather[0].description}</h3>
      </div>
    </div>
  );
}

export default TodaysWeather;
