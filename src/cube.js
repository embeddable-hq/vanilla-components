function hashCode(obj) {
  var str = JSON.stringify(obj || {});
  var hash = 0, i = 0, len = str.length;
  while ( i < len ) {
      hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return Math.abs(hash);
}

module.exports = {

  contextToAppId: ({ securityContext }) => {
    return `CUBE_APP_${hashCode(securityContext)}`;
  },

  scheduledRefreshContexts: () => [
    {
      securityContext: {
        // see:
        // https://cube.dev/docs/reference/configuration/config#scheduled_refresh_contexts
      }
    }
  ]
};