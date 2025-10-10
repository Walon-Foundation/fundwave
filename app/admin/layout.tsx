import React from "react";
import AdminSidebarLayout from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarLayout>
      <div className="px-4 py-6">
        {children}
      </div>
    </AdminSidebarLayout>
  );
}
