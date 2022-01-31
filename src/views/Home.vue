<template>
  <div class="home">
    <form action="" @submit.prevent="shorten(link)">
      <label for="" class="form-label">Link : </label>
      <input type="text" v-model="link" class="form-control" />
      <a :href="'key/' + hashed"  v-if="hashed" class="btn btn-success">Go to link</a>
      <button class="btn btn-primary" v-if="!hashed">Shorten</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src

import { ref } from "vue";
export default {
  name: "Home",
  setup() {
    let link = ref("");
    let hashed = ref("")

    const shorten = async (link) => {
      var sha1 = require('sha-1');
      hashed.value = await sha1(link);
      hashed.value = await hashed.value.substring(0,6)
    };

    return { link, shorten, hashed };
  },
};
</script>
