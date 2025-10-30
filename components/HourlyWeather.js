import moment from "moment-timezone";
import React from "react";
import Image from "next/image";

function HourlyWeather({ hourlyWeather, timezone }) {
  if (!hourlyWeather || hourlyWeather.length === 0) return null;

  return (
    <div className="hourly">
      <div className="hourly__inner">
        {hourlyWeather.map((weather, index) => {
          const temp =
            weather?.main?.temp ??
            weather?.temp ??
            weather?.main?.feels_like ??
            0;

          return (
            <div className="hourly__box-wrapper" key={weather.dt}>
              <div className="hourly__box">
                <span
                  className={`hourly__time ${
                    index === 0 ? "hourly__time--now" : ""
                  }`}
                >
                  {index === 0
                    ? "Now"
                    : moment.unix(weather.dt).tz(timezone).format("LT")}
                </span>

                <Image
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || "Weather icon"}
                  width={80}
                  height={80}
                />

                <span>{Math.round(temp)}&deg;C</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyWeather;
