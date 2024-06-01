import { errorHandler } from './errorHandler.js';

export const getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.findAll({ limit: 10 });
    res.json({ok: true, items});
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getOne = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Model.findOne({ where: { id } });
    if (!item) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ok: true, item});
  } catch (error) {
    errorHandler(res, error);
  }
};

export const create = (Model) => async (req, res) => {
  try {
    const item = await Model.create(req.body);
    res.json({ok: true, item});
  } catch (error) {
    errorHandler(res, error);
  }
};

export const update = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Model.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: 'Record not found' });
    }
    const item = await Model.findOne({ where: { id } });
    res.json({ok: true, item});
  } catch (error) {
    errorHandler(res, error);
  }
};

export const remove = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Model.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ok: true});
  } catch (error) {
    errorHandler(res, error);
  }
};
