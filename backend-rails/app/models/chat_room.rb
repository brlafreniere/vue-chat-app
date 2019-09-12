class ChatRoom < ApplicationRecord
  has_and_belongs_to_many :users, :join_table => :chat_rooms_and_users
  validates_uniqueness_of :name

  DEFAULT_ROOM_NAME = "General"

  def self.default_room
    chat_room = ChatRoom.find_by name: self::DEFAULT_ROOM_NAME
  end
end
