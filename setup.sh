LOCATION={LOCATION}
RESOURCE_GROUP={YOUR_RESOURCE_GROUP_NAME}
DNS_PREFIX={YOUR_DNS_PREFIX}
KUBERNETES_NAME={YOUR_KUBERNETES_RESOURCE_NAME}
KEYVAULT_NAME={YOUR_KEYVAULT_NAME}
DATA_TABLE_NAME=todo
LOG_TABLE_NAME=logs
DATA_TABLE_STORAGE_ACCOUNT={YOUR_DATA_TABLE_STORAGE_ACCOUNT}
LOG_TABLE_STORAGE_ACCOUNT={YOUR_LOG_TABLE_STORAGE_ACCOUNT}
DATA_CS_KEYVAULT_SECRET=datacs
LOG_CS_KEYVAULT_SECRET=logcs
ACR_NAME={YOUR_AZURE_CONTAINER_REGISTRY_NAME}
IP_NAME={YOUR_IP_NAME}
CLUSTER_DNS={YOUR_CUSTOM_DNS_NAME}

###SETUP

#Create Resource Group
az group create -l $LOCATION -n $RESOURCE_GROUP

#Create Azure Container Registry
az acr create -g $RESOURCE_GROUP -n $ACR_NAME --sku Basic

#Create Azure Kubernetes Service
NODE_RESOURCE_GROUP=`az aks create -n $KUBERNETES_NAME --dns-name-prefix $DNS_PREFIX --node-vm-size Standard_A1 --node-count 3 -g $RESOURCE_GROUP -o tsv --query "nodeResourceGroup"`

#Create public IP
az network public-ip create -n $IP_NAME -g $NODE_RESOURCE_GROUP -l $LOCATION --allocation-method Static --dns-name $CLUSTER_DNS

#Create Azure KeyVault
az keyvault create -g $RESOURCE_GROUP -n $KEYVAULT_NAME

#Create Azure Storage Accounts
az storage account create -n $DATA_TABLE_STORAGE_ACCOUNT -g $RESOURCE_GROUP -l $LOCATION
az storage account create -n $LOG_TABLE_STORAGE_ACCOUNT -g $RESOURCE_GROUP -l $LOCATION

#Create Tables
az storage table create -n $DATA_TABLE_NAME --account-name $DATA_TABLE_STORAGE_ACCOUNT
az storage table create -n $LOG_TABLE_NAME --account-name $LOG_TABLE_STORAGE_ACCOUNT

#Put Connection Strings to KeyVault
DATA_CS=`az storage account show-connection-string -n $DATA_TABLE_STORAGE_ACCOUNT -g $RESOURCE_GROUP -o tsv --query "connectionString"`
LOG_CS=`az storage account show-connection-string -n $LOG_TABLE_STORAGE_ACCOUNT -g $RESOURCE_GROUP -o tsv --query "connectionString"`

az keyvault secret set --vault-name $KEYVAULT_NAME -n $DATA_CS_KEYVAULT_SECRET --value $DATA_CS
az keyvault secret set --vault-name $KEYVAULT_NAME -n $LOG_CS_KEYVAULT_SECRET --value $LOG_CS

###Enable Managed Identity For Each VM

#Get list of all VMs in my cluster resource group
readarray VMS <<< `az vm list -g $NODE_RESOURCE_GROUP --query "[].name" -o tsv`

#Create identity for each vm and store its ID
i=0;
for VM in ${VMS[@]}
do
VM_IDENTITIES[$i]=`az vm identity assign -g $NODE_RESOURCE_GROUP -n $VM -o tsv --query "systemAssignedIdentity"`
let "i=$i+1"
done

#Allow each identity to access KeyVault
for ID in ${VM_IDENTITIES[@]}
do
az keyvault set-policy -g $RESOURCE_GROUP -n $KEYVAULT_NAME --object-id $ID --secret-permissions list get
done