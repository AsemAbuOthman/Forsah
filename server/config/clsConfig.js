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
            trustServerCertificate: true,
            enableArithAbort: true
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        
        connectionTimeout: 30000,

        requestTimeout: 30000
    }

    static getConnection = async () => {

        if (!global.pool) {
            try {
                global.pool = await new sql.ConnectionPool(this.connString).connect();
                console.log('Database connection pool created');

                global.pool.on('error', err => {
                    console.error('SQL Pool Error:', err);
                    global.pool = null;
                });

            } catch (err) {
                console.error('Database connection failed:', err);
                global.pool = null;
                throw err;
            }
        }
        return global.pool;
    }
    
    static closeConnection = async () => {

        let isClosed = false;

        if (global.pool) {
            try {
                if(await global.pool.close()){

                    global.pool = null;
                    isClosed = true;
                    console.log('Database connection pool closed');
                }
            } catch (err) {
                console.error('Error closing database connection:', err);
                throw err;
            }
        } else {
            console.log('No active database connection to close');
        }

        return isClosed;
    }

}

process.on('SIGINT', async () => {
    await clsConfig.closeConnection();
    process.exit(0);
})
    

module.exports = clsConfig;