# Keeping env names short to avoid hitting resource name length limits when combined with project_name and random suffix
variable "environment_name" {
  description = "The environment to deploy to (prod, dev, qa, stg)"
  type        = string

  validation {
    condition     = contains(["prod", "dev", "qa", "stg"], var.environment_name)
    error_message = "environment_name must be one of: prod, dev, qa, stg."
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

variable "globally_unique_suffix" {
  description = "A short string that can be used in resources that need a property that must be globally unique"
  type        = string
  default     = "ttt"
}

variable "enable_postgresql" {
  description = "Whether to provision the PostgreSQL Flexible Server and related configuration"
  type        = bool
  default     = true
}

variable "postgresql_admin_username" {
  description = "Administrator username for the PostgreSQL Flexible Server"
  type        = string
  default     = "psqladmin"
}

variable "postgresql_sku_name" {
  description = "SKU name for the PostgreSQL Flexible Server"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgresql_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "16" # Postgresql 17 and 18 are still not supported 
}

variable "postgresql_storage_mb" {
  description = "Storage size in MB for the PostgreSQL Flexible Server"
  type        = number
  default     = 32768
}

variable "app_service_plan_sku" {
  description = "SKU name for the App Service Plan (e.g. B1, B2, P1v2)"
  type        = string
  default     = "B1"
}

variable "storage_account_replication_type" {
  description = "Replication type for the Storage Account (LRS, GRS, RAGRS, ZRS)"
  type        = string
  default     = "LRS"

  validation {
    condition     = contains(["LRS", "GRS", "RAGRS", "ZRS"], var.storage_account_replication_type)
    error_message = "storage_account_replication_type must be one of: LRS, GRS, RAGRS, ZRS."
  }
}

variable "storage_container_name" {
  description = "Name of the blob storage container"
  type        = string
  default     = "uploads"
}
