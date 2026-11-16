from datetime import UTC, datetime

from app.modules.pedidos.models import (
    DetallePedido,
    Pedido,
)
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class PedidoNoEncontrado(Exception):
    pass


class PedidoService:
    def __init__(
        self,
        uow: PedidoUnitOfWork,
    ):
        self.uow = uow

    def listar_mios(
        self,
        usuario_id: int,
    ) -> list[PedidoRead]:
        with self.uow as uow:
            pedidos = uow.pedidos.get_by_usuario(
                usuario_id
            )

            return [
                PedidoRead.model_validate(pedido)
                for pedido in pedidos
            ]

    def listar_admin(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> PedidosPaginados:
        with self.uow as uow:
            total, pedidos = uow.pedidos.search(
                skip=skip,
                limit=limit,
            )

            return PedidosPaginados(
                total=total,
                items=[
                    PedidoRead.model_validate(pedido)
                    for pedido in pedidos
                ],
            )

    def obtener_resumen(
        self,
    ) -> ResumenPedidos:
        with self.uow as uow:
            (
                pendientes,
                en_preparacion,
                entregados,
                cancelados,
                pedidos_hoy,
                ingresos_entregados,
            ) = uow.pedidos.get_resumen()

            return ResumenPedidos(
                pendientes=pendientes,
                en_preparacion=en_preparacion,
                entregados=entregados,
                cancelados=cancelados,
                pedidos_hoy=pedidos_hoy,
                ingresos_entregados=ingresos_entregados,
            )

    def obtener_por_id(
        self,
        pedido_id: int,
        usuario_id: int,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_with_items(
                pedido_id
            )

            if (
                pedido is None
                or pedido.usuario_id != usuario_id
            ):
                raise PedidoNoEncontrado(
                    f"Pedido {pedido_id} no encontrado"
                )

            return PedidoRead.model_validate(
                pedido
            )

    def cambiar_estado(
        self,
        pedido_id: int,
        data: CambioEstado,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_with_items(
                pedido_id
            )

            if pedido is None:
                raise PedidoNoEncontrado(
                    f"Pedido {pedido_id} no encontrado"
                )

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(UTC)

            uow.pedidos.add(
                pedido
            )

            return PedidoRead.model_validate(
                pedido
            )

    def crear(
        self,
        usuario_id: int,
        data: PedidoCreate,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0,
            )

            pedido = uow.pedidos.add(
                pedido
            )

            total = 0.0
            detalles = []

            for item in data.items:
                producto = uow.productos.get_activo_by_id(
                    item.producto_id
                )

                if producto is None:
                    raise ProductoNoEncontrado(
                        f"Producto {item.producto_id} no encontrado"
                    )

                if not producto.disponible:
                    raise ProductoNoDisponible(
                        f"Producto {producto.nombre} no disponible"
                    )

                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        f"Stock insuficiente para {producto.nombre}"
                    )

                subtotal = (
                    producto.precio_base
                    * item.cantidad
                )

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )

                uow.session.add(
                    detalle
                )

                producto.stock -= item.cantidad

                if producto.stock == 0:
                    producto.disponible = False

                uow.productos.add(
                    producto
                )

                detalles.append(detalle)
                total += subtotal

            pedido.total = total
            pedido.updated_at = datetime.now(UTC)

            pedido.items = detalles

            uow.pedidos.add(
                pedido
            )

            return PedidoRead.model_validate(
                pedido
            )