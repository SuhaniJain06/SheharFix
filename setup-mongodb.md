# MongoDB Setup Instructions

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows
1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select "Windows" and download the MSI installer
   - Run the installer and follow the setup wizard

2. **Start MongoDB Service:**
   ```bash
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

3. **Verify Installation:**
   ```bash
   mongo --version
   ```

### macOS
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create Account:**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred cloud provider and region

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update Environment:**
   - Open `API/config.env`
   - Replace `MONGODB_URI` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sheharfix
   ```

## Option 3: Use Docker (Alternative)

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

## After MongoDB Setup

1. **Update Environment File:**
   - Open `API/config.env`
   - Ensure `MONGODB_URI` is correct

2. **Restart Backend Server:**
   ```bash
   cd API
   npm start
   ```

3. **Verify Connection:**
   - Check console for "Connected to MongoDB" message
   - No more connection errors should appear

## Troubleshooting

### Common Issues:
1. **Port 27017 in use:** Change MongoDB port in config
2. **Permission denied:** Run as administrator (Windows) or use sudo (Linux/Mac)
3. **Connection timeout:** Check firewall settings
4. **Authentication failed:** Verify username/password in connection string

### Test MongoDB Connection:
```bash
# Using mongo shell
mongo
> show dbs

# Or using mongosh (newer version)
mongosh
> show dbs
```
