<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 v-if="redirected">
            Anda sedang diarahkan ke halaman yang anda tuju...
          </h1>
          <div v-if="notFound">
            <h1>:(</h1>
            <h4>Alamat <code>http://localhost:8080/key/{{ hash }}</code> tidak terdaftar di server kami.</h4>
            <router-link to="/" class="btn btn-sm btn-primary"><i class="fas fa-arrow-left"></i> Kembali</router-link>
          </div>
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
    const notFound = ref(false);

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
        if (await !redirected.value) {
          notFound.value = true;
        }
      });
    };
    redirect();

    return { redirected, hash, notFound };
  },
};
</script>
