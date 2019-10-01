<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    @load="onMapLoaded"
    :center="centerpos"
    :minZoom="minZoom"
    :zoom="zoom"
    :repaint="rePaint"
  >
    <MglNavigationControl position="top-right" />
    <MglGeolocateControl
      position="top-right"
      :trackUserLocation="true"
      :showUserLocation="true"
      :positionOptions="positionOptions"
    />
    <MglMarker :coordinates="centerpos">
      <v-icon v-if="false" slot="marker" color="blue darken-2">mdi-navigation</v-icon>
      <navigation v-else :size="32" :angle="markerBearing" slot="marker"></navigation>
      <MglPopup>
        <VCard class="mx-auto">
          <v-card-title>
            <v-icon large leftcolor="blue darken-2">mdi-navigation</v-icon>
            <span class="title font-weight-light">Your Position</span>
          </v-card-title>
          <v-card-text>Thats you</v-card-text>
        </VCard>
      </MglPopup>
    </MglMarker>
    <div v-for="cache in cacheList" v-bind:key="cache.header">
      <MglMarker v-if="cache.visible" :coordinates="cache.coordinates">
        <mapicon :size="40" :cache="cache" :team="theTeam" slot="marker"></mapicon>
        <MglPopup v-if="!cache.found" @added="popupAdded">
          <VCard max-width="350" class="mx-auto">
            <v-card-title>
              <mapicon :size="48" :cache="cache" :team="theTeam" slot="marker"></mapicon>
              <span class="title font-weight-light">{{cache.header}}</span>
            </v-card-title>
            <v-card-text>{{cache.description}}</v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="indigo"
                v-on:click.native="foundCache(cache.id)"
              >
                <v-icon dark>mdi-checkbox-marked-circle-outline</v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="indigo" v-on:click.native="closePopUp()">
                <v-icon dark>mdi-close-circle-outline</v-icon>
              </v-btn>
            </v-card-actions>
          </VCard>
        </MglPopup>
      </MglMarker>
    </div>
    <div id="currPos">{{currentPos}}</div>
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import mapicon from "./MapIcon.vue";
import navigation from "./NavigationArrow.vue";
import geo from "../utils";

import {
  MglMap,
  MglMarker,
  MglPopup,
  MglNavigationControl,
  MglGeolocateControl
} from "vue-mapbox";

export default {
  components: {
    mapicon,
    navigation,
    MglMap,
    MglMarker,
    MglPopup,
    MglNavigationControl,
    MglGeolocateControl
  },
  data() {
    return {
      positionOptions: { enableHighAccuracy: true, timeout: 15000 },
      centerpos: [7.5471869, 52.1693414],
      minZoom: 4,
      zoom: 16,
      component: null,
      asyncActions: null,
      map: null,
      popup: null,
      markerBearing: 20,
      rotateStyle: "",
      accessToken: "", // your access token. Needed if you using Mapbox maps
      mapStyle: "mapbox://styles/mapbox/streets-v11" // your map style
    };
  },
  computed: {
    cacheList() {
      var ackCaches = this.$store.getters.loadCaches;
      if (!ackCaches) {
        ackCaches = this.caches;
      }
      return ackCaches;
    },
    theTeam() {
      return this.$store.getters.getTeam;
    },
    rePaint() {
      return this.$store.getters.getRepaint;
    },
    currentPos() {
      var lat = lat;
      var lng = lng;
      var latResult, lngResult, dmsResult;

      lat = parseFloat(this.centerpos[0]);
      lng = parseFloat(this.centerpos[1]);

      latResult = lat >= 0 ? "N" : "S";
      latResult += this.getDms(lat);

      lngResult = lng >= 0 ? "E" : "W";
      lngResult += this.getDms(lng);
      const team = this.$store.getters.getTeam;
      dmsResult = team + " : " + latResult + " " + lngResult;
      console.log(dmsResult);
      return dmsResult; // this.centerpos.toString();
    }
  },
  mounted() {
    this.trackPosition();
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
  methods: {
    popupAdded(event) {
      console.log("popupAdded", event);
      this.popup = event.popup;
    },
    closePopUp() {
      if (this.popup != null) {
        this.popup.remove();
      }
    },
    foundCache(cacheId) {
      this.$store.dispatch("setFound", cacheId);
      if (this.caches != null) {
        for (var i = 0; i < this.caches.length; i++) {
          if (this.caches[i].id === cacheId) {
            this.caches[i].found = true;
            console.log("Found", this.caches[i].header);
          }
        }
      }
      if (this.popup != null) {
        this.popup.remove();
      }
    },
    async onMapLoaded(event) {
      // in component
      this.map = event.map;
      // or just to store if you want have access from other components
      this.asyncActions = event.component.actions;
      this.component = event.component;
      // Add geolocate control to the map.
    },
    async trackPosition() {
      if (navigator.geolocation) {
        console.log(navigator.geolocation);
        navigator.geolocation.watchPosition(
          this.successPosition,
          this.failurePosition,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      } else {
        alert(`Browser doesn't support Geolocation`);
      }
    },
    async successPosition(position) {
      const newPos = [position.coords.longitude, position.coords.latitude];
      this.rotateStyle = "transform: rotate(45deg);";
      this.markerBearing = geo.geo.bearing(
        this.centerpos[0],
        this.centerpos[1],
        newPos[0],
        newPos[1]
      );
      this.centerpos = newPos;
      this.caches = this.$store.getters.loadCaches;
      console.log(this.centerpos);
      if (this.asyncActions != null) {
        const newParams = await this.asyncActions.flyTo({
          center: this.centerpos,
          zoom: this.zoom,
          speed: 5
        });
        console.log(newParams);
      }
    },
    failurePosition(err) {
      console.error(
        "Error Code: " + err.code + " Error Message: " + err.message
      );
    },
    getDms(val) {
      var valDeg, valMin, valSec, result;

      val = Math.abs(val);

      valDeg = Math.floor(val);
      result = valDeg + "º";

      valMin = Math.floor((val - valDeg) * 60);
      result += valMin + "'";

      valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
      result += valSec + '"';

      return result;
    },
    cacheFound(id) {
      this.$store.dispatch("setFound", id);
    }
  }
};
</script>
<style scoped>
#currPos {
  background: #fff;
  position: absolute;
  z-index: 1;
  /*top: 100%;*/
  right: 40%;
  left: 40%;
  margin: auto;
  bottom: 10px;
  border-radius: 3px;
  width: 250px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.4);
  font-family: "Open Sans", sans-serif;
}
</style>