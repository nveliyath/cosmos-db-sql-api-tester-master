//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('./config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
var containerId = null
const collections = config.collections // list of collections
//const partitionKey = config.partitionkey//{ kind: 'Hash', paths: ['/Country'] }

const client = new CosmosClient({ endpoint, key })

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
  console.log(`Created database:\n${database.id}\n`)
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read()
  console.log(`Reading database:\n${databaseDefinition.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  for(var item of collections) {
    var partitionKey = item.partitionkey;
    containerId = item.id
    const { container } = await client
      .database(databaseId)
      .containers.createIfNotExists(
        { id: item.id, partitionKey },
        { offerThroughput: 1000 }
      )
    console.log(`Created container:\n${item.id}\n`)
  }  
}

/**
 * Read the container definition
 */
async function readContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
  console.log(`Reading container:\n${containerDefinition.id}\n`)
}

/**
 * Create family item if it does not exist
 */
async function createFamilyItem(itemBody) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody)
  console.log(`Created family item with id:\n${itemBody.id}\n`)
}

/**
 * Query the container using SQL
 */
async function queryContainer() {
  console.log(`Querying container:\n${containerId}`)

  // query to return all children in a family
  const querySpec = {
    query: 'SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName',
    parameters: [
      {
        name: '@lastName',
        value: 'Andersen'
      }
    ]
  }

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll()
  for (var queryResult of results) {
    let resultString = JSON.stringify(queryResult)
    console.log(`\tQuery returned ${resultString}\n`)
  }
}

/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`)
  // Change property 'grade'
  itemBody.children[0].grade = 6
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .replace(itemBody)
}

/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(itemBody) {
  await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .delete(itemBody)
  console.log(`Deleted item:\n${itemBody.id}\n`)
}

/**
 * Cleanup the database and collection on completion
 */
async function cleanup() {
  await client.database(databaseId).delete()
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message)
  //console.log('Press any key to exit')
  //process.stdin.setRawMode(true)
  // process.stdin.resume()
  //process.stdin.on('data', process.exit.bind(process, 0))
}

createDatabase()
  .then(() => readDatabase())               // Create a database if it does not exists
  .then(() => createContainer())            // Create a container if it does not exists
  .then(() => readContainer())              // Read the container, similar to use db
  .then(() => createFamilyItem(config.items.Andersen))     // Add two documents
  .then(() => createFamilyItem(config.items.Wakefield))
  .then(() => queryContainer())             // Query the container back
  .then(() => replaceFamilyItem(config.items.Andersen))   // Replace one item with the same content
  .then(() => queryContainer())             // Query the container again
  .then(() => deleteFamilyItem(config.items.Andersen))  // delete one item
  .then(() => {
    exit(`Completed successfully`)          // finish the test
  })
  .catch(error => {
    exit(`Completed with error ${JSON.stringify(error)}`)
  })
