const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

// Ruta al archivo reservas.json
const reservasFilePath = path.join(__dirname, "../data/reservas.json");

// Función para leer el archivo
const leerReservas = async () => {
  try {
    const data = await fs.readFileSync(reservasFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("El archivo reservas.json no existe.");
      return [];
    } else {
      console.error("Error al leer el archivo reservas.json:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }
};

// Función para escribir en el archivo
const guardarReservas = async (reservas) => {
  try {
    await fs.writeFileSync(
      reservasFilePath,
      JSON.stringify(reservas, null, 2),
      "utf8"
    );
    return true; // Indica que la operación fue exitosa
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("El archivo reservas.json no existe.");
      return false; // <-- Devuelve `false` para mantener consistencia
    } else {
      console.error("Error al guardar el archivo reservas.json:", error);
      return false;
    }
  }
};

// Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await leerReservas();
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json("Error ingresando a la base de datos para obtener reservas");
  }
};

// Obtener una reserva específica por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }
    const reservas = await leerReservas();
    const reserva = reservas.find((r) => r.id === id);
    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send("Error obteniendo la información de la reserva buscada.");
  }
};

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  try {
    const { hotel, fecha_inicio, fecha_fin, tipo_habitacion, num_huespedes, estado } = req.body;

    if (!hotel || !fecha_inicio || !fecha_fin || !tipo_habitacion || !num_huespedes || !estado) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    if (
      isNaN(parseInt(num_huespedes, 10)) ||
      parseInt(num_huespedes, 10) <= 0
    ) {
      return res
        .status(400)
        .json({ mensaje: "num_huespedes debe ser un número entero positivo" });
    }
    if (
      typeof hotel !== "string" ||
      typeof fecha_inicio !== "string" ||
      typeof fecha_fin !== "string" ||
      typeof tipo_habitacion !== "string" ||
      typeof estado !== "string"
    ) {
      return res.status(400).json({ mensaje: "Tipos de datos no válidos" });
    }

    const reservas = await leerReservas();
    const nuevaReserva = {
      id: reservas.length + 1, // Generar ID único
      ...req.body, // Los datos se envían en el cuerpo de la solicitud
    };
    reservas.push(nuevaReserva);
    await guardarReservas(reservas);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando la reserva.");
  }
};

// Eliminar una reserva por ID
const eliminarReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }
    const reservas = await leerReservas();
    const index = reservas.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(400).json({ mensaje: "Reserva no encontrada" });
    }
    const reservaEliminada = reservas.splice(index, 1);
    await guardarReservas(reservas);
    res.json(reservaEliminada[0]);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error eliminando la reserva.");
  }
};

// Actualizar una reserva por ID
const actualizarReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }
    const { hotel, fecha_inicio, fecha_fin, tipo_habitacion, num_huespedes, estado } = req.body;

    if (!hotel || !fecha_inicio || !fecha_fin || !tipo_habitacion || !num_huespedes || !estado) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    if (
      isNaN(parseInt(num_huespedes, 10)) ||
      parseInt(num_huespedes, 10) <= 0
    ) {
      return res
        .status(400)
        .json({ mensaje: "num_huespedes debe ser un número entero positivo" });
    }
    if (
      typeof hotel !== "string" ||
      typeof fecha_inicio !== "string" ||
      typeof fecha_fin !== "string" ||
      typeof tipo_habitacion !== "string" ||
      typeof estado !== "string"
    ) {
      return res.status(400).json({ mensaje: "Tipos de datos no válidos" });
    }

    const reservas = await leerReservas();
    const index = await reservas.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(400).json({ mensaje: "Reserva no encontrada" });
    }
    reservas[index] = { ...reservas[index], ...req.body };
    await guardarReservas(reservas);
    res.json(reservas[index]);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error editando la reserva.");
  }
};

//Obtener reservas filtradas por Hotel
const obtenerReservasPorHotel = async (req, res) => {
  try {
    if (!req.query.hotel) {
      return res
        .status(400)
        .json({ mensaje: "El parámetro 'hotel' es obligatorio." });
    }
    const reservas = await leerReservas();
    const filtradasPorHotel = reservas.filter(
      (r) => r.hotel === req.query.hotel
    );

    if (filtradasPorHotel.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron reservas en el hotel seleccionado",
      });
    }
    res.json(filtradasPorHotel);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error obteniento las reservas filtradas.");
  }
};

//Obtener reservas filtradas por fechas
const obtenerReservasPorFechas = async (req, res) => {
  const reservas = await leerReservas();
  const { fecha_inicio, fecha_fin } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ mensaje: "Se requieren las fechas de inicio y fin" });
  }

  // Convertimos las fechas del query a objetos Day.js con formato estricto
  const inicio = dayjs(fecha_inicio, "YYYY-MM-DD", true);
  const fin = dayjs(fecha_fin, "YYYY-MM-DD", true);

  if (!inicio.isValid() || !fin.isValid()) {
    return res.status(400).json({ mensaje: "Las fechas proporcionadas no son válidas" });
  }

  // Filtrar reservas que estén dentro del rango de fechas
  const filtradasPorFechas = reservas.filter((reserva) => {
    if (!reserva.fecha_inicio || !reserva.fecha_fin) return false;

    let reservaInicio = dayjs(reserva.fecha_inicio, "YYYY-MM-DD", true);
    let reservaFin = dayjs(reserva.fecha_fin, "YYYY-MM-DD", true);

    // Condición corregida: la reserva debe estar completamente dentro del rango
    return (
      reservaInicio.isValid() &&
      reservaFin.isValid() &&
      (reservaInicio.isSame(inicio) || reservaInicio.isAfter(inicio)) && // Inicio de reserva después o el mismo día
      (reservaFin.isSame(fin) || reservaFin.isBefore(fin)) // Fin de reserva antes o el mismo día
    );
  });

  if (filtradasPorFechas.length === 0) {
    console.log("⚠️ No se encontraron reservas en el rango de fechas");
    return res.status(404).json({ mensaje: "No se encontraron reservas en el rango de fechas seleccionado" });
  }

  res.json(filtradasPorFechas);
};


//Obtener reservas filtradas por tipo de habitación
const obtenerReservasPorHabitacion = async (req, res) => {
  try {
    if (!req.query.tipo_habitacion) {
      return res
        .status(400)
        .json({ mensaje: "El parámetro 'tipo_habitacion' es obligatorio." });
    }
    const reservas = await leerReservas();
    const fitradasPorHabitacion = reservas.filter(
      (r) => r.tipo_habitacion === req.query.tipo_habitacion
    );
    if (fitradasPorHabitacion.length === 0) {
      return res.status(400).json({
        mensaje:
          "No se encontraron reservas con el tipo de habitación seleccionado",
      });
    }
    res.json(fitradasPorHabitacion);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error obteniento las reservas filtradas.");
  }
};

//Obtener reservas filtradas por estado
const obtenerReservasPorEstado = async (req, res) => {
  try {
    if (!req.query.estado) {
      return res
        .status(400)
        .json({ mensaje: "El parámetro 'estado' es obligatorio." });
    }
    const reservas = await leerReservas();
    const fitradasPorEstado = reservas.filter(
      (r) => r.estado === req.query.estado
    );
    if (fitradasPorEstado.length === 0) {
      return res.status(400).json({
        mensaje: "No se encontraron reservas en el estado seleccionado",
      });
    }
    res.json(fitradasPorEstado);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error obteniento las reservas filtradas.");
  }
};

//Obtener reservas filtradas por número de huéspedes
const obtenerReservasPorNum_Pax = async (req, res) => {
  try {
    const num_pax = parseInt(req.query.num_huespedes, 10);
    if (isNaN(num_pax) || num_pax <= 0 || !Number.isInteger(num_pax)) {
      return res.status(400).json({ mensaje: "Número de huéspedes no válido" });
    }
    const reservas = await leerReservas();
    const fitradasPorPax = reservas.filter((r) => r.num_huespedes === num_pax);
    if (fitradasPorPax.length === 0) {
      return res.status(400).json({
        mensaje:
          "No se encontraron reservas con el número de huéspedes seleccionado",
      });
    }
    res.json(fitradasPorPax);
  } catch (error) {
    console.error(error);
    res.status(404).send("Error obteniento las reservas filtradas.");
  }
};

module.exports = {
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
};
