cube(`content_object`, {
  sql: `
        SELECT
            sid as art_sid
            ,versions#>>'{0, "scraperData", "artworkId"}' as art_id
            ,case when versions#>>'{0, "publishedAt"}' is null then '❌ unpublished' else '✅ published' end as art_status
            ,cast(versions#>>'{0, "publishedAt", "en-GB"}' as timestamp) as published_at
            ,cast("createdAt" as timestamp) as created_at
            ,cast("updatedAt" as timestamp) as updated_at
            ,versions#>>'{0,"scraperData", "hostSid"}' as venue_sid
            ,upper(substring(versions#>>'{0,"scraperData", "hostSid"}', '\_(.*)')) as venue_id
            ,versions#>>'{0,"orgSid"}' as organization_sid
            ,artists#>>'{0, "sid"}' as artist_sid
            ,versions#>>'{0, "defaultTitle"}' as art_default_name
            ,versions#>>'{0, "category"}' as art_category
            ,versions#>>'{0, "medium", "en-GB"}' as art_medium
            ,versions#>>'{0, "date", "en-GB"}' as art_date
            ,versions#>>'{0, "locationLabel", "en-GB"}' as art_room
            ,versions::jsonb#>>'{0, "config", "isOnView"}' as image_listed
            ,versions::jsonb#>>'{0, "images", 0, "imageState"}' as image_copyright
            ,case when tags::text LIKE '%tag_D1NtGtE683zGasBfF1OI%' then 'true' else 'false' end as image_nudity
            ,concat('https://app.smartify.org/objects/', "prettyId") as art_url
            ,concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(versions#>>'{0, "images", 0, "s3Uri"}', 'media(.*)')) as art_image_url
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
      sql: `art_default_name`
    },
    art_status: {
      type: 'string',
      sql: 'art_status'
    },
    art_category: {
      type: 'string',
      sql: 'art_category'
    },
    art_medium: {
      type: 'string',
      sql: 'art_medium'
    },
    art_date: {
      type: 'string',
      sql: 'art_date'
    },
    art_room: {
      type: 'string',
      sql: 'art_room'
    },
    image_listed: {
      type: 'string',
      sql: 'image_listed'
    },
    image_copyright: {
      type: 'string',
      sql: 'image_copyright'
    },
    image_nudity: {
      type: 'string',
      sql: 'image_nudity'
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
    }
  },
  joins: {
    content_artist: {
      relationship: 'many_to_one',
      sql: `${CUBE}.artist_sid = ${content_artist}.sid`
    },
    content_organisation: {
      relationship: 'many_to_one',
      sql: `${CUBE}.organization_sid = ${content_organisation}.org_sid`
    },
    content_venue: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue}.venue_sid`
    }
  }
});