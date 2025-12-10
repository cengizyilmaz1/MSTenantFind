# Microsoft Tenant Finder

Professional Microsoft Azure and Microsoft 365 tenant lookup tool by Microsoft MVP Cengiz YILMAZ.

## 🌐 Live Demo

[https://tenant-find.cengizyilmaz.net](https://tenant-find.cengizyilmaz.net)

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

Every push to the `main` branch triggers an automatic deployment to GitHub Pages.

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── public/
│   ├── CNAME              # Custom domain configuration
│   └── 404.html           # SPA routing fallback
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── ...
├── vite.config.ts         # Vite configuration
└── package.json
```

## 🌐 Custom Domain

The site is configured to use the custom domain `tenant-find.cengizyilmaz.net` through:

1. `public/CNAME` file
2. DNS CNAME record pointing to GitHub Pages
3. Updated base paths in configuration files

## 🔧 Configuration

The project is configured for GitHub Pages deployment with:

- ✅ Vite base path set to `/`
- ✅ React Router basename removed for custom domain
- ✅ SPA routing support with `404.html`
- ✅ Automatic GitHub Actions deployment
- ✅ Custom domain configuration

## 📝 Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion

## 👨‍💻 Author

**Cengiz YILMAZ** - Microsoft MVP
- Website: [cengizyilmaz.net](https://cengizyilmaz.net)
- Twitter: [@cengizyilmazz](https://x.com/cengizyilmazz)
- LinkedIn: [cengizyilmaz](https://www.linkedin.com/in/cengizyilmazz/)
