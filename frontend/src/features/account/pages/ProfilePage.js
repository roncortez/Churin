import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "shared/ui/Loading";
import { useAuth } from "app/context/AuthContext";

const Profile = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [cliente, setCliente] = useState("");
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      // si no hay usuario, limpia estados y sal
      if (!currentUser) {
        setCliente("");
        setPedidos([]);
        return;
      }

      setLoading(true);
      try {
        // 1) obtener cliente
        const r1 = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`,
          { email: currentUser.email },
          { signal: controller.signal },
        );
        if (cancelled) return;
        setCliente(r1.data);

        // 2) obtener pedidos (depende de cliente.id)
        if (r1.data && r1.data.id) {
          const r2 = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/pedido/${r1.data.id}`,
            { signal: controller.signal },
          );
          if (cancelled) return;
          setPedidos(r2.data);
        } else {
          setPedidos([]);
        }
      } catch (err) {
        if (!cancelled) console.log(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [currentUser]);

  if (loading) return <Loading />;

  return (
    <div className="p-5 sm:p-10">
      <div className="mx-auto flex w-full flex-col gap-5 sm:w-1/2">
        <h2 className="font-paytone text-3xl font-bold">
          ¡Hola {cliente.first_name}!
        </h2>

        <h3 className="font-paytone text-2xl font-semibold">
          {pedidos && pedidos.length > 0
            ? "Pedidos realizados"
            : "Aún no has realizado pedidos"}
        </h3>
        <ul className="font-comfortaa">
          {pedidos &&
            pedidos.map((pedido) => (
              <li
                className="mt-10 rounded-lg bg-white p-5 shadow-md"
                key={pedido.id_pedido}
              >
                {/* 📌 Fecha y total alineados */}
                <div className="flex justify-between text-sm font-semibold sm:w-2/3 sm:justify-between sm:text-lg">
                  <div className="flex items-center sm:w-1/2">
                    <span>📅</span>
                    <span>{pedido.fecha}</span>
                  </div>
                  <div className="flex w-1/4 items-center justify-center">
                    <span>💰</span>
                    <span>${pedido.total}</span>
                  </div>
                  {pedido.lugar_envio ? (
                    <div className="flex w-1/4 items-center justify-center">
                      <span>🛵</span>
                      <span>{pedido.lugar_envio}</span>
                    </div>
                  ) : (
                    <div className="flex w-1/4 items-center justify-center">
                      <span>Retiro</span>
                    </div>
                  )}
                </div>

                {/* 📌 Detalles, envio y estado */}
                <div className="mt-5 flex items-center">
                  <ul className="flex w-1/2 flex-col">
                    {pedido.detalles.map((detalle) => (
                      <li
                        key={detalle.id_detalle}
                        className="mb-4 flex items-center justify-between"
                      >
                        <div className="ml-6">
                          {detalle.plato}
                          <ul className="ml-6 flex list-disc flex-col">
                            {detalle.ingredientes &&
                              detalle.ingredientes.map((ingrediente) => (
                                <li className="text-xs">
                                  {ingrediente.nombre}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="font-semibold">
                          {detalle.cantidad} x ${detalle.precio_unitario}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* 📌 Estado del pedido como badge */}
                  <div className="flex w-1/2 justify-center">
                    <span className="rounded-full bg-lime-400 p-3 text-sm font-semibold">
                      Recibido
                    </span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
