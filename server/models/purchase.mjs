import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    textbookId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
