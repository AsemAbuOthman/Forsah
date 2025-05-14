const sql = require('mssql');
global.pool = null;


class clsConfig{

    static connString =   {
        server: 'localhost',
        database: 'Forsah',
        user: 'sa',
        password: '00000000',
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    }

    static getConnection = async ()=> {
        if (!global.pool) {
            try {
                global.pool = await sql.connect(this.connString);
                console.log('Database connected');
            } catch (err) {
                console.error('Database connection failed:', err);
                throw err;
            }
        }else{
            console.log('Database already connected');
        }
        return global.pool;
    }
    
    static closeConnection = async ()=> {
        if (global.pool) {
            try {
                global.pool.close();
                console.log('Database closed');
            } catch (err) {
                console.error('Database connection failed:', err);
                throw err;
            }
        }else{
            console.log('Database already closed');
        }
    
        return global.pool;
    }

}

module.exports = clsConfig;