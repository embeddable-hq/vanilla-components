cube(`content_artist`, {
  sql: `
      select 
        sid, 
        versions#>>'{0, "defaultName"}' as default_name, 
        versions#>>'{0, "dates", "isDeathDateAlive"}' as artist_alive,
        concat('https://app.smartify.org/objects/', sid) as artist_url,
        case
		    when versions#>>'{0, "image", "s3Uri"}' is not null then concat('https://smartify-media.s3.eu-west-1.amazonaws.com', substring(versions#>>'{0, "image", "s3Uri"}', 'media(.*)'))
		    else null
        end as artist_image
      from content.artists
    `,
  dataSource: 'smartify-postgres',
  measures: {
    total_artists: {
      type: 'count'
    }
  },
  dimensions: {
    artist_sid: {
      type: 'string',
      sql: `sid`,
      primaryKey: true,  // Add this line to define primary key
      shown: true
    },
    artist_name: {
      type: 'string',
      sql: 'default_name'
    },
    artist_image: {
      type: 'string',
      sql: 'artist_image'
    },
    artist_url: {
      type: 'string',
      sql: 'artist_url'
    },
    artist_alive: {
      type: 'string',
      sql: 'artist_alive'
    }
  }
});
