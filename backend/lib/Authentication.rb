module Authentication
	include Jwt

	def authenticate(email, password)
		user = User.find_by(email: email)
		if user and user.authenticate(password)
			cookies.encrypted[:refresh_token] = {:value => encode_refresh_token(user), :httponly => true}
			return encode_access_token(user.id, user.email)
		end
		return nil
	end	

	def get_token_from_header(request)
		auth_header = request.headers['Authorization']
		raise ArgumentError.new "Authorization header missing" unless auth_header 
		raise ArgumentError.new "Authorization header missing Bearer" unless auth_header.start_with?("Bearer ")

		auth_header.gsub("Bearer ", "")
	end

	def logged_in_user(request)
		access_token = decode_access_token(get_token_from_header(request))
		user = User.find(access_token[0]['user_id'])
		return user if user.email == access_token[0]['sub']
		raise "Bad token"
	end

	def logged_in?(request)
		!!logged_in_user(request)
	end

end