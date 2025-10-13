"use client";

import { useEffect, useState } from "react";
import { Settings, Save, AlertTriangle, Shield, Bell, Database, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Platform Settings
    maintenanceMode: false,
    newRegistrations: true,
    campaignCreation: true,
    
    // Feature Flags
    chatEnabled: true,
    notificationsEnabled: true,
    kycRequired: true,
    
    // Limits
    maxCampaignGoal: '10000000', // 10M SLE
    minCampaignGoal: '50000',    // 50K SLE
    campaignDurationLimit: '365', // days
    
    // Notifications
    adminEmailAlerts: true,
    reportThreshold: '5',
    
    // Content Moderation
    autoModerationEnabled: true,
    requireApproval: false,
    
    // System
    backupFrequency: 'daily',
    logRetentionDays: '90',

    // Theme / Footer / SEO
    theme: {
      primaryColor: '#006C67',
      accentColor: '#F9A826',
      mode: 'light' as 'light'|'dark',
    },
    footer: {
      contactEmail: 'info@fundwavesl.org',
      socialLinks: { facebook: '', twitter: '', instagram: '' },
    },
    seo: {
      metaTitle: 'FundWaveSL',
      metaDescription: 'Crowdfunding for Sierra Leone',
      keywords: 'fundraising,Sierra Leone,crowdfunding',
    },
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.ok && data.data?.config) {
          setSettings({
            maintenanceMode: !!data.data.config.maintenanceMode,
            newRegistrations: !!data.data.config.newRegistrations,
            campaignCreation: !!data.data.config.campaignCreation,
            chatEnabled: !!data.data.config.chatEnabled,
            notificationsEnabled: !!data.data.config.notificationsEnabled,
            kycRequired: !!data.data.config.kycRequired,
            maxCampaignGoal: String(data.data.config?.limits?.maxCampaignGoal ?? '10000000'),
            minCampaignGoal: String(data.data.config?.limits?.minCampaignGoal ?? '50000'),
            campaignDurationLimit: String(data.data.config?.limits?.campaignDurationLimit ?? '365'),
            adminEmailAlerts: !!data.data.config.adminEmailAlerts,
            reportThreshold: String(data.data.config.reportThreshold ?? '5'),
            autoModerationEnabled: !!data.data.config.autoModerationEnabled,
            requireApproval: !!data.data.config.requireApproval,
            backupFrequency: String(data.data.config.backupFrequency ?? 'daily'),
            logRetentionDays: String(data.data.config.logRetentionDays ?? '90'),
            theme: {
              primaryColor: data.data.config?.theme?.primaryColor ?? '#006C67',
              accentColor: data.data.config?.theme?.accentColor ?? '#F9A826',
              mode: (data.data.config?.theme?.mode ?? 'light'),
            },
            footer: {
              contactEmail: data.data.config?.footer?.contactEmail ?? 'info@fundwavesl.org',
              socialLinks: {
                facebook: data.data.config?.footer?.socialLinks?.facebook ?? '',
                twitter: data.data.config?.footer?.socialLinks?.twitter ?? '',
                instagram: data.data.config?.footer?.socialLinks?.instagram ?? '',
              }
            },
            seo: {
              metaTitle: data.data.config?.seo?.metaTitle ?? 'FundWaveSL',
              metaDescription: data.data.config?.seo?.metaDescription ?? 'Crowdfunding for Sierra Leone',
              keywords: (Array.isArray(data.data.config?.seo?.keywords) ? data.data.config.seo.keywords.join(',') : (data.data.config?.seo?.keywords ?? 'fundraising,Sierra Leone,crowdfunding')),
            },
          });
        }
      } catch {}
    };
    load();
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config = {
        maintenanceMode: settings.maintenanceMode,
        newRegistrations: settings.newRegistrations,
        campaignCreation: settings.campaignCreation,
        chatEnabled: settings.chatEnabled,
        notificationsEnabled: settings.notificationsEnabled,
        kycRequired: settings.kycRequired,
        limits: {
          maxCampaignGoal: Number(settings.maxCampaignGoal),
          minCampaignGoal: Number(settings.minCampaignGoal),
          campaignDurationLimit: Number(settings.campaignDurationLimit),
        },
        adminEmailAlerts: settings.adminEmailAlerts,
        reportThreshold: Number(settings.reportThreshold),
        autoModerationEnabled: settings.autoModerationEnabled,
        requireApproval: settings.requireApproval,
        backupFrequency: settings.backupFrequency,
        logRetentionDays: Number(settings.logRetentionDays),
        theme: settings.theme,
        footer: settings.footer,
        seo: {
          metaTitle: settings.seo.metaTitle,
          metaDescription: settings.seo.metaDescription,
          keywords: settings.seo.keywords.split(',').map(s => s.trim()).filter(Boolean),
        },
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      await res.json();
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      maximumFractionDigits: 0,
    }).format(parseInt(amount) || 0);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Platform Settings</h2>
          <p className="text-neutral-600">Configure platform-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Platform Status
          </CardTitle>
          <CardDescription>
            Control overall platform availability and access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Temporarily disable public access to the platform
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
            />
          </div>
          
          {settings.maintenanceMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Platform is in maintenance mode</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Users will see a maintenance page and won&apos;t be able to access the platform
              </p>
            </div>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="registrations">New User Registrations</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              id="registrations"
              checked={settings.newRegistrations}
              onCheckedChange={(checked) => handleSettingChange('newRegistrations', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="campaigns">Campaign Creation</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Allow users to create new campaigns
              </p>
            </div>
            <Switch
              id="campaigns"
              checked={settings.campaignCreation}
              onCheckedChange={(checked) => handleSettingChange('campaignCreation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Brand colors and mode</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Primary Color</Label>
            <Input value={settings.theme.primaryColor} onChange={(e)=> setSettings(p=>({...p, theme: {...p.theme, primaryColor: e.target.value}}))} />
          </div>
          <div>
            <Label>Accent Color</Label>
            <Input value={settings.theme.accentColor} onChange={(e)=> setSettings(p=>({...p, theme: {...p.theme, accentColor: e.target.value}}))} />
          </div>
          <div>
            <Label>Mode (light/dark)</Label>
            <Input value={settings.theme.mode} onChange={(e)=> setSettings(p=>({...p, theme: {...p.theme, mode: (e.target.value as any)}}))} />
          </div>
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Contact and social links</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Contact Email</Label>
            <Input value={settings.footer.contactEmail} onChange={(e)=> setSettings(p=>({...p, footer: {...p.footer, contactEmail: e.target.value}}))} />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input value={settings.footer.socialLinks.facebook} onChange={(e)=> setSettings(p=>({...p, footer: {...p.footer, socialLinks: {...p.footer.socialLinks, facebook: e.target.value}}}))} />
          </div>
          <div>
            <Label>Twitter/X</Label>
            <Input value={settings.footer.socialLinks.twitter} onChange={(e)=> setSettings(p=>({...p, footer: {...p.footer, socialLinks: {...p.footer.socialLinks, twitter: e.target.value}}}))} />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input value={settings.footer.socialLinks.instagram} onChange={(e)=> setSettings(p=>({...p, footer: {...p.footer, socialLinks: {...p.footer.socialLinks, instagram: e.target.value}}}))} />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Meta tags for the site</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Meta Title</Label>
            <Input value={settings.seo.metaTitle} onChange={(e)=> setSettings(p=>({...p, seo: {...p.seo, metaTitle: e.target.value}}))} />
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea value={settings.seo.metaDescription} onChange={(e)=> setSettings(p=>({...p, seo: {...p.seo, metaDescription: e.target.value}}))} rows={3} />
          </div>
          <div>
            <Label>Keywords (comma-separated)</Label>
            <Input value={settings.seo.keywords} onChange={(e)=> setSettings(p=>({...p, seo: {...p.seo, keywords: e.target.value}}))} />
          </div>
        </CardContent>
      </Card>

      {/* Feature Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Feature Controls
          </CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="chat">Campaign Chat System</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Enable real-time chat on campaign pages
              </p>
            </div>
            <Switch
              id="chat"
              checked={settings.chatEnabled}
              onCheckedChange={(checked) => handleSettingChange('chatEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Send push notifications to users
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="kyc">KYC Requirement</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Require KYC verification for campaign creation
              </p>
            </div>
            <Switch
              id="kyc"
              checked={settings.kycRequired}
              onCheckedChange={(checked) => handleSettingChange('kycRequired', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaign Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Campaign Limits
          </CardTitle>
          <CardDescription>
            Set platform-wide limits for campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxGoal">Maximum Campaign Goal</Label>
            <Input
              id="maxGoal"
              type="number"
              value={settings.maxCampaignGoal}
              onChange={(e) => handleSettingChange('maxCampaignGoal', e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-neutral-600 mt-1">
              Currently: {formatCurrency(settings.maxCampaignGoal)}
            </p>
          </div>
          
          <div>
            <Label htmlFor="minGoal">Minimum Campaign Goal</Label>
            <Input
              id="minGoal"
              type="number"
              value={settings.minCampaignGoal}
              onChange={(e) => handleSettingChange('minCampaignGoal', e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-neutral-600 mt-1">
              Currently: {formatCurrency(settings.minCampaignGoal)}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="duration">Maximum Campaign Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              value={settings.campaignDurationLimit}
              onChange={(e) => handleSettingChange('campaignDurationLimit', e.target.value)}
              className="mt-1 max-w-xs"
            />
            <p className="text-sm text-neutral-600 mt-1">
              Maximum duration: {settings.campaignDurationLimit} days ({Math.round(parseInt(settings.campaignDurationLimit) / 30)} months)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Moderation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>
            Configure content moderation and approval workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="automod">Auto-Moderation</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Automatically flag potentially inappropriate content
              </p>
            </div>
            <Switch
              id="automod"
              checked={settings.autoModerationEnabled}
              onCheckedChange={(checked) => handleSettingChange('autoModerationEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="approval">Require Approval</Label>
              <p className="text-sm text-neutral-600 mt-1">
                All new campaigns must be approved before going live
              </p>
            </div>
            <Switch
              id="approval"
              checked={settings.requireApproval}
              onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="threshold">Report Alert Threshold</Label>
            <Input
              id="threshold"
              type="number"
              value={settings.reportThreshold}
              onChange={(e) => handleSettingChange('reportThreshold', e.target.value)}
              className="mt-1 max-w-xs"
            />
            <p className="text-sm text-neutral-600 mt-1">
              Send admin alerts when content receives {settings.reportThreshold} or more reports
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Admin Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Admin Notifications
          </CardTitle>
          <CardDescription>
            Configure when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailalerts">Email Alerts</Label>
              <p className="text-sm text-neutral-600 mt-1">
                Receive email notifications for critical platform events
              </p>
            </div>
            <Switch
              id="emailalerts"
              checked={settings.adminEmailAlerts}
              onCheckedChange={(checked) => handleSettingChange('adminEmailAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure system maintenance and data retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="retention">Log Retention (days)</Label>
            <Input
              id="retention"
              type="number"
              value={settings.logRetentionDays}
              onChange={(e) => handleSettingChange('logRetentionDays', e.target.value)}
              className="mt-1 max-w-xs"
            />
            <p className="text-sm text-neutral-600 mt-1">
              System logs will be automatically deleted after {settings.logRetentionDays} days
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Current System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Platform Version:</span>
                <Badge variant="outline">v0.1.4</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Last Backup:</span>
                <span className="text-blue-600">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">System Health:</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
          <CardDescription>
            Current deployment and configuration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-neutral-700">Node Environment:</span>
              <Badge className="ml-2">{process.env.NODE_ENV || 'development'}</Badge>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Admin Host:</span>
              <Badge className="ml-2 bg-blue-100 text-blue-800">admin.fundwavesl.org</Badge>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Build Time:</span>
              <span className="ml-2 text-neutral-600">{new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Region:</span>
              <span className="ml-2 text-neutral-600">Sierra Leone</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
