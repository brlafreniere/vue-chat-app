class AddEmailAndPasswordtoUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :email, :string
    add_column :users, :password_digest, :strina
  end
end
