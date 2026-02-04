# 🤝 Guía de Contribución

## Flujo de Trabajo Git

### 1. Crear una nueva rama para tu feature
```bash
# Asegúrate de estar en la rama principal actualizada
git checkout dev
git pull origin dev

# Crea una nueva rama con un nombre descriptivo
git checkout -b feature/nombre-descriptivo
# O para correcciones:
git checkout -b fix/nombre-descriptivo
```

### 2. Realizar tus cambios
- Escribe código limpio y bien documentado
- Sigue las convenciones de código del proyecto
- Añade tests para nuevas funcionalidades

### 3. Commits
Usa commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git add .
git commit -m "tipo: descripción breve

Descripción detallada si es necesario"
```

Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, sin cambios de código
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 4. Push de tu rama
```bash
git push origin feature/nombre-descriptivo
```

### 5. Crear Pull Request
1. Ve a GitHub y crea un Pull Request hacia la rama `dev`
2. Completa la plantilla de PR con:
   - Descripción de los cambios
   - Screenshots si aplica
   - Checklist de tareas completadas
3. Asigna reviewers si es necesario
4. Espera la revisión del encargado del repositorio

### 6. Proceso de Revisión
- El **encargado del repositorio** revisará tu PR
- Los tests automáticos deben pasar ✓
- Se pueden solicitar cambios antes de aprobar
- Una vez aprobado, el encargado hará el merge a `dev`

## Reglas Importantes

⚠️ **NO hacer push directo a `dev` o `main`**
⚠️ **Siempre trabajar en ramas feature/fix**
⚠️ **Todos los tests deben pasar antes de crear PR**

## Estructura de Ramas
```
main (producción)
  └── dev (desarrollo)
       ├── feature/tu-feature-1
       ├── feature/tu-feature-2
       └── fix/tu-fix
```

## Contacto

Si tienes dudas, contacta al encargado del repositorio equipo: [S02-26-Equipo-33-Web-App]

