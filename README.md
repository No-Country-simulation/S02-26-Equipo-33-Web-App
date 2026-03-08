# Horse Trust – Plataforma de Anuncios Verificados de Caballos

## S02-26-Equipo-33-Web-App

## 📌 Visión general

**Horse Trust** es una plataforma web diseñada para crear un marketplace seguro y confiable para la compra y venta de caballos.
La idea principal es eliminar los riesgos típicos de los marketplaces tradicionales (anuncios sin validación) y ofrecer:

Verificación veterinaria de cada caballo listado.
Evidencias de rendimiento (videos, fotos, datos de rendimiento).
Comunicación segura entre compradores y vendedores.
Control administrativo para gestionar anuncios, usuarios y procesos de verificación.

## 🛠️ Technical

Monorepo (server + client)

- **Node.js** - JavaScript Runtime
- **Express.js** - Backend Framework
- **Next.js** - Frontend Framework
- **Typescript** - Types
- **MongoDB** - (NoSQL uso temporal)
- **SQL** - (Deploy final)


```bash
# set nodejs v24.13.0
# set git 2.43.0
git clone git@github.com:No-Country-simulation/S02-26-Equipo-33-Web-App.git
cd No-Country-simulation/S02-26-Equipo-33-Web-App/
```

### Backend

```bash
cd /server
# install dependencies
npm i
# Set environment variables

# run, build, start
npm run dev 
```
#### GET - Test

```bash
curl http://localhost:8031/test # or 3031
```
##### response
```json
{   
    "success":true,
    "message":"response Ok!",
    "data":{
        "team":"S02-26-Equipo-33-Web-App",
        "status":"Development"
    }
}
```

### Frontend

```bash
cd /client
# install dependencies
npm i
# Set environment variables

# run, build, start
npm run dev 

# go to
http://localhost:8031/test
```
## 👥 Créditos

| Nombre | Rol | Funciones destacadas |
|--------|-----|-------------|
| Andrés Segura | Backend | Arquitectura de API, manejo de base de datos |
| Valentina Calogeropulos | Frontend | UI/UX, componentes de React |
| Andministrator | QA/Testing | Administración de requerimientos, pruebas y control de calidad |


