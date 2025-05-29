const { getConnection } = require('../config/clsConfig');

class clsMessage{

    static async getContacts(userId){

        let result = null;

        try {
            const pool = await getConnection();

            result = await pool.request().query`
            
                SELECT 
                    users.userId,
                    users.firstName,
                    users.lastName,
                    users.username,
                    images.imageUrl,
                    users.email
                FROM contacts 
                    JOIN users  ON contacts.userContactId = users.userId
                    JOIN profiles ON profiles.userId = contacts.userContactId
                    JOIN images ON images.imageableId = profiles.profileId AND images.imageableType = 'profile'
                WHERE contacts.userId = ${userId}
                ORDER BY contacts.createdAt DESC;
            `;

            result = {
                contacts: result.recordset
            };

        } catch (error) {

            console.log('Faild fetch contacts !', error);
        }

        return result;
    }


    static async checkContact(userId, contactId){

        let result = null;

        try {
            const pool = await getConnection();

            result = await pool.request().query`
            
                SELECT * FROM contacts 
                WHERE userId = ${userId} AND userContactId = ${contactId};
            `;

            result = result.recordset.length > 0 ? true : false;

        } catch (error) {

            console.log('Failed to check contact !', error);
        }

        return result;
    }


    static async createContact(userId, contactId){

        let result = null;

        console.log('userId : ', userId);
        console.log('contactId : ', contactId);

        
        try {
            
            const pool = await getConnection();

            const checkContact1 = await this.checkContact(userId, contactId);
            const checkContact2 = await this.checkContact(contactId, userId);

            if(!(checkContact1 && checkContact2)){

                result = await pool.request().query`

                INSERT INTO contacts 
                    (userContactId, userId)
                VALUES (${contactId}, ${userId}), (${userId}, ${contactId});
            `;

            }

            if(result.rowsaffectd[0] > 0){

                result =  await this.getContacts(userId);
            }

        } catch (error) {

            console.log('Faild create contacts !', error);
        }

        return result;
    }


    static async sendMessage(messageData){
        
        let result = null;
        
        console.log('messageData : ', messageData);
        

        try {
            const pool = await getConnection();
            
            result = await pool.request().query`
            
                INSERT INTO messages 
                    (messageContent, senderId, receiverId, messageStateId)
                    OUTPUT INSERTED.messageId, INSERTED.sentAt
                VALUES(${messageData.messageContent}, ${messageData.senderId}, ${messageData.receiverId}, 1);
            `;
            
            result = {
                messageId: result.recordset[0].messageId,
                messageContent: messageData.messageContent,
                sentAt: result.recordset[0].sentAt,
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                state: 'Sent'
            };

        } catch (error) {
            
            console.log('Faild send messaege !', error);
        }

        return result;
    }

    static async replyMessage(replyData){

        let result = null;
        
        try {
            const pool = await getConnection();
            
            const messageResult = await this.sendMessage({
                content: replyData.content,
                senderId: replyData.senderId,
                receiverId: replyData.receiverId
            });

            result = await pool.request().query`
            
                INSERT INTO replies 
                    (messageId, replyMessageId)
                VALUES(${messageResult.messageId}, ${replyData.messageId});
            `;

            if(result){

                result = messageResult;
            }

        } catch (error) {
            
            console.log('Failed with replying message !', error);
        }

        return result;
    }

    static async deleteMessage(messageId, userId){

        let result = false;

        try {

            const pool = await getConnection();

            result = await pool.request().query`
            
                DELETE FROM messages
                WHERE messageId = ${messageId} AND senderId = ${userId};
            `;

            result = result.rowsaffectd[0] > 0 ? true : false;

        } catch (error) {
            
            console.log('Failed to delete message !', error);
        }

        return result;
    }

    static async getMessageHistory(senderId, receiverId){

        let result = null;

        try {

            const pool = await getConnection();

            result = await pool.request().query`
    
            SELECT 
            m.messageId,
            m.senderId,
            m.receiverId,
            m.messageContent,
            m.sentAt,
            ms.messageState,
            r.replyId,
                CASE 
                    WHEN m.senderId = ${senderId} THEN 'sent'
                    ELSE 'received'
                END AS messageDirection
            FROM Messages m
            LEFT JOIN Replies r ON m.messageId = r.messageId
            JOIN MessageStates ms ON m.messageStateId = ms.messageStateId
            WHERE (
                (m.senderId = ${senderId} AND m.receiverId = ${receiverId}) OR
                (m.senderId = ${receiverId} AND m.receiverId = ${senderId})
            )
            AND m.isDeleted = 0
            ORDER BY m.sentAt ASC
            `;
            
            result = result.recordset;

        } catch (error) {
            
            console.log('Failed to fetch message history ! ', error);
        }

        return result;
    }

}

module.exports = clsMessage;