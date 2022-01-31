<template>
  <div>
    <h1>Halaman Bitly</h1>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();

    const redirect = () => {
      let hash = route.params.hash
      // http://localhost:8080
      fetch("http://localhost:3000/link")
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          json.forEach((element) => {
            if (element.hash == hash) {
              return window.location.replace(element.url);
            }
          });
        })
        .catch(function () {
          this.dataError = true;
        });
    };
    redirect();
  },
};
</script>
