import subprocess
import os
import sys

print("Python wrapper starting...")

# 1. Install Frontend dependencies and build
print("Installing frontend dependencies and building production assets...")
subprocess.run("npm install --prefix Frontend", shell=True, check=True)
subprocess.run("npm run build --prefix Frontend", shell=True, check=True)

# 2. Install Backend dependencies
print("Installing backend dependencies...")
subprocess.run("npm install --prefix Backend", shell=True, check=True)

# 3. Start Express server on port 7860 (Hugging Face default)
print("Launching Express server on port 7860...")
os.environ["PORT"] = "7860"
os.environ["NODE_ENV"] = "production"

# Execute the backend server (blocking call)
sys.exit(subprocess.run("node Backend/server.js", shell=True).returncode)
