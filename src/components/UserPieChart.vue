<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Pie } from "vue-chartjs";

const chartData = ref(null);

const ctx = ref(null);
const pieChart = ref(null); // Declare pieChart variable

onMounted(() => {
  renderPieChart();
});

function renderPieChart() {
  pieChart.value = new Pie(ctx.value, {
    // Assign value to pieChart
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

const setChartData = (userData) => {
  chartData.value = {
    labels: Object.keys(userData),
    datasets: [
      {
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        data: Object.values(userData),
      },
    ],
  };
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
