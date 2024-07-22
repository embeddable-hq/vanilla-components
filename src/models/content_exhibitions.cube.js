cube(`content_exhibition`, {
  sql: `
    select
        sid as exhibition_sid
        ,"orgSid" as organisation_sid
        ,"defaultTitle" as exhibition_name
        ,"createdBy" as venue_sid
        ,cast(dates::jsonb->>'endDate' as timestamp) as end_date
        ,cast(dates::jsonb->>'startDate' as timestamp) as start_date
        ,case when "publishedAt"::text<> '{}' then 'published' else 'unpublished' end as exhibition_status
        ,case when (images#>>'{0,"s3Uri"}') is NULL then 'null' else concat('https://smartify-media.s3.eu-west-1.amazonaws.com', SUBSTRING(images#>>'{0, "s3Uri"}', 'media(.*)')) end as exhibition_image_url
    from content.exhibitions
    `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    exhibition_sid: {
      type: 'string',
      sql: `exhibition_sid`
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
      sql: 'venue_sid'
    },
    organization_sid: {
      type: 'string',
      sql: 'organisation_sid'
    },
    exhibition_image_url: {
      type: 'string',
      sql: 'exhibition_image_url'
    }
  }
});
