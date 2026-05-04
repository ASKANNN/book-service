import {Author, Book} from "../model/index.js";

export const findPublishersByAuthor = async (req, res) => {
    const author = await Author.findByPk(req.params.name);
    if (!author) {
        return res.status(404).json({error: `Author with name ${req.params.name} not found`});
    }
    const publishers = await Book.aggregate('publisher', 'DISTINCT', {
        plain: false,       // тип запроса SELECT и возвращает одну строку
        include: {
            model: Author,
            as: 'authors',
            where: {name: req.params.name},
            through: {
                attributes: []
            }
        }
    })
    return res.json(publishers.map(p => p.DISTINCT));
}