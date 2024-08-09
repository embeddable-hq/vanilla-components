cube(`content_zones`, {
  sql: `
    WITH org_data AS (
        SELECT
            h1.sid AS org_sid
            ,h1.type
            ,jsonb_array_elements_text(h1."childHostSids") AS venue_sid
        FROM content.hosts h1
        WHERE h1.type = 'organisation'
    ),
    venue_data AS (
        SELECT
            h2.sid AS venue_sid
            ,h2."defaultName" AS venue_name
            ,case when h2."publishedAt" is null then 'unpublished' else 'published' end as venue_status
            ,jsonb_array_elements_text(h2."childHostSids") AS zone_sid
        FROM content.hosts h2
        WHERE h2.type = 'venue'
    )
    SELECT
        org_data.type as host_type
        ,org_data.org_sid as organisation_sid
        ,venue_data.venue_sid as venue_sid
        ,venue_data.zone_sid as zone_sid
        ,zones."defaultName" as zone_name
        ,zones."parentVenueSid" as parent_venue_sid
        ,zones."parentZoneSid" as parent_zone_sid
        ,zones."zoneType" as zone_type
        ,zones."zoneListOrder" as zone_list_order
        ,case when zones."publishedAt" is null then '❌ unpublished' else '✅ published' end as zone_status
        ,concat('https://app.smartify.org/venues/',zones."prettyId") as zone_url
        ,case when image#>>'{"s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image#>>'{"s3Uri"}', 'media(.*)')) else null end as zone_image
        ,'Zones' as zone_string
    FROM org_data
    JOIN venue_data ON org_data.venue_sid = venue_data.venue_sid
    join content.hosts as zones on venue_data.zone_sid = zones.sid
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
    host_type: {
      type: 'string',
      sql: `host_type`
    },
    organisation_sid: {
      type: 'string',
      sql: `organisation_sid`
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid'
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
    parent_venue_sid: {
      type: 'string',
      sql: 'parent_venue_sid'
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
    content_venue: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue}.venue_sid`
    },
    content_venue_detail: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue_detail}.venue_sid`
    }
  }
});