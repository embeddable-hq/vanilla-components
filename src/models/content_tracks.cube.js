cube(`content_track`, {
  sql: `
        SELECT
            concat(sid,media_lang) as track_sid_locale
            ,sid as track_sid
            ,"defaultTitle" as track_id_name
            ,"orgSid" as organization_sid
            ,replace(replace(replace(replace(replace(replace(replace("aggregateDisplayedOn"::text, "orgSid", ''), '"", ', ''), ', ""', ''),'", "', ','),'"',''),'[',''),']','') as venue_id
            ,case when images#>>'{0,"s3Uri"}' is null then null else concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(images#>>'{0,"s3Uri"}', 'media(.*)')) end as track_image_url
            ,replace(replace(replace(replace(replace(replace("aggregateCategories"::text, '"", ', ''), ', ""', ''),'", "', ','),'"',''),'[',''),']','') as track_object_category
            ,media_lang AS track_locale
            ,media_properties->>'mimeType' AS media_type
            ,CAST(media_properties->>'durationSecs' AS INT) AS duration_sec
        FROM content.tracks
        CROSS JOIN LATERAL (SELECT key AS media_lang, value AS media_properties FROM jsonb_each(content.tracks.media)) AS media_info;
    `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    track_sid_locale: {
      type: 'string',
      sql: `track_sid_locale`
    },
    track_sid: {
      type: 'string',
      sql: `track_sid`
    },
    track_locale: {
      type: 'string',
      sql: `track_locale`
    },
    media_type: {
      type: 'string',
      sql: `media_type`
    },
    duration_sec: {
      type: 'string',
      sql: `duration_sec`
    },
    track_name: {
      type: 'string',
      sql: 'track_id_name'
    },
    track_image: {
      type: 'string',
      sql: 'track_image_url'
    },
    track_object_category: {
      type: 'string',
      sql: 'track_object_category'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_id'
    },
    organisation_sid: {
      type: 'string',
      sql: 'organization_sid'
    }
  }
});