import { Empresa } from "../models/Empresa.js";
import {
  getAllWithSearch,
  getOne,
  create,
  update,
  remove,
} from "../utils/crudController.js";
import { stateEmpresa } from "../app.js";
import { errorHandler } from "../utils/errorHandler.js";

const searchableFields = ["p.emp_nombre", "p.emp_descripcion", "p.emp_pais"];

export const getEmpresas = getAllWithSearch(
  "empresas",
  searchableFields,
  "p.emp_nombre",
  Empresa,
  false
);
export const getEmpresa = getOne(Empresa, "emp_codigo", false);
export const createEmpresa = create(Empresa, false);
// export const updateEmpresa = update(Empresa, "emp_codigo", false);

export const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Empresa.update(req.body, {
      where: { emp_codigo: id },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Error al actualizar el registro." });
    }

    const item = await Empresa.findOne({ where: { emp_codigo: id } });

    stateEmpresa(item);

    res.json({ ok: true, item });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteEmpresa = remove(Empresa, "emp_codigo", false);
