
const { getConnection } = require("../config/clsConfig");

class clsPayment {

    static async addPayment(userId, paymentData) {

        let result = null;
    
        try {
            const pool = await getConnection();

            const transaction = new pool.transaction();
    
            await transaction.begin();
    
            const request = new sql.Request(transaction);
    
            // Insert into payments and get inserted ID
            const paymentInsertResult = await request.query(`
                INSERT INTO payments (paymentAmount, paymentStatus, projectId, userId)
                OUTPUT INSERTED.paymentId
                VALUES (
                    ${paymentData.paymentAmount},
                    ${paymentData.paymentStatus},
                    ${paymentData.projectId},
                    ${userId}
                );
            `);
    
            const insertedPaymentId = paymentInsertResult.recordset[0].paymentId;
    
            // Insert into bills using the inserted paymentId
            await request.query(`
                INSERT INTO bills (paymentId, billUrl, tax, subtotal)
                VALUES (
                    ${insertedPaymentId},
                    ${paymentData.billUrl},
                    ${paymentData.tax},
                    ${paymentData.subtotal}
                );
            `);
    
            await transaction.commit();
    
            result = { success: true, paymentId: insertedPaymentId };
        } catch (err) {
            console.error('Transaction failed: ', err);
    
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error('Rollback failed: ', rollbackErr);
            }
    
            result = { success: false, error: err.message };
        }
    
        return result;
    }
    
}

module.exports = clsPayment;