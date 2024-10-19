import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
  code: { type: Number, required: true },
  purchase_datetime: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  products: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  amount: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
