Rails.application.routes.draw do
  resources :chat_rooms
  get '/user/:client_token', to: "users#by_client_token"
  post '/user/update_nickname', to: "users#update_nickname"

  # TODO update these to use GET
  get '/chat_room/:id/messages', to: "chat_rooms#messages"
  get '/chat_room/:id/users', to: "chat_rooms#users"
  post '/chat_room/join', to: "chat_rooms#join"
end
