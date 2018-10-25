const testUtils = require('../testUtils.js');

test('should check that only chart key is required', async ()=> {
  const user = await testUtils.createTestUser();
  var client = testUtils.createClient(user.secretKey, testUtils.baseUrl);
  var chartFromFileKey = await testUtils.createTestChartFromFile('/sampleChart.json', user.designerKey);
  var event = await client.events.create(chartFromFileKey);

  expect(event.key).toBeDefined();
  expect(event.key).toBeTruthy();
  expect(event.id).toBeDefined();
  expect(event.id).toBeTruthy();
  expect(event.chartKey).toBe(chartFromFileKey);
  expect(event.bookWholeTables).toBe(false);
  expect(event.supportsBestAvailable).toBe(true);
  expect(event.createdOn).toBeDefined();
  expect(event.createdOn).toBeTruthy();
  expect(event.forSaleConfig).toBeUndefined();
  expect(event.updatedOn).toBeUndefined();
});

test('should pass in event key as a create() param', async ()=>{
  const user = await testUtils.createTestUser();
  var client = testUtils.createClient(user.secretKey, testUtils.baseUrl);
  var chart = await client.charts.create();
  var event = await client.events.create(chart.key, 'eventKey');

  expect(event.key).toBe('eventKey');
});

test('should pass in BookWholeTables as a create() param', async ()=>{
  const user = await testUtils.createTestUser();
  var client = testUtils.createClient(user.secretKey, testUtils.baseUrl);
  var chart = await client.charts.create();
  var event = await client.events.create(chart.key, null, false);

  expect(event.key).toBeDefined();
  expect(event.bookWholeTables).toBe(false);
});

test('should pass in tableBookingModes as a create() param', async ()=>{
  const user = await testUtils.createTestUser();
  var client = testUtils.createClient(user.secretKey, testUtils.baseUrl);
  var chartKey = await testUtils.createTestChartFromFile('/sampleChartWithTables.json', user.designerKey);
  var tableBookingModes = {
    'T1' : 'BY_TABLE',
    'T2' : 'BY_SEAT'
  };
  var event = await client.events.create(chartKey, null, tableBookingModes);
  expect(event.key).toBeDefined();
  expect(event.key).toBeTruthy();
  expect(event.bookWholeTables).toBe(false);
  expect(event.tableBookingModes).toEqual(tableBookingModes);
});