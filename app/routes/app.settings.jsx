import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import prisma from "../db.server";

export async function loader({ request }) {
  const settings = await prisma?.settings?.findFirst();

  return Response.json({
    name: settings?.name,
    description: settings?.description,
  });
}

export async function action({ request }) {
  let settings = await request.formData();
  settings = Object.fromEntries(settings);

  await prisma?.settings?.upsert({
    where: {
      id: "1",
    },
    update: {
      id: "1",
      name: settings?.name,
      description: settings.description,
    },
    create: {
      id: "1",
      name: settings.name,
      description: settings.description,
    },
  });

  return Response.json(settings);
}

export default function SettingsPage() {
  const settings = useLoaderData();
  const [formState, setFormState] = useState(settings);

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update settings for your store.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField
                  name="name"
                  label="Name"
                  onChange={(v) =>
                    setFormState((prev) => ({ ...prev, name: v }))
                  }
                  value={formState?.name}
                />
                <TextField
                  name="description"
                  label="Description"
                  onChange={(v) =>
                    setFormState((prev) => ({ ...prev, description: v }))
                  }
                  value={formState?.description}
                />
              </BlockStack>

              <Button submit={true}>Save</Button>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
