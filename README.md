# Clusters HPA Chatbot Educativo Especializado en Microsoft 365

Este repositorio contiene una aplicación de chatbot educativo especializado en Microsoft 365, con configuración de auto-escalado horizontal (HPA) en Kubernetes.

## Requisitos previos

- Docker Desktop instalado
- Cuenta en Docker Hub
- Kubernetes habilitado
- Minikube (para desarrollo local)

## Guía de despliegue

### 1. Preparación del entorno

1. Abrir Docker Desktop
2. Habilitar Kubernetes en Docker Desktop (Configuración > Kubernetes > Enable Kubernetes)

### 2. Construcción y publicación de imágenes Docker

> **Nota**: Reemplazar `su-usuario` con su nombre de usuario de Docker Hub.

#### Backend

```bash
cd back
docker build -t su-usuario/clustershpachatboteducativoespecializadoenmicrosoft365-backend:latest .
docker push su-usuario/clustershpachatboteducativoespecializadoenmicrosoft365-backend:latest
```

#### Frontend

```bash
cd front
docker build -t su-usuario/clustershpachatboteducativoespecializadoenmicrosoft365-frontend:latest .
docker push su-usuario/clustershpachatboteducativoespecializadoenmicrosoft365-frontend:latest
```

### 3. Configuración de Minikube

#### Instalar Minikube (si no está instalado)

```bash
winget install Kubernetes.minikube
```

#### Iniciar Minikube

```bash
minikube start
```

#### Habilitar metrics-server para el autoscaler (HPA)

```bash
minikube addons enable metrics-server
```

### 4. Despliegue en Kubernetes

#### Desplegar el backend

```bash
cd back/k8s
kubectl apply -f .
```

#### Desplegar el frontend

```bash
cd front/k8s
kubectl apply -f .
```

### 5. Verificar los servicios desplegados

```bash
kubectl get services
```

Ejemplo de salida:
```
NAME               TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
backend-service    NodePort       10.96.210.105    <none>        80:32133/TCP   4m15s
frontend-service   NodePort       10.99.93.128     <none>        80:30441/TCP   76s
```

### 6. Acceder a los servicios

#### Acceder al backend

```bash
kubectl port-forward service/backend-service 30001:80
```

#### Acceder al frontend

```bash
minikube service frontend-service
```

## Pruebas del Auto-escalado Horizontal (HPA)

### Generar carga para probar el HPA

```powershell
while ($true) { Invoke-WebRequest http://127.0.0.1:61095 -UseBasicParsing }
```

### Monitorear los pods durante el escalado

```powershell
while ($true) {
    kubectl get pods -l app=frontend
    Start-Sleep -Seconds 2
    Clear-Host
}
```

## Notas adicionales

- Los archivos de configuración de Kubernetes se encuentran en los directorios `back/k8s` y `front/k8s`.
- Asegúrese de que las imágenes Docker estén correctamente etiquetadas y publicadas en Docker Hub antes de desplegar en Kubernetes.
- Puede ser necesario ajustar la URL en el script de prueba de carga según la dirección IP y puerto asignados por Minikube.
