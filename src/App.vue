<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span style="color:green">GEO</span>
        <span class="font-weight-light">GAME</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav">
        <SelectTeam v-if="TheTeam === 'none' || TheTeam === 'all'"></SelectTeam>
        <EnterCode></EnterCode>
      </div>
    </v-app-bar>
    <v-content>
      <TheMap />
    </v-content>
  </v-app>
</template>

<script>
import TheMap from "@/components/TheMap.vue";
import EnterCode from "@/components/EnterCode.vue";
import SelectTeam from "@/components/Dialogs/SelectTeam.vue";
export default {
  name: "App",
  components: {
    TheMap,
    EnterCode,
    SelectTeam
  },
  data: () => ({
    //
  }),
  computed: {
    TheTeam() {
      return this.$store.getters.getTeam;
    }
  },
  methods: {
    enterKey() {
      console.log("enterKey");
    }
  }
};
</script>
