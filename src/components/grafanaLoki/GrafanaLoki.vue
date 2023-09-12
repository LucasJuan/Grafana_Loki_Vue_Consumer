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

    // Use uma função async separada para realizar a solicitação à API
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

    // Chame a função fetchData no início do setup
    // async function handleClick() {
    //   console.log("Before API request");

    //   // Espere pela resposta antes de prosseguir
    //   await fetchData();

    //   console.log("After API request");
    // }
    async function handleClick() {
      logMessage.value = "Loading..."; // Defina uma mensagem enquanto a solicitação está em andamento
      const title = await fetchData();
      logMessage.value = title;
    }

    return {
      logMessage,
      handleClick
    };
  },
};
</script>
