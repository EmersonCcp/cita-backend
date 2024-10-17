import { User } from "../models/User.js";

import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ ok: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
    });

    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    let { username, email, password, roles } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password,
      roles,
    });

    res.json({ ok: true, newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    // Si ya existe un usuario con ese email, devolver un error
    if (existingUser) {
      return res
        .status(200)
        .json({ ok: false, message: "El email ya está en uso." });
    }

    // Si no existe, proceder a actualizar el email del usuario
    const userToUpdate = await User.findByPk(id); // Buscar al usuario por ID
    if (!userToUpdate) {
      return res.status(200).json({ message: "Usuario no encontrado." });
    }

    // Actualizar el email
    userToUpdate.email = email;
    await userToUpdate.save();

    res
      .status(200)
      .json({
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

    const user = await User.findByPk(id);

    user.username = username;
    (user.email = email), (user.roles = roles);

    await user.save();

    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await User.destroy({
      where: {
        id,
      },
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
