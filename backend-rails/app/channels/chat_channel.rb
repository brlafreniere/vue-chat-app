class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
    self.class.broadcast_to current_user, nickname: current_user.nickname, room_list: current_user.room_list
  end

  def unsubscribed
  end

  def new_message

  end
end
