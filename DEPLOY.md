# 🚀 Guía de Deploy - Sistema de Gastos

## 📋 Configuración de Auto-Redeploy

### **1. Vercel (Recomendado)**

#### Configuración Automática:
1. Conecta tu repositorio en [Vercel Dashboard](https://vercel.com/dashboard)
2. Importa el proyecto desde GitHub
3. Configura las variables de entorno:
   - `MONGODB_URI`: Tu string de conexión de MongoDB
4. El auto-deploy se activa automáticamente

#### Deploy Manual:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### **2. Netlify**

#### Configuración:
1. Conecta en [Netlify Dashboard](https://app.netlify.com)
2. Importa desde GitHub
3. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Variables de entorno en Site settings

### **3. GitHub Actions (Para cualquier hosting)**

#### Configuración de Secrets:
Ve a Settings > Secrets and variables > Actions en tu repositorio y agrega:
- `VERCEL_TOKEN`: Token de Vercel
- `ORG_ID`: ID de tu organización
- `PROJECT_ID`: ID de tu proyecto

### **4. Variables de Entorno Requeridas**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reg-gastos
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NODE_ENV=production
```

## 🔄 Flujo de Auto-Redeploy

### **Trigger Automático:**
- ✅ Push a rama `main`
- ✅ Pull Request mergeado
- ✅ Tag release

### **Proceso:**
1. **Detecta cambios** en GitHub
2. **Instala dependencias** (`npm install`)
3. **Ejecuta linting** (`npm run lint`)
4. **Construye aplicación** (`npm run build`)
5. **Despliega** a producción
6. **Notifica** resultado

## 📊 Monitoreo Post-Deploy

### **Checklist:**
- [ ] Gráficas se muestran correctamente
- [ ] Responsive design funciona en móvil
- [ ] APIs responden (`/api/expenses/charts`)
- [ ] Base de datos conectada
- [ ] Sin errores en consola

### **URLs de Prueba:**
- `/` - Página principal
- `/api/expenses` - API de gastos
- `/api/expenses/charts` - API de gráficas

## 🛠️ Comandos Útiles

```bash
# Deploy local
npm run deploy

# Deploy a Vercel
npm run deploy:vercel

# Deploy a Netlify
npm run deploy:netlify

# Verificar build
npm run build

# Linting
npm run lint
```

## 🚨 Troubleshooting

### **Error de Build:**
- Verificar que todas las dependencias estén en `package.json`
- Revisar variables de entorno
- Comprobar que MongoDB esté accesible

### **Error de Runtime:**
- Verificar conexión a MongoDB
- Revisar logs en dashboard de hosting
- Comprobar que las APIs respondan

### **Error de Gráficas:**
- Verificar que Recharts esté instalado
- Comprobar que `/api/expenses/charts` funcione
- Revisar consola del navegador
