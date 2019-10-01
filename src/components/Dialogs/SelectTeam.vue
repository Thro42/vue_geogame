<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2" fab dark small color="indigo" v-on="on">
        <v-icon dark>mdi-account-multiple-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Wähle dein Team</span>
      </v-card-title>
      <v-card-text>
        <v-radio-group v-model="the_team" column>
          <v-radio label="Team Blue" value="blue"></v-radio>
          <v-radio label="Team Red" value="red"></v-radio>
          <v-radio label="No Team" value="all"></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="enterKey">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    the_team: "none"
  }),
  methods: {
    enterKey() {
      this.dialog = false;
      this.$store.dispatch("setTeam", this.the_team);
      console.log("enterKey");
    }
  }
};
</script>