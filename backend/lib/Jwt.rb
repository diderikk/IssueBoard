# https://github.com/jwt/ruby-jwt
module Jwt
	ACCESS_TOKEN_SECRET = Rails.application.credentials.send(Rails.env)[:access_token_secret]
	REFRESH_TOKEN_SECRET = Rails.application.credentials.send(Rails.env)[:refresh_token_secret]

	def encode_access_token(user_id, user_email = "")
		iat = Time.now.to_i # Issued at
		exp = Time.now.to_i + 5*60 # Expiration 5 minutes
		payload = {user_id: user_id, iat: iat, exp: exp, sub: user_email}
		JWT.encode payload, Jwt::ACCESS_TOKEN_SECRET, 'HS512'
	end

	def decode_access_token(token)
		begin
			JWT.decode token, Jwt::ACCESS_TOKEN_SECRET, true, {algorithm: 'HS512'}
		rescue JWT::ExpiredSignature => e # If signature has expired
			handle_expired_access_token
		end
	end

	def encode_refresh_token(user)
		iat = Time.now.to_i # Issued at
		exp = Time.now.to_i + 7*24*60*60 # Expiration 7 days
		
		user.update({:token_version => user.token_version+1})
		payload = {user_id: user.id, iat: iat, exp: exp, token_version: user.token_version}
		JWT.encode payload, Jwt::REFRESH_TOKEN_SECRET, 'HS512' 
	end

	def decode_refresh_token(token)
		JWT.decode token, Jwt::REFRESH_TOKEN_SECRET, true, { algorithm: 'HS512'}
	end

	private

	def handle_expired_access_token
		refresh_token = decode_refresh_token(cookies.encrypted[:refresh_token]) # Get refresh token from request cookie
		user = User.find(refresh_token[0]['user_id']) # Finds user from token's user_id

		if(user.token_version != refresh_token[0]['token_version'])
			raise JWT::DecodeError.new "Refresh token not up to date"
		else
			new_refresh_token = encode_refresh_token(user)
			cookies.encrypted[:refresh_token] = {:value => new_refresh_token,:httponly => true}
		end

		raise JWT::ExpiredSignature.new "new_token: #{encode_access_token(user.id, user.email)}"
	end

end
