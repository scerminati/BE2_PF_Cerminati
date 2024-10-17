import Product from "../DAO/services/productsServices.js";
import Cart from "../DAO/services/cartsServices.js";

const productsService = new Product();
const cartService = new Cart();

export const viewsPaginateController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 10 ? 10 : limit;
  const sort = req.query.sort;
  const category = req.query.category;

  let filter = {};
  if (category) {
    filter.category = category;
  }

  let sortOrder;
  let result;

  try {
    if (sort) {
      sortOrder = sort === "desc" ? -1 : 1;
      result = await productsService.paginateProducts(filter, {
        page,
        limit,
        sort: { price: sortOrder },
      });
    } else {
      result = await productsService.paginateProducts(filter, {
        page,
        limit,
      });
    }

    const allCategories = await productsService.categoryProducts();

    result.sort = sort;
    result.category = category;
    result.categories = allCategories;
    // Construir los enlaces con encodeURIComponent
    result.prevLink = result.hasPrevPage
      ? `/?page=${result.prevPage}${limit < 10 ? `&limit=${limit}` : ""}${
          sort ? `&sort=${encodeURIComponent(sort)}` : ""
        }${category ? `&category=${encodeURIComponent(category)}` : ""}`
      : "";
    result.nextLink = result.hasNextPage
      ? `/?page=${result.nextPage}${limit < 10 ? `&limit=${limit}` : ""}${
          sort ? `&sort=${encodeURIComponent(sort)}` : ""
        }${category ? `&category=${encodeURIComponent(category)}` : ""}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render("index", result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al cargar los productos." });
  }
};

export const viewsProductController = async (req, res) => {
  const idProduct = req.params.pid;
  try {
    const product = await productsService.getProduct(idProduct);

    if (product) {
      res.render("products/productDetail", {
        product,
      });
    } else {
      res.status(404).render("error/error", { msg: "Producto no encontrado." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("error/error", { msg: "Error al obtener el producto." });
  }
};

export const viewsCartController = async (req, res) => {
  const cartId = req.params.cid;
  try {
    let carritoEncontrado = await cartService.getCart(cartId);
    console.log(carritoEncontrado.products);
    if (!carritoEncontrado) {
      return res
        .status(404)
        .render("error/error", { msg: "Carrito no encontrado." });
    }

    let totalPrice = carritoEncontrado.products.reduce((acc, products) => {
      return acc + products.product.price * products.quantity;
    }, 0);

    totalPrice = totalPrice.toFixed(2);



    res.render("users/cart", {
      products: carritoEncontrado.products,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

export const viewsRTPController = async (req, res) => {
  try {
    const products = await productsService.paginateProducts(null, null, 1);
    res.render("admin/realtimeproducts", {
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al cargar los productos." });
  }
};
export const viewsRTCController = async (req, res) => {};
export const viewsRTUController = async (req, res) => {};
export const viewsRTTController = async (req, res) => {};

export const viewsLoginController = async (req, res) => {
  res.render("users/login");
};
export const viewsRegisterController = async (req, res) => {
  res.render("users/register");
};
export const viewsProfileController = async (req, res) => {
  res.render("users/profile", { user: req.user });
};
