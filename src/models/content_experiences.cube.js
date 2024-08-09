cube(`content_experience`, {
  sql: `
    select
        sid as experience_id
        ,label as experience_name
        ,"orgSid" as organisation_sid
        ,REPLACE(REPLACE(REPLACE(REPLACE("venueSids"::text, '[', ''), ']', ''), '"', ''), ' ', '') as venue_sid
        ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as experience_status
        ,case when image->>'s3Uri' is null then null else  concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image->>'s3Uri', 'media(.*)')) end as experience_image_url
    from content.experiences
      `,
  dataSource: 'smartify-postgres',
  measures: {
    total_experiences: {
      type: 'count'
    },
    published_experiences: {
      type: 'count',
      filters: [{ sql: `${CUBE}.experience_status = '✅ published'` }],
    }
  },
  dimensions: {
    experience_sid: {
      type: 'string',
      sql: `experience_id`,
      primaryKey: true,
      shown: true
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
      sql: 'venue_sid',
      shown: false
    },
    organisation_sid: {
      type: 'string',
      sql: 'organisation_sid',
      shown: false
    },
    experience_image: {
      type: 'string',
      sql: 'experience_image_url'
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