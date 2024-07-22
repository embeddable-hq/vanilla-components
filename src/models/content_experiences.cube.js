cube(`content_experience`, {
  sql: `
    select
        sid as experience_id
        ,label as experience_name
        ,"orgSid" as organisation_sid
        ,REPLACE(REPLACE(REPLACE(REPLACE("venueSids"::text, '[', ''), ']', ''), '"', ''), ' ', '') as venue_sid
        ,case when "publishedAt" is null then 'Unpublished' else 'Published' end as experience_status
        ,case when image->>'s3Uri' is null then null else  concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image->>'s3Uri', 'media(.*)')) end as experience_image_url
    from content.experiences
      `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    experience_id: {
      type: 'string',
      sql: `experience_id`
    },
    experience_name: {
      type: 'string',
      sql: `experience_name`
    },
    experience_status: {
      type: 'string',
      sql: 'experience_status'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid'
    },
    organisation_sid: {
      type: 'string',
      sql: 'organisation_sid'
    },
    experience_image: {
      type: 'string',
      sql: 'experience_image_url'
    }
  }
});