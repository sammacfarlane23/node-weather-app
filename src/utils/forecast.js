const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=0e6f6f00fcb0b0647626730ee4254a54&query=${longitude},${latitude}`;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Unable to connect to weather service!");
    } else if (body.error) {
      callback("Unable to find location");
    } else {
      const { temperature, feelslike, weather_descriptions } = body.current;
      callback(
        undefined,
        `${weather_descriptions[0]}. The temperature is ${temperature} celsius but it feels like ${feelslike} celsius.`
      );
    }
  });
};

module.exports = forecast;
