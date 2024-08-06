cube(`content_object_group`, {
  sql: `
          select
            sid as art_sid
            ,"orgSid" as organisation_sid
            ,"scraperData"->>'groupId' as art_id
            ,case when "publishedAt"::text<> '{}' then '✅ published' else '❌ unpublished' end as art_status
            ,"locatedAt" as venue_sid
            ,"defaultTitle" as art_name
            ,concat('https://app.smartify.org/objects/', "prettyId") as art_url
            ,concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image->>'s3Uri', 'media(.*)')) as art_image_url
        from content."objectGroups"
        `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    art_sid: {
      type: 'string',
      sql: `art_sid`
    },
    art_name: {
      type: 'string',
      sql: `art_name`
    },
    art_status: {
      type: 'string',
      sql: 'art_status'
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
      sql: 'venue_sid'
    },
    organisation_sid: {
      type: 'string',
      sql: 'organisation_sid'
    }
  }
});
