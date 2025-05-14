# Usa una imagen base oficial de Python
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia todos los archivos del proyecto
COPY . /app

# Instala las dependencias directamente
RUN pip install --no-cache-dir flask flask-cors requests

# Expone el puerto que usa Flask
EXPOSE 5000

# Ejecuta la aplicación
CMD ["python", "app.py"]
