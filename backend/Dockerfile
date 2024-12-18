FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Configura la variable de entorno para Django
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:${PYTHONPATH}"

# Expone el puerto para Django
EXPOSE 8000

# Ejecuta el servidor
CMD ["gunicorn", "DeezerTest.wsgi:application", "--bind", "0.0.0.0:8000"]
