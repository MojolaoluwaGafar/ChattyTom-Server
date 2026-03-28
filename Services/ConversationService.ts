import pool from "../Config/Db";
import { createConversation, findConversationById, IConversation} from "../Models/ConversationModel";
import { addParticipant, getParticipantsByConversationId } from "../Models/ConversationParticipantsModel";
import { getMessagesByConversation } from './MessageService';

// Responsibilities:
// Create 1-on-1 conversations and avoid duplicates.
// Create group conversations, ensuring at least 2 members and unique participants.
// Add participants to conversations.
// Fetch all conversations for a user (for the chat list) with the last message preview.
// Fetch a single conversation by ID.
//calls message service when needed
//does not write message sql
// Flow:
// When a new message comes in, the service ensures the conversation exists.
// For group chats, participants are validated before creation.
// 1-on-1 chats automatically check for existing conversations between two users.
//gets convo,gets participant,asks messageservice for messages,combines result
//create1-1Convo
export const createOneToOneConversation = async (
    user1Id: number,
    user2Id: number
) => {
    if (user1Id === user2Id) {
       throw new Error("Cannot create conversation with yourself") 
    }
    // 1. Check if conversation already exists between both users
    const existingConvo = await pool.query(
        `SELECT C.* FROM conversations c 
        JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
        WHERE c.is_group = false
        AND cp1.user_id = $1
        AND cp2.user_id = $2`,
        [user1Id, user2Id]
    );
    // 2. If yes → return it
    if (existingConvo.rows.length > 0) {
        return existingConvo.rows[0]
    }
    // 3. If no → create conversation
    const conversation = await createConversation(false)
    // 4. Add both participants
    await addParticipant(conversation.id,user1Id)
    await addParticipant(conversation.id, user2Id)

    return conversation;
};


//createGroupConversation
export const createGroupConversation = async(
    name : string,
    creatorId : number,
    membersIds : number[]
): Promise<IConversation> =>{
    if (!name) {
        throw new Error("Group name is required")
    }
    //remove duplicate members
    const uniqueMembers = Array.from(new Set(membersIds))
    //Ensure creator is included
    if (!uniqueMembers.includes(creatorId)) {
        uniqueMembers.push(creatorId);
    }

    if (uniqueMembers.length < 2) {
        throw new Error("Group chat must have at least 2 members")
    }

    const conversation = await createConversation(true,name)
    for (const userId of uniqueMembers) {
        await addParticipant(conversation.id,userId)
    }
    return conversation;
}


//get user conversations for chatList
export const getUserConversations = async(userId : number)=>{
    const result = await pool.query(
        `
        SELECT c.id, c.is_group, c.updated_at,
        CASE 
        WHEN c.is_group = true THEN c.name
        ELSE CONCAT(u.firstname, ' ', u.lastname)
        END as display_name,
        m.content as last_message,
        m.created_at as last_message_time,
        COUNT(m2.id) FILTER (
        WHERE m2.created_at > cp.last_read_at
        AND m2.sender_id != $1 ) as unread
        FROM conversations c 
        JOIN conversation_participants cp 
        ON cp.conversation_id = c.id
        AND cp.user_id = $1
        LEFT JOIN LATERAL
        ( SELECT content, created_at 
         FROM messages 
         WHERE conversation_id = c.id
         ORDER BY created_at DESC LIMIT 1) m ON true
        LEFT JOIN messages m2
        ON m2.conversation_id = c.id
        LEFT JOIN conversation_participants cp_other
        ON cp_other.conversation_id = c.id
        AND cp_other.user_id != $1
        LEFT JOIN users u
        ON u.id = cp_other.user_id
        GROUP BY c.id, c.is_group, display_name, m.content, m.created_at, cp.last_read_at, c.updated_at
        ORDER BY c.updated_at DESC
        `, [userId]
    );
    return result.rows;
}

//get a single conversation
export const getConversationById = async(
    conversationId : string
)=>{
    const conversation = await findConversationById(conversationId)
    if (!conversation) {
        throw new Error("Conversation not found")
    }

    const participants = await getParticipantsByConversationId(conversationId)
    const messages = await getMessagesByConversation(conversationId)

    return {
    ...conversation,
    participants,
    messages,
  };
}