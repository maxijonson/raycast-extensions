import { Action, ActionPanel, List } from "@raycast/api";

export type PropertyLineProps = Omit<List.Item.Props, "title"> & {
  name: string;
  value: string | null | undefined;
  hidden?: boolean;
  preAccessories?: List.Item.Accessory[];
};

const PropertyLine = ({ name, value, hidden = false, preAccessories = [], ...rest }: PropertyLineProps) => {
  if (hidden || value === null || value === undefined || (typeof value === "string" && !value)) return null;
  return (
    <List.Item
      {...rest}
      title={name}
      accessories={[...preAccessories, { text: value }, ...(rest.accessories || [])]}
      keywords={[name, value, ...(rest.keywords || [])]}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Value" content={value} />
          {rest.actions}
        </ActionPanel>
      }
    />
  );
};

export default PropertyLine;
