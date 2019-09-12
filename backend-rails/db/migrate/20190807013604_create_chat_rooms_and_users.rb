class CreateChatRoomsAndUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_rooms_and_users do |t|
      t.belongs_to :chat_room, index: true
      t.belongs_to :user, index: true
    end
  end
end
