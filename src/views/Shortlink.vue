<template>
  <div>
    <div class="container" style="max-width: 650px">
      <div class="card mt-4" style="border-radius: 20px">
        <div class="card-body">
          <div class="row text-center mt-5 mb-5">
            <div class="col-md-12" v-if="!notFound">
              <div
                v-if="countdown"
                class="container rounded-circle"
                style="width: 150px; height: 150px; border: 4px solid #0b5ed7"
              >
                <h1 class="mt-5" style="font-size: 48px">
                  {{ countdown }}
                </h1>
              </div>
              <h3 v-if="!countdown">This link is ready</h3>
              <button
                class="btn btn-lg btn-primary mt-3"
                style="border-radius: 25px"
                @click="redirect"
                :class="{ disabled: countdown }"
              >
                Continue to Site
              </button>
            </div>
            <div class="col-md-12 text-center">
              <div v-if="notFound">
                <img src="https://www.svgrepo.com/show/338120/sad-emoji-emoticon.svg" class="mb-3">
                <br>
                <code>http://localhost:8080/key/{{ hash }}</code>
                <hr>
                <h5>
                  Maybe this link moved? Got deleted? <br />
                  Is hiding out in quarantine? <br />
                  Never existed in the first place? <br />
                  <br />
                  Let's go home and try from there.
                </h5>
                <router-link to="/" class="btn btn-primary" style="border-radius: 20px"
                  >Return to Home</router-link
                >
              </div>
            </div>
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
import { computed, reactive, ref } from "vue";
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
    // redirect();

    // make countdown
    const countdown = ref(10);
    const countdownDecrement = () => {
      countdown.value--;
    };
    const timer = setInterval(() => {
      console.log(`${countdown.value} seconds remaining...`);
      countdownDecrement();
      if (countdown.value == 0) {
        clearInterval(timer);
      }
    }, 1000);
    return { redirected, hash, notFound, countdown, redirect };
  },
};
</script>
