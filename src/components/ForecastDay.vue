<template>
    <v-col cols="3" class="forecast-day-col">
        <v-row>
            <v-col cols="6" class="text-right">
                <v-row>
                    <v-col cols="12" class="pa-0">
                        {{ forecast.day }}
                    </v-col>
                    <v-col cols="12" class="pa-0"> {{ forecast.temp }}°</v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-icon>{{ forecast.icon }}</v-icon>
            </v-col>
        </v-row>
    </v-col>
</template>

<style scoped>
.forecast-day-col i {
    color: #368ec4 !important;
    padding-top: 10px;
}

.forecast-day-col .col {
    padding-top: 0;
    padding-bottom: 0;
}
</style>

<script>
export default {
    name: "ForecastDay",
    props: ["forecast"]
};
</script>
