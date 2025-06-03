const permitRoles = (...allowed) => {
    return (req, res, next) => {
        if(!allowed.includes(req.user.roles)){
            return res.status(403).json({message: "Insufficient rights: forbidden!"})
        }
        next()
    }
}

export default permitRoles