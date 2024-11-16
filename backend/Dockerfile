
FROM python:3.13

WORKDIR /backend

RUN pip install pipenv

COPY Pipfile Pipfile.lock ./

RUN pipenv install --system --deploy

COPY . .

CMD ["fastapi", "run", "app/main.py", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]