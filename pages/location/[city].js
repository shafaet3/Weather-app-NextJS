import React from "react";
import cities from "../../lib/city.list.json";
import Head from "next/head";
import Link from "next/link";
import TodaysWeather from "../../components/TodaysWeather";
import SearchBox from "../../components/SearchBox";
import moment from "moment-timezone";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from "../../components/WeeklyWeather";

export async function getServerSideProps(context) {
  const city = getCity(context.params.city);

  // console.log(city);

  if (!city) {
    return {
      notFound: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  console.log(data);

  const slug = context.params.city;

  const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);
  const weeklyWeather = data.daily;

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      hourlyWeather: hourlyWeather,
      weeklyWeather: weeklyWeather,
    },
  };
}

const getCity = (params) => {
  const cityParams = params.trim();
  const splitCity = cityParams.split("-");
  const id = splitCity[splitCity.length - 1];

  if (!id) {
    return null;
  }

  const city = cities.find((city) => city.id.toString() == id);

  if (city) {
    return city;
  } else {
    return null;
  }
};

const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf("day").valueOf();
  const endTimeStamp = Math.floor(endOfDay / 1000);

  const todaysData = hourlyData.filter((data) => data.dt < endTimeStamp);

  return todaysData;
};

function City({
  city,
  weather,
  currentWeather,
  hourlyWeather,
  weeklyWeather,
  timezone,
}) {
  // console.log(hourlyWeather);
  return (
    <div>
      <Head>
        <title>{city.name} Weather - NextJS Weather App</title>
      </Head>

      <div className="page-wrapper">
        <div className="container">
          <Link href="/">
            <a className="back-link">&larr; Home</a>
          </Link>
          <SearchBox placeholder="Search for another location..." />
          <TodaysWeather
            city={city}
            weather={weeklyWeather[0]}
            timezone={timezone}
          />
          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />

          <WeeklyWeather weeklyWeather={weeklyWeather} timezone={timezone} />
        </div>
      </div>
    </div>
  );
}

export default City;
