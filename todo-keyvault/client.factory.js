const KeyVault = require('azure-keyvault');
const axios = require('axios');

key_vault_url = 'https://{VAULT_NAME}.vault.azure.net';
ad_url ='http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net';

authenticator = async function(challenge, callback){
    const response = await axios.get(ad_url, {
        headers:{
            Metadata:true
        }
    });
    const authorizationValue = `${response.data.token_type} ${response.data.access_token}`;
    return callback(null, authorizationValue);
}

class KeyVaultClient{
    getSecret(name){
        var credentials = new KeyVault.KeyVaultCredentials(authenticator);
        var client = new KeyVault.KeyVaultClient(credentials);
        return client.getSecret(key_vault_url, name, '');
    }
}

module.exports = KeyVaultClient;