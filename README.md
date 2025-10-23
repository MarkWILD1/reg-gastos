# Sistema de Registro de Gastos

Una aplicación web minimalista para registrar y controlar gastos personales, construida con Next.js, Tailwind CSS y MongoDB.

## Características

- ✅ **Registro de gastos** con descripción, monto, categoría y fecha
- ✅ **Vistas por período**: Diario, semanal, mensual y anual
- ✅ **Interfaz minimalista** y fácil de usar
- ✅ **Categorización** de gastos con colores distintivos
- ✅ **Edición y eliminación** de gastos
- ✅ **Estadísticas** por período seleccionado
- ✅ **Responsive design** para móviles y desktop

## Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: MongoDB con Mongoose
- **Utilidades**: date-fns para manejo de fechas

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd reg-gastos
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   MONGODB_URI=mongodb://localhost:27017/reg-gastos
   NEXTAUTH_SECRET=tu-clave-secreta-aqui
   ```

4. **Inicia MongoDB**
   Asegúrate de tener MongoDB ejecutándose en tu sistema.

5. **Ejecuta la aplicación**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   Ve a [http://localhost:3000](http://localhost:3000)

## Uso

### Agregar un gasto
1. Haz clic en "Agregar Gasto"
2. Completa el formulario con:
   - Descripción del gasto
   - Monto (en euros)
   - Categoría
   - Fecha
3. Haz clic en "Agregar"

### Ver gastos por período
- **Diario**: Ve los gastos de un día específico
- **Semanal**: Ve los gastos de una semana
- **Mensual**: Ve los gastos de un mes
- **Anual**: Ve los gastos de un año

### Editar o eliminar gastos
- Haz clic en "Editar" para modificar un gasto
- Haz clic en "Eliminar" para borrar un gasto (con confirmación)

## Estructura del proyecto

```
reg-gastos/
├── app/
│   ├── api/expenses/          # API routes para gastos
│   ├── globals.css            # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── ExpenseForm.tsx      # Formulario de gastos
│   ├── ExpenseList.tsx      # Lista de gastos
│   ├── PeriodSelector.tsx   # Selector de período
│   └── StatsCard.tsx        # Tarjeta de estadísticas
├── lib/
│   └── mongodb.ts           # Conexión a MongoDB
├── models/
│   └── Expense.ts           # Modelo de datos
└── ...
```

## Categorías disponibles

- 🍎 Alimentación
- 🚗 Transporte
- 🎬 Entretenimiento
- 🏥 Salud
- 📚 Educación
- 👕 Ropa
- 🏠 Hogar
- 📦 Otros

## Desarrollo

### Scripts disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

### Próximas mejoras

- [ ] Gráficos y visualizaciones
- [ ] Exportar datos a CSV/PDF
- [ ] Presupuestos y límites
- [ ] Recordatorios de gastos
- [ ] Múltiples usuarios
- [ ] Sincronización en la nube

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
