const testUtils = require('./testUtils.js')

beforeEach(async () => {
  jest.setTimeout(100000)
  global.user = await testUtils.createTestUser()
  global.client = testUtils.createClient(user.secretKey)
})
