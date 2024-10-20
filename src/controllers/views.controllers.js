import {
  getCartService,
  getVirtualStockService,
} from "../services/cart.services.js";
import {
  getAllProductsService,
  getCategoriesProductsService,
  getProductService,
  paginateProductsService,
} from "../services/products.services.js";

import { getAllUsersService } from "../services/users.services.js";

import { ValidationError } from "../utils/main/errorUtils.js";

export const viewsPaginateController = async (req, res, next) => {
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
    result = await paginateProductsService(filter, {
      page,
      limit,
      sort: sortValue,
    });

    const allCategories = await getCategoriesProductsService();

    result.sort = sort;
    result.category = category;
    result.categories = allCategories;

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
    next(error);
  }
};

export const viewsProductController = async (req, res, next) => {
  const idProduct = req.params.pid;
  if (!idProduct || idProduct.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }

  try {
    const product = await getProductService(idProduct);

    res.render("products/productDetail", {
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const viewsCartController = async (req, res, next) => {
  const cartId = req.params.cid;
  if (!cartId || cartId.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }

  try {
    let carritoEncontrado = await getCartService(cartId);

    let totalPrice = carritoEncontrado.products.reduce((acc, products) => {
      return acc + products.product.price * products.quantity;
    }, 0);

    totalPrice = totalPrice.toFixed(2);

    res.render("users/cart", {
      products: carritoEncontrado.products,
      totalPrice,
    });
  } catch (error) {
    next(error);
  }
};

export const viewsRTPController = async (req, res, next) => {
  try {
    const products = await getAllProductsService();
    res.render("admin/realtimeproducts", {
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const viewsRTUController = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.render("admin/realtimeusers", {
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const viewsRTTController = async (req, res, next) => {};

export const viewsLoginController = async (req, res, next) => {
  res.render("users/login");
};
export const viewsRegisterController = async (req, res, next) => {
  res.render("users/register");
};
export const viewsProfileController = async (req, res, next) => {
  res.render("users/profile", { user: req.user });
};

async function getSessionStock(req, prod) {
  let cartId;
  if (!req.user) {
    return null;
  }
  cartId = req.user.cart;
  if (!cartId || cartId.length !== 24) {
    return null;
  }

  return await getVirtualStockService(cartId, prod);
}
