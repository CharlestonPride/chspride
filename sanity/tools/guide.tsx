import { Card, Text, Stack } from "@sanity/ui";
import { DashboardIcon } from "@sanity/icons";

export const guide = () => {
  return {
    title: "Guide",
    name: "guide",
    icon: DashboardIcon,
    component: () => (
      <Card padding={4}>
        <Stack>
          <Text>TODO</Text>
        </Stack>
      </Card>
    ),
  };
};
