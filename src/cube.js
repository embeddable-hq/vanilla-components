module.exports = {

  contextToAppId: ({ securityContext }) => {
    return `CUBE_APP_${securityContext.country}`;
  },

  scheduledRefreshContexts: () => [
    {
      securityContext: {
        country: 'United States'
      }
    },
    {
      securityContext: {
        country: 'Germany'
      }
    }
  ]
};