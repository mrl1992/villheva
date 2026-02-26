<template>
  <v-app-bar :elevation="0" class="app-bar-custom">
    <template v-slot:prepend>
      <NuxtLink to="/">
        <div class="brand">
          <img src="/logo.png" alt="Villheva" class="logo" />
        </div>
      </NuxtLink>
    </template>

    <div class="nav-links-centered">
      <NuxtLink to="/products" class="nav-link">Produkter</NuxtLink>
      <NuxtLink to="/gallery" class="nav-link">Galleri</NuxtLink>
      <NuxtLink to="/about" class="nav-link">Om oss</NuxtLink>
    </div>

    <v-menu class="mobile-nav" location="bottom end" offset="8">
      <template #activator="{ props }">
        <v-btn icon class="mobile-menu-btn" v-bind="props">
          <v-icon color="earth">mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <NuxtLink to="/products" class="nav-link">Produkter</NuxtLink>
        </v-list-item>
        <v-list-item>
          <NuxtLink to="/gallery" class="nav-link">Galleri</NuxtLink>
        </v-list-item>
        <v-list-item>
          <NuxtLink to="/about" class="nav-link">Om oss</NuxtLink>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon class="mr-6 cart-button" @click="openCart">
      <v-badge
        v-if="cartStore.cartCount > 0"
        location="top right"
        color="seafoam"
        :content="cartStore.cartCount"
      >
        <v-icon color="earth"> mdi-cart </v-icon>
      </v-badge>
      <v-icon v-else color="earth"> mdi-cart </v-icon>
    </v-btn>

    <CartOverlay ref="cartOverlay" />
  </v-app-bar>
</template>

<script setup lang="ts">
  const cartStore = useCartStore();
  const cartOverlay = ref();

  const openCart = () => {
    cartOverlay.value?.openCart();
  };
</script>

<style scoped>
  .app-bar-custom {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50 !important;
    background-color: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(186, 185, 167, 0.3) !important;
  }

  .logo {
    height: auto;
    max-height: 60px;
    width: 30px;
    margin: 0;
    display: block;
  }

  .logo-text {
    height: 1000px;
    width: 200px;
    margin: 0;
    padding: 0;
    display: block;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 12px;
  }

  .brand-name {
    font-family: "Bree Serif", serif !important;
    font-size: 1.5rem !important;
    color: #4d4738 !important;
    font-style: italic !important;
    white-space: nowrap;
    text-decoration: none;
  }

  .nav-links-centered {
    position: absolute;
    display: flex;
    gap: 2rem;
    align-items: center;
    left: 50%;
    transform: translateX(-50%);
  }

  .mobile-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: none;
  }

  @media (max-width: 960px) {
    .nav-links-centered {
      display: none;
    }

    .mobile-nav {
      display: inline-flex;
    }

    .mobile-menu-btn {
      display: inline-flex;
    }

    .logo {
      height: 34px;
    }

    .brand {
      padding-left: 8px;
      gap: 0.4rem;
    }

    .brand-name {
      font-size: 1.25rem !important;
    }

    .cart-button {
      margin-right: 8px !important;
    }
  }

  .nav-link {
    text-decoration: none;
    color: #4d4738;
    font-weight: 500;
    transition: color 0.2s;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #8c7e64;
  }
</style>
