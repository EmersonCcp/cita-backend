import { Cita } from "../models/Cita.js";
import { sequelize } from "../database/database.js";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { QueryTypes } from "sequelize";
import { deleteKeysByPattern } from "../middleware/redisMiddleware.js";
import { client } from "../index.js";
import { Empresa } from "../models/Empresa.js";
import { Cobro } from "../models/Cobro.js";
import { Caja } from "../models/Caja.js";
import { CitaServicio } from "../models/CitaServicio.js";
import { errorHandler } from "../utils/errorHandler.js";
import { MovimientoCaja } from "../models/MovimientoCaja.js";

const searchableFields = ["clientes.cli_nombre", "clientes.cli_apellido"];

export const getAllWithSearch = async (req, res) => {
  try {
    const { limit, pagination, query, fk_empresa } = req.params;

    if (fk_empresa) {
      const empresa = await Empresa.findOne({
        where: { emp_codigo: fk_empresa },
      });

      const clienteEmpresa = empresa.get();

      if (clienteEmpresa.emp_estado === false) {
        return res
          .status(200)
          .json({ ok: false, message: "Cuenta Desabilitada" });
      }
    }

    const tableName = "citas";

    // Generar una clave única para Redis
    // const redisKey = `${Cita.name}:list:fk_empresa=${fk_empresa}:query=${query}:limit=${limit}:pagination=${pagination}`;

    // Intentar obtener los datos desde Redis
    // const reply = await client.get(redisKey);
    // if (reply) {
    //   return res.status(200).json({ ok: true, items: JSON.parse(reply) });
    // }

    let queryAdd = ``;
    if (query && query !== ":query") {
      const conditions = searchableFields
        .map((field) => {
          return `${field}::VARCHAR ILIKE '%${query}%'`;
        })
        .join(" OR ");

      queryAdd = `WHERE (${conditions})`;
    }

    // Agrega la condición para fk_empresa
    let empresaCondition = ``;
    if (fk_empresa) {
      empresaCondition = queryAdd
        ? `AND citas.fk_empresa = :fk_empresa`
        : `WHERE citas.fk_empresa = :fk_empresa`;
    }

    const sql = `
      SELECT 
        citas.cita_codigo AS cita_codigo,
        clientes.cli_codigo AS fk_cliente,
        CONCAT(clientes.cli_nombre, ' ', clientes.cli_apellido) AS cliente,
        citas.cita_fecha AS fecha,
        citas.cita_hora AS hora,
        citas.cita_estado AS estado,
        citas.cita_monto AS monto
      FROM  ${tableName}
      INNER JOIN clientes ON citas.fk_cliente = clientes.cli_codigo
      ${queryAdd} ${empresaCondition}
      ORDER BY  citas.cita_fecha ASC
      LIMIT ${limit}
      OFFSET ${pagination}
    `;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { fk_empresa }, // Se usa para pasar el valor de fk_empresa
    });

    // if (items.length > 0) {
    //   await client.set(redisKey, JSON.stringify(items), "EX", 3600);
    // }

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateEstado = async (req, res) => {
  try {
    let { id, estado } = req.params;

    estado = estado.toLowerCase();

    if (!["pendiente", "completado", "cancelado"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const [updatedRows] = await Cita.update({ estado }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await deleteKeysByPattern(`${Cita.name}:list:fk_empresa=`);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getCitas = getAll(Cita);
export const getCita = getOne(Cita, "cita_codigo");
// export const createCita = create(Cita);

export const createCita = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cita, citaServicios } = req.body;
    const { fk_empresa } = req.params;

    // Crear la nueva cita
    const newCita = await Cita.create(
      { ...cita, fk_empresa },
      { transaction: t }
    );

    if (newCita) {
      const citaServiciosData = citaServicios.map((servicio) => ({
        ...servicio,
        fk_empresa,
        fk_cita: newCita.cita_codigo,
      }));

      await CitaServicio.bulkCreate(citaServiciosData, { transaction: t });

      console.log(newCita);

      await Cobro.create({
        cob_estado: 'pendiente',
            cob_fecha: newCita.cita_fecha,
            cob_monto_total: newCita.cita_monto,
            cob_num_cuotas: 1,
            fk_operacion: newCita.cita_codigo,
            cob_tipo_operacion: 'cita',
            fk_empresa
      },
      { transaction: t })

      //   // Registrar movimiento en la caja
        // await MovimientoCaja.create(
        //   {
        //     mc_tipo: "ingreso",
        //     mc_monto: Number(cita.cita_monto),
        //     mc_descripcion: `citaCOD${newCita.cita_codigo}-ingreso`,
        //     mc_fecha: cita.cita_fecha,
        //     fk_operacion: newCita.cita_codigo,
        //     mc_tipo_operacion: "cita",
        //     fk_caja: newCita.fk_caja,
        //     fk_empresa,
        //   },
        //   { transaction: t }
        // );
      // }
    }

    await t.commit();
    res.status(201).json({ ok: true, message: "Cita creada con éxito" });
  } catch (error) {
    await t.rollback();
    errorHandler(res, error);
  }
};

export const updateCita = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { cita, citaServicios } = req.body;
    const { fk_empresa } = req.params;

    const existingCita = await Cita.findOne({
      where: { cita_codigo: id, fk_empresa },
    });

    if (!existingCita) {
      return res.status(404).json({ ok: false, message: "Cita no encontrada" });
    }

    // Actualizar la cita con los nuevos datos
    await Cita.update(cita, {
      where: { cita_codigo: id, fk_empresa },
      transaction,
    });

    // Eliminar los servicios anteriores y agregar los nuevos
    await CitaServicio.destroy({
      where: { fk_cita: id, fk_empresa },
      transaction,
    });

    for (const servicio of citaServicios) {
      await CitaServicio.create(
        { ...servicio, fk_cita: id, fk_empresa },
        { transaction }
      );
    }

    await transaction.commit();
    res.json({ ok: true, message: "Cita actualizada correctamente" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(res, error);
  }
};

export const deleteCita = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, fk_empresa } = req.params;

    const existingCita = await Cita.findOne({
      where: { cita_codigo: id, fk_empresa },
    });

    if (!existingCita) {
      return res.status(404).json({ ok: false, message: "Cita no encontrada" });
    }


    // Eliminar cuotas
    const sqlDeleteCuotas = `DELETE FROM cuotas WHERE cuo_tipo_operacion = 'cita' AND fk_operacion = ${id}`;
    await sequelize.query(sqlDeleteCuotas, {
      type: QueryTypes.DELETE,
      transaction,
    });

    await CitaServicio.destroy({
      where: { fk_cita: id, fk_empresa },
      transaction,
    });

    await Cita.destroy({ where: { cita_codigo: id, fk_empresa }, transaction });

    await transaction.commit();
    res.json({ ok: true, message: "Cita eliminada correctamente" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(res, error);
  }
};

// export const updateCita = update(Cita, "cita_codigo");
// export const deleteCita = remove(Cita, "cita_codigo");
