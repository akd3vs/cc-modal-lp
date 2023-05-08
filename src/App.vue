<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: { RouterView }
})
</script>

<template>
  <nav class="nav-main">
    <img
      src="https://loanpro.simnang.com/client/app/img/lp-logo-white.png"
      alt=""
      class="nav-main-logo"
    />
    <p class="nav-main-tenant">Modal</p>
    <ul class="menu-h ml-auto">
      <li><a href="/">Home</a></li>
      <li class="has-submenu">
        <span>Store</span>
        <ul class="menu-v submenu">
          <li><a href="/store/products">Products</a></li>
        </ul>
      </li>
    </ul>
  </nav>
  <main class="ly-container my-2">
    <RouterView />
  </main>
</template>
