<template>
  <div>
    <div class="container" style="max-width: 650px">
      <div class="card mt-4" id="card1">
        <div class="card-body">
          <div class="row text-center mt-5 mb-5">
            <div class="col-md-12" v-if="!notFound && destinationLink">
              <p v-if="countdown" style="font-size: 18px">
                <i>Please wait until the link is ready...</i>
              </p>
              <div
                v-if="countdown"
                id="circle"
                class="container rounded-circle"
              >
                <h1 id="countdown" class="mt-5">
                  {{ countdown }}
                </h1>
              </div>
              <h3 v-if="!countdown">This link is ready</h3>
              <button
                id="btn-gotolink"
                class="btn btn-lg btn-primary mt-3"
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
                <router-link to="/" id="btn-returnhome" class="btn btn-primary"
                  >Return to Home</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <!-- <img src="" class="rounded mr-2" alt="..." /> -->
      <strong class="mr-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button
        type="button"
        class="ml-2 mb-1 close"
        data-dismiss="toast"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">Hello, world! This is a toast message.</div>
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

<style>
#card1 {
  border-radius: 20px;
}
#circle {
  width: 150px;
  height: 150px;
  border: 4px solid #0b5ed7;
}
h1#countdown {
  font-size: 48px;
}
button#btn-gotolink {
  border-radius: 25px;
}
#btn-returnhome {
  border-radius: 25px;
}
</style>
