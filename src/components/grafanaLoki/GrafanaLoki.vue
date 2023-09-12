<template>
  <div class="greetings">
    <div>
      <button @click="handleClick">Call the API</button>
      <div>Log Message: {{ logMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import lokiAxios from "../../helpers/axios/axiosConfig";

export default {
  setup() {
    const logMessage = ref(null);

    async function fetchData() {
      try {
        const response = await lokiAxios.get(
          "https://jsonplaceholder.typicode.com/posts/1"
        );
        logMessage.value = response.data.title;
      } catch (error) {
        logMessage.value = "Error occurred";
      }
    }

    async function handleClick() {
      console.log("Before API request");

      await fetchData();

      console.log("After API request");
    }

    return {
      logMessage,
      handleClick
    };
  },
};
</script>