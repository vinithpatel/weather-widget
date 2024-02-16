<template>
    <v-app style="background-color: #fff;">
        <v-content>
            <v-container v-if="formattedForecasts.length > 0" class="fill-height py-0">
                <div class="main-weather">
                    <div>
                        <span class="main-weather-text">{{ formattedForecasts[0].temp }}°</span>
                        <span class="main-weather-icon">
                            <v-icon class="main-weather-icon">{{ formattedForecasts[0].icon }}</v-icon>
                        </span>
                    </div>
                    <div class="main-weather-subtitle-wrapper">
                        <span class="text-center main-weather-subtitle"> <v-icon>mdi-map-marker</v-icon> {{ weatherLocation }} </span>
                    </div>
                </div>
                <v-row style="margin-top: -10px;">
                    <forecast-day v-for="(forecast, index) in formattedForecasts.filter((f, i) => i >= 1)" :key="'i-' + index" :forecast="forecast" />
                </v-row>
            </v-container>
            <v-container v-else class="fill-height justify-center" fluid>
                <v-alert text outlined color="deep-orange">
                    One or more user preference is empty.
                    <br />
                    Make sure to fill them in preferences.
                </v-alert>
            </v-container>
        </v-content>
    </v-app>
</template>

<style>
html {
    overflow-y: hidden !important;
}
</style>

<style scoped>
@font-face {
    font-family: "NewsCycle Regular";
    src: url("../static/fonts/NewsCycle-Regular.ttf");
}

@font-face {
    font-family: "NewsCycle Bold";
    src: url("../static/fonts/NewsCycle-Bold.ttf");
}

.main-weather {
    width: 100%;
    text-align: center !important;
}

.main-weather-text {
    font-family: "NewsCycle Regular";
    font-weight: bold;
    font-size: 80px;
}

.main-weather-icon i {
    font-size: 90px !important;
    color: #368ec4 !important;
    margin-top: -60px;
}

.main-weather-subtitle-wrapper .main-weather-subtitle {
    font-family: "Roboto";
    color: grey;
    font-size: 26px;
}
</style>

<script>
import ForecastDay from "./ForecastDay.vue";
import { mapState, mapGetters } from "vuex";

export default {
    name: "App",
    components: {
        ForecastDay
    },
    computed: {
        ...mapGetters(["formattedForecasts"]),
        ...mapState(["weatherLocation"])
    },
    mounted() {
        this.$store.dispatch("GET_FORECASTS");
    }
};
</script>
