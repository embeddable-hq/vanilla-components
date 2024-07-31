cube(`content_zones`, {
  sql: `
    WITH org_data AS (
        SELECT
            h1.sid AS org_sid
            ,h1.type
            ,h1."defaultName" AS org_name
            ,case when h1."publishedAt" is null then 'unpublished' else 'published' end as org_status
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
        ,org_data.org_name as organisation_name
        ,org_data.org_status as organisation_status
        ,venue_data.venue_sid as venue_sid
        ,venue_data.venue_name as venue_name
        ,venue_data.zone_sid as zone_sid
        ,venue_data.venue_status as venue_status
        ,zones."defaultName" as zone_name
        ,zones."parentVenueSid" as parent_venue_sid
        ,zones."parentZoneSid" as parent_zone_sid
        ,zones."zoneType" as zone_type
        ,zones."zoneListOrder" as zone_list_order
        ,case when zones."publishedAt" is null then 'unpublished' else 'published' end as zone_status
        ,concat('https://app.smartify.org/venues/',zones."prettyId") as zone_url
        ,case when image#>>'{"s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image#>>'{"s3Uri"}', 'media(.*)')) else null end as zone_image
    FROM org_data
    JOIN venue_data ON org_data.venue_sid = venue_data.venue_sid
    join content.hosts as zones on venue_data.zone_sid = zones.sid
        `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
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
    organisation_name: {
      type: 'string',
      sql: 'organisation_name'
    },
    organisation_status: {
      type: 'string',
      sql: 'organisation_status'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid'
    },
    venue_name: {
      type: 'string',
      sql: 'venue_name'
    },
    venue_status: {
      type: 'string',
      sql: 'venue_status'
    },
    zone_sid: {
      type: 'string',
      sql: 'zone_sid'
    },
    zone_name: {
      type: 'string',
      sql: 'zone_name'
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
  }
});
