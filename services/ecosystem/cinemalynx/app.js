const serviceName = process.env.SERVICE_NAME || "service";
const startedAt = new Date().toISOString();

console.log(`[scaffold] ${serviceName} booting at ${startedAt}`);
console.log("[scaffold] Non-production placeholder. Replace with real service logic.");

setInterval(() => {
  console.log(`[scaffold] ${serviceName} heartbeat ${new Date().toISOString()}`);
}, 30000);
