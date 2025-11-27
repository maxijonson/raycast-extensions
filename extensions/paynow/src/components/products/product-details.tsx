import { Action, ActionPanel, List } from "@raycast/api";
import { useMemo } from "react";
import { withProviders } from "../../hocs/with-providers";
import { useStore } from "../../providers/store-provider/store-provider";
import { toPriceString } from "../../utils/to-price-string";
import type { ManagementSchemas } from "@paynow-gg/typescript-sdk";
import type { PropertyLineProps } from "../property-line";
import PropertyLine from "../property-line";

export interface ProductDetailsProps {
  product: ManagementSchemas["ProductDto"];
}

const Line = ({
  productId,
  ...rest
}: {
  productId: string;
} & PropertyLineProps) => {
  const { store } = useStore();

  return (
    <PropertyLine
      {...rest}
      actions={
        <Action.OpenInBrowser title="Open" url={`https://dashboard.paynow.gg/products/${productId}?s=${store?.slug}`} />
      }
    />
  );
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const status = useMemo(() => {
    if (product.is_hidden) return "Hidden";
    const now = new Date();
    if (product.enabled_at && new Date(product.enabled_at) > now) return "Scheduled";
    if (product.enabled_until && new Date(product.enabled_until) < now) return "Expired";
    return "Active";
  }, [product.enabled_at, product.enabled_until, product.is_hidden]);

  return (
    <List navigationTitle={product.name}>
      <Line productId={product.id} name="ID" value={product.id} />
      <Line productId={product.id} name="Name" value={product.name} />
      <Line productId={product.id} name="Slug" value={product.slug} />
      <Line productId={product.id} name="Status" value={status} />
      <Line
        productId={product.id}
        name="Tags"
        value={product.tags.map((tag) => tag.name).join(", ") || "None"}
        hidden={product.tags.length === 0}
      />
      <Line productId={product.id} name="Price" value={toPriceString(product)} />

      <Line
        productId={product.id}
        name="Type"
        value="Hybrid"
        hidden={!product.allow_one_time_purchase || !product.allow_subscription}
      />
      <Line productId={product.id} name="Type" value="One-time" hidden={!product.allow_one_time_purchase} />
      <Line productId={product.id} name="Type" value="Subscription" hidden={!product.allow_subscription} />

      <Line
        productId={product.id}
        name="Created At"
        value={new Date(product.created_at || 0).toLocaleString()}
        hidden={!product.created_at}
      />
      <Line
        productId={product.id}
        name="Updated At"
        value={new Date(product.updated_at || 0).toLocaleString()}
        hidden={!product.updated_at}
      />
      <Line
        productId={product.id}
        name="Enabled At"
        value={new Date(product.enabled_at || 0).toLocaleString()}
        hidden={!product.enabled_at}
      />
      <Line
        productId={product.id}
        name="Remove After"
        value={
          (product.remove_after_time_value || 0) > 1
            ? `${product.remove_after_time_value} ${product.remove_after_time_scale}s`
            : `${product.remove_after_time_value} ${product.remove_after_time_scale}`
        }
        hidden={!product.remove_after_enabled}
      />

      <Line
        productId={product.id}
        name="Promo Codes"
        value={product.disable_promo_codes ? "Disabled" : "Enabled"}
        hidden={typeof product.disable_promo_codes !== "boolean"}
      />
      <Line productId={product.id} name="Label" value={product.label} />
      <Line productId={product.id} name="Description" value={product.description} />
      <Line productId={product.id} name="Sort Order" value={String(product.sort_order)} />
      <Line
        productId={product.id}
        name="Applies to"
        value={product.single_game_server_only ? "Single Game Server Only" : "Multiple Game Servers"}
      />
      <Line productId={product.id} name="Version" value={product.version_id} />
      <Line
        productId={product.id}
        name="Concurrent Active Items"
        value={product.allow_concurrent_active_items ? "Allowed" : "Not Allowed"}
        hidden={typeof product.allow_concurrent_active_items !== "boolean"}
      />

      {product.image_url && (
        <List.Item
          title="Image"
          accessories={[{ icon: product.image_url || undefined }]}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Image URL" content={product.image_url || ""} />
              <Action.OpenInBrowser title="Open Image" url={product.image_url} />
            </ActionPanel>
          }
        />
      )}

      {product.gameservers.length > 0 && (
        <List.Section title="Game Servers">
          {product.gameservers.map((gs) => (
            <Line
              productId={product.id}
              key={gs.id}
              keywords={["Game Server"]}
              name={gs.name}
              value={gs.id}
              accessories={[
                {
                  tag: {
                    value: gs.enabled ? "Active" : "Inactive",
                    color: gs.enabled ? "green" : "red",
                  },
                },
              ]}
            />
          ))}
        </List.Section>
      )}

      <List.Section title="Stock">
        <Line
          productId={product.id}
          keywords={["Stock"]}
          name={product.stock_limit_do_not_include_removed ? "Store Stock (Excludes Removed)" : "Store Stock"}
          value={String(product.stock_available.store_available)}
          hidden={!product.store_stock_limit.enabled}
        />
        <Line
          productId={product.id}
          keywords={["Stock"]}
          name="Customer Stock"
          value={String(product.stock_available.customer_available)}
          hidden={!product.customer_stock_limit.enabled}
        />
      </List.Section>

      {product.trial.enabled && (
        <List.Section title="Trial">
          <Line
            productId={product.id}
            keywords={["Trial"]}
            name="Duration"
            value={
              (product.trial.period_value || 0) > 1
                ? `${product.trial.period_value} ${product.trial.period_scale}s`
                : `${product.trial.period_value} ${product.trial.period_scale}`
            }
          />
          <Line
            productId={product.id}
            keywords={["Trial"]}
            name="Revoke Immediately When Canceled"
            value={product.trial.revoke_immediately_when_canceled ? "Yes" : "No"}
          />
          <Line
            productId={product.id}
            keywords={["Trial"]}
            name="New Customers Order Lookback"
            value={
              (product.trial.new_customer_order_lookback_value || 0) > 1
                ? `${product.trial.new_customer_order_lookback_value} ${product.trial.new_customer_order_lookback_scale}s`
                : `${product.trial.new_customer_order_lookback_value} ${product.trial.new_customer_order_lookback_scale}`
            }
            hidden={!product.trial.new_customers_only}
          />
          <Line
            productId={product.id}
            keywords={["Trial"]}
            name="Repeatable Every"
            value={
              (product.trial.repeat_trial_cooldown_value || 0) > 1
                ? `${product.trial.repeat_trial_cooldown_value} ${product.trial.repeat_trial_cooldown_scale}s`
                : product.trial.repeat_trial_cooldown_scale
            }
            hidden={!product.trial.allow_repeat_trials}
          />
        </List.Section>
      )}

      {product.customer_stock_limit.enabled && (
        <List.Section title="Customer Stock Limit">
          <Line
            productId={product.id}
            keywords={["Customer Stock Limit"]}
            name="Limit"
            value={String(product.customer_stock_limit.quantity || 0)}
          />
          <Line
            productId={product.id}
            keywords={["Customer Stock Limit"]}
            name="Every"
            value={
              (product.customer_stock_limit.time_value || 0) > 1
                ? `${product.customer_stock_limit.time_value} ${product.customer_stock_limit.time_scale}s`
                : product.customer_stock_limit.time_scale
            }
          />
          <Line
            productId={product.id}
            keywords={["Customer Stock Limit"]}
            name="Trials"
            value={product.customer_stock_limit.include_trials ? "Included" : "Excluded"}
          />
        </List.Section>
      )}

      {product.commands.map((c, i) => (
        <List.Section key={i} title={`Command #${i + 1}`} subtitle={c.stage}>
          <Line productId={product.id} keywords={["Command", `Command #${i + 1}`]} name="Command" value={c.content} />
          <Line
            productId={product.id}
            keywords={["Command", `Command #${i + 1}`]}
            name="Online Only"
            value={String(c.online_only)}
          />
          <Line
            productId={product.id}
            keywords={["Command", `Command #${i + 1}`]}
            name="Stage"
            value={String(c.stage)}
          />
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(ProductDetails);
