class User < ApplicationRecord
  has_and_belongs_to_many :chat_rooms, :join_table => :chat_rooms_and_users

  before_create :generate_nickname

  def generate_nickname
    self.nickname = "rando_" + rand(99..999).to_s
  end

  def join_room room_name = nil
    if !room_name
      chat_room = ChatRoom.default_room
    else
      chat_room = ChatRoom.find_by name: room_name
    end
    chat_room.users << self unless chat_room.users.include?(self)
  end

  # to be sent to the frontend
  def room_list
    self.chat_rooms.map do |chat_room|
      {id: chat_room.id, name: chat_room.name}
    end
  end
end
