<template>
  <div class="home">
    <h1 class="text-primary text-center"><strong><i class="fas fa-ice-cream"></i> Bing Qi Link</strong></h1>
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
                    <i class="fas fa-link"></i> Shorten
                  </button>
                  <button
                    class="btn btn-light text-primary"
                    style="border: 1px solid #0b5ed7"
                    v-if="hashed"
                  >
                   <i class="fas fa-check"></i> Shortened
                  </button>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row mt-3 justify-content-center">
                <div class="col-md-10">
                  <div
                    class="alert alert-light"
                    style="border: 1px solid #0b5ed7"
                    v-if="hashed"
                  >
                    <div class="row justify-content-center align-items-center">
                      <div class="col-md-2">
                        <span>Result : </span>
                      </div>
                      <div class="col-md-6">
                        <span
                          class="text-black"
                          style="text-decoration: none"
                          id="copy"
                          ><strong class="fs-18"
                            >https://bing-qi-link.vercel.app/key/{{ hashed }}</strong
                          ></span
                        >
                      </div>
                      <div class="col-md-3">
                        <button
                          class="btn btn-primary btn-sm mx-1"
                          id="btn-copy"
                          data-clipboard-target="#copy"
                        >
                          <i class="fas fa-copy"></i>
                        </button>
                        <a
                          class="btn btn-primary btn-sm"
                          v-if="hashed"
                          :href="'key/' + hashed"
                          >Go!</a>
                      </div>
                    </div>
                  </div>
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
    <Footer />
  </div>
  <!-- <h1>{{ counter }} Kali</h1>
  <button @click="counter++">Klik</button> -->
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
import { reactive, ref } from "vue";
import { addDoc, onSnapshot } from "firebase/firestore";
import { colRef, db } from "../firebase";
import ClipboardJS from "clipboard";
export default {
  name: "Home",
  components: { Footer },
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
    new ClipboardJS("#btn-copy");
    // let counter = ref(0);
    return { shorten, hashed, input };
  },
};
</script>
