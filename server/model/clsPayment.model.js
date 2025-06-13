
const { getConnection } = require("../config/clsConfig");
const sql = require('mssql'); 

class clsPayment {

    static async addPayment(paymentData) {

        let result = null;
        let transaction;
    
        console.log('paymentData : ', paymentData);

        try {
        const pool = await getConnection();
    
        transaction = new sql.Transaction(pool);
        await transaction.begin();
    
        const request = new sql.Request(transaction);
    
        request.input("paymentAmount", sql.Decimal(10, 2), paymentData.paymentDetails.amount);
        request.input("paymentStatus", sql.VarChar(50), paymentData.paymentDetails.status || "Completed");
        request.input("projectId", sql.Int, paymentData.projectId);
        request.input("userId", sql.Int, paymentData.userId);
        request.input("paymentMethod", sql.VarChar(50), paymentData.paymentDetails.method);
        request.input("transactionId", sql.VarChar(100), paymentData.paymentDetails.payerId); 
    
        const paymentResult = await request.query(`
            INSERT INTO payments (
                paymentAmount,
                paymentStatus,
                projectId,
                userId,
                paymentMethod,
                transactionId
            )
            OUTPUT INSERTED.paymentId
            VALUES (
                @paymentAmount,
                @paymentStatus,
                @projectId,
                @userId,
                @paymentMethod,
                @transactionId
            );
        `);
    
        const insertedPaymentId = paymentResult.recordset[0].paymentId;
    
        // Insert into bills table
        const billRequest = new sql.Request(transaction);
        billRequest.input("paymentId", sql.Int, insertedPaymentId);
        billRequest.input("billUrl", sql.VarChar(sql.MAX), paymentData.paymentDetails.billUrl);
        billRequest.input("tax", sql.Decimal(10, 4), paymentData.orderData.tax);
        billRequest.input("subtotal", sql.Decimal(10, 2), paymentData.orderData.subtotal);
    
        await billRequest.query(`
            INSERT INTO bills (
                paymentId,
                billUrl,
                tax,
                subtotal
            )
            VALUES (
                @paymentId,
                @billUrl,
                @tax,
                @subtotal
            );
        `);
    
        await transaction.commit();
    
            result = {
                success: true,
                paymentId: insertedPaymentId,
                billUrl: paymentData.paymentDetails.billUrl,
            };
        } catch (err) {
        console.error("Transaction failed: ", err);
    
        if (transaction) {
            try {

                await transaction.rollback();
            } catch (rollbackErr) {

                console.error("Rollback failed: ", rollbackErr);
            }
        }
    
            result = {
                success: false,
                error: err.message,
                stack: err.stack,
            };
        }
    
        return result;
    }
    
    static async getPayments(userId) {
        try {
        const pool = await getConnection();
        const request = pool.request();
    
        request.input("userId", sql.Int, userId);
    
        const result = await request.query(`
            SELECT 
                p.paymentId,
                p.paymentAmount,
                p.paymentStatus,
                p.projectId,
                p.userId,
                p.paymentMethod,
                p.transactionId,
                p.paidTime,
                b.billId,
                b.billUrl,
                b.tax,
                b.subtotal
            FROM 
            payments p
            LEFT JOIN 
            bills b ON p.paymentId = b.paymentId
            WHERE 
            p.userId = @userId
            ORDER BY 
            p.paidTime DESC;
        `);
    
        const payments = [];
        const bills = [];
    
        for (const row of result.recordset) {
            payments.push({
            paymentId: row.paymentId,
            paymentAmount: row.paymentAmount,
            paymentStatus: row.paymentStatus,
            projectId: row.projectId,
            userId: row.userId,
            paymentMethod: row.paymentMethod,
            transactionId: row.transactionId,
            paidTime: row.paidTime
            });
    
            if (row.billId) {
            bills.push({
                billId: row.billId,
                paymentId: row.paymentId,
                billUrl: row.billUrl,
                tax: row.tax,
                subtotal: row.subtotal
            });
            }
        }
    
        return {
            success: true,
            payments,
            bills
        };
        } catch (err) {
        console.error("Failed to fetch payments: ", err);
        return {
            success: false,
            error: err.message,
            stack: err.stack
        };
        }
    }
}

module.exports = clsPayment;