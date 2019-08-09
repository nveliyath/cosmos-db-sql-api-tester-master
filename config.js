var config = {}

config.endpoint = 'https://cos-tccc-ts01-nsr-product-a.documents.azure.com:443/'
config.key = 'MQo1iGyTpiGPudNucJPVkGVbVxphrbkJ4uJnLIqnF0i5VauHwWGberhIDWVUZ2QGF7chM35UizWdsIGNSXXhKQ=='

config.database = {
  id: 'FamilyDatabase'
}


//
// We can work/test multiple collections for existnece. If will create them if it does not exists. The last container item in this list will be really exercised
// So please make sure  will be used to 
//
config.collections = [ {id: 'nsr-collection-1', partitionkey: { kind: 'Hash', paths: ['/Country'] } }, 
                       {id: 'nsr-collection-2', partitionkey: { kind: 'Hash', paths: ['/Country'] }},
                       {id: 'test-me', partitionkey: { kind: 'Hash', paths: ['/Country'] }}
                     ]

config.partitionkey = { kind: 'Hash', paths: ['/Country'] }


config.items = {
  Andersen: {
    id: 'Anderson.1',
    Country: 'USA',
    lastName: 'Andersen',
    parents: [
      {
        firstName: 'Thomas'
      },
      {
        firstName: 'Mary Kay'
      }
    ],
    children: [
      {
        firstName: 'Henriette Thaulow',
        gender: 'female',
        grade: 5,
        pets: [
          {
            givenName: 'Fluffy'
          }
        ]
      }
    ],
    address: {
      state: 'WA',
      county: 'King',
      city: 'Seattle'
    }
  },
  Wakefield: {
    id: 'Wakefield.7',
    Country: 'Italy',
    parents: [
      {
        familyName: 'Wakefield',
        firstName: 'Robin'
      },
      {
        familyName: 'Miller',
        firstName: 'Ben'
      }
    ],
    children: [
      {
        familyName: 'Merriam',
        firstName: 'Jesse',
        gender: 'female',
        grade: 8,
        pets: [
          {
            givenName: 'Goofy'
          },
          {
            givenName: 'Shadow'
          }
        ]
      },
      {
        familyName: 'Miller',
        firstName: 'Lisa',
        gender: 'female',
        grade: 1
      }
    ],
    address: {
      state: 'NY',
      county: 'Manhattan',
      city: 'NY'
    },
    isRegistered: false
  }
}

module.exports = config
