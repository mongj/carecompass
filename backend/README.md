# FastAPI server

## Local development
1. Set up the environment variables
```
cp .env.template .env
```

2. Start a local postgres database and add in the database credentials. `DB_USERNAME` and `DB_PASSWORD` can be left empty if you're connecting via Unix-domain sockets
```
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
DB_SSLMODE=
```

3. Get the OpenAI credentials from AWS Secret Manager. Will eventually use boto3 for this but haven't set it up yet
```
OPENAI_API_KEY= 
OPENAI_ASSISTANT_ID=
```

4. Install dependencies and create the virtual environment
```
pipenv install
```

5. Activate the virtual environment
```
pipenv shell
```

6. Run the server
```
fastapi dev app/main.py
```

## Database migrations
The project uses alembic to manage database schema changes. Migration files are stored at `app/migrations/versions`

Migrate up
```
alembic upgrade head
```

Migrate down
```
alembic downgrade <step>
```

To autogenerate migrations based on the latest models
```
alembic revision --autogenerate -m <migration-name>
```

## Deployment
todo