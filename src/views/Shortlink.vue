<template>
  <div>
    <h1 v-if="redirected">
      Anda sedang diarahkan ke halaman yang anda tuju...
    </h1>
    <div class="" v-if="!redirected">
      <h1>Mercusuar Page</h1>
      <p>Link yang anda tuju tidak tersedia didalam server kami.</p>
      <router-link to="/">Kembali ke shortlink</router-link>
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
