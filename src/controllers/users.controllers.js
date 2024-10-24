import { User } from "../models/User.js";

import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const { fk_empresa } = req.params; // Obtener fk_empresa de req.params

    const users = await User.findAll({
      where: { fk_empresa }, // Filtrar por empresa
    });

    res.json({ ok: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;

    const user = await User.findOne({
      where: { id, fk_empresa },
    });

    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    let { username, email, password, roles } = req.body;
    const { fk_empresa } = req.params; // Obtener fk_empresa de req.params
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password,
      roles,
      fk_empresa, // Usar fk_empresa del req.params
    });

    res.json({ ok: true, newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { id, fk_empresa } = req.params; // Obtener el id del usuario y fk_empresa de req.params
    const { email } = req.body;

    // Verificar si ya existe otro usuario con el mismo email en la misma empresa
    const existingUser = await User.findOne({
      where: { email, fk_empresa }, // Filtrar por empresa
    });

    // Si ya existe un usuario con ese email, devolver un error
    if (existingUser) {
      return res
        .status(200)
        .json({ ok: false, message: "El email ya está en uso." });
    }

    // Buscar al usuario por ID y fk_empresa
    const userToUpdate = await User.findOne({
      where: { id, fk_empresa },
    });

    // Si el usuario no existe en la empresa, devolver un error
    if (!userToUpdate) {
      return res.status(200).json({ message: "Usuario no encontrado." });
    }

    // Actualizar el email
    userToUpdate.email = email;
    await userToUpdate.save();

    res.status(200).json({
      ok: true,
      user: userToUpdate,
      message: "Email actualizado correctamente.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, roles } = req.body;
    const { fk_empresa } = req.params; // Obtener fk_empresa de req.params

    const user = await User.findByPk(id);

    user.username = username;
    user.email = email;
    user.roles = roles;
    user.fk_empresa = fk_empresa; // Actualizar fk_empresa desde req.params

    await user.save();

    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id, fk_empresa } = req.params;

    const deleteUser = await User.destroy({
      where: {
        id,
        fk_empresa,
      },
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
