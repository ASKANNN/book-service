import Book from "./book.model.js";
import Publisher from "./publisher.model.js";
import {sequelize} from "../config/database.js";
import {DataTypes} from "sequelize";
import Author from "./author.model.js";

// Book and Publisher
Book.belongsTo(Publisher, {
    foreignKey: "publisher",
    targetKey: "publisher_name",
    as: 'publisherDetails'
});

Publisher.hasMany(Book, {
    foreignKey: "publisher",
    sourceKey: "publisher_name",
    as: 'books'
})

// Define the junction table
const BooksAuthors = sequelize.define('BooksAuthors', {
    isbn: {
        type: DataTypes.STRING,
        references: {
            model: Book,
            key: 'isbn',

        }
    },
    author_name: {
        type: DataTypes.STRING,
        references: {
            model: Author,
            key: 'name',
        }
    }
}, {
    tableName: 'books_authors'
})

// Book and Author: Many-To-Many relationship
Book.belongsToMany(Author, {
    through: BooksAuthors,
    foreignKey: 'isbn',
    otherKey: 'author_name',
    as: 'authors'
});

Author.belongsToMany(Book, {
    through: BooksAuthors,
    foreignKey: 'author_name',
    otherKey: 'isbn',
    as: 'books'
})

const syncModels = async () => {
    try {
        await sequelize.sync();     // {force: true} - удаляет уже существующие колонки
        console.log('Models synchronized successfully');
    } catch (e) {
        console.log('Error synchronizing models:', e);
    }
}
export {syncModels, Book, Publisher, Author};

// Bidirectional association - в базах данных/ORM: Это связь, при которой внешний ключ находится в таблице А и ссылается на таблицу B. То есть, запись A "смотрит" или направлена в сторону B.