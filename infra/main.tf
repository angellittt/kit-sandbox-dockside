
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

# Sample resource. TODO: Replace with actual infrastructure
resource "azurerm_resource_group" "example" {
  name     = "${var.project_name}-resources"
  location = var.location
}

