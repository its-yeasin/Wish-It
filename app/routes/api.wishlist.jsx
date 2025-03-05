import { cors } from "remix-utils/cors";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  return Response.json({ message: "Hello World", method: request.method });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "GET":
      return Response.json({ message: "Hello World", method: request.method });
    case "POST":
      const method = request.method;

      let data = await request.formData();
      data = Object.fromEntries(data);

      const customerId = data.customerId;
      const productId = data.productId;
      const shop = data.shop;

      console.log(data, "--------------------data");

      if (!customerId || !productId || !shop) {
        return Response.json({
          message: "Missing customerId or productId or shop",
          method,
        });
      }

      const wishlist = await prisma.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });

      const response = Response.json({
        message: "Product added to wishlist successfully",
        data: wishlist,
      });

      return cors(request, response);
    case "PUT":
      return Response.json({ message: "Hello World", method: request.method });
    case "PATCH":
      return Response.json({ message: "Hello World", method: request.method });
    case "DELETE":
      return Response.json({ message: "Hello World", method: request.method });

    default:
      return Response.json({ message: "Hello World", method: "DEFAULT" });
  }
};
