class ChatRoomController < ApplicationController
  before_action :set_chat_room, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  # def join
  #   user = User.find_by client_token: params[:client_token]

  #   if user
  #     user.join_room params[:room_name]
  #   else

  #   render :nothing => true
  # end

  # GET /chat_rooms
  # GET /chat_rooms.json
  def index
    @chat_rooms = ChatRoom.all
  end

  # GET /chat_rooms/1
  # GET /chat_rooms/1.json
  def show
  end

  # GET /chat_rooms/new
  def new
    @chat_room = ChatRoom.new
  end

  # GET /chat_rooms/1/edit
  def edit
  end

  # POST /chat_rooms
  # POST /chat_rooms.json
  def create
    @chat_room = ChatRoom.new(chat_room_params)

    respond_to do |format|
      if @chat_room.save
        format.html { redirect_to @chat_room, notice: 'Chat room was successfully created.' }
        format.json { render :show, status: :created, location: @chat_room }
      else
        format.html { render :new }
        format.json { render json: @chat_room.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /chat_rooms/1
  # PATCH/PUT /chat_rooms/1.json
  def update
    respond_to do |format|
      if @chat_room.update(chat_room_params)
        format.html { redirect_to @chat_room, notice: 'Chat room was successfully updated.' }
        format.json { render :show, status: :ok, location: @chat_room }
      else
        format.html { render :edit }
        format.json { render json: @chat_room.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /chat_rooms/1
  # DELETE /chat_rooms/1.json
  def destroy
    @chat_room.destroy
    respond_to do |format|
      format.html { redirect_to chat_rooms_url, notice: 'Chat room was successfully destroyed.' }
      format.json { head :no_content }
    end
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
