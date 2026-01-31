# DockerNet Project Changes Summary

This document outlines the key changes made to the DockerNet project throughout its development and fixes.

## Initial Setup and Dependencies
- **Issue**: The project could not execute due to missing Node.js and npm.
- **Fix**: Installed Node.js (version 12.22.9) and npm on the Linux system using `sudo apt install nodejs npm`.
- **Note on Installation**: Running `npm install` initially showed warnings about deprecated packages (e.g., uuid@3.4.0, querystring@0.2.0) and security vulnerabilities (60 packages with low, moderate, high, and critical issues). The output indicated: "added 1234 packages, and audited 1235 packages in 2m". Despite the warnings, the installation completed successfully, allowing the project to run.
  - **Files Updated/Created**: `node_modules/` directory (containing all installed packages), `package-lock.json` (generated/updated for dependency locking).
- **Result**: Enabled running `npm install` and `npm start` to launch the application.

## Docker Connectivity Fixes
- **Issue**: The application displayed "Unable to connect with Docker" due to an outdated Docker API version.
- **Initial Fix**: Updated the API version in `server/controllers/networksController.ts` from `v1.18` to `v1.44` in the curl command to the Docker socket.
- **Improved Fix**: Replaced the curl-based API call with direct Docker CLI commands for better compatibility. Changed the `getNetworksAndContainers` function to use:
  ```bash
  docker network inspect $(docker network ls -q)
  ```
  This retrieves network and container data using Docker CLI instead of the HTTP API.
- **Result**: The app now successfully connects to Docker and displays networks and containers.

## Network and Container Creation
- **Added Network**: Created a custom Docker network named "mynetwork" using `docker network create mynetwork`.
- **Added Containers**: Launched 10 Docker containers (container1 to container10), each running nginx and connected to "mynetwork":
  ```bash
  for i in {1..10}; do docker run -d --name container$i --network mynetwork nginx; done
  ```
- **Result**: Populated the app with a network containing 10 running containers for visualization.

## Graph Topology Modifications
- **File**: `src/components/GraphDisplay.tsx`
- **Initial Topology**: Star network (central network node connected to each container).
- **Change 1**: Converted to full mesh topology where every container is connected to every other container.
- **Change 2**: Limited the mesh to prevent overcrowding: each container now connects to the next 4 containers in a circular order (circulant graph with degree 4).
  - Code: Loops through containers, adding links to `i+1`, `i+2`, `i+3`, `i+4` (modulo the total count).
- **Result**: The graph visualization shows a structured network with exactly 4 links per node, improving readability while maintaining connectivity.

## Overall Impact
- The project now runs successfully with Docker integration.
- Users can view networks and containers in both list and graph views.
- The graph displays a custom topology (limited mesh) instead of the default star layout.
- All changes are compatible with the existing React/TypeScript setup and Docker environment.

## Files Modified
- `server/controllers/networksController.ts`: Updated Docker data retrieval method.
- `src/components/GraphDisplay.tsx`: Modified graph link generation for topology changes.

## Technologies Used
- Node.js, npm, Express, React, TypeScript, Docker, react-force-graph-2d for visualization.