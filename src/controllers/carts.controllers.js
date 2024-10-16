export const getAllCartsController = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    let carts;

    if (!isNaN(limit) && limit > 0) {
      carts = await cartsModel.find({}).limit(limit);
    } else {
      carts = await cartsModel.find({});
    }

    carts = await Promise.all(
      carts.map(async (cart) => {
        let populatedCart = await populateCarrito(cart);
        return {
          ...populatedCart.toObject(),
          products: populatedCart.products.map((product) => ({
            ...product.product.toObject(),
            quantity: product.quantity,
          })),
        };
      })
    );

    res.status(200).json({ msg: "Mostrando carritos", carts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener los carritos." });
  }
};

export const getCartController = async (req, res) => {};

export const getCartQTController = async (req, res) => {};

////
export const createCartController = async (req, res) => {};

///
export const editProductInCartController = async (req, res) => {};

///
export const deleteCartController = async (req, res) => {};

export const deleteProductInCartController = async (req, res) => {};
