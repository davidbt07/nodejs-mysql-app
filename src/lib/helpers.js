const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async(password) => {//Se crea metodo para cifrar la contraseña en el momento de registrarse
    const salt = await bcrypt.genSalt(10);//Se crea un hash y se corre 10 veces
    const hash = await bcrypt.hash(password, salt);//Paramentros(contraseña a cifrar, lista de caracteres generados en salt) y con esto se cifra la contraseña
    return hash;
};

helpers.matchPassword = async(pasword, savedPassword) => {//Metodo para comparar contraseñas al momenot de hacer login
    try{
        await bcrypt.compare(password, savedPassword);//compare recibe la contraseña enviada por el usuario con lo que ya tengo en la base de datos
    }catch{
        console.log(e);
    }
}; 

module.exports = helpers;