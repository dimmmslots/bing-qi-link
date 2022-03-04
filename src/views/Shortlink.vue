<template>
  <div>
    <div class="container" style="max-width: 650px">
      <div class="card mt-4" style="border-radius: 20px">
        <div class="card-body">
          <div class="row text-center mt-5 mb-5">
            <div class="col-md-12" v-if="!notFound && destinationLink">
              <div
                v-if="countdown"
                class="container rounded-circle"
                style="width: 150px; height: 150px; border: 4px solid #0b5ed7"
              >
                <h1 class="mt-5" style="font-size: 48px">
                  {{ countdown }}
                </h1>
              </div>
              <h3>This link is ready</h3>
              <button
                class="btn btn-lg btn-primary mt-3"
                style="border-radius: 25px"
                @click="goToLink"
                :class="{ disabled: countdown }"
              >
                Continue to Site
              </button>
            </div>
            <div class="col-md-12 text-center">
              <div v-if="notFound">
                <img
                  src="https://www.svgrepo.com/show/338120/sad-emoji-emoticon.svg"
                  class="mb-3"
                />
                <br />
                <code>http://localhost:8080/key/{{ hash }}</code>
                <hr />
                <h5>
                  Maybe this link moved? Got deleted? <br />
                  Is hiding out in quarantine? <br />
                  Never existed in the first place? <br />
                  <br />
                  Let's go home and try from there.
                </h5>
                <router-link
                  to="/"
                  class="btn btn-primary"
                  style="border-radius: 20px"
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
    // const redirected = ref(false);
    const destinationLink = ref("");
    const notFound = ref(false);

    let hash = route.params.hash;

    const redirect = () => {
      onSnapshot(colRef, async (snapshot) => {
        let res = [];
        snapshot.docs.forEach(async (doc) => {
          await res.push({ ...doc.data(), id: doc.id });
        });
        res.forEach((link) => {
          if (link.hash == hash) {
            destinationLink.value = link.url;
            countdown.value = 10;
            const timer = setInterval(() => {
              console.log(`${countdown.value} seconds remaining...`);
              countdownDecrement();
              if (countdown.value == 0) {
                clearInterval(timer);
              }
            }, 1000);
          }
        });
        if (await !destinationLink.value) {
          notFound.value = true;
        }
      });
    };
    redirect();
    const goToLink = async () => {
      await window.location.replace(destinationLink.value);
    };

    // make countdown
    const countdown = ref(0);
    const countdownDecrement = () => {
      countdown.value--;
    };
    return { hash, notFound, countdown, redirect, goToLink, destinationLink };
  },
};
</script>
