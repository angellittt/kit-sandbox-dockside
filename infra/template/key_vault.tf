resource "azurerm_key_vault" "key_vault" {
  name                        = "${var.project_name}-${var.environment_name}-${var.globally_unique_suffix}"
  resource_group_name         = azurerm_resource_group.resource_group.name
  location                    = var.location
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = var.key_vault_sku_name
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  enable_rbac_authorization   = true
  enabled_for_disk_encryption = true

}

# Each email must match the user's Azure AD `mail` attribute exactly, and every
# listed user must exist in the tenant, otherwise this data source errors and
# fails the apply.
data "azuread_users" "developers" {
  mails = var.key_vault_developers
}
data "azuread_users" "admins" {
  mails = var.key_vault_administrators
}


# Allows admins to manage the vault and add role assignments
resource "azurerm_role_assignment" "admin_vault_role" {
  for_each             = toset(data.azuread_users.admins.object_ids)
  scope                = azurerm_key_vault.key_vault.id
  role_definition_name = "Key Vault Data Access Administrator"
  principal_id         = each.key
}
# Allow admins to read/set secrets
resource "azurerm_role_assignment" "admin_vault_secrets_role" {
  for_each             = toset(data.azuread_users.admins.object_ids)
  scope                = azurerm_key_vault.key_vault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = each.key
}

# Allows all developers to read/set secrets, certificates and keys. Cannot manage key vault resources or manage role assignments
resource "azurerm_role_assignment" "developers_secrets_role" {
  for_each             = toset(data.azuread_users.developers.object_ids)
  scope                = azurerm_key_vault.key_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = each.key
  depends_on           = [azurerm_role_assignment.admin_vault_role]
}
