const Product = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });
    let cartItems = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );
      return {
        product: relatedProduct._id,
        name: relatedProduct.name,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        qty: item.qty,
        user: req.user._id,
      };
    });
    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.json(cartItems);
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
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );
    return res.json(items);
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

module.exports = { update, index };
