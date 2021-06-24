<template>
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="year in years" :key="year">
      <a
        :class="actual == year ? 'active' : ''"
        aria-current="page"
        class="nav-link"
        v-on:click="setActual(year)"
      >
        {{ year }}
      </a>
    </li>
  </ul>
</template>
<script>
function generate(now, actual) {
  const years = [];
  const yearDiff = now - actual;
  let j = 10 - yearDiff;
  if (j <= 0) {
    j = 1;
  }
  for (let i = actual - j; i <= actual; i++) {
    years.push(i);
  }
  if (actual < now) {
    for (let i = actual + 1; i <= now; i++) {
      years.push(i);
    }
  }
  return years;
}
export default {
  data() {
    return {
      actual: this.$parent.actual.year,
      now: this.$parent.now.year,
      years: [],
    };
  },
  methods: {
    setActual(year) {
      this.actual = this.$parent.actual.year = year;
      this.years = generate(this.now, this.actual);
    },
  },
  mounted() {
    this.setActual(this.now);
  },
};
</script>
<style scoped></style>
