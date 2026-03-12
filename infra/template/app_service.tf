resource "azurerm_service_plan" "app_service_plan" {
  name                = "${var.project_name}-${var.environment_name}-${var.globally_unique_suffix}"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
}

resource "azurerm_linux_web_app" "app_service" {
  name                = "${var.project_name}-${var.environment_name}-${var.globally_unique_suffix}"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      docker_image_name   = "${var.project_name}:latest"
      docker_registry_url = "https://${azurerm_container_registry.container_registry.login_server}"
    }
  }

  app_settings = {
    "POSTGRESQL_HOST"     = azurerm_postgresql_flexible_server.postgresql.fqdn
    "POSTGRESQL_USER"     = var.postgresql_admin_username
    "POSTGRESQL_DB"       = var.project_name
    "POSTGRESQL_PASSWORD" = azurerm_postgresql_flexible_server.postgresql.administrator_password
  }

  lifecycle {
    ignore_changes = [app_settings]
  }
}

resource "azurerm_role_assignment" "app_service_acr_pull" {
  scope                = azurerm_container_registry.container_registry.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.app_service.identity[0].principal_id
}

resource "azurerm_role_assignment" "app_service_key_vault_secrets" {
  scope                = azurerm_key_vault.key_vault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.app_service.identity[0].principal_id
}

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
