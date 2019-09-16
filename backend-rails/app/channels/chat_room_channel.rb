class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    chat_room = ChatRoom.find(params[:chat_room_id])
    stream_for chat_room
  end

  def unsubscribed
  end

  def new_message(data)
    chat_room_id = data['chat_room_id']
    message_text = data['message_text']

    chat_room = ChatRoom.find(chat_room_id)

    message = Message.new
    message.text = message_text
    message.nickname = current_user.nickname
    message.user_id = current_user.id
    message.chat_room_id = chat_room_id
    message.save

    ChatRoomChannel.broadcast_to(chat_room, message)
  end
end
