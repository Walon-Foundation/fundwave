"use client"

import { useState } from "react"
import { Save, Shield, Bell, CreditCard, Settings } from "lucide-react"

const mockSettings = {
  general: {
    siteName: "FundWaveSL",
    siteDescription: "Sierra Leone's Premier Crowdfunding Platform",
    contactEmail: "support@fundwavesl.com",
    timezone: "Africa/Freetown",
    language: "en",
    currency: "SLL",
    maintenanceMode: false,
  },
  security: {
    twoFactorRequired: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    kycRequired: true,
    autoSuspendSuspiciousAccounts: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    adminAlerts: true,
    systemUpdates: true,
  },
  payments: {
    orangeMoneyEnabled: true,
    africellMoneyEnabled: true,
    qmoneyEnabled: true,
    bankTransferEnabled: true,
    minimumDonation: 1000,
    maximumDonation: 10000000,
    platformFee: 2.5,
  },
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState("general")
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false)
    alert("Settings saved successfully!")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Settings</h1>
          <p className="text-slate-600">Configure platform-wide settings and preferences</p>
        </div>
        {hasChanges && (
          <button onClick={handleSave} className="btn-primary flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: "general", label: "General", icon: Settings },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "payments", label: "Payments", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "general" && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">General Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Africa/Freetown">Africa/Freetown</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Language</label>
                <select
                  value={settings.general.language}
                  onChange={(e) => handleSettingChange("general", "language", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="kri">Krio</option>
                  <option value="men">Mende</option>
                  <option value="tem">Temne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) => handleSettingChange("general", "currency", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SLL">Sierra Leonean Leone (SLL)</option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Maintenance Mode</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">Enable to temporarily disable public access</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Security Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorRequired}
                    onChange={(e) => handleSettingChange("security", "twoFactorRequired", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Require Two-Factor Authentication</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.kycRequired}
                    onChange={(e) => handleSettingChange("security", "kycRequired", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Require KYC Verification</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password Minimum Length</label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) =>
                    handleSettingChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleSettingChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.autoSuspendSuspiciousAccounts}
                    onChange={(e) => handleSettingChange("security", "autoSuspendSuspiciousAccounts", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Auto-suspend Suspicious Accounts</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Notification Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Email Notifications</span>
                </label>
                <p className="text-xs text-slate-500 ml-6">Send email notifications to users</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">SMS Notifications</span>
                </label>
                <p className="text-xs text-slate-500 ml-6">Send SMS notifications for important events</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Push Notifications</span>
                </label>
                <p className="text-xs text-slate-500 ml-6">Send push notifications to mobile apps</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.adminAlerts}
                    onChange={(e) => handleSettingChange("notifications", "adminAlerts", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Admin Alerts</span>
                </label>
                <p className="text-xs text-slate-500 ml-6">Send alerts to administrators for critical events</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => handleSettingChange("notifications", "systemUpdates", e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">System Update Notifications</span>
                </label>
                <p className="text-xs text-slate-500 ml-6">Notify users about system updates and maintenance</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Payment Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-slate-900 mb-4">Payment Methods</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payments.orangeMoneyEnabled}
                        onChange={(e) => handleSettingChange("payments", "orangeMoneyEnabled", e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Orange Money</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payments.africellMoneyEnabled}
                        onChange={(e) => handleSettingChange("payments", "africellMoneyEnabled", e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Africell Money</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payments.qmoneyEnabled}
                        onChange={(e) => handleSettingChange("payments", "qmoneyEnabled", e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">QMoney</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payments.bankTransferEnabled}
                        onChange={(e) => handleSettingChange("payments", "bankTransferEnabled", e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Bank Transfer</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-slate-900 mb-4">Transaction Limits</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Donation</label>
                    <input
                      type="number"
                      value={settings.payments.minimumDonation}
                      onChange={(e) =>
                        handleSettingChange("payments", "minimumDonation", Number.parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Current: {formatCurrency(settings.payments.minimumDonation)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Donation</label>
                    <input
                      type="number"
                      value={settings.payments.maximumDonation}
                      onChange={(e) =>
                        handleSettingChange("payments", "maximumDonation", Number.parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Current: {formatCurrency(settings.payments.maximumDonation)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Platform Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.payments.platformFee}
                      onChange={(e) =>
                        handleSettingChange("payments", "platformFee", Number.parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Current: {settings.payments.platformFee}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
