# Infrastructure

## Prerequisites

- Install terraform by following their [installation steps](https://developer.hashicorp.com/terraform/install).
- Install azure cli by following their [installation steps](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- Make sure your azure user has all required permissions (or ask an admin for them).
- Make sure you have a valid subscription id or ask for one. See these [docs on how to find yours](https://learn.microsoft.com/en-us/azure/azure-portal/get-subscription-tenant-id).

## Getting started

If this is the first time you will interact with the project, please run `./setup.sh`.
This script will automatically push the terraform state to Azure by creating a resource group, a storage account, a storage container for you.

You only need to execute this script once. After doing so, you can execute `terraform plan`, `terraform apply`, or `terraform destroy` as you would normally do in any terraform project.
