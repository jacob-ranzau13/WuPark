# WuPark
**Smart Parking Management System - Senior Design Project**

A comprehensive parking management solution with real-time monitoring, modern web interface, and AWS cloud deployment.

## 🏗️ Architecture

- **Frontend**: Modern React application with Material-UI and OpenStreetMap integration
- **Backend**: FastAPI with AWS Lambda (deployed separately in another repository)
- **Infrastructure**: AWS S3, CloudFront, API Gateway, Lambda
- **Deployment**: Serverless Framework with GitHub Actions CI/CD

## 📁 Project Structure

```
WuPark/
├── frontEnd/              # Modern React frontend application
│   ├── src/
│   │   ├── components/    # React components (Dashboard, Map, Cards)
│   │   ├── services/      # API client and utilities
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript definitions
│   ├── .github/workflows/ # CI/CD pipelines
│   └── serverless.yml     # AWS deployment configuration
├── backEnd/               # Backend dependencies (see separate repo for main code)
├── send_receive/          # Data communication utilities
├── LotImages/             # Parking lot images
└── *.py                   # Legacy Python scripts
```

## 🚀 Quick Start

### Frontend Development

1. **Navigate to frontend directory**:
   ```bash
   cd frontEnd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

### Deployment

#### Using PowerShell (Windows):
```powershell
cd frontEnd
.\deploy.ps1 -Stage staging
```

#### Using Bash (Linux/macOS):
```bash
cd frontEnd
chmod +x deploy.sh
./deploy.sh --stage staging
```

## 📡 Data Protocol

The system communicates using a binary protocol for efficient data transmission:

**Format**: `[Length][Lot ID][Spot Data...]`

- **Byte 1**: Number of data bytes to follow (minimum 1)
- **Byte 2**: Parking lot identifier  
- **Bytes 3-n**: Bit-encoded parking spot status (1 = occupied, 0 = empty)

### Example: Three bytes
```
00000010 00000101 10100011
```

**Interpretation**:
1. **Byte 1** (2): Expect 2 more bytes
2. **Byte 2** (5): Data from Parking Lot #5  
3. **Byte 3** (163): 4 occupied spots, 4 empty spots

## 🔧 Features

### Frontend Features
- 🎨 Modern Material-UI design system
- 📱 Responsive mobile-friendly interface
- 🗺️ Interactive OpenStreetMap integration
- 📊 Real-time parking data visualization
- ⚡ Live updates with React Query
- 📈 Occupancy rate monitoring and analytics

### Infrastructure Features
- ☁️ Serverless AWS deployment
- 🚀 Automated CI/CD with GitHub Actions
- 🌐 CloudFront CDN for global delivery
- 🔒 Secure API integration
- 📊 CloudWatch monitoring and logging

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Git

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod
REACT_APP_ENVIRONMENT=production
```

### GitHub Actions Secrets
Configure these secrets in your repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`  
- `STAGING_API_URL`
- `PROD_API_URL`

## 📚 Documentation

- [Frontend README](./frontEnd/README.md) - Detailed frontend documentation
- [API Documentation](./API.md) - Backend API reference (if available)
- [Deployment Guide](./DEPLOYMENT.md) - Comprehensive deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`  
6. Submit a pull request

## 📄 License

This project is part of the WuPark Senior Design Project.

---

**Future Enhancements**: Data integrity verification, WebSocket real-time updates, mobile app integration