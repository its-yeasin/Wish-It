import { useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  LegacyCard,
  EmptyState,
  DataTable,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const auth = await authenticate.admin(request);
  const shop = auth.session.shop;

  const wishlistData = await prisma.wishlist.findMany({
    where: {
      shop: shop,
    },
  });

  return wishlistData;
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

  return (
    <Page>
      <TitleBar title="Dashboard Overview" />
      <LegacyCard sectioned>
        {data.length > 0 ? (
          <div>
            <Text variant="headingLg" as="h5">
              Wishlist Products
            </Text>
            <DataTable
              columnContentTypes={["numeric", "text", "text"]}
              headings={["ID", "Customer ID", "Product ID"]}
              rows={data.map((row) => [row.id, row.customerId, row.productId])}
            />

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
      </LegacyCard>
    </Page>
  );
}
