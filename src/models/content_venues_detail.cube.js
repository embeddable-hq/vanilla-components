cube(`content_venue_detail`, {
    sql: `
          select
            sid as venue_sid
            ,"defaultName" as venue_name
            ,case when description is null then 'false' else 'true' end  as venue_description_exist
            ,ARRAY(SELECT jsonb_object_keys(description::jsonb)) AS venue_description_lang
            ,ARRAY(SELECT jsonb_object_keys(name::jsonb)) AS venue_name_lang
            --,name::jsonb->>'en-GB' as venue_name_engb
            --,name
            --,location
            ,case when location::jsonb->>'address' is null then 'false' else 'true' end  as geo_address_exist
            ,location::jsonb->>'continentName' as geo_continent
            ,location::jsonb->>'countryName' as geo_country
            ,location::jsonb#>>'{"cityName", "en-GB"}' as geo_city_en
            ,case when location::jsonb->>'cityName' is null then 'false' else 'true' end as geo_city_exist
            ,case when logo::jsonb#>>'{"dark", "s3Uri"}' is null then 'false' else 'true' end as logo_dark_exist
            ,case when logo::jsonb#>>'{"light", "s3Uri"}' is null then 'false' else 'true' end as logo_light_exist
            ,case when logo::jsonb#>>'{"dark", "s3Uri"}' = logo::jsonb#>>'{"light", "s3Uri"}' then 'true' else 'false' end as logo_dark_equals_light
            ,'Venues' as venue_string
        from content.hosts
        where type = 'venue'
        `,
    dataSource: 'smartify-postgres',
    measures: {
      records: {
        type: 'count'
      }
    },
    dimensions: {
      venue_sid: {
        type: 'string',
        sql: `venue_sid`,
        primaryKey: true,  // Define primary key here
        shown: true  // Hide this dimension from the user interface if necessary
      },
      venue_name: {
        type: 'string',
        sql: `venue_name`
      },
      venue_description_exist: {
        type: 'string',
        sql: 'venue_description_exist'
      },
      venue_description_lang: {
        type: 'string',
        sql: 'venue_description_lang'
      },
      venue_name_lang: {
        type: 'string',
        sql: 'venue_name_lang'
      },
      geo_address_exist: {
        type: 'string',
        sql: 'geo_address_exist'
      },
      geo_continent: {
        type: 'string',
        sql: 'geo_continent'
      },
      geo_city_en: {
        type: 'string',
        sql: 'geo_city_en'
      },
      geo_city_exist: {
        type: 'string',
        sql: 'geo_city_exist'
      },
      logo_dark_exist: {
        type: 'string',
        sql: 'logo_dark_exist'
      },
      logo_light_exist: {
        type: 'string',
        sql: 'logo_light_exist'
      },
      venue_string: {
        type: 'string',
        sql: 'venue_string'
      },
      logo_dark_equals_light: {
        type: 'string',
        sql: 'logo_dark_equals_light'
      }
    },
    joins: {
      content_organisation: {
        relationship: 'many_to_one',
        sql: `${CUBE}.venue_sid = ${content_venue}.venue_sid`
      }
    }
  });
  