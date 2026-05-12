import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { connectToDatabase } from "../database/mongoose";

async function main() {
  try {
    await connectToDatabase();
    // If connectToDatabase resolves without throwing, connection is OK
    console.log("OK: Database connection succeeded");
    process.exit(0);
  } catch (err) {
    console.error("ERROR: Database connection failed");
    console.error(err);
    process.exit(1);
  }
}

main();