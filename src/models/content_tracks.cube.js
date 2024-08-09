cube(`content_track`, {
    sql: `
        select
            sid as track_sid
            ,"defaultTitle" as track_name
            ,case when "trackableSid" like 'tour_%' then "trackableSid" else "(not set)" end as tour_sid
            ,replace(replace(replace(replace(replace(replace(replace("aggregateDisplayedOn"::text, "orgSid", ''), '"", ', ''), ', ""', ''),'", "', ','),'"',''),'[',''),']','') as venue_sid
            ,"orgSid" as organisation_sid
            ,"durationSecs" as track_duration
            ,"listOrder" as track_list_order
            ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as track_status
            ,"prettyId" as track_pretty_id
        from content.tracks
        `,
    dataSource: 'smartify-postgres',
    measures: {
      total_tracks: {
        type: 'count'
      },
      published_tracks: {
        type: 'count',
        filters: [{ sql: `${CUBE}.track_status = '✅ published'` }],
      }
    },
    dimensions: {
      track_sid: {
        type: 'string',
        sql: `track_sid`,
        primaryKey: true,
        shown: true
      },
      track_name: {
        type: 'string',
        sql: `track_name`
      },
      tour_sid: {
        type: 'string',
        sql: 'tour_sid',
        shown: false
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
      track_status: {
        type: 'string',
        sql: 'track_status'
      },
      track_pretty_id: {
        type: 'string',
        sql: 'track_pretty_id'
      },
      track_duration: {
        type: 'number',
        sql: 'track_duration'
      },
      track_list_order: {
        type: 'number',
        sql: 'track_list_order'
      }
    },
    joins: {
      content_tour: {
        relationship: 'many_to_one',
        sql: `${CUBE}.tour_sid = ${content_tour}.tour_sid`
      },
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