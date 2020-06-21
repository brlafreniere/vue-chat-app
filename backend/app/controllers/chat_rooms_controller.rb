class ChatRoomsController < ApplicationController
    # before_action :set_chat_room, only: [:show, :edit, :update, :destroy]
    skip_before_action :verify_authenticity_token

    def show
        @chat_room = ChatRoom.find(params[:id])
        render json: @chat_room.to_json(include: :users)
    end

    def messages
        @messages = Message.where(chat_room_id: params[:id])
        render :json => @messages
    end

    def users
        @users = ChatRoom.find(params[:id]).users
        render :json => @users
    end

    def join
        user = User.find_by(client_token: params[:client_token])
        if ChatRoom.exists?(name: params[:name])
            chat_room = ChatRoom.find_by(name: params[:name])
            chat_room.users << user unless chat_room.users.include?(user)
        else
            chat_room = ChatRoom.new
            chat_room.name = params[:name]
            chat_room.save
            chat_room.users << user
        end
    end
end
