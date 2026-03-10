const sdk = require('node-appwrite');

const client = new sdk.Client()
    .setEndpoint(process.env.END_POINT) // appwrite endpoint
    .setProject(process.env.PROJECT_ID)  // appwrite project ID
    .setKey(process.env.API_KEY);    // appwrite API Key

const storage = new sdk.Storage(client);

module.exports = { client, storage, sdk };