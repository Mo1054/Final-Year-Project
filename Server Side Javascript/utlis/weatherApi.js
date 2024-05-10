const { default: axios } = require("axios");

const getWeather = async (req) => {
  if (!req.session.user) {
    return null;
  }
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.session.user?.country}&appid=1793a8f2cca49ce71a9982c24665848d`
    );

    return {
      icon: data.weather[0].icon,
      temp: (data.main.temp - 273.15).toFixed(2),
    };
  } catch (err) {
    console.log(err.response.data);
  }
};

module.exports = getWeather;
