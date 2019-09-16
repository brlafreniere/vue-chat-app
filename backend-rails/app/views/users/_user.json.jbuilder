json.extract! user, :id, :created_at, :updated_at, :chat_rooms, :nickname
json.url user_url(user, format: :json)
