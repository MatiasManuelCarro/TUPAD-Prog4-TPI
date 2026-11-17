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


class ProductoRepetido(Exception):
    pass


class PedidoNoEncontrado(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class CancelacionNoPermitida(Exception):
    pass


TRANSICIONES_VALIDAS = {
    "PENDIENTE": {
        "EN_PREPARACION",
        "CANCELADO",
    },
    "EN_PREPARACION": {
        "ENTREGADO",
        "CANCELADO",
    },
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoService:
    def __init__(
        self,
        uow: PedidoUnitOfWork,
    ):
        self.uow = uow

    def listar(
        self,
        usuario_id: int,
        es_admin: bool,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            if es_admin:
                total, pedidos = uow.pedidos.search(
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )
            else:
                total, pedidos = uow.pedidos.get_by_usuario(
                    usuario_id=usuario_id,
                    skip=skip,
                    limit=limit,
                    estado=estado,
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
        es_admin: bool,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_with_items(
                pedido_id
            )

            if pedido is None:
                raise PedidoNoEncontrado(
                    f"Pedido {pedido_id} no encontrado"
                )

            if (
                pedido.usuario_id != usuario_id
                and not es_admin
            ):
                raise PedidoAjeno(
                    "No tienes permisos para consultar este pedido"
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

            estados_permitidos = TRANSICIONES_VALIDAS[
                pedido.estado
            ]

            if data.estado not in estados_permitidos:
                raise TransicionInvalida(
                    f"No se puede pasar de {pedido.estado} "
                    f"a {data.estado}"
                )

            if data.estado == "CANCELADO":
                for detalle in pedido.items:
                    producto = uow.productos.get_by_id(
                        detalle.producto_id
                    )

                    if producto is not None:
                        producto.stock += detalle.cantidad
                        producto.disponible = True

                        uow.productos.add(
                            producto
                        )

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(UTC)

            uow.pedidos.add(
                pedido
            )

            return PedidoRead.model_validate(
                pedido
            )

    def cancelar(
        self,
        pedido_id: int,
        usuario_id: int,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_with_items(
                pedido_id
            )

            if pedido is None:
                raise PedidoNoEncontrado(
                    f"Pedido {pedido_id} no encontrado"
                )

            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno(
                    "No tienes permisos para cancelar este pedido"
                )

            if pedido.estado != "PENDIENTE":
                raise CancelacionNoPermitida(
                    "Solo se puede cancelar un pedido PENDIENTE"
                )

            for detalle in pedido.items:
                producto = uow.productos.get_by_id(
                    detalle.producto_id
                )

                if producto is not None:
                    producto.stock += detalle.cantidad
                    producto.disponible = True

                    uow.productos.add(
                        producto
                    )

            pedido.estado = "CANCELADO"
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
            productos_ids = [
                item.producto_id
                for item in data.items
            ]

            if len(productos_ids) != len(set(productos_ids)):
                raise ProductoRepetido(
                    "No se puede repetir un producto en el pedido"
                )

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

                detalles.append(
                    detalle
                )

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