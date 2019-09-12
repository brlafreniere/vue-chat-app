class AddIndexToPosts < ActiveRecord::Migration[5.2]
  def change
    add_index :chat_rooms_and_users, [:chat_room_id, :user_id], :unique => true
  end
end
