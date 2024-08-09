cube(`content_venue`, {
  sql: `
        with ven as (
            select
                sid
                ,"defaultName" as name
                ,"prettyId" as url
                ,case when image#>>'{"s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image#>>'{"s3Uri"}', 'media(.*)')) 
                else null end as venue_image
                ,location as loc
                ,"defaultLocale" as default_locale
                ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as venue_status
            from content.hosts
        )

        select
            u.sid as org_sid
            ,tb.value as venue_sid
            ,upper(substring(tb.value, '\_(.*)')) as venue_id
            ,ven.name as venue_name
            ,ven.default_locale as venue_locale
            ,ven.venue_status as venue_status
            ,ven.loc->>'countryIso2' as venue_iso
            ,ven.loc->>'continentName' as venue_continent
            ,ven.loc->>'countryName' as venue_country
            ,ven.loc#>>'{"cityName", "en-GB"}' as venue_city
            ,concat(ven.loc->>'latitude',',',ven.loc->>'longitude') as venue_lat_long
            ,concat('https://app.smartify.org/venues/',ven.url) as venue_url
            ,venue_image
            ,'Venues' as venue_string
        from content.hosts u
        cross join jsonb_array_elements_text(u."childHostSids") as tb join ven on tb.value = ven.sid
        where tb.value LIKE 'venue_%'
      `,
  dataSource: 'smartify-postgres',
  measures: {
    total_venues: {
      type: 'count'
    },
    published_venues: {
      type: 'count',
      filters: [{ sql: `${CUBE}.venue_status = '✅ published'` }],
    },
  },
  dimensions: {
    organisation_sid: {
      type: 'string',
      sql: `org_sid`
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid',
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
    },
    venue_id: {
      type: 'string',
      sql: 'venue_id'
    },
    venue_name: {
      type: 'string',
      sql: 'venue_name'
    },
    venue_locale: {
      type: 'string',
      sql: 'venue_locale'
    },
    venue_status: {
      type: 'string',
      sql: 'venue_status'
    },
    venue_string: {
      type: 'string',
      sql: 'venue_string'
    },
    venue_iso: {
      type: 'string',
      sql: 'venue_iso',
      shown: false
    },
    venue_continent: {
      type: 'string',
      sql: 'venue_continent',
      shown: false
    },
    venue_country: {
      type: 'string',
      sql: 'venue_country',
      shown: false
    },
    venue_city: {
      type: 'string',
      sql: 'venue_city',
      shown: false
    },
    venue_lat_long: {
      type: 'string',
      sql: 'venue_lat_long',
      shown: false
    },
    venue_url: {
      type: 'string',
      sql: 'venue_url'
    },
    venue_image: {
      type: 'string',
      sql: 'venue_image'
    }
  },
  joins: {
    content_organisation: {
      relationship: 'many_to_one',
      sql: `${CUBE}.org_sid = ${content_organisation}.org_sid`
    }
  }
});
