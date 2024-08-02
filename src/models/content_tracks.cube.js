cube(`content_track`, {
  sql: `
        select
            sid as track_sid
            ,case
                when "trackableSid" like 'tour_%' then "trackableSid" 
                else null 
            end as tour_sid
            ,"defaultTitle" as track_id_name
            ,"orgSid" as organization_sid
            ,replace(replace(replace(replace(replace(replace(replace("aggregateDisplayedOn"::text, "orgSid", ''), '"", ', ''), ', ""', ''),'", "', ','),'"',''),'[',''),']','') as venue_id
            ,replace(replace(replace(replace(replace(replace("aggregateCategories"::text, '"", ', ''), ', ""', ''),'", "', ','),'"',''),'[',''),']','') as track_object_category
            ,case 
                when images#>>'{0,"s3Uri"}' is null then null 
                else concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(images#>>'{0,"s3Uri"}', 'media(.*)')) 
            end as track_image_url
        from content.tracks
    `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    track_sid: {
      type: 'string',
      sql: `track_sid`,
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
    },
    track_name: {
      type: 'string',
      sql: 'track_id_name'
    },
    },
    tour_sid: {
      type: 'string',
      sql: 'tour_sid'
    },
    track_image: {
      type: 'string',
      sql: 'track_image_url'
    },
    track_object_category: {
      type: 'string',
      sql: 'track_object_category'
    },
    venue_sids: {
      type: 'string',
      sql: 'venue_id'
    },
    organisation_sid: {
      type: 'string',
      sql: 'organization_sid'
    },
    joins: {
      content_tour: {
        relationship: 'many_to_one',
        sql: `${CUBE}.tour_sid = ${content_tour}.tour_sid`
      }
    }
});