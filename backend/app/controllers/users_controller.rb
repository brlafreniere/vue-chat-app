class UsersController < ApplicationController
    before_action :set_user, only: [:show, :edit, :update, :destroy]
    skip_before_action :verify_authenticity_token, :only => [:by_client_token, :update_nickname]

    def by_client_token
        @user = User.find_by(client_token: params[:client_token])
        if not @user
            @user = User.new
            @user.client_token = params[:client_token]
            @user.chat_rooms << ChatRoom.default_room
        end
        @user.online = true
        @user.save
        render :json => @user, :include => { :chat_rooms => {:include => :users} }
    end

    def update_nickname
        @user = User.find_or_create_by_client_token(params[:client_token])
        old_nickname = @user.nickname
        @user.nickname = params[:nickname]
        @user.save
        # @user.chat_rooms.each do |chat_room|
        #   ChatRoomChannel.broadcast_to(chat_room, {action: "update_nickname", old_nickname: old_nickname, new_nickname: @user.nickname})
        # end
    end

    def register_account
        @user = User.find_or_create_by_client_token(params[:client_token])
        if !@user.email
            @user.email = params[:email]
            @user.password = params[:password]
            @user.password_confirmation = params[:password_confirmation]
            if @user.save
                render status: :ok
            else
                render status: :unprocessable_entity, json: @user.errors.to_json
            end
        else
            render status: :unprocessable_entity
        end
    end
end