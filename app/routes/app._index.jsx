import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Text,
  Button,
  LegacyCard,
  EmptyState,
  DataTable,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const wishlistData = await prisma.wishlist.findMany({
    where: {
      shop: shop,
    },
  });

  const productIds = wishlistData.map(
    (i) => `gid://shopify/Product/${i.productId}`,
  );

  const response = await admin.graphql(
    `
    query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        onlineStorePreviewUrl
      }
    }
  }
    `,
    {
      variables: {
        ids: productIds,
      },
    },
  );

  const { data } = await response.json();
  const products = data.nodes?.map((product) => {
    const slices = product?.id?.split("/");
    const id = slices[slices.length - 1];
    return {
      id,
      title: product?.title,
      preview: product?.onlineStorePreviewUrl,
    };
  });

  return products;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const data = useLoaderData();
  console.log(data, "+++++++++++++++++++++");

  return (
    <Page>
      <TitleBar title="Dashboard Overview" />

      {data.length > 0 ? (
        <div>
          <Text variant="headingLg" as="h5">
            Wishlist Products
          </Text>
          <LegacyCard sectioned>
            <DataTable
              columnContentTypes={["text", "text"]}
              headings={["ID", "Title"]}
              rows={data.map((row) => [row.id, row.title])}
            />
          </LegacyCard>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              url="https://anonymous-shop4u.myshopify.com/"
              target="_blank"
            >
              Add More +
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          heading="Wishlist Products"
          action={{
            content: "Add Product to Wishlist",
            url: "https://anonymous-shop4u.myshopify.com/",
            target: "_blank",
          }}
          secondaryAction={{
            content: "Learn more",
            url: "/app/settings",
          }}
          image="https://img.freepik.com/premium-vector/wishlist-icon-vector-image-can-be-used-web-store_120816-363114.jpg?w=100"
        >
          <p>Manage and track your wishlist products here.</p>
        </EmptyState>
      )}
    </Page>
  );
}
