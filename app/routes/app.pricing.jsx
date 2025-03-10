import {
  Page,
  Grid,
  LegacyCard,
  Text,
  Badge,
  Button,
  List,
} from "@shopify/polaris";
import { ANNUAL_PLAN, authenticate, MONTHLY_PLAN } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request);
    const { appSubscriptions } = await billing.check({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: true,
    });
    // console.log(hasActivePayment);
    console.log(
      "Start++++++++++++",
      appSubscriptions,
      "check+++++++++++++++++++++++++++++",
    );

    const plan = appSubscriptions?.[0];

    if (appSubscriptions.length === 0) {
      // Indicating free plan
      throw new Error("FREE");
    }
    console.log("ok");
    return Response.json({ billing, plan: { ...plan, isFree: false } });
  } catch (err) {
    // Check if free plan
    if (err.message === "FREE") {
      return Response.json({
        billing: {},
        plan: {
          name: "Free Plan",
          isFree: true,
        },
      });
    }
  }
};

export default function PricingPage() {
  const { plan } = useLoaderData();
  const isFree = plan.isFree;

  return (
    <Page title="Choose Your Plan">
      <Grid>
        {/* Free Plan */}
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LegacyCard sectioned>
            <Text variant="headingLg" as="h2">
              Free Plan
            </Text>

            <Badge status="success">Free Forever</Badge>

            <Text variant="bodyMd" color="subdued">
              Perfect for individuals or small teams just getting started.
            </Text>

            <Text variant="heading2xl" as="h3">
              $0{" "}
              <Text variant="bodyMd" color="subdued">
                / month
              </Text>
            </Text>

            <List type="bullet">
              <List.Item>Basic analytics</List.Item>
              <List.Item>Limited reports</List.Item>
              <List.Item>Email support</List.Item>
            </List>

            {isFree && (
              <Button fullWidth primary url="/app">
                Upgrade to pro
              </Button>
            )}
          </LegacyCard>
        </Grid.Cell>

        {/* Pro Plan */}
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <LegacyCard sectioned>
            <Text variant="headingLg" as="h2">
              Pro Plan
            </Text>

            <Badge status="info">Most Popular</Badge>

            <Text variant="bodyMd" color="subdued">
              Advanced features for growing businesses.
            </Text>

            <Text variant="heading2xl" as="h3">
              $49{" "}
              <Text variant="bodyMd" color="subdued">
                / month
              </Text>
            </Text>

            <List type="bullet">
              <List.Item>Advanced analytics</List.Item>
              <List.Item>Unlimited reports</List.Item>
              <List.Item>Priority support</List.Item>
              <List.Item>Custom integrations</List.Item>
            </List>

            {isFree && (
              <Button fullWidth primary tone="success" url="/app/upgrade">
                Upgrade Now
              </Button>
            )}
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}
