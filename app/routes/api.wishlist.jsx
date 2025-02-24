export const loader = async () => {
  return Response.json({
    name: "My Store",
    description: "My Store Description",
  });
};
