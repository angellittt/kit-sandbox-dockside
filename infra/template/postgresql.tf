resource "random_password" "postgresql_administrator_password" {
  length           = 16
  special          = true
  override_special = "!@#%&*_-"
}

resource "azurerm_postgresql_flexible_server" "postgresql" {
  count                  = var.enable_postgresql ? 1 : 0
  name                   = "${var.project_name}-${var.environment_name}-${var.globally_unique_suffix}"
  resource_group_name    = azurerm_resource_group.resource_group.name
  location               = var.location
  version                = var.postgresql_version
  administrator_login    = var.postgresql_admin_username
  administrator_password = random_password.postgresql_administrator_password.result
  sku_name               = var.postgresql_sku_name
  storage_mb             = var.postgresql_storage_mb
}


resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  count            = var.enable_postgresql ? 1 : 0
  name             = "allow-azure-services"
  server_id        = azurerm_postgresql_flexible_server.postgresql[0].id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
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
