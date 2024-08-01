cube(`content_organisation`, {
  sql: `
    select
        sid as org_sid
        ,"defaultName" as org_name
        ,"defaultLocale" as org_locale
        ,case when "publishedAt"::jsonb->>"defaultLocale" is null then 'unpublished' else 'published' end as org_status
        ,config::jsonb->>'membershipTier' as org_tier
        ,concat('https://app.smartify.org/venues/', "prettyId") as org_url
    ,case when image#>>'{"s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(image#>>'{"s3Uri"}', 'media(.*)')) else null end as org_image_url
    from content.hosts
    where type = 'organisation'
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
      sql: `org_sid`,
      primaryKey: true,  // Define primary key here
      shown: true  // Hide this dimension from the user interface if necessary
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
    organization_url: {
      type: 'string',
      sql: 'org_url'
    },
    organization_image: {
      type: 'string',
      sql: 'org_image_url'
    }
  }
});