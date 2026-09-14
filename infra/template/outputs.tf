output "app_service_id" {
  description = "The ID of the App Service"
  value       = azurerm_linux_web_app.app_service.id
}

output "app_service_name" {
  description = "The name of the App Service"
  value       = azurerm_linux_web_app.app_service.name
}

output "app_service_default_hostname" {
  description = "The default hostname of the App Service"
  value       = azurerm_linux_web_app.app_service.default_hostname
}

output "app_service_identity_principal_id" {
  description = "The principal ID of the App Service managed identity"
  value       = azurerm_linux_web_app.app_service.identity[0].principal_id
}

output "app_service_plan_id" {
  description = "The ID of the App Service Plan"
  value       = azurerm_service_plan.app_service_plan.id
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

output "key_vault_id" {
  description = "The ID of the Key Vault"
  value       = azurerm_key_vault.key_vault.id
}

output "key_vault_uri" {
  description = "The URI of the Key Vault"
  value       = azurerm_key_vault.key_vault.vault_uri
}

output "key_vault_name" {
  description = "The name of the Key Vault"
  value       = azurerm_key_vault.key_vault.name
}

output "postgresql_id" {
  description = "The ID of the PostgreSQL Flexible Server"
  value       = one(azurerm_postgresql_flexible_server.postgresql[*].id)
}

output "postgresql_fqdn" {
  description = "The FQDN of the PostgreSQL Flexible Server"
  value       = one(azurerm_postgresql_flexible_server.postgresql[*].fqdn)
}

output "postgresql_name" {
  description = "The name of the PostgreSQL Flexible Server"
  value       = one(azurerm_postgresql_flexible_server.postgresql[*].name)
}

output "postgresql_admin_login" {
  description = "The administrator login for the PostgreSQL Flexible Server"
  value       = one(azurerm_postgresql_flexible_server.postgresql[*].administrator_login)
}

output "postgresql_admin_password" {
  description = "The administrator password for the PostgreSQL Flexible Server"
  value       = one(azurerm_postgresql_flexible_server.postgresql[*].administrator_password)
  sensitive   = true
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

output "swa_publish_token" {
  description = "The deployment/publish token for the Static Web App"
  value       = azurerm_static_web_app.static_web_app.api_key
  sensitive   = true
}
