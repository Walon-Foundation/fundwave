import React from "react";
import AdminSidebarLayout from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarLayout>
      <Toaster richColors closeButton position="top-center" duration={2500} />
      <div className="px-4 py-6">
        {children}
      </div>
    </AdminSidebarLayout>
  );
}
