import { BlockStack, Button, Card, Layout, Page, Text } from "@shopify/polaris";

export default function PricingPage() {
  return (
    <Page title="Pricing Plans">
      <Layout>
        {/* First Column */}
        <Layout.Section oneHalf>
          <Card title="Basic Plan" sectioned>
            <BlockStack spacing="tight">
              <Text as="h2" variant="headingMd">
                $19/month
              </Text>
              <Text as="p">✅ 10 Products</Text>
              <Text as="p">✅ Basic Support</Text>
              <Text as="p">✅ 1 Admin Account</Text>
              <Button primary>Choose Plan</Button>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Second Column */}
        <Layout.Section oneHalf>
          <Card title="Pro Plan" sectioned>
            <BlockStack spacing="tight">
              <Text as="h2" variant="headingMd">
                $49/month
              </Text>
              <Text as="p">✅ Unlimited Products</Text>
              <Text as="p">✅ Priority Support</Text>
              <Text as="p">✅ 5 Admin Accounts</Text>
              <Button primary>Choose Plan</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
