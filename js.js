// ThingSpeak 配置
const CHANNEL_ID = 3361176;
const READ_API_KEY = "C9JIZOBNMW8UQBIK";

// 数据存储
let heartData = [];
let spo2Data = [];
let tempData = [];
let humData = [];
let labels = [];
let maxDataPoints = 40; // 最多保留40个数据点

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  initChart();
  fetchData();
  setInterval(fetchData, 20000); // 20秒刷新一次
});

// 初始化图表
function initChart() {
  const ctx = document.getElementById("c").getContext("2d");
  window.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "心率 (次/分)",
          data: heartData,
          borderColor: "#ff4444",
          backgroundColor: "rgba(255, 68, 68, 0.1)",
          fill: true,
          tension: 0.3
        },
        {
          label: "血氧 (%)",
          data: spo2Data,
          borderColor: "#00C851",
          backgroundColor: "rgba(0, 200, 81, 0.1)",
          fill: true,
          tension: 0.3
        },
        {
          label: "温度 (℃)",
          data: tempData,
          borderColor: "#33b5e5",
          backgroundColor: "rgba(51, 181, 229, 0.1)",
          fill: true,
          tension: 0.3
        },
        {
          label: "湿度 (%)",
          data: humData,
          borderColor: "#ffbb33",
          backgroundColor: "rgba(255, 187, 51, 0.1)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// 拉取ThingSpeak数据并更新页面和曲线
function fetchData() {
  const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("请求失败");
      return response.json();
    })
    .then(data => {
      // 更新文本显示
      document.getElementById("h").textContent = data.field3 || "--";
      document.getElementById("s").textContent = data.field4 || "--";
      document.getElementById("t").textContent = data.field1 || "--";
      document.getElementById("u").textContent = data.field2 || "--";

      // 更新曲线数据
      const now = new Date();
      labels.push(now.toLocaleTimeString());
      heartData.push(Number(data.field3) || 0);
      spo2Data.push(Number(data.field4) || 0);
      tempData.push(Number(data.field1) || 0);
      humData.push(Number(data.field2) || 0);

      // 限制数据点数量
      if (labels.length > maxDataPoints) {
        labels.shift();
        heartData.shift();
        spo2Data.shift();
        tempData.shift();
        humData.shift();
      }

      // 更新图表
      window.chart.update();
    })
    .catch(error => {
      console.error("拉取数据出错：", error);
    });
}
