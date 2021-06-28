<template>
  <apexchart
    width="500"
    type="bar"
    :options="options"
    :series="series"
  ></apexchart>
</template>
<script>
export default {
  props: {
    accounts: [],
  },
  data: function() {
    var transactions = [].concat.apply(
      [],
      this.accounts.map((account) =>
        Object.keys(account.transactions).map(
          (i) => account.transactions[Number(i)]
        )
      )
    );
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    const years = transactions
      .map((t) => t.date.getFullYear())
      .filter(onlyUnique)
      .sort((a, b) => a - b);
    const datap = [];
    const datan = [];
    for (var index in years) {
      var year = years[index];
      datap[index] = transactions
        .filter((t) => t.date.getFullYear() == year && t.paid && t.value > 0)
        .map((t) => t.value)
        .reduce((a, b) => a + b);
      try {
        datan[index] = transactions
          .filter((t) => t.date.getFullYear() == year && t.paid && t.value < 0)
          .map((t) => t.value)
          .reduce((a, b) => a + b);
      } catch (ex) {
        console.log(ex);
        datan[index] = 0;
      }
    }
    return {
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: years,
        },
      },
      series: [
        {
          name: "series-1",
          data: datap,
        },
        {
          name: "series-2",
          data: datan,
        },
      ],
    };
  },
};
</script>
