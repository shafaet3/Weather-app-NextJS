import moment from "moment-timezone";
import React from "react";
import Image from "next/image";

function WeeklyWeather({ weeklyWeather, timezone, sunrise, sunset }) {
  return (
    <div className="weekly">
      <h3 className="weekly__title">
        Weekly <span>Weather</span>
      </h3>

      {weeklyWeather && weeklyWeather.length > 0 ? (
        weeklyWeather.map((weather, index) => {
          // Skip first entry (already shown in today's weather)
          if (index === 0) return null;

          // Temperature structure — adapt to both forecast & onecall
          const tempMax = weather.main?.temp_max || weather.temp?.max || null;
          const tempMin = weather.main?.temp_min || weather.temp?.min || null;

          // Sunrise/sunset might not exist in forecast
          const sunrise =
            weather.sys && weather.sys.sunrise
              ? weather.sys.sunrise
              : weather.sunrise || null;
          const sunset =
            weather.sys && weather.sys.sunset
              ? weather.sys.sunset
              : weather.sunset || null;

          // Weather description
          const description = weather.weather?.[0]?.description || "N/A";
          const icon = weather.weather?.[0]?.icon || "01d";

          return (
            <div className="weekly__card" key={weather.dt}>
              <div className="weekly__inner">
                <div className="weekly__left-content">
                  <div>
                    <h3>
                      {moment.unix(weather.dt).tz(timezone).format("dddd")}
                    </h3>
                    <h4>
                      <span>
                        {tempMax !== null ? tempMax.toFixed(0) : "--"}&deg;C
                      </span>
                      <span>
                        {tempMin !== null ? tempMin.toFixed(0) : "--"}&deg;C
                      </span>
                    </h4>
                  </div>

                  <div className="weekly__sun-times">
                    <div>
                      <span>Sunrise</span>
                      <span>
                        {moment.unix(sunrise).tz(timezone).format("LT")}
                      </span>
                    </div>
                  </div>
                  <div className="weekly__sun-times">
                    <div>
                      <span>Sunset</span>
                      <span>
                        {moment.unix(sunset).tz(timezone).format("LT")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="weekly__right-content">
                  <div className="weekly__icon-wrapper">
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt={description}
                        fill
                        sizes="100px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h5 className="capitalize">{description}</h5>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
}

export default WeeklyWeather;
