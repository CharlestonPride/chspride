import { useState } from "react";
import { Card, Text, Stack, Button, Box } from "@sanity/ui";
import { PublishIcon } from "@sanity/icons";

type Status = "idle" | "loading" | "success" | "error";

const DEPLOY_HOOK_URL = process.env.NEXT_PUBLIC_SANITY_DEPLOY_HOOK_URL;

function DeployTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleDeploy() {
    if (!DEPLOY_HOOK_URL) {
      setStatus("error");
      setMessage(
        "NEXT_PUBLIC_SANITY_DEPLOY_HOOK_URL is not set. Add it to your .env file.",
      );
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(DEPLOY_HOOK_URL, { method: "POST" });
      if (res.ok) {
        setStatus("success");
        setMessage("Deploy triggered — changes will be live in ~5 minutes.");
      } else {
        setStatus("error");
        setMessage(`Request failed: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <Card padding={5}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          Deploy to Production
        </Text>
        <Text size={1} muted>
          Triggers a full site rebuild and deployment. Published Sanity content
          will be live in approximately 5 minutes.
        </Text>
        <Box>
          <Button
            icon={PublishIcon}
            text={status === "loading" ? "Deploying…" : "Deploy Now"}
            tone={status === "error" ? "critical" : "primary"}
            onClick={handleDeploy}
            disabled={status === "loading"}
          />
        </Box>
        {message && (
          <Card
            padding={3}
            tone={status === "success" ? "positive" : "critical"}
            border
            radius={2}
          >
            <Text size={1}>{message}</Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}

export const deploy = () => {
  return {
    title: "Deploy",
    name: "deploy",
    icon: PublishIcon as any,
    component: DeployTool,
  };
};
