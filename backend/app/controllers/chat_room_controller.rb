class ChatRoomController < ApplicationController
  before_action :set_chat_room, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def messages
    @messages = Message.where(chat_room_id: params[:id])
    render :json => @messages
  end

  def users
    @users = ChatRoom.find(params[:id]).users
    render :json => @users
  end
end
