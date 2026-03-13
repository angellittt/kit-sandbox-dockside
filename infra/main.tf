terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.1.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  # This is only required when the User, Service Principal, or Identity running Terraform lacks the permissions to register Azure Resource Providers.
  resource_provider_registrations = "none"
}

module "dev_environment" {
  source           = "./template"
  location         = var.location
  project_name     = var.project_name
  subscription_id  = var.subscription_id
  environment_name = "dev"
  swa_location     = "westus2"
  # Set to true if your app needs a postgreSQL database
  enable_postgresql = false
  # Replace with your own email addresses
  key_vault_administrators = ["juan.lopez@ttt.studio", "justin.kuan@ttt.studio"]
  key_vault_developers     = ["sunny.xue@ttt.studio"]
}

output "dev_env_outputs" {
  value     = module.dev_environment
  sensitive = true
}
