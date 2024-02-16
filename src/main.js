import { x3DDashboardUtils } from "./lib/widget";
import Vue from "vue";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store";

function start() {
    x3DDashboardUtils.disableCSS(true);

    window.title = "Weather";
    widget.setTitle(window.title);
    widget.setIcon("https://btcc.s3-eu-west-1.amazonaws.com/FL7/UM5Modules/assets/icons/custom-widget-icon.png");

    store.dispatch("retrievePreferences", widget);

    const mainComponent = new Vue({
        store,
        vuetify,
        render: h => h(App)
    });

    mainComponent.$mount("app");
}
/**
 * Entry point for both standalone & 3DDashboard modes
 * Assuming widget object has been loaded through widget-starter module
 */
export default function() {
    widget.addEvent("onLoad", () => {
        start();
    });
    widget.addEvent("onRefresh", () => {
        store.dispatch("retrievePreferences", widget);
    });
}
