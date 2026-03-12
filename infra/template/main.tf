# A 3 char random string that can be used in resources that need a property that must be globally unique 
resource "random_string" "globally_unique_suffix" {
  length  = 3
  special = false
  upper   = false
  numeric = false
}

resource "azurerm_resource_group" "resource_group" {
  name     = "${var.project_name}_${var.environment_name}"
  location = var.location
}

