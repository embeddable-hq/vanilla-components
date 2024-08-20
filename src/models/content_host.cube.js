cube(`content_host`, {
  sql: `
      select
          sid as venue_sid
          ,"orgSid" as organisation_sid
          ,concat("orgSid",'-',sid) as host_join_sid
      from content.hosts
      where type = 'venue'
      union all
      select
          'null' as venue_sid
          ,sid as org_sid
          ,concat(sid,'-','null') as host_join_sid
      from content.hosts
      where type = 'organisation'
      `,
  dataSource: 'smartify-postgres',
  measures: {
    total_hosts: {
      type: 'count'
    }
  },
  dimensions: {
    organisation_sid: {
      type: 'string',
      sql: `org_sid`,
      shown: false
    },
    host_join_sid: {
      type: 'string',
      sql: 'host_join_sid',
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid',
      shown: false
    }
  },
  joins: {
    content_venue: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue}.venue_sid`
    },
    content_organisation: {
      relationship: 'many_to_one',
      sql: `${CUBE}.organisation_sid = ${content_organisation}.organisation_sid`
    },
    content_venue_detail: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue_detail}.venue_sid`
    }
  }
});
