import AdminSideBar from "features/admin/components/AdminSideBar";
import { Outlet } from "react-router-dom";
import Pedidos from "features/admin/pages/AdminOrdersPage";

export default function AdminLayout() {
  return (
    <div className="flex h-[calc(100vh-5rem)] gap-20 overflow-hidden px-10 py-20">
      <aside className="">
        <AdminSideBar />
      </aside>
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
