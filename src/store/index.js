import Vue from "vue";
import Vuex from "vuex";
import tuc from "temp-units-conv";
import moment from "moment";

Vue.use(Vuex);
const APP_ID = "'Open Weather' token";
const PREFERRED_UNIT_NAME = "Preferred Unit";
const WEATHER_LOCATION_QUERY = "Weather Location";

// init store
export const store = new Vuex.Store({
    state: {
        appId: "",
        preferredUnit: "",
        weatherLocation: "",
        forecasts: []
    },
    getters: {
        formattedForecasts: state => {
            return state.forecasts.map(f => ({
                day: f.day,
                icon: f.icon,
                temp: parseInt(state.preferredUnit === "celsius" ? tuc.k2c(f.temp) : tuc.k2f(f.temp))
            }));
        }
    },
    mutations: {
        setPreferences(state, preferences) {
            Object.keys(preferences).forEach(prefKey => (state[prefKey] = preferences[prefKey]));
        },
        setForecasts(state, forecasts) {
            state.forecasts = forecasts;
        }
    },
    actions: {
        retrievePreferences(context, widget) {
            if (!widget.getPreference(PREFERRED_UNIT_NAME)) {
                widget.addPreference({
                    name: PREFERRED_UNIT_NAME,
                    type: "list",
                    options: [
                        { value: "celsius", label: "Celsius" },
                        { value: "fahrenheit", label: "Fahrenheit" }
                    ],
                    defaultValue: "celsius"
                });
            }
            if (!widget.getPreference(WEATHER_LOCATION_QUERY)) {
                widget.addPreference({
                    name: WEATHER_LOCATION_QUERY,
                    type: "text",
                    defaultValue: "Paris"
                });
            }
            if (!widget.getPreference(APP_ID)) {
                widget.addPreference({
                    name: APP_ID,
                    type: "text",
                    defaultValue: ""
                });
            }

            context.commit("setPreferences", {
                appId: widget.getValue(APP_ID),
                preferredUnit: widget.getValue(PREFERRED_UNIT_NAME),
                weatherLocation: widget.getValue(WEATHER_LOCATION_QUERY)
            });

            context.dispatch("GET_FORECASTS");
        },
        GET_FORECASTS(context) {
            const getIconFromApi = forecast => {
                const defaultValue = "mdi-weather-partly-cloudy";
                if (!forecast.weather || !forecast.weather[0]) {
                    return defaultValue;
                }
                const forcastWeatherId = forecast.weather[0].id;
                if (forcastWeatherId >= 200 && forcastWeatherId < 300) {
                    return "mdi-weather-lightning";
                } else if (forcastWeatherId >= 300 && forcastWeatherId < 500) {
                    return "mdi-weather-pouring";
                } else if (forcastWeatherId >= 500 && forcastWeatherId < 600) {
                    return "mdi-weather-pouring";
                } else if (forcastWeatherId >= 600 && forcastWeatherId < 700) {
                    return "mdi-weather-snowy-heavy";
                } else if (forcastWeatherId >= 700 && forcastWeatherId < 800) {
                    return "mdi-weather-fog";
                } else if (forcastWeatherId === 800) {
                    return "mdi-weather-sunny";
                } else if (forcastWeatherId >= 801) {
                    return "mdi-weather-partly-cloudy";
                }
                return defaultValue;
            };

            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${context.state.weatherLocation}&appid=${context.state.appId}`)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    const forecasts = [];
                    const dateOfReference = data.list[0].dt_txt;
                    for (let i = 0; i < 5; i++) {
                        const forecast = data.list.find(
                            x =>
                                x.dt_txt ===
                                moment(dateOfReference)
                                    .add(i, "days")
                                    .format("YYYY-MM-DD HH:mm:ss")
                        );
                        forecasts.push({
                            day: moment(forecast.dt_txt).format("ddd"),
                            temp: parseInt(forecast.main.temp),
                            icon: getIconFromApi(forecast)
                        });
                    }
                    context.commit("setForecasts", forecasts);
                });
        }
    }
});
