export default {
  // Override css variables / styles here
  css: {
    variables: {
      // '--category-2': '#AA0000',
    },
    styles: {
      '#embeddable-main-canvas': `
        background-color: --var(category-2);
        color: #AA0000;
      `,
      div: `{ background-color: #AA00000; }`,
    },
  },
  // Override other theme properties here
  chartjs: {
    showGrid: false,
  },
  mui: {},
  amCharts: {},
  myFavChars: {},
};
