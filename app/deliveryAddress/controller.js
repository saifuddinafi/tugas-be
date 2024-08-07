const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const DeliveryAddress = require("./model");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress.create({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    let { _id, ...payload } = req.body;
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let policy = policyFor(req.user);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: req.user._id,
    });
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You are not allowed to update this address",
      });
    }
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    });
    res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let policy = policyFor(req.user);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You are not allowed to delete this address",
      });
    }
    address = await DeliveryAddress.findByIdAndDelete(id);
    res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await DeliveryAddress.find({
      user: req.user._id,
    }).countDocuments();
    let addresses = await DeliveryAddress.find({
      user: req.user._id,
    })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort("-createdAt");

    return res.json({ data: addresses, count });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

module.exports = { store, update, destroy, index };
