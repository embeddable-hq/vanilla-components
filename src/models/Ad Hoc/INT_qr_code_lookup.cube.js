cube(`int_qrcode_lookup`, {
  sql: `
      select
          sid as qrcode_sid
          ,"orgSid" as organisation_sid
          ,label as qrcode_label
          ,case when "publishedAt" is null then '❌ unpublished' else '✅ published' end as qrcode_status
      from content."qrCodes"
    `,
  dataSource: 'smartify-postgres',
  measures: {
    total_qrcodes: {
      type: 'count'
    }
  },
  dimensions: {
    qrcode_sid: {
      type: 'string',
      sql: `qrcode_sid`,
      primaryKey: true,  // Add this line to define primary key
      shown: true
    },
    organisation_sid: {
      type: 'string',
      sql: 'organisation_sid'
    },
    qrcode_label: {
      type: 'string',
      sql: 'qrcode_label'
    },
    qrcode_status: {
      type: 'string',
      sql: 'qrcode_status'
    }
  }
});
