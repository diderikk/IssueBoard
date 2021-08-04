class ApplicationController < ActionController::API
	include ActionController::Cookies
	include Jwt


	def access_token
		refresh_token = decode_refresh_token(cookies.encrypted[:refresh_token]);
		user = User.find(refresh_token[0]['user_id']) # Finds user from token's user_id

		if(user.token_version != refresh_token[0]['token_version'])
			raise JWT::DecodeError.new "Refresh token not up to date"
		end
		
		new_refresh_token = encode_refresh_token(user)
		cookies.encrypted[:refresh_token] = {:value => new_refresh_token,:httponly => true}


		render json: {"access_token" => encode_access_token(user.id, user.email)}
	end
end
