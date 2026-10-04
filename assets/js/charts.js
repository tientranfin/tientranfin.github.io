// Vẽ biểu đồ từ thẻ {% include chart.html %}. Không cần chỉnh file này.
(function () {
  if (typeof Chart === 'undefined') return;
  var palette = ['#123A6B', '#C99A2E', '#3F8FB5', '#7A8CA8', '#2E7D6B'];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Chart.defaults.font.family = "'IBM Plex Sans', system-ui, sans-serif";
  Chart.defaults.color = '#44566F';

  document.querySelectorAll('.nk-chart').forEach(function (box) {
    var type = box.dataset.type === 'bar' ? 'bar' : 'line';
    var unit = box.dataset.unit || '';
    var labels = (box.dataset.labels || '').split(',').map(function (s) { return s.trim(); });
    var series = (box.dataset.series || '').split('|').map(function (s, i) {
      var cut = s.lastIndexOf(':');
      var name = s.slice(0, cut).trim();
      var data = s.slice(cut + 1).split(',').map(function (v) {
        v = v.trim();
        return v === '' ? null : Number(v);
      });
      var color = palette[i % palette.length];
      return {
        label: name,
        data: data,
        borderColor: color,
        backgroundColor: type === 'bar' ? color : color,
        borderWidth: type === 'bar' ? 0 : 2.5,
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderRadius: type === 'bar' ? 2 : 0
      };
    });

    new Chart(box.querySelector('canvas'), {
      type: type,
      data: { labels: labels, datasets: series },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduce ? false : { duration: 500 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: series.length > 1, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: {
            callbacks: {
              label: function (c) { return ' ' + c.dataset.label + ': ' + c.formattedValue + unit; }
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: '#E6ECF4' },
            ticks: { callback: function (v) { return v + unit; } }
          }
        }
      }
    });
  });
})();
