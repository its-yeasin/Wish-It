export const loader = async ({ request }) => {
  return Response.json({ message: "Hello World", method: request.method });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "GET":
      return Response.json({ message: "Hello World", method: request.method });
    case "POST":
      return Response.json({ message: "Hello World", method: request.method });
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
