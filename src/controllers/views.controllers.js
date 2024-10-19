import ProductsRepository from "../DAO/repositories/productsRepository.js";
import CartsRepository from "../DAO/repositories/cartsRepository.js";
import UsersRepository from "../DAO/repositories/usersRepository.js";
import SessionsRepository from "../DAO/repositories/sessionsRepository.js";
import {
  ProductsDAO,
  CartsDAO,
  UsersDAO,
  SessionsDAO,
} from "../DAO/DAOFactory.js";

const productsService = new ProductsRepository(ProductsDAO);
const cartService = new CartsRepository(CartsDAO);
const userService = new UsersRepository(UsersDAO);
const sessionService = new SessionsRepository(SessionsDAO);

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

  let sortOrder, sortValue;
  let result;

  if (sort) {
    sortOrder = sort === "desc" ? -1 : 1;
    sortValue = {
      price: sortOrder,
    };
  } else {
    sortValue = {
      id: 1,
    };
  }
  try {
    result = await productsService.paginateProducts(filter, {
      page,
      limit,
      sort: sortValue,
    });

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

    let prodStock = await getSessionStock(req, result.docs);

    if (prodStock) {
      result.docs = prodStock;
    }

    return res.render("index", result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al cargar los productos." });
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
      return res
        .status(404)
        .render("error/error", { msg: "Producto no encontrado." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .render("error/error", { msg: "Error al obtener el producto." });
  }
};

export const viewsCartController = async (req, res) => {
  const cartId = req.params.cid;
  try {
    let carritoEncontrado = await cartService.getCart(cartId);

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
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

export const viewsRTPController = async (req, res) => {
  try {
    const products = await productsService.getAllProducts();
    console.log(products);
    res.render("admin/realtimeproducts", {
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al cargar los productos." });
  }
};

export const viewsRTUController = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render("admin/realtimeusers", {
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al cargar los productos." });
  }
};
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

async function getSessionStock(req, prod) {
  const cartId = req.user.cart;
  let cart;

  try {
    if (cartId) {
      cart = await cartService.getCart(cartId);

      if (!cart) {
        // En lugar de enviar una respuesta, lanza un error o retorna un estado
        throw new Error("Carrito no encontrado");
      }

      const cartProducts = cart.products;

      prod.forEach((product) => {
        const cartProduct = cartProducts.find(
          (cartItem) =>
            cartItem.product._id.toString() === product._id.toString()
        );

        if (cartProduct) {
          const newStock = product.stock - cartProduct.quantity;
          product.stock = newStock >= 0 ? newStock : 0;
          if (product.stock === 0) {
            product.status = false;
          }
        }
      });
      return prod;
    }
    return false;
  } catch (error) {
    console.error("Error al obtener el carrito o actualizar el stock:", error);
    return false;
  }
}
