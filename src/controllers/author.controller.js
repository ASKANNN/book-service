import {Author, Book} from "../model/index.js";
import {sequelize} from "../config/database.js";

export const findBookAuthors = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.isbn, {
            include: [
                {
                    model: Author,
                    as: 'authors',
                    attributes: {
                        include: ['name', [sequelize.col('birth_date'), 'birthDate']],
                        exclude: ['birth_date']
                    },
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!book) {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }

        return res.json(book.authors);
    } catch (e) {
        console.log('Error finding book authors', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to find book authors'
        });
    }
}

export const removeAuthor = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const author = await Author.findByPk(req.params.author, {
            attributes: {
                include: ['name', [sequelize.col('birth_date'), 'birthDate']],
                exclude: ['birth_date']
            },
            transaction: t
        });

        if (!author) {
            await t.rollback();
            return res.status(404).send({error: `Author ${req.params.author} not found`});
        }

        await author.destroy({transaction: t});
        await t.commit();
        return res.json(author);
    } catch (e) {
        await t.rollback();
        console.log('Error removing author', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to remove author'
        });
    }
}
