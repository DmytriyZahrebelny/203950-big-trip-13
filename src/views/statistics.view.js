import SmartView from './smart.view';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {createStatisticsTemplate} from './templates/statistics-templates';

const renderMoneyChart = (moneyCtx, offers, points) => {
  const money = offers.map((type) => {
    return points.reduce((acc, point) => type === point.type.toUpperCase() ? point.basePrice : acc, 0);
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: offers,
      datasets: [{
        data: money,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, offers, points) => {
  const countTypes = offers.map((type) => {
    return points.reduce((acc, point) => type === point.type.toUpperCase() ? acc + 1 : acc, 0);
  });

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: offers,
      datasets: [{
        data: countTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export default class Statistics extends SmartView {
  constructor(points, offers) {
    super();

    this.data = {
      points,
      offers: offers.map(({type}) => type.toUpperCase())
    };

    this._moneyChart = null;
    this._typeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._moneyChart || this._typeChart) {
      this._moneyChart = null;
      this._typeChart = null;
    }

    const BAR_HEIGHT = 55;

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    moneyCtx.height = BAR_HEIGHT * 9;
    typeCtx.height = BAR_HEIGHT * 9;

    const {offers, points} = this.data;
    this._moneyChart = renderMoneyChart(moneyCtx, offers, points);
    this._typeChart = renderTypeChart(typeCtx, offers, points);
  }
}
