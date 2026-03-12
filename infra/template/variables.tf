# Keeping env names short to avoid hitting resource name length limits when combined with project_name and random suffix
variable "environment_name" {
  description = "The environment to deploy to (prod, dev, QA, stg)"
  type        = string

  validation {
    condition     = contains(["prod", "dev", "QA", "stg"], var.environment_name)
    error_message = "environment_name must be one of: prod, dev, QA, stg."
  }
}

variable "subscription_id" {
  description = "Azure subscription ID where resources will be created"
  type        = string
}

variable "project_name" {
  description = "Name of the project/client, used for naming resources (3-24 chars, lowercase letters and numbers only)"
  type        = string
}

variable "location" {
  description = "Azure location where resources will be created"
  type        = string
}

variable "swa_location" {
  description = "Azure location for the Static Web App"
  type        = string
  default     = "westus2"

  validation {
    condition     = contains(["westus2", "centralus", "eastus2", "westeurope", "eastasia"], var.swa_location)
    error_message = "swa_location is only available on: westus2, centralus, eastus2, westeurope, eastasia."
  }
}

variable "container_registry_sku" {
  description = "SKU for the Azure Container Registry (Basic, Standard, Premium)"
  type        = string
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.container_registry_sku)
    error_message = "container_registry_sku must be one of: Basic, Standard, Premium."
  }
}
