class RenameRoomIdToChatRoomId < ActiveRecord::Migration[5.2]
  def change
    rename_column :messages, :room_id, :chat_room_id
  end
end
