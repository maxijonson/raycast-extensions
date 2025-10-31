import type { ManagementSchemas } from "@paynow-gg/typescript-sdk";
import { Action, List } from "@raycast/api";
import { withProviders } from "../../hocs/with-providers";
import { useStore } from "../../providers/store-provider/store-provider";
import type { PropertyLineProps } from "../property-line";
import PropertyLine from "../property-line";

export interface OrderDetailsProps {
  order: ManagementSchemas["OrderDto"];
}

const Line = ({ orderId, ...rest }: { orderId: string } & PropertyLineProps) => {
  const { store } = useStore();

  return (
    <PropertyLine
      {...rest}
      actions={
        <Action.OpenInBrowser title="Open" url={`https://dashboard.paynow.gg/orders/${orderId}?s=${store?.slug}`} />
      }
    />
  );
};

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const customerName =
    order.customer.name || order.customer.profile?.name || order.customer.steam?.name || order.customer.minecraft?.name;
  const orderType = (() => {
    switch (order.type) {
      case "one_time":
        return "One Time";
      case "subscription":
        return "Subscription";
      case "mixed":
        return "Mixed";
      default:
        return order.type;
    }
  })();

  return (
    <List navigationTitle={order.pretty_id}>
      <Line orderId={order.id} name="ID" value={order.id} />
      <Line orderId={order.id} name="Pretty ID" value={order.pretty_id} />

      <Line orderId={order.id} name="Product Names" value={order.lines.map((line) => line.product_name).join(", ")} />

      <Line orderId={order.id} name="Subtotal Amount" value={order.subtotal_amount_str} />
      <Line orderId={order.id} name="Tax Amount" value={order.tax_amount_str} />
      <Line
        orderId={order.id}
        name="Discount Amount"
        value={order.discount_amount_str}
        hidden={!order.discount_amount}
      />
      <Line
        orderId={order.id}
        name="Gift Card Amount"
        value={order.giftcard_usage_amount_str}
        hidden={!order.giftcard_usage_amount}
      />
      <Line orderId={order.id} name="Total Amount" value={order.total_amount_str} />
      <Line orderId={order.id} name="Currency" value={order.currency.toUpperCase()} />

      <List.Section title="Customer">
        <Line orderId={order.id} keywords={["Customer"]} name="ID" value={order.customer.id} />
        <Line
          orderId={order.id}
          keywords={["Customer"]}
          name="Name"
          accessories={order.customer.profile?.avatar_url ? [{ icon: order.customer.profile.avatar_url }] : []}
          value={customerName}
        />
        <Line
          orderId={order.id}
          keywords={["Customer"]}
          name="Steam ID"
          accessories={order.customer.steam?.avatar_url ? [{ icon: order.customer.steam.avatar_url }] : []}
          value={order.customer.steam_id}
        />
        <Line
          orderId={order.id}
          keywords={["Customer"]}
          name="Minecraft ID"
          accessories={order.customer.minecraft?.avatar_url ? [{ icon: order.customer.minecraft.avatar_url }] : []}
          value={order.customer.minecraft_uuid}
        />
        <Line orderId={order.id} keywords={["Customer"]} name="Xbox ID" value={order.customer.xbox_xuid} />
        <Line orderId={order.id} keywords={["Customer"]} name="IP" value={order.customer_ip} />
      </List.Section>

      <List.Section title="Billing">
        <Line orderId={order.id} keywords={["Billing"]} name="Name" value={order.billing_name} />
        <Line orderId={order.id} keywords={["Billing"]} name="Email" value={order.billing_email} />
        <Line orderId={order.id} keywords={["Billing"]} name="Country" value={order.billing_country} />
        <Line
          orderId={order.id}
          keywords={["Billing"]}
          name="Cycle Sequence"
          value={`${order.billing_cycle_sequence}`}
        />
      </List.Section>

      <Line orderId={order.id} name="Subscription ID" value={order.subscription_id} />
      <Line orderId={order.id} name="Coupon ID" value={order.coupon_id} />
      <Line orderId={order.id} name="Affiliate ID" value={order.affiliate_id} />
      <Line orderId={order.id} name="Checkout ID" value={order.checkout_id} />
      <Line orderId={order.id} name="Checkout Token" value={order.checkout_token} />

      <Line
        orderId={order.id}
        name="Created At"
        value={new Date(order.created_at || 0).toLocaleString()}
        hidden={!order.created_at}
      />
      <Line
        orderId={order.id}
        name="Completed At"
        value={new Date(order.completed_at || 0).toLocaleString()}
        hidden={!order.completed_at}
      />

      <Line orderId={order.id} name="Type" value={orderType} />
      <Line orderId={order.id} name="Status" value={order.status} />
    </List>
  );
};

export default withProviders(OrderDetails);
