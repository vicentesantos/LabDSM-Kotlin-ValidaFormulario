const db = require("./banco")
const moment = require('moment');

const Agendamentos = db.sequelize.define("agendamentos",{
    nome:{
        type: db.Sequelize.STRING
    },
/*    telefone:{
        type: db.Sequelize.STRING
    },*/
    
    origem: {
        type: db.Sequelize.ENUM('Celular', 'Fixo', 'Whatsapp', 'Facebook', 'Instagram', 'Google Meu Negocio')
    },
    
    telefone: {
        type: db.Sequelize.STRING,
        get() {
            const rawValue = this.getDataValue('telefone');
            const origem = this.getDataValue('origem'); 
            
            let formattedValue;
            switch(origem) {
                case 'Fixo':
                    // Formato para telefone fixo
                    formattedValue = rawValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                    break;
                case 'Celular':
                    // Formato para telefone celular
                    formattedValue = rawValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                    break;
                default:
                    throw new Error('Origem de telefone desconhecida'),
                    res.redirect('/cadastrar');
            }
            return formattedValue;
        }
    },

    data_contato: {
        type: db.Sequelize.DATEONLY,
        get() {
            const rawValue = this.getDataValue('data_contato');
            return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
        }
    },
    observacao:{
        type: db.Sequelize.TEXT
    }
}, {
    timestamps: false
}
)

//Agendamentos.sync({force: true})

module.exports = Agendamentos