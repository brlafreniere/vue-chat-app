class ChatRoomController < ApplicationController
  before_action :set_chat_room, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def messages
    @messages = Message.where(chat_room_id: params[:chat_room_id])
    render :json => @messages
  end
end
