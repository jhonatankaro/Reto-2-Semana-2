const { Usuario } = require('../models');
const bcrypt = require('bcryptjs')
const servtoken = require('../services/token')


module.exports = {

    list : async (req, res, next) => {
        try{
            const re = await Usuario.findAll();
            res.status(200).json(re)
        } catch {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next()
        }
    },


  
    login : async (req, res, next) => {

            try {
                    const user = await Usuario.findOne( { where :  { email : req.body.email } } )
                    if(user){
                        // Evaluar contraseña
                        const contrasenhaValida = bcrypt.compareSync(req.body.password, user.password)
                    if (contrasenhaValida)
                    {
                        const token = servtoken.encode(user.id, user.rol)
                       
                        res.status(200).send({
                            auth : true,
                            tokenReturn : token,
                            user : user
                        })

                    }  else {
                        res.status(401).send({ auth: false, tokenReturn: null, reason:
                            "Invalid Password!" });
                            
                    }

                } else {
                    res.status(404).send({ 'error' : 'User Not Found' })
                }

            } 
            catch (error) {
                res.status(500).json({ 'error' : 'Oops paso algo' })
                next()
            }


        }   
}


