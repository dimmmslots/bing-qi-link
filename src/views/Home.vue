<template>
  <div class="home">
    <h1 class="text-primary text-center">
      <strong><i class="fas fa-ice-cream"></i> Bing Qi Link</strong>
    </h1>
    <h4 class="text-center"><strong>URL Shortener</strong></h4>
    <div class="container" id="con1">
      <div class="card mt-4" id="card1">
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
                  <button
                    class="btn btn-primary"
                    id="btn-shorten"
                    v-if="!hashed"
                  >
                    <i class="fas fa-link"></i> Shorten
                  </button>
                  <button
                    id="btn-hashed"
                    class="btn btn-light text-primary"
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
                  <div id="comp-hashed" class="alert alert-light" v-if="hashed">
                    <div class="row justify-content-center align-items-center">
                      <div class="col-md-2">
                        <span>Result : </span>
                      </div>
                      <div class="col-md-6 py-2">
                        <span class="text-black" id="copy"
                          ><i
                            >https://bql.co.vu/key/{{ hashed }}</i
                          ></span
                        >
                      </div>
                      <div class="col-md-4 py-2">
                        <button
                          class="unfocus mx-1"
                          id="btn-copy"
                          data-clipboard-target="#copy"
                          @click="toastOpen"
                        >
                          <i class="fas fa-copy"></i>
                        </button>
                        <a
                          class="btn btn-primary"
                          v-if="hashed"
                          :href="'key/' + hashed"
                          >Go to Link <i class="fas fa-arrow-right"></i
                        ></a>
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
import toast from "vue-toast-notification";
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
  methods: {
    toastOpen() {
      this.$toast.open({
        message: "Copied to clipboard",
        type: "success",
        duration: 3000,
        position: "top-right",
      });
    },
  },
};
</script>

<style>
#con1 {
  max-width: 800px;
}
button#btn-hashed {
  border: 1px solid #0b5ed7;
}
#comp-hashed {
  border: 1px solid #0b5ed7;
}
span#copy {
  text-decoration: underline;
}
.unfocus {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: #fff;
  background-color: #0d6efd;
  border:1px solid #0d6efd;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  /* transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; */
}
.unfocus:active {
  color: white;
  background-color: #08377e;
  border: 1px solid #08377e;
}
.v-toast__item {
    display: inline-flex;
    align-items: center;
    animation-duration: 150ms;
    margin: .5em .5em;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: .25em;
    pointer-events: auto;
    opacity: .92;
    color: #fff;
    min-height: 3em;
    cursor: pointer;
    padding: 0 2em;
}
.v-toast__item--success {
    background-color: #0b5ed7;
}
</style>
