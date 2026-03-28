import { createMessage, IMessage } from "../Models/MessageModel"
import { findConversationById } from "../Models/ConversationModel"
import { IConversationParticipant, getParticipantsByConversationId, getParticipant } from './../Models/ConversationParticipantsModel';
import pool from "../Config/Db"

//Responsibilities:
// Send a message in a conversation and validate the sender is a participant.
// Retrieve messages for a conversation.
// Retrieve messages along with all participants (important for group chats).
// Mark a conversation as read for a specific participant.
// Flow:
// Before sending a message, the service confirms that the conversation exists and the sender is part of it.
// Messages are stored in the messages table, and the updated_at timestamp of the conversation is updated.
// Messages can be fetched with sender info or with the participant list for UI rendering.
// Read receipts are handled per participant.
//OWNS ALL MESSAGE QUERIES


//send a message in a conversation (uses get particpant)
export const SendMessage = async (
    conversationId : string | number,
    senderId : number, 
    content : string
) : Promise<IMessage> =>{
    //check if convo exists
    const convoIdStr = conversationId.toString()
    const conversation = await findConversationById(convoIdStr)
    if (!conversation) {
        throw new Error("Conversation not found")
    }

    
    //get and validate sender is a cp
    const isParticipant = await getParticipant(convoIdStr,senderId)
    if (!isParticipant) {
        throw new Error("User is not a participant of this conversation")
    }
    
    //create message in db
    const message = await createMessage(convoIdStr,senderId,content)

    return message;
}

//getMessages for a conversation
export const getMessagesByConversation = async (
    conversationId : string | number
) : Promise<IMessage[]> => {
    const convoIdStr = conversationId.toString()
    const response = await pool.query(
        ` SELECT m.*, u.firstname, u.lastname, u.email
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`, [convoIdStr]
    );
    
    return response.rows;
}


//get messages with participants (useful for group chats)
export const getMessagesWithParticipants = async (
    conversationId : string | number
) => {
    const convoIdStr = conversationId.toString()
    const messageResponse = await pool.query(`
        SELECT m.id, m.content, m.created_at, u.id AS sender_id, u.firstname, u.lastname
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`, [convoIdStr]
    );
    const participants = await getParticipantsByConversationId(convoIdStr)

    return {
        messages : messageResponse.rows,
        participants,
    };
}
//mark all messages in a convo as read by a specific user
export const markConversationAsRead = async (
    conversationId : string | number,
    userId : number
) => {
    const convoIdStr = conversationId.toString()
    await pool.query(`
        UPDATE conversation_participants
        SET last_read_at = NOW()
        WHERE conversation_id =$1 AND user_id = $2`,
    [convoIdStr, userId]
);
}

// export const getUnreadCount= async (params:type) => {
    


// }