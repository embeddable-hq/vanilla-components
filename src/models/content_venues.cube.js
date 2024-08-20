cube(`content_venue`, {
  sql: `
      select
          sid as venue_sid
          ,"defaultName" as venue_name
          ,"orgSid" as organisation_sid
          ,concat("orgSid",'-',sid) as host_join_sid
          ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as venue_status
          ,concat('https://app.smartify.org/venues/',"prettyId") as venue_url
          ,'Venues' as venue_string
      from content.hosts
      where type = 'venue'
      `,
  dataSource: 'smartify-postgres',
  measures: {
    total_venues: {
      type: 'count'
    },
    published_venues: {
      type: 'count',
      filters: [{ sql: `${CUBE}.venue_status = '✅ published'` }],
    },
  },
  dimensions: {
    venue_sid: {
      type: 'string',
      sql: 'venue_sid',
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
    },
    venue_id: {
      type: 'string',
      sql: 'venue_id'
    },
    venue_name: {
      type: 'string',
      sql: 'venue_name'
    },
    venue_locale: {
      type: 'string',
      sql: 'venue_locale'
    },
    venue_status: {
      type: 'string',
      sql: 'venue_status'
    },
    venue_string: {
      type: 'string',
      sql: 'venue_string'
    },
    venue_url: {
      type: 'string',
      sql: 'venue_url'
    }
  }
});
