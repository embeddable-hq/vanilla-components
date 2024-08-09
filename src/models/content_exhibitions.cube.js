cube(`content_exhibition`, {
  sql: `
    select
        sid as exhibition_sid
        ,"orgSid" as organisation_sid
        ,"defaultTitle" as exhibition_name
        ,"createdBy" as venue_sid
        ,cast(dates::jsonb->>'endDate' as timestamp) as end_date
        ,cast(dates::jsonb->>'startDate' as timestamp) as start_date
        ,case when "publishedAt"::text<> '{}' then '✅ published' else '❌ unpublished' end as exhibition_status
        ,case when (images#>>'{0,"s3Uri"}') is NULL then 'null' else concat('https://smartify-media.s3.eu-west-1.amazonaws.com', SUBSTRING(images#>>'{0, "s3Uri"}', 'media(.*)')) end as exhibition_image_url
    from content.exhibitions
    `,
  dataSource: 'smartify-postgres',
  measures: {
    total_exhibitions: {
      type: 'count'
    },
    published_exhibitions: {
      type: 'count',
      filters: [{ sql: `${CUBE}.exhibition_status = '✅ published'` }],
    }
  },
  dimensions: {
    exhibition_sid: {
      type: 'string',
      sql: `exhibition_sid`,
      primaryKey: true,
      shown: true
    },
    exhibition_name: {
      type: 'string',
      sql: `exhibition_name`
    },
    exhibition_status: {
      type: 'string',
      sql: 'exhibition_status'
    },
    end_date: {
      type: 'string',
      sql: 'end_date'
    },
    start_date: {
      type: 'string',
      sql: 'start_date'
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
    },
    exhibition_image: {
      type: 'string',
      sql: 'exhibition_image_url'
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
