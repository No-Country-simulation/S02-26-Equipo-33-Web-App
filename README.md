# S02-26-Equipo-33-Web-App

## 🛠️ Technical

- **Node.js** - JavaScript Runtime
- **Express.js** - Backend Framework
- **Next.js** - Frontend Framework
- **Typescript** - Types

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
