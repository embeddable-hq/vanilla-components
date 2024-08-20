cube(`content_object`, {
  sql: `
        SELECT
            sid as art_sid
            ,versions#>>'{0, "defaultTitle"}' as art_name
            ,case when versions#>>'{0, "publishedAt"}' is null then '❌ unpublished' else '✅ published' end as art_status
            ,versions#>>'{0, "category"}' as art_category
            ,concat('https://app.smartify.org/objects/', "prettyId") as art_url
            ,concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(versions#>>'{0, "images", 0, "s3Uri"}', 'media(.*)')) as art_image_url
            ,'Objects' as object_string
            ,artists#>>'{0, "sid"}' as artist_sid
            ,concat(versions#>>'{0,"orgSid"}','-',COALESCE(coalesce(versions#>>'{0,"scraperData", "hostSid"}',versions#>>'{0, "locatedAt"}'), 'NULL')) as host_join_sid
            --Not imported fields
            ,coalesce(versions#>>'{0,"scraperData", "hostSid"}',versions#>>'{0, "locatedAt"}') as venue_sid
            ,versions#>>'{0,"orgSid"}' as organization_sid
        FROM content.objects
      `,
  dataSource: 'smartify-postgres',
  measures: {
    total_objects: {
      type: 'count',
    },
    published_objects: {
      type: 'count',
      filters: [{ sql: `${CUBE}.art_status = '✅ published'` }],
    }
  },
  dimensions: {
    art_sid: {
      type: 'string',
      sql: `art_sid`,
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
    },
    art_name: {
      type: 'string',
      sql: `art_name`
    },
    art_status: {
      type: 'string',
      sql: 'art_status'
    },
    art_string: {
      type: 'string',
      sql: 'object_string'
    },
    art_category: {
      type: 'string',
      sql: 'art_category'
    },
    art_image: {
      type: 'string',
      sql: 'art_image_url'
    },
    art_url: {
      type: 'string',
      sql: 'art_url'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid',
      shown: false
    },
    organisation_sid: {
      type: 'string',
      sql: 'organization_sid',
      shown: false
    },
    artist_sid: {
      type: 'string',
      sql: 'artist_sid',
      shown: false  // Hide this dimension from the user interface if necessary
    },
    host_join_sid: {
      type: 'string',
      sql: 'host_join_sid',
      shown: false
    }
  },
  joins: {
    content_artist: {
      relationship: 'many_to_one',
      sql: `${CUBE}.artist_sid = ${content_artist}.sid`
    },
    content_host: {
      relationship: 'many_to_one',
      sql: `${CUBE}.host_join_sid = ${content_host}.host_join_sid`
    }
  }
});