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

## Resources

The infrastructure is defined in `main.tf` using the `./template` module per environment. The template contains:

| Resource                        | Purpose                                    | Connections                                                                                                                    |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Resource Group**              | Container for all environment resources    | Parent of all resources                                                                                                        |
| **Container Registry**          | Stores Docker images for the app           | App Service pulls images from it via managed identity (AcrPull role)                                                           |
| **App Service Plan**            | Compute plan for the web app               | Hosts the App Service                                                                                                          |
| **App Service**                 | Runs the application as a Docker container | Pulls images from Container Registry; reads secrets from Key Vault; writes files to Storage; optionally connects to PostgreSQL |
| **Key Vault**                   | Stores secrets and credentials             | App Service has Key Vault Secrets User role; admins/developers assigned via RBAC                                               |
| **Storage Account + Container** | Blob storage for file uploads              | App Service has Storage Blob Data Contributor role; connection info injected as app settings                                   |
| **PostgreSQL Flexible Server**  | Managed PostgreSQL database (optional)     | Firewall rule allows Azure services; connection info injected as app settings on App Service                                   |

PostgreSQL provisioning is controlled by the `enable_postgresql` variable (default: `false`).

## Optional modules

These modules are opt-in and off by default, so they don't block a minimum-viable deployment of the template. Enable them per-environment in `main.tf` once a project actually needs them.

| Module                  | Resources                                                                                                                                                             | Enabled by                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monitoring/alerting** | Log Analytics workspace, 2x Application Insights (api/web), diagnostic settings, exception-spike alerts, health-check alert, 3-location synthetic availability checks | `enable_monitoring = true` + `alert_notification_emails` (see [`template/monitoring.tf`](template/monitoring.tf) and [`../MONITORING.md`](../MONITORING.md))                                             |
| **Transactional email** | Azure Communication Services + custom email domain, with SPF/DKIM verification DNS records and a poll-and-wait verification script                                    | `enable_transactional_email = true` + `email_domain`, `dns_zone_name`, `dns_resource_group_name` (see [`template/communication.tf`](template/communication.tf) and [`template/dns.tf`](template/dns.tf)) |

The transactional email module assumes the project's domain already has an Azure DNS zone — it doesn't provision one.

## Applying changes per environment

Environments are defined as separate module calls in `main.tf`. To apply changes to a specific environment, use `-target`:

```bash
# Plan changes for a specific environment
terraform plan -target=module.dev_environment

# Apply changes to a specific environment
terraform apply -target=module.dev_environment
```

To apply all environments at once:

```bash
terraform apply
```

## Destroying infrastructure per environment

To destroy a specific environment's resources:

```bash
terraform destroy -target=module.dev_environment
```

To destroy all environments:

```bash
terraform destroy
```

> **Warning:** Destroying will permanently delete all resources including databases and storage. Make sure to back up any important data first.

## Using terraform output

Outputs are marked sensitive and must be accessed explicitly. To view all outputs for an environment:

```bash
terraform output -json dev_env_outputs
```

To access a specific nested value:

```bash
terraform output -json dev_env_outputs | jq '.app_service_default_hostname'
```
