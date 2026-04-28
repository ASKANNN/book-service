import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';

dotenv.config();

// Create new Sequelize instance

// Создаём подключение к DB через объект подключения Sequelize(экземпляр ORM)
const sequelize = new Sequelize(
    process.env.DB_NAME || 'test',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
        define: {
            timestamps: false,
        }
    }
);

// DB connection
const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the database', error);
    }
}
export {sequelize, dbConnection};
