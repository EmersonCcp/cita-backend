export const errorHandler = (res, error) => {
    console.error(error);
    res.status(200).json({ ok:false, message: error.message });
  };