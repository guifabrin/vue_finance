<template>
  <nav
    id="sidebarMenu"
    class="col-md-3 col-lg-2 d-md-block sidebar collapse"
    :class="$root.light ? 'bg-dark text-light' : 'bg-light'"
  >
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a
            class="nav-link active"
            aria-current="page"
            v-on:click="setPage('accounts')"
          >
            {{ $t("accounts.title") }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link active"
            aria-current="page"
            v-on:click="setPage('charts')"
          >
            {{ $t("charts.title") }}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                v-on:click="$root.light = !$root.light"
              />
              <label class="form-check-label" for="flexCheckDefault">
                {{ $t($root.light ? "app.light" : "app.dark") }}
              </label>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  methods: {
    setPage: function(page) {
      this.$root.page = page;
    },
  },
};
</script>
