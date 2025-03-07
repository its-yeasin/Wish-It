import { cors } from "remix-utils/cors";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const response = Response.json({
    message: "Hello World",
    method: request.method,
  });
  return cors(request, response);
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const method = request.method;

      let data = await request.formData();
      data = Object.fromEntries(data);

      const customerId = data.customerId;
      const productId = data.productId;
      const shop = data.shop;
      const action = data._action;

      switch (action) {
        case "CREATE":
          if (!customerId || !productId || !shop) {
            const errorResponse = Response.json({
              message: "Missing customerId or productId or shop",
              method,
            });
            return cors(request, errorResponse);
          }

          const wishlist = await prisma.wishlist.create({
            data: {
              customerId,
              productId,
              shop,
            },
          });

          const createResponse = Response.json({
            message: "Product added to wishlist successfully",
            data: wishlist,
          });

          return cors(request, createResponse);
        case "UPDATE":
          return "updated";
        case "DELETE":
          const deletedWishlist = await prisma.wishlist.deleteMany({
            where: {
              customerId,
              productId,
              shop,
            },
          });

          const deleteResponse = Response.json({
            message: "Product deleted successfully",
            data: deletedWishlist,
          });

          return cors(request, deleteResponse);
        default:
          return cors(request, {
            message: "No method mentioned",
            data: null,
          });
      }
  }
};
