const testUtils = require('../testUtils.js');

test('should update extra data of an event', async ()=> {
  var user = await testUtils.createTestUser();
  var client = testUtils.createClient(user.secretKey, testUtils.baseUrl);
  var chartKey = testUtils.getChartKey();
  await testUtils.createTestChart(chartKey, user.designerKey);
  var event = await client.events.create(chartKey);
  var extraData = {'foo':'bar'};
  await client.events.updateExtraData(event.key, 'A-1', extraData);
  var objStatus = await client.events.retrieveObjectStatus(event.key, 'A-1');
  expect(objStatus.extraData).toEqual(extraData);
});
