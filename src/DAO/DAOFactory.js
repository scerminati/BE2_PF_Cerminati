import ProductsMongoDAO from "./Mongo/services/ProductsMongoDAO.js";
import CartsMongoDAO from "./Mongo/services/CartsMongoDAO.js";
import UsersMongoDAO from "./Mongo/services/UsersMongoDAO.js";
import SessionsMongoDAO from "./Mongo/services/SessionsMongoDAO.js";
import TicketsMongoDAO from "./Mongo/services/TicketsMongoDAO.js";

import { PERSISTENCE } from "../config/persistence.config.js";

const persistence = PERSISTENCE;

let ProductsDAO;
let CartsDAO;
let UsersDAO;
let SessionsDAO;
let TicketsDAO;

switch (persistence) {
  case "MONGO":
    ProductsDAO = new ProductsMongoDAO();
    CartsDAO = new CartsMongoDAO();
    UsersDAO = new UsersMongoDAO();
    SessionsDAO = new SessionsMongoDAO();
    TicketsDAO = new TicketsMongoDAO();
    break;

  default:
    throw new Error("Método de PERSISTENCE no soportada");
}

export { ProductsDAO, CartsDAO, UsersDAO, SessionsDAO, TicketsDAO };
