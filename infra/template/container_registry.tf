resource "azurerm_container_registry" "container_registry" {
  name                = "${var.project_name}${var.environment_name}${random_string.globally_unique_suffix.result}"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.location
  sku                 = var.container_registry_sku
  admin_enabled       = true
}

output "container_registry_id" {
  description = "The ID of the Container Registry"
  value       = azurerm_container_registry.container_registry.id
}

output "container_registry_login_server" {
  description = "The login server URL of the Container Registry"
  value       = azurerm_container_registry.container_registry.login_server
}

output "container_registry_name" {
  description = "The name of the Container Registry"
  value       = azurerm_container_registry.container_registry.name
}
output "container_registry_admin_username" {
  description = "The admin username for the Container Registry"
  value       = azurerm_container_registry.container_registry.admin_username
}

output "container_registry_admin_password" {
  description = "The admin password for the Container Registry"
  value       = azurerm_container_registry.container_registry.admin_password
  sensitive   = true
}
