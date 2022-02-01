<template>
  <div class="home">
    <h1 class="text-primary text-center"><strong>Bing Qi Link</strong></h1>
    <h4 class="text-center"><strong>URL Shortener</strong></h4>
    <div class="container" style="max-width: 800px">
      <div class="card mt-4">
        <div class="card-body text-center">
          <form action="" @submit.prevent="shorten(link)">
            <h4 class="mt-3">
              <strong>Paste the URL to be shortened</strong>
            </h4>
            <div class="row justify-content-center">
              <div class="col-md-10">
                <div class="input-group mt-3">
                  <input
                    type="url"
                    v-model="input.url"
                    class="form-control"
                    placeholder="Enter the link here"
                    required
                  />
                  <button class="btn btn-primary" v-if="!hashed">
                    Shorten URL
                  </button>
                  <button
                    class="btn btn-light text-primary"
                    style="border: 1px solid #0b5ed7"
                    v-if="hashed"
                  >
                    Shortened
                  </button>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row mt-3 justify-content-center">
                <div class="col-md-10">
                  <div class="alert alert-primary" v-if="hashed">
                    <span>Result : </span>
                    <a
                      class="text-black mx-2"
                      style="text-decoration: none"
                      ><strong
                        >http://localhost:8080/key/{{ hashed }}</strong
                      ></a
                    >
                  </div>
                </div>
                <div class="col-md-4 mb-2">
                  <a class="btn btn-primary btn-sm" v-if="hashed" :href="'key/' + hashed">Go to Link</a>
                </div>
              </div>
            </div>
          </form>

          <p class="mt-1">
            Bing Qi Link is a free tool to shorten a URL or reduce a link <br />
            Use our URL Shortener to create a shortened link making it easy to
            remember
          </p>
        </div>
      </div>
    </div>
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
