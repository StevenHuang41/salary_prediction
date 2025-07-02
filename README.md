# Salary Prediction

A full stack web application that predicts your salary
based on user input using machine learning.

<!-- ## Motivation -->

## Overview
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structurej)
    - [root](#root)
    - [frontend](#frontend)
    - [backend](#backend)
- [Installation](#installation)
    - [Installation & Setup Methods](#installation--setup-methods)

## Features

- Intuitive web interface
- Real-time salary predictions
- Iteractive data management & Model retraining
- Automated model selection & Hyperparameter Optimization
- Dynamic prediction adjustment
- Data visualization


## Tech Stack

**Frontend:** React / Vite  
**Backend:** python / fastAPI / bash  
**Database:** sqlite3 / pandas  
**ML:** scikit-learn / tensorflow   
**Other:** docker / git

## Project Structure
### root

```sh
.
├── README.md
├── docker-compose.yml
├── setup
├── frontend/
├── backend/
├── readme_images/
└── .gitignore
```

### Frontend

```sh
frontend/
├── README.md
├── Dockerfile
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── src/
├── public/
├── .gitignore
└── .dockerignore
```

### Backend

```sh
backend/
├── README.md
├── Dockerfile
├── main.py
├── uv.lock
├── pyproject.toml
├── requirements.txt
├── my_package/
├── database/
├── .gitignore
└── .dockerignore
```

## Installation

### 1. Clone the repo:  

```sh
# ssh:
git clone git@github.com:StevenHuang41/salary_prediction.git
```

Alternatively,  

```sh
# http:
git clone https://github.com/StevenHuang41/salary_prediction.git
``` 
then do,  
```sh
cd salary_prediction
```  

---

### Installation & Setup Methods:

1. [Manual Installation](#2-frontend-installation) (without docker)

2. [Docker](#docker) (Recommended)

---

### 2. frontend Installation:
```sh
cd frontend
npm install
cd ..
```  

---

### 3. backend Installation:
```sh
cd backend
pip install -r requirements.txt
```  

Alternatively, install uv first
```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

then do,

```sh
cd backend
uv sync --locked # faster than pip install
cd ..
```

## Usage 

### 1. Setup 

use `setup` to create .env.local files
```sh
./setup
```
expected result:
![setup image](./readme_images/setup_image.png)

### 2. Start server

open 4 terminals, and run each command respectively.

- **frontend test**

    ```sh
    cd frontend
    npm test
    ```

    expected result:  
    ![frontend test](./readme_images/frontend_test.png)

- **frontend server**

    ```sh
    cd frontend
    npm run dev
    ```

    expected result:  
    ![frontend server](./readme_images/frontend_server.png)

- **Backend server**

    for basic api request

    ```sh
    cd backend
    python main.py 8001
    ```
    Alternatively,
    ```sh
    cd backend
    uv run main.py 8001
    ```

    expected result:  
    ![backend server](./readme_images/backend_server.png)

- **backend training server**

    ```sh
    cd backend
    python main.py 8000
    ```
    Alternatively,
    ```sh
    cd backend
    uv run main.py 8000
    ```
    expected result:  
    ![training server](./readme_images/training_server.png)

---

### Docker 

Docker handles packages installation & setup, which is much easier than manual installation.

```sh
cd salary_prediction
./setup --build
```

see `./setup --help` for further imformations  

expected result:
![setup build](./readme_images/setup_build.png)

wait until all servers are successfully built

---

### 3. Access

#### **Browser**

- **Frontend:** <http://localhost:3000>

- **Backend:** <http://localhost:8001/docs>

- **Training:** <http://localhost:8000/docs>

expected result:  
- frontend:
![browser frontend](./readme_images/browser_frontend.png)

- backend:
![browser backend](./readme_images/browser_backend.png)



---

#### **Mobile**

enter `http://[local IP address]:3000/` in your mobile browser

replace `[local IP address]` with your local machine [IP address](#1-setup)

expected result:
![mobile frontend](./readme_images/mobile_frontend.png)


### 4. App Instructions

after entering informations, press the **Predict** Salary button
![instruction1](./readme_images/instruction1.png)

click **see detail** button for further functions
![instruction2](./readme_images/instruction2.png)

change predict value by keyborad
![instruction3](./readme_images/instruction3.png)

alternatively, change predict value by range bar
![instruction5](./readme_images/instruction5.png)

click **Add Data** button
![instruction4](./readme_images/instruction4.png)

click **Retrain Model** button to retrain model based on changed predict value
![instruction6](./readme_images/instruction6.png)

result of retraining model, (predict value larger)
![instruction7](./readme_images/instruction7.png)

click **Reset Database** button, clean the database from added data
![instruction8](./readme_images/instruction8.png)


## Contribution

1. Fork the repository.
2. Create a new branch
    ```sh
    git switch -c feature-branch
    ```
3. Commit your changes
    ```sh
    git commit -m "Add some feature"
    ```
4. Push to the branch
    ```sh
    git push origin feature-branch
    ```
5. Create a new Pull Request.

## License

This project is licensed under the ... License.
See the [LICENSE](LICENSE) file for details.

## Credits

Thanks to all contributors!
See the [contributors list](https://github.com/StevenHuang41/salary_prediction/graphs/contributors)
<!-- 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->