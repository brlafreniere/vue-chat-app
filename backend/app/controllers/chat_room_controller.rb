class ChatRoomController < ApplicationController
  before_action :set_chat_room, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def messages
    @messages = Message.where(chat_room_id: params[:chat_room_id])
    render :json => @messages
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chat_room
      @chat_room = ChatRoom.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def chat_room_params
      params.fetch(:chat_room, {})
    end
end
