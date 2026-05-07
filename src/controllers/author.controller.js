import {Author, Book} from "../model/index.js";
import {sequelize} from "../config/database.js";


export const findBookAuthors = async (req, res) => {
    const book = await Book.findByPk(req.params.isbn);
    if (!book) {
        return res.status(404).json({error: `Book with ISBN ${req.params.isbn} not found`});
    }
    const authors = await book.getAuthors({
        joinTableAttributes: [],            // удаление присоединенной таблицы
        attributes: {
            include: ['name', [sequelize.col('birth_date'), 'birthDate']],
            exclude: ['birth_date']
        }
    });
    return res.status(200).json(authors);
}

export const removeAuthor = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const author = await Author.findByPk(req.params.name, {
            transaction: t,
            joinTableAttributes: [],
            attributes: {
                include: ['name', [sequelize.col('birth_date'), 'birthDate']],
                exclude: ['birth_date']
            }
        });
        if (!author) {
            await t.rollback();
            return res.status(404).json({error: `Author with name ${req.params.name} not found`});
        }
        if ((await author.getBooks({transaction: t})).length > 0) {
            await t.rollback();
            return res.status(400).json({error: `Author ${req.params.name} has books associated with them`});
        }
        await author.destroy();
        return res.status(200).json(author);
    } catch (e) {
        await t.rollback();
        console.log(`Error removing author:`, e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to remove author'
        });
    }
}