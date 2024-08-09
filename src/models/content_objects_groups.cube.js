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
    total_obj_groups: {
      type: 'count'
    },
    published_obj_groups: {
      type: 'count',
      filters: [{ sql: `${CUBE}.art_status = '✅ published'` }],
    }
  },
  dimensions: {
    art_sid: {
      type: 'string',
      sql: `art_sid`,
      primaryKey: true,
      shown: true
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
      sql: 'venue_sid',
      shown: false
    },
    organisation_sid: {
      type: 'string',
      sql: 'organisation_sid',
      shown: false
    }
  },
  joins: {
    content_organisation: {
      relationship: 'many_to_one',
      sql: `${CUBE}.organisation_sid = ${content_organisation}.org_sid`
    },
    content_venue: {
      relationship: 'many_to_one',
      sql: `${CUBE}.venue_sid = ${content_venue}.venue_sid`
    }
  }
});
