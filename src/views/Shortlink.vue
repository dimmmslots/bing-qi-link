<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 v-if="redirected">
            Anda sedang diarahkan ke halaman yang anda tuju...
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { colRef } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { reactive, ref } from "vue";
export default {
  setup() {
    const route = useRoute();
    const redirected = ref(false);

    let hash = route.params.hash;

    const redirect = () => {
      onSnapshot(colRef, async (snapshot) => {
        let res = [];
        // users = [];
        // await links.splice(0, links.length);
        snapshot.docs.forEach(async (doc) => {
          await res.push({ ...doc.data(), id: doc.id });
        });
        // console.log(res);
        res.forEach((link) => {
          if (link.hash == hash) {
            redirected.value = true;
            window.location.replace(link.url);
          }
        });
      });
    };
    redirect();

    return { redirected };
  },
};
</script>
