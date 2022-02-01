<template>
  <div class="home">
    <form action="" @submit.prevent="shorten(link)">
      <label for="" class="form-label">Link : </label>
      <input type="url" v-model="input.url" class="form-control" />
      <div class=""  v-if="hashed" >
        <span class="mx-2">Link : </span>
        <a :href="'key/' + hashed" class="text-decoration-underline"
          >http://localhost:8080/key/{{ hashed }}</a
        >
      </div>
      <button class="btn btn-primary my-2" v-if="!hashed" >Shorten</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src

import { reactive, ref } from "vue";
import { addDoc, onSnapshot } from "firebase/firestore";
import { colRef, db } from "../firebase";
export default {
  name: "Home",
  setup() {
    let hashed = ref("");
    let input = reactive({
      hash: "",
      url: "",
    });
    let sameHashCounter = ref(0);

    const shorten = async (link) => {
      var sha1 = require("sha-1");
      hashed.value = await sha1(input.url);
      hashed.value = await hashed.value.substring(0, 6);
      input.hash = await hashed.value;

      await onSnapshot(colRef, async (snapshot) => {
        let res = [];
        // users = [];
        // await links.splice(0, links.length);
        snapshot.docs.forEach(async (doc) => {
          await res.push({ ...doc.data(), id: doc.id });
        });

        res.forEach(async (link) => {
          if (link.hash == hashed.value) {
            await sameHashCounter.value++;
          }
        });
        console.log(await sameHashCounter.value);
        if ((await sameHashCounter.value) == 0) {
          createDoc();
        }
      });
    };

    const createDoc = async () => {
      if (input.name !== "" && input.job !== "") {
        // await users.splice(0, users.length);
        await addDoc(colRef, {
          hash: input.hash,
          url: input.url,
        });
      }
    };

    return { shorten, hashed, input };
  },
};
</script>
