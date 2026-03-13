resource "azurerm_storage_account" "storage_account" {
  name                     = "${var.project_name}${var.environment_name}${var.globally_unique_suffix}"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type
}

resource "azurerm_storage_container" "storage_container" {
  name                  = var.storage_container_name
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "private"
}

resource "azurerm_role_assignment" "app_service_storage_blob_contributor" {
  scope                = azurerm_storage_account.storage_account.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_web_app.app_service.identity[0].principal_id
}

output "storage_account_id" {
  description = "The ID of the Storage Account"
  value       = azurerm_storage_account.storage_account.id
}

output "storage_account_name" {
  description = "The name of the Storage Account"
  value       = azurerm_storage_account.storage_account.name
}

output "storage_account_primary_blob_endpoint" {
  description = "The primary blob endpoint of the Storage Account"
  value       = azurerm_storage_account.storage_account.primary_blob_endpoint
}

output "storage_container_name" {
  description = "The name of the Storage Container"
  value       = azurerm_storage_container.storage_container.name
}
