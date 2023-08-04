export default async (req, res, next) => {
    const { profile } = req;

    if(profile !== 'admin') {
        return res.status(401).json({ error: 'Não autorizado.' })
    }

    next();
};
