cube(`content_zones`, {
  sql: `
        select
            sid as zone_sid
            ,"parentVenueSid" as venue_sid
            ,"defaultName" as zone_name
            ,"parentZoneSid" as parent_zone_sid
            ,"zoneType" as zone_type
            ,"zoneListOrder" as zone_list_order
            ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as zone_status
            ,concat('https://app.smartify.org/venues/',"prettyId") as zone_url
            ,case when image#>>'{"s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image#>>'{"s3Uri"}', 'media(.*)')) else null end as zone_image
            ,'Zones' as zone_string
        from content.hosts
        where type = 'zone'
        `,
  dataSource: 'smartify-postgres',
  measures: {
    total_zones: {
      type: 'count'
    },
    published_zones: {
      type: 'count',
      filters: [{ sql: `${CUBE}.zone_status = '✅ published'` }],
    }
  },
  dimensions: {
    venue_sid: {
      type: 'string',
      sql: 'venue_sid',
      shown: false
    },
    zone_sid: {
      type: 'string',
      sql: 'zone_sid',
      primaryKey: true,  // Add this line to define primary key
      shown: true
    },
    zone_name: {
      type: 'string',
      sql: 'zone_name'
    },
    zone_string: {
      type: 'string',
      sql: 'zone_string'
    },
    parent_zone_sid: {
      type: 'string',
      sql: 'parent_zone_sid'
    },
    zone_type: {
      type: 'string',
      sql: 'zone_type'
    },
    zone_list_order: {
      type: 'string',
      sql: 'zone_list_order'
    },
    zone_status: {
      type: 'string',
      sql: 'zone_status'
    },
    zone_url: {
      type: 'string',
      sql: 'zone_url'
    },
    zone_image: {
      type: 'string',
      sql: 'zone_image'
    }
  },
  joins: {
    content_host: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_host}.venue_sid`
    }
  }
});