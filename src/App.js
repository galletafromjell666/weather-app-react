import React, { useState, useEffect} from "react";
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
  const [inputErr, setInputErr] = useState(false)
  //timeout used on form animation
  useEffect(() => {
    const timeout = setTimeout(() => {
       setErrAnimation(false);
     }, 900);
    return () => clearTimeout(timeout);
   },[inputErr]);
  //fetching data with useAxios custom hook
  const { data, error, loaded } = useAxios(urlRequest, "get");
  //form submit handler fn
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formText) {
      setUrlRequest(apiFormatter(formText));
      //remove text from input
      setFormText("");
    } else { 
      setErrAnimation(true);
      //trigger useEffect and its setTimeout
      setInputErr(!inputErr)
    }
  };

  const handleChange = (e) => setFormText(e.target.value);

  //loader
  if (!loaded) {
    return (
      <div>
        <div>
          <ImSpinner8 className="text-5xl animate-spin" />
        </div>
      </div>
    );
  }
  //error
  if (error) {
    return <div>ERROR</div>;
  }

  // set icon according to weather
  let icon;
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

  //date obj
  const date = new Date();

  return (
      <div
        className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0"
        id="root"
      >
        {/* input form */}
        <form
          onSubmit={handleSubmit}
          className={`${
            errAnimation ? "animate-shake" : "animate-none"
          } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}
        >
          <div className="h-full relative flex items-center justify-between p-2">
            <input
              value={formText}
              onChange={(e) => {
                handleChange(e);
              }}
              className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full"
              type="text"
              placeholder="Search by city || country"
            />
            <button
              type="submit"
              className="bg-cyan-400/50 w-16 h-12 rounded-full flex justify-center items-center transition hover:bg-cyan-700"
            >
              <IoMdSearch className="text-2xl text-white" />
            </button>
          </div>
        </form>
        {/* Card */}
        <div className="w-full max-w-[450px] min-h-[585px] bg-black/20 text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
          <div>
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
            <div className="max-w-[375px] mx-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
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
              <div className="flex justify-between">
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
          </div>
        </div>
      </div>
  );
};

export default App;
