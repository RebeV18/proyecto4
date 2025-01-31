# Proyecto 4: Reservas hoteleras

Construirás una aplicación de servicios para la gestión de reservas en hoteles que involucre las 4 operaciones CRUD y otras 6 adicionales relacionadas con filtros, utilizando Node.js y Express.

Opcionalmente, realizarás un proceso de investigación relacionado con la documentación de API, usando Swagger, con la estandarización OPENAPI, la cual se utiliza en equipos internacionales para construir servicios escalables.


## Requerimientos
-  Crear una arquitectura de carpetas y archivos, clara
- Permitir la creación de reservas con los detalles necesarios (por ejemplo, hotel, tipo de habitación, número de huéspedes, fechas, etc.).
- Permitir la visualización de la lista de reservas.
- Permitir la obtención de la información de una reserva específica.
- Permitir la actualización de la información de una reserva.
- Permitir la eliminación de una reserva.
- Permitir la búsqueda de reservas por hotel, rango de fechas, tipo de habitación, estado y número de huéspedes.
- Almacenar los datos de las reservas en una estructura de datos.




## Documentación Swagger

```
openapi: 3.0.1
information:
  title: PROYECTO 4, API de Reservas Hoteleras
  description: Aplicación de servicios CRUD para la gestión de reservas de hoteles.
  version: 1.0.0
  servers: 
  - url: http://localhost:9000/api/reservas
    description: entorno de desarrollo de APIs.
  tags: 
  - name: reservas
    descriprion: Este endpoint maneja toda la información relacionada con las reservas.
  
  paths:
    /api/reservas
    get:
      summary: Para obtener todas las reservas.
      description: Devuelve todas las reservas de la base de datos.
      parameters:
        no requiere
        
    /reservas
    post:
      summary: Crear reserva
      description: Función para crear una nueva reserva, para esto requiere enviar un body.
      parameters:
        $ref: '#components/schemas/BodyReservaPost'
        
    /reservas/hotel
    get:
      summary: Para filtrar reservas por hotel
      description: Función para buscar las reservas filtradas por hotel, de un hotel específico. Es necesario que envíe el nombre del hotel como parámetro.
      parameters:
        hotel=HOTEL
        
    /reservas/fechas
    get:
      summary: Para filtrar reservas por fechas de inicio y fin de la reserva.
      description: Función para buscar las reservas filtradas por fechas, dentro del rango de fechas que envía como parámetros.
      parameters:
        fecha_inicio=FECHA_INICIO
        fecha_fin=FECHA_FIN
        
    /reservas/tipo_habitacion
    get:
      summary: Para filtrar reservas por tipo de habitación
      description: Función para buscar las reservas filtradas por tipo de habitación. Es necesario que envíe el tipo de habitación como parámetro.
      parameters:
        tipo_habitacion=TIPO_HABITACION
        
    /reservas/estado
    get:
      summary: Para filtrar reservas por estado de la misma.
      description: Función para buscar las reservas filtradas estado. Es necesario que envíe el estado de la reserva como parámetro.
      parameters:
        estado=ESTADO
        
    /reservas/num_huespedes
    get:
      summary: Para filtrar reservas por número de huéspedes.
      description: Función para buscar las reservas filtradas por número de huéspedes. Es necesario que envíe el número de huéspedes como parámetro.
      parameters:
        num_huespedes=NUM_HUESPEDES
        
     /reservas/:id
    get:
      summary: Para obtener una reserva específica
      description: Función para buscar una reserva específica, es necesario enviar el id como parámetro.
      parameters:
        id en el endpoint
    
    /reservas/:id
    put:
      summary: Actualizar una reserva
      description: Función para editar una reserva, es necesario que envíe el id de la reserva que desea alterar como parámetro y proveer un body.
      parameters:
        $ref: '#components/schemas/BodyReservaPost'
        id en el endpoint
        
    /reservas/:id
    delete:
      summary: Eliminar reserva
      description: Función para eliminar una reserva, es necesario que envíe el id de la reserva que desea eliminar como parámetro.
      parameters:
        id en el endpoint
        
        
  components:
    responses:
      200:
        description: (OK) La información de la reserva se guardó con éxito.
        content:
          application/json:
            schema:
              error: error
              message: Mensaje de error
      400:
        description: Error al realizar función.
        content:
          application/json:
            schema:
              error: error
              message: Mensaje de error
      500:
        description: Error de servidor.
        content:
          application/json:
            schema:
              error: error
              message: Mensaje de error
        
    schemas:
      BodyReservaPost:
        type: object
        properties:
          hotel:
            type: string
            description: nombre del hotel.
            required: true
          fecha_inicio:
            type: string
            description: fecha de check in o inicio de la reserva en formato YYYY-MM-DD.
            required: true
          fecha_fin:
            type: string
            description: fecha de check out o final de la reserva en formato YYYY-MM-DD.
            required: true
          estado:
            type: string
            description: estado actual de la reserva, confirmada, solicitada o no show.
            required: true
          pago:
            type: string
            description: estado del pago, pagada, pendiente o multa pagada.
            required: true
          tipo_habitacion:
            type: string
            description: tipo de habitación, individual, doble, triple, cuadruple o quintuple.
            required: true
          num_huespedes:
            type: string
            description: número de huespedes de la reserva.
            required: true
          pax:
            type: array de objetos
            description: arreglo de pasajeros de la reserva. Cada huesped tiene nombre y rut, pasaporte o DNI.
            required: true
```
