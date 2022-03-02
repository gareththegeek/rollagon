param location string = resourceGroup().location
param appServicePlanResourceGroupName string
param appServicePlanId string
param cosmosAccountName string
param cosmosResourceGroupName string

var appName = 'rollagon'

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' existing = {
  name: cosmosAccountName
  scope: resourceGroup(cosmosResourceGroupName)
}

var connectionString = listConnectionStrings(cosmosAccount.id, '2021-10-15').connectionStrings[0].connectionString

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: resourceId(appServicePlanResourceGroupName, 'Microsoft.Web/serverfarms', appServicePlanId)
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      appCommandLine: 'npm start'
      webSocketsEnabled: true
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~16'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: connectionString
        }
        {
          name: 'COSMOS_DATABASE_NAME'
          value: 'rollagon'
        }
        {
          name: 'COSMOS_DATA_TTL'
          value: '2592000'
        }
        {
          name: 'GAME_COLLECTION_NAME'
          value: 'games'
        }
        {
          name: 'CORS_ORIGIN'
          value: '${appName}.azurewebsites.net'
        }
      ]
    }
  }
}

resource stagingslot 'Microsoft.Web/sites/slots@2021-03-01' = {
  parent: appService
  name: 'staging'
  location: location
  properties: {}
}

output appServiceName string = appService.name
