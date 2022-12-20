import React, { useState, useEffect } from "react";
import { useAxios } from "./hooks/useAxios";
//icons
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";

import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
} from "react-icons/bs";

import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const App = () => {
  const apiFormatter = (usrInput = "Santa Ana, SV") => {
    let newRequest = `https://api.openweathermap.org/data/2.5/weather?q=${usrInput}&units=metric&appid=${API_KEY}`;
    return newRequest;
  };

  const [urlRequest, setUrlRequest] = useState(apiFormatter);
  const [formText, setFormText] = useState("");
  const [errAnimation, setErrAnimation] = useState(false);
  //timeout used on form animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrAnimation(false);
    }, 900);
    return () => clearTimeout(timeout);
  }, [errAnimation]);
  //fetching data with useAxios custom hook
  const { data,errorAnimationTimer, loaded, error } = useAxios(urlRequest, "get");
  //form submit handler fn
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formText) {
      setUrlRequest(apiFormatter(formText));
      //remove text from input
      setFormText("");
    } else {
      //error on the usr input
      setErrAnimation(true);
    }
  };

  const handleChange = (e) => setFormText(e.target.value);
  
  // set icon according to weather
  let icon;
  if(loaded){
    switch (data.weather[0].main) {
      case "Clouds":
        icon = <IoMdCloudy />;
        break;
      case "Haze":
        icon = <BsCloudHaze2Fill />;
        break;
      case "Rain":
        icon = <IoMdRainy />;
        break;
      case "Clear":
        icon = <IoMdSunny />;
        break;
      case "Drizzle":
        icon = <BsCloudDrizzleFill />;
        break;
      case "Snow":
        icon = <IoMdSnow />;
        break;
      case "Thunder":
        icon = <IoMdThunderstorm />;
        break;
      default:
        icon = <IoMdCloudy />;
    }
    
  }
  //date obj
  const date = new Date();
  return (
    <div
      className="w-full min-h-screen max-h-fit py-2 bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0 lg:py-4"
      id="root"
    >
      {errorAnimationTimer && (
        <div className="w-full h-max-w-[90vw] text-center bg-rose-600 text-white absolute z-10 top-2 lg:top-10 p-4 capitalize rounded-md">
          {error.message}
        </div>
      )}
      {/* input form */}
      <form
        onSubmit={handleSubmit}
        className={`${
          errAnimation ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-2 lg:mb-8`}
      >
        <div className="h-full relative flex items-center justify-between p-2">
          <input
            value={formText}
            onChange={(e) => {
              handleChange(e);
            }}
            className="flex-1 relative bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full"
            type="text"
            placeholder="Search by city || country"
          />
          <button
            type="submit"
            className="bg-cyan-400/50 absolute right-2 w-14 h-12 rounded-full flex justify-center items-center transition hover:bg-cyan-700"
          >
            <IoMdSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>
      {/* Card */}
      {loaded ?  <div className="w-full max-w-[450px] min-h-[585px] bg-black/20 text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
          {/* Card Top */}
          <div className="flex items-center gap-x-5">
            <div className="text-[87px]">{icon}</div>
            <div>
              <div className="text-2xl font-semibold">
                {data.name}, {data.sys.country}
              </div>
              <div>
                {date.getUTCDate()}/{date.getUTCMonth() + 1}/
                {date.getUTCFullYear()}
              </div>
            </div>
          </div>
          {/* Card Body */}
          <div className="my-20">
            <div className="flex justify-center items-center">
              <div className="text-[144px] leading-none font-light">
                {parseInt(data.main.temp)}
              </div>
              <div className="text-6xl">
                <TbTemperatureCelsius />
              </div>
            </div>
            <div className="capitalize text-center text-xl">
              {data.weather[0].description}
            </div>
          </div>
          {/* Card Bottom */}
          <div className="max-w-[375px] mx-auto flex flex-col gap-y-4 md:gap-y-6">
            <div className="flex justify-between items-center flex-col gap-y-4 md:flex-row">
              <div className="flex items-center gap-x-2">
                <div className="text-[20px]">
                  <BsEye />
                </div>
                <div>
                  Visibility
                  <span className="ml-2">{data.visibility / 1000}Km</span>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="text-[20px]">
                  <BsThermometer />
                </div>
                <div className="flex">
                  Feels like
                  <div className="flex ml-2">
                    {parseInt(data.main.feels_like)}
                    <div>
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-y-4 md:flex-row">
              <div className="flex items-center gap-x-2">
                <div className="text-[20px]">
                  <BsWater />
                </div>
                <div>
                  Humidity
                  <span className="ml-2">{data.main.humidity} %</span>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="text-[20px]">
                  <BsWind />
                </div>
                <div>
                  Wind
                  <span className="ml-2">{data.wind.speed}m/s</span>
                </div>
              </div>
            </div>
          </div>
      </div> :  <div>
          <ImSpinner8 className="text-8xl animate-spin text-white" />
        </div>}
     
    </div>
  );
};

export default App;
