import {Author, Publisher, Book} from "../model/index.js";

export const findPublishersByAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.author, {
            include: [
                {
                    model: Book,
                    as: 'books',
                    include: [
                        {
                            model: Publisher,
                            as: 'publisherDetails'
                        }
                    ],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!author) {
            return res.status(404).send({error: `Author ${req.params.author} not found`});
        }

        const publishersMap = new Map();
        for (const book of author.books) {
            if (book.publisherDetails) {
                publishersMap.set(book.publisherDetails.publisher_name, book.publisherDetails.publisher_name);
            }
        }

        return res.json(Array.from(publishersMap.values()));
    } catch (e) {
        console.log('Error finding publishers by author', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to find publishers by author'
        });
    }
}
