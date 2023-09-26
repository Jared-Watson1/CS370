import psycopg2
import os
from psycopg2 import errors
from dotenv import load_dotenv
from datetime import date

load_dotenv()
DATABASE_URL = os.getenv("TASK_DB_URL")

