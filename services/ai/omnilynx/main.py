import os
import time
from datetime import datetime

service_name = os.getenv("SERVICE_NAME", "service")
print(f"[scaffold] {service_name} booting at {datetime.utcnow().isoformat()}Z")
print("[scaffold] Non-production placeholder. Replace with real service logic.")

while True:
    print(f"[scaffold] {service_name} heartbeat {datetime.utcnow().isoformat()}Z")
    time.sleep(30)
