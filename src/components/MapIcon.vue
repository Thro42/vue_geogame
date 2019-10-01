<template>
  <div>
    <div v-if="cache.found">
      <found_blue v-if="cache.found_by === 'blue'" :size="size"></found_blue>
      <found_red v-if="cache.found_by === 'red'" :size="size"></found_red>
    </div>
    <div v-if="!cache.found && (cache.schow_for === team || team === 'all') ">
      <pin_cache v-if="!cache.is_final" :size="size"></pin_cache>
      <shatz v-if="cache.is_final" :size="size"></shatz>
    </div>
  </div>
</template>
<script>
import pin_cache from "./Pins/PinCache.vue";
import shatz from "./Pins/Schatz.vue";
import found_blue from "./Pins/FoundBlue.vue";
import found_red from "./Pins/FoundRed.vue";
export default {
  name: "mapicon",
  props: ["size", "cache", "team"],
  components: {
    pin_cache,
    shatz,
    found_blue,
    found_red
  }
};
</script>