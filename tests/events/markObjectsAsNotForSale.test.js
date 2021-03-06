test('should mark objects as not for sale', async () => {
  let chart = await client.charts.create()
  let event = await client.events.create(chart.key)

  await client.events.markAsNotForSale(event.key, ['o1', 'o2'], ['cat1', 'cat2'])

  let retrievedEvent = await client.events.retrieve(event.key)
  expect(retrievedEvent.forSaleConfig.forSale).toBe(false)
  expect(retrievedEvent.forSaleConfig.objects).toEqual(['o1', 'o2'])
  expect(retrievedEvent.forSaleConfig.categories).toEqual(['cat1', 'cat2'])
})

test('that categories are optional for mark as not for sale', async () => {
  let chart = await client.charts.create()
  let event = await client.events.create(chart.key)

  await client.events.markAsNotForSale(event.key, ['o1', 'o2'])

  let retrievedEvent = await client.events.retrieve(event.key)
  expect(retrievedEvent.forSaleConfig.objects).toEqual(['o1', 'o2'])
  expect(retrievedEvent.forSaleConfig.categories.length).toBe(0)
})

test('that objects are optional for mark as not for sale', async () => {
  let chart = await client.charts.create()
  let event = await client.events.create(chart.key)

  await client.events.markAsNotForSale(event.key, null, ['cat1', 'cat2'])

  let retrievedEvent = await client.events.retrieve(event.key)
  expect(retrievedEvent.forSaleConfig.categories).toEqual(['cat1', 'cat2'])
  expect(retrievedEvent.forSaleConfig.objects.length).toBe(0)
})
