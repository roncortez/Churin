import { Link } from "react-router-dom";

export default function AdminSideBar() {
  return (
    <nav className="flex h-full flex-col gap-4 border-r-2 px-10 py-5">
      <Link to="/admin/overview">Resumen</Link>
      <Link to="/admin/orders">Órdenes</Link>
      <Link to="/admin/clients">Clientes</Link>
      <Link to="/admin/sales">Ventas</Link>
      <Link to="/admin/menu">Menú</Link>
      <Link to="/admin/promotions">Promociones</Link>
      <Link to="/admin/settings">Configuración</Link>
    </nav>
  );
}
