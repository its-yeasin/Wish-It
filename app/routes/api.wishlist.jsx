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
    case "GET":
      const getResponse = Response.json({
        message: "Hello World",
        method: request.method,
      });
      return cors(request, getResponse);

    case "POST":
      const method = request.method;

      let data = await request.formData();
      data = Object.fromEntries(data);

      const customerId = data.customerId;
      const productId = data.productId;
      const shop = data.shop;

      console.log(data, "--------------------data");

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

      const successResponse = Response.json({
        message: "Product added to wishlist successfully",
        data: wishlist,
      });

      return cors(request, successResponse);

    case "PUT":
      const putResponse = Response.json({
        message: "Hello World",
        method: request.method,
      });
      return cors(request, putResponse);

    case "PATCH":
      const patchResponse = Response.json({
        message: "Hello World",
        method: request.method,
      });
      return cors(request, patchResponse);

    case "DELETE":
      const deleteResponse = Response.json({
        message: "Hello World",
        method: request.method,
      });
      return cors(request, deleteResponse);

    default:
      const defaultResponse = Response.json({
        message: "Hello World",
        method: "DEFAULT",
      });
      return cors(request, defaultResponse);
  }
};
