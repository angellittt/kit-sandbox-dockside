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

variable "key_vault_sku_name" {
  description = "SKU name for the Azure Key Vault (standard or premium)"
  type        = string
  default     = "standard"

  validation {
    condition     = contains(["standard", "premium"], var.key_vault_sku_name)
    error_message = "key_vault_sku_name must be one of: standard, premium."
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

variable "key_vault_administrators" {
  description = "List of email addresses for Key Vault administrators"
  type        = list(string)
  validation {
    condition     = alltrue([for email in var.key_vault_administrators : can(regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", email))])
    error_message = "Each administrator must be a valid email address."
  }
}

variable "key_vault_developers" {
  description = "List of email addresses for Key Vault developers"
  type        = list(string)
  validation {
    condition     = alltrue([for email in var.key_vault_developers : can(regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", email))])
    error_message = "Each developer must be a valid email address."
  }
}
