module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      user = User.find_by client_token: cookies[:client_token]

      user.online = true
      user.save

      self.current_user = user
    end

    def disconnect
      self.current_user.online = false
      self.current_user.save
    end
  end
end
