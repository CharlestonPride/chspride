import { Card, Text, Stack } from "@sanity/ui";
import { PublishIcon } from "@sanity/icons";

export const deploy = () => {
  return {
    title: "Deploy",
    name: "deploy",
    icon: PublishIcon as any,
    component: () => (
      <Card padding={4}>
        <Stack>
          <Text>TODO</Text>
        </Stack>
      </Card>
    ),
  };
};
