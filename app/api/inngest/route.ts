import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import {serve} from "inngest/next";
import {inngest} from "@/lib/inngest/client";
import {sendDailyNewsSummary, sendSignUpEmail} from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary],
});