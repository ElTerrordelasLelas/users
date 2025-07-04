
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    # Configuración de conexión (ajusta según tu configuración)
    conn_params = {
        'host': 'localhost',
        'port': 5432,
        'user': 'postgres',  # Cambia por tu usuario
        'password': 'password'  # Cambia por tu contraseña
    }
    
    try:
        # Conectar al servidor PostgreSQL
        conn = psycopg2.connect(**conn_params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Crear cursor
        cursor = conn.cursor()
        
        # Crear la base de datos
        cursor.execute("CREATE DATABASE criminal_records")
        print("Base de datos 'criminal_records' creada exitosamente!")
        
    except psycopg2.errors.DuplicateDatabase:
        print("La base de datos 'criminal_records' ya existe.")
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    create_database()
