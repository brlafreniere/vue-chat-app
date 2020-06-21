class User < ApplicationRecord
    has_and_belongs_to_many :chat_rooms, :join_table => :chat_rooms_and_users
    has_secure_password validations: false

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

    def self.find_or_create_by_client_token client_token
        @user = self.find_by(client_token: client_token)
        if !@user
            @user = self.new
            @user.client_token = client_token
            @user.chat_rooms << ChatRoom.default_room
        end
        @user.online = true
        @user.save
        return @user
    end
end