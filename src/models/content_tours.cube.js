cube(`content_tour`, {
  sql: `
    select
        sid as tour_sid
        ,"experienceSid" as experience_id
        ,"orgSid" as organization_sid
        ,replace(replace(replace(replace("venueSids"::text, '[', ''),']',''),'"',''),' ','') as venue_sid
        ,'published' as tour_status
        ,cast("createdAt" as timestamp) as created_at
        ,cast(null as timestamp) as updated_at
        ,cast(null as timestamp) as published_at
        ,'(not set)' as tour_id_name
        ,0 as paid_tour
        ,"durationMins" as tour_duration
        ,'false' as tour_geo_fanced
        ,'false' as tour_hidden
        ,null as tour_image_url
        ,concat('https://app.smartify.org/en-GB/tours/',sid) as tour_url
    from content."personalisedTours"
    union all
    select
        sid as tour_sid
        ,null as experience_id
        ,"orgSid" as organization_sid
        ,"locatedAt" as venue_sid
        ,case when "publishedAt"::text<> '{}' then '✅ published' else '❌ unpublished' end as tour_status
        ,cast("createdAt" as timestamp) as created_at
        ,cast("updatedAt" as timestamp) as updated_at
        ,cast("publishedAt"->>'en-GB' as timestamp) as published_at
        ,"defaultTitle" as tour_id_name
        ,case when ("storeKey" is not null and "storeKey" <> '') then 1 else 0 end as paid_tour
        ,"durationMins" as tour_duration
        ,config::jsonb->>'geoFenced' as tour_geo_fanced
        ,config::jsonb->>'hideEverywhere' as tour_hidde
        ,concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image->>'s3Uri', 'media(.*)')) as tour_image_url
        ,concat('https://app.smartify.org/en-GB/tours/',"prettyId") as tour_url
    from content.tours
    `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    tour_sid: {
      type: 'string',
      sql: `tour_sid`
    },
    tour_type: {
      type: 'string',
      sql: `case when tour_sid LIKE "ptour_%" then "Bespoke Tour" else "Regular Tour" end`
    },
    experience_id: {
      type: 'string',
      sql: 'experience_id'
    },
    organisation_sid: {
      type: 'string',
      sql: 'organization_sid'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid'
    },
    tour_status: {
      type: 'string',
      sql: 'tour_status'
    },
    created_at: {
      type: 'string',
      sql: 'created_at'
    },
    updated_at: {
      type: 'string',
      sql: 'updated_at'
    },
    published_at: {
      type: 'string',
      sql: 'published_at'
    },
    tour_name: {
      type: 'string',
      sql: 'tour_id_name'
    },
    paid_tour: {
      type: 'string',
      sql: 'paid_tour'
    },
    tour_duration: {
      type: 'string',
      sql: 'tour_duration'
    },
    tour_geo_fanced: {
      type: 'string',
      sql: 'tour_geo_fanced'
    },
    tour_hidde: {
      type: 'string',
      sql: 'tour_hidde'
    },
    tour_image_url: {
      type: 'string',
      sql: 'tour_image_url'
    },
    tour_url: {
      type: 'string',
      sql: 'tour_url'
    }
  }
});
