import { QueryTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const executeSQL = async (req, res) => {
  try {
    const { sql } = req.body;

    const items = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    res.status(200).json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};
