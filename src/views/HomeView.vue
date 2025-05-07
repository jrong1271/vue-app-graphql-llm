<!-- filepath: /Users/joe/dev/vue/finance/src/views/HomeView.vue -->
<template>
  <div class="home">
    <h1>My Vue App</h1>

    <section>
      <h2>API Configuration</h2>
      <p>
        This application can connect to either a remote GraphQL API or a local development server.
      </p>
    </section>
  </div>
</template>

<script setup>
// No additional logic is needed for this static page
</script>

<style scoped>
.home {
  padding: 2rem;
  line-height: 1.6;
  width: 500px;
  background-color: #f9f9f9;
  border-radius: 1em;
  min-height: 400px;
}

h1,
h2,
h3 {
  color: #333;
}

code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
