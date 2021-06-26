module Mutations
	class Login < GraphQL::Schema::Mutation
		include Authentication

		graphql_name "Login"

		argument :email, String, required: true
		argument :password, String, required: true

		field :access_token, String, null: true
		field :errors, [String], null: true

		def resolve(email:, password:)
			access_token = authenticate(email, password, context[:cookies])
			
			{
				access_token: access_token,
				errors: access_token.nil? ? ["Email or password is wrong"] : nil
			}

		end
	end
end