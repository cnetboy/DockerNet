# DockerNet Tutorial: Running the Project and Creating Networks, Nodes, and Bridges

This tutorial guides you through setting up and running the DockerNet project, a web app for visualizing and managing Docker networks and containers. You'll learn how to create networks (including bridge networks), containers (nodes), and connect them.

## Prerequisites
- **Docker**: Installed and running. Download from [docker.com](https://www.docker.com/).
- **Node.js and npm**: Version 12 or higher. Download from [nodejs.org](https://nodejs.org/).
- **Git**: For cloning the repository.

Ensure Docker is running:
```bash
sudo systemctl start docker  # Linux
# Or open Docker Desktop on Windows/Mac
```

## Step 1: Clone and Set Up the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/cnetboy/DockerNet.git
   cd DockerNet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   - This may show warnings, but installation completes successfully.

3. Configure environment (optional):
   - Rename `.env.example` to `.env` if you want to change default ports (8081 for frontend, 3031 for backend).

4. Start the application:
   ```bash
   npm start
   ```
   - Opens the app in your browser at `http://localhost:8081/`.
   - The backend runs on `http://localhost:3031/`.

## Step 2: Understanding DockerNet Interface
- **Sidebar**: Lists all Docker networks (e.g., default `bridge`, `host`, `none`).
- **Main Area**: Shows network details, containers, and visualizations.
- **Views**: Switch between List View and Graph View.
- **Actions**: Create/delete networks, connect/disconnect containers.

## Step 3: Creating Networks
Docker networks allow containers to communicate. DockerNet lets you create custom networks via the UI.

### Via DockerNet UI
1. In the app, click "Add Network" in the sidebar.
2. Enter a network name (e.g., `mybridge`).
3. Select driver (e.g., `bridge` for isolated networking).
4. Click "Create" – the network appears in the sidebar.

### Via Docker CLI (Alternative)
```bash
docker network create --driver bridge mybridge
```
- Verify in DockerNet by refreshing the page.

### Types of Networks
- **Bridge**: Default, isolated network for containers on the same host.
- **Host**: Shares host's network stack (no isolation).
- **Overlay**: For multi-host networking (Swarm mode).
- **Macvlan**: Assigns MAC addresses for direct host network access.

## Step 4: Creating Containers (Nodes)
Containers are the "nodes" in your network. Create them via CLI, then manage in DockerNet.

### Create Containers
Run containers and connect to a network:
```bash
# Create 3 example containers connected to 'mybridge'
docker run -d --name node1 --network mybridge nginx
docker run -d --name node2 --network mybridge nginx
docker run -d --name node3 --network mybridge nginx
```

- `--network mybridge`: Connects to the custom bridge network.
- `nginx`: Runs a web server for testing.

### View in DockerNet
1. Click on "mybridge" in the sidebar.
2. See containers listed with their details (ID, name, IP).
3. Switch to Graph View to visualize connections (mesh topology with limited links).

## Step 5: Managing Connections
### Connect Existing Containers to Networks
Via DockerNet UI:
1. Select a network.
2. Use "Connect Container" to add running containers.

Via CLI:
```bash
docker network connect mybridge existing_container_name
```

### Disconnect Containers
Via UI: Select container and "Disconnect".
Via CLI:
```bash
docker network disconnect mybridge container_name
```

## Step 6: Advanced: Building a Custom Bridge Network
1. Create a bridge network with custom options:
   ```bash
   docker network create --driver bridge \
     --subnet=192.168.10.0/24 \
     --gateway=192.168.10.1 \
     mycustombridge
   ```

2. Run containers with static IPs:
   ```bash
   docker run -d --name node1 --network mycustombridge --ip 192.168.10.10 nginx
   docker run -d --name node2 --network mycustombridge --ip 192.168.10.11 nginx
   ```

3. View in DockerNet: Refresh and select "mycustombridge" to see IPs and connections.

## Step 7: Testing Connectivity
1. Inspect container IPs:
   ```bash
   docker inspect node1 | grep IPAddress
   ```

2. Test communication:
   ```bash
   docker exec node1 curl http://node2  # Should work if on same network
   ```

3. Use DockerNet's graph to visualize the topology.

## Troubleshooting
- **"Unable to connect with Docker"**: Ensure Docker is running and user is in `docker` group.
- **Port conflicts**: Change ports in `.env` if 8081/3031 are in use.
- **No containers shown**: Refresh the app or check `docker ps`.
- **Graph not updating**: The app polls every few seconds; wait or refresh.

## Cleanup
- Stop containers: `docker stop $(docker ps -q)`
- Remove containers: `docker rm $(docker ps -a -q)`
- Remove networks: `docker network rm mybridge`
- In DockerNet UI, use "Delete Network" for custom networks.

This tutorial gets you started with DockerNet for network visualization and management. Explore the UI for more features! For code details, see [CHANGES.md](./CHANGES.md).