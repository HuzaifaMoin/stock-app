import { Inngest} from "inngest";
import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const inngest = new Inngest({
    id: 'signalist',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }}
})