Demo application showing usage of Managed Identities with Koa.js application hosted in Kubernetes cluster.

You can run setup.sh to setup everything for you.

Checklist:
 - update variables in setup.sh
 - update environment.cloud.js with endpoint
 - update ACR name in cube.yaml
 - update ACR name in build.ps1


 Run ./setup.sh to setup everything.
 Run ./build.ps1 to build everything, push to ACR and deploy to AKS.