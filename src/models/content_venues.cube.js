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
                ,case when "publishedAt" is null then 'unpublished' else 'published' end as venue_status
            from content.hosts
        )

        select
            u.sid as org_sid
            ,"defaultName" as org_name
            ,case when "publishedAt"::jsonb->>"defaultLocale" is null then 'unpublished' else 'published' end as org_status
            ,config::jsonb->>'membershipTier' as org_tier
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
            ,concat('https://app.smartify.org/venues/', u."prettyId") as org_url
        from content.hosts u
        cross join jsonb_array_elements_text(u."childHostSids") as tb join ven on tb.value = ven.sid
        where tb.value LIKE 'venue_%'
      `,
  dataSource: 'smartify-postgres',
  measures: {
    records: {
      type: 'count'
    }
  },
  dimensions: {
    organisation_sid: {
      type: 'string',
      sql: `org_sid`
    },
    organisation_name: {
      type: 'string',
      sql: `org_name`
    },
    organisation_locale: {
      type: 'string',
      sql: 'org_locale'
    },
    organisation_status: {
      type: 'string',
      sql: 'org_status'
    },
    organization_tier: {
      type: 'string',
      sql: 'org_tier'
    },
    org_url: {
      type: 'string',
      sql: 'org_url'
    },
    venue_sid: {
      type: 'string',
      sql: 'venue_sid'
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
    venue_iso: {
      type: 'string',
      sql: 'venue_iso'
    },
    venue_continent: {
      type: 'string',
      sql: 'venue_continent'
    },
    venue_country: {
      type: 'string',
      sql: 'venue_country'
    },
    venue_city: {
      type: 'string',
      sql: 'venue_city'
    },
    venue_lat_long: {
      type: 'string',
      sql: 'venue_lat_long'
    },
    venue_url: {
      type: 'string',
      sql: 'venue_url'
    },
    venue_image: {
      type: 'string',
      sql: 'venue_image'
    }
  }
});
