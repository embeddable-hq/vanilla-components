function hashCode(obj) {
  var str = JSON.stringify(obj || {})
  var hash = 0,
    i = 0,
    len = str.length
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0
  }
  return Math.abs(hash)
}

module.exports = {
  contextToAppId: ({ securityContext }) => {
    return `CUBE_APP_${hashCode(securityContext)}`
  },

  scheduledRefreshContexts: () => [
    {
      securityContext: {
        // see:
        // https://cube.dev/docs/reference/configuration/config#scheduled_refresh_contexts
      },
    },
  ],

  /**
   * A queryRewrite that is used to add "global" filter  (where x.a=b) to query based on the security context.
   * It is used to filter the data based on the companyId.
   */
  queryRewrite: (query, { securityContext }) => {
    // const securityContext = props.securityContext || { companyId: 95 }
    if (securityContext && securityContext.companyId) {
      query.filters.push({
        member: 'company.id',
        operator: 'equals',
        values: [securityContext.companyId],
      })
    } else {
      console.error('Security Context is missing companyId!')
    }
    return query
  },
}
