// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import cube, { Query } from '@cubejs-client/core'

const CUBE_API_URL = 'http://localhost:4000/cubejs-api/v1'
const token = 'token'

describe('Cube API Tests', () => {
  const cubeApi = cube(token, { apiUrl: CUBE_API_URL })

  beforeAll(async () => {
    // Ensure that cube image is running
  })

  describe('count all tables should be successful', () => {
    const measures = [
      'candidate_application.count',
      'candidate_application_status.count',
      'candidate_profile.count',
      'company.count',
      'company_department.count',
      'company_office.count',
      'company_user.count',
      'hiring_team_member.count',
      'job_listing.count',
      'job_listing_job_pipeline.count',
      'job_opening.count',
      'job_pipeline.count',
      'profile_details.count',
      'requisition.count',
      'role.count',
      'scalis_user.count',
      'template_pipeline.count',
      'template_stage.count',
      'user_invitation.count',
    ]

    test('count all tables', async () => {
      const data = await cubeApi.load({
        measures,
      })
      const result = data.loadResponse.results[0].data[0]
      const resultKeys = Object.keys(result)
      expect(resultKeys.length).toBe(measures.length)
      expect(data.loadResponse.results[0].data).toBeDefined()
    }, 20000)
  })
})
