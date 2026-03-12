
resource "azurerm_static_web_app" "static_web_app" {
  name                = "${var.project_name}-${var.environment_name}-${random_string.globally_unique_suffix.result}"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.swa_location
}
