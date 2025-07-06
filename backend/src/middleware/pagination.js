const paginationMiddleware = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const category = req.params.category;

  const whereClause = category ? { category } : {};

  try {
    const totalItems = await model.count({ where: whereClause });
    const data = await model.findAll({
      where: whereClause,
      limit,
      offset,
    });

    const results = {};

    if (offset + limit < totalItems) {
      results.next = { page: page + 1, limit };
    }

    if (offset > 0) {
      results.previous = { page: page - 1, limit };
    }

    results.data = data.map((e) => ({ ...e.dataValues }));
    res.paginatedResults = results;
    next();
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || "Error in pagination middleware" });
  }
};

export default paginationMiddleware;
