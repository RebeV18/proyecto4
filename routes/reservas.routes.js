const express = require("express");
const {
  obtenerReservas,
  crearReserva,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  obtenerReservasPorHotel,
  obtenerReservasPorFechas,
  obtenerReservasPorHabitacion,
  obtenerReservasPorEstado,
  obtenerReservasPorNum_Pax,
} = require("../controllers/reservas.controller");

const router = express.Router();

router.get("/", obtenerReservas); // Obtener todas las reservas
router.post("/", crearReserva); // Crear una Reserva
router.get("/hotel", obtenerReservasPorHotel); //Obtener reservas filtradas por hotel
router.get("/fechas", obtenerReservasPorFechas); //Obtener reservas filtradas por hotel
router.get("/tipo_habitacion", obtenerReservasPorHabitacion); //Obtener reservas filtradas por tipo de habitación
router.get("/estado", obtenerReservasPorEstado); //Obtener reservas filtradas por estado
router.get("/num_huespedes", obtenerReservasPorNum_Pax); //Obtener reservas filtradas por número de huéspedes
router.get("/:id", obtenerReservaPorId); // obtener una reserva por ID
router.put("/:id", actualizarReserva); // Actualizar reserva
router.delete("/:id", eliminarReserva); // Eliminar la reserva por ID
module.exports = router;
