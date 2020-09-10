var Chart = require('chart.js');
data: {
    datasets: [{
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        data: [10, 20, 30, 40, 50, 60, 70]
    }]
};
options = {
    scales: {
        xAxes: [{
            gridLines: {
                offsetGridLines: true
            }
        }]
    }
};
var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});
