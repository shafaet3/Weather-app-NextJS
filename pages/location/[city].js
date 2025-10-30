// pages/location/[city].js
import React from "react";
import cities from "../../lib/city.list.json";
import Head from "next/head";
import Link from "next/link";
import TodaysWeather from "../../components/TodaysWeather";
import SearchBox from "../../components/SearchBox";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from "../../components/WeeklyWeather";
import tzlookup from "tz-lookup";

export async function getServerSideProps(context) {
  try {
    const city = getCity(context.params.city);
    if (!city) return { notFound: true };

    // Dynamically get timezone from lat/lon
    const timezone = tzlookup(city.coord.lat, city.coord.lon);

    // Fetch current and forecast data
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric`
      ),
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (!currentData || !forecastData || !forecastData.list) {
      console.error("Incomplete weather data:", { currentData, forecastData });
      return { notFound: true };
    }

    // Extract hourly (next 8 entries ~ 24 hours) and weekly (daily intervals)
    const hourlyWeather = forecastData.list.slice(0, 8);
    const weeklyWeather = forecastData.list.filter((_, i) => i % 8 === 0);

    return {
      props: {
        city,
        timezone,
        currentWeather: currentData,
        hourlyWeather,
        weeklyWeather,
      },
    };
  } catch (err) {
    console.error("Server error:", err);
    return { notFound: true };
  }
}

// Helper to get city object from slug
const getCity = (params) => {
  const cityParams = params.trim();
  const splitCity = cityParams.split("-");
  const id = splitCity[splitCity.length - 1];
  if (!id) return null;
  return cities.find((c) => c.id.toString() === id) || null;
};

function City({
  city,
  currentWeather,
  hourlyWeather,
  weeklyWeather,
  timezone,
}) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather - NextJS Weather App</title>
      </Head>

      <div className="page-wrapper">
        <div className="container">
          <Link href="/" className="back-link">
            &larr; Home
          </Link>

          <SearchBox placeholder="Search for another location..." />

          <TodaysWeather
            city={city}
            weather={{
              temp: {
                max: currentWeather.main.temp_max,
                min: currentWeather.main.temp_min,
              },
              weather: currentWeather.weather,
              sunrise: currentWeather.sys.sunrise,
              sunset: currentWeather.sys.sunset,
            }}
            timezone={timezone}
          />

          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />

          <WeeklyWeather weeklyWeather={weeklyWeather}
            timezone={timezone}
            sunrise={currentWeather.sys.sunrise}
            sunset={currentWeather.sys.sunset} />
        </div>
      </div>
    </div>
  );
}

export default City;
