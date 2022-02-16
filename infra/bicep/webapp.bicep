param location string = resourceGroup().location
param appServicePlanResourceGroupName string
param appServicePlanId string
param cosmosAccountName string

var appName = 'rollagon'

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' existing = {
  name: cosmosAccountName
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
      linuxFxVersion: 'node|14-lts'
      appCommandLine: 'npm start'
      webSocketsEnabled: true
      appSettings: [
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
          name: 'GAME_COLLECTION_NAME'
          value: 'games'
        }
      ]
    }
  }
}

output appServiceName string = appService.name
