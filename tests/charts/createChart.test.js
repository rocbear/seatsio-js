const SeatsioClient = require('../../src/SeatsioClient.js');
const axios = require('axios');
const Category = require('../../src/Charts/Category.js')

function createTestUser(){
  var baseUrl = 'https://api-staging.seatsio.net/';

  var testUserPr = axios({
    method: 'POST',
    url: baseUrl + 'system/public/users/actions/create-test-user'
  }).then(response => {
    return response.data;
  }).catch(error => {
    console.log(error);
  });

  return testUserPr;
}

function createClient(key, baseUrl){
  return new SeatsioClient(key, baseUrl);
}

test('should create a chart with default parameters', async () => {
    const user = await createTestUser();
    var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
    var chart = await client.charts.create();
    var retrievedChart = await client.charts.retrievePublishedVersion(chart.key);

    expect(chart.key).toBeDefined();
    expect(chart.key).toBeTruthy();
    expect(chart.id).toBeDefined();
    expect(chart.id).toBeTruthy();
    expect(chart.status).toBe('NOT_USED');
    expect(chart.name).toBe('Untitled chart');
    expect(chart.publishedVersionThumbnailUrl).toBeDefined();
    expect(chart.publishedVersionThumbnailUrl).toBeTruthy();
    expect(chart.draftVersionThumbnailUrl).toBeFalsy();
    expect(chart.tags).toEqual([]);
    expect(chart.archived).toBeFalsy();
    expect(retrievedChart.venueType).toEqual('MIXED');
    expect(retrievedChart.categories.list).toEqual([]);
    expect(retrievedChart.categories.list).toBeDefined();
});

test('should create chart with name', async () => {
    const user = await createTestUser();
    var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
    var chart = await client.charts.create('aChart');
    var retrievedChart = await client.charts.retrievePublishedVersion(chart.key);
    expect(retrievedChart.name).toEqual('aChart');
    expect(retrievedChart.venueType).toEqual('MIXED');
    expect(retrievedChart.categories.list).toEqual([]);
    expect(retrievedChart.categories.list).toBeDefined();
});

test('should create chart with venue type', async () => {
    const user = await createTestUser();
    var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
    var chart = await client.charts.create(null, 'BOOTHS');
    var retrievedChart = await client.charts.retrievePublishedVersion(chart.key);
    expect(retrievedChart.name).toEqual('Untitled chart');
    expect(retrievedChart.venueType).toEqual('BOOTHS');
    expect(retrievedChart.categories.list).toBeDefined();
    expect(retrievedChart.categories.list).toEqual([]);
});

test('should create chart with categories as class', async() => {
  var cat1 = {'key': 1, 'label': 'Category 1', 'color': '#aaaaaa'};
  var cat2 = {'key': 3, 'label': 'Category 2', 'color': '#bbbbbb'};
  const user = await createTestUser();
  var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
  var chart = await client.charts.create(null, null, [cat1, cat2]);
  var retrievedChart = await client.charts.retrievePublishedVersion(chart.key);

  expect(retrievedChart.name).toEqual('Untitled chart');
  expect(retrievedChart.venueType).toEqual('MIXED');
  expect(retrievedChart.categories.list).toEqual([cat1, cat2]);
});

test('should create chart with categories as instance of Category class', async() => {
  var cat1 = new Category(1, 'Category 1', '#aaaaaa');
  var cat2 = new Category(2, 'Category 2', '#bbbbbb');
  const user = await createTestUser();
  var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
  var chart = await client.charts.create(null, null, [cat1, cat2]);

  var expectedCategories = [
    {
      'key': 1,
      'label': 'Category 1',
      'color': '#aaaaaa'
    },
    {
      'key': 2,
      'label': 'Category 2',
      'color': '#bbbbbb'
    }];

  var retrievedChart = await client.charts.retrievePublishedVersion(chart.key);
  expect(retrievedChart.name).toEqual('Untitled chart');
  expect(retrievedChart.venueType).toEqual('MIXED');
  expect(retrievedChart.categories.list).toEqual(expectedCategories);
});

test('should add tag', async ()=> {
  const user = await createTestUser();
  var client = createClient(user.secretKey, 'https://api-staging.seatsio.net/');
  var chart = await client.charts.create();
  await client.charts.addTag(chart.key, 'async');
  var retrievedChart = await client.charts.retrieve(chart.key);
  expect(retrievedChart.key).toBe(chart.key);
  expect(retrievedChart.id).not.toBeNull();
  expect(retrievedChart.name).toBe('Untitled chart');
  expect(retrievedChart.status).toBe('NOT_USED');
  expect(retrievedChart.publishedVersionThumbnailUrl).not.toBeNull();
  expect(retrievedChart.draftVersionThumbnailUrl).not.toBeNull();
  expect(retrievedChart.archived).toBeFalsy();
  expect(retrievedChart.events).toBeUndefined();
});