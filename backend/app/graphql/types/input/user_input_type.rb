module Types
	class Input::UserInputType < GraphQL::Schema::InputObject
		graphql_name "UserInputType"
		description "Attributes for creating a user"
		argument :name, String, "Name of the user", required: true
		argument :email, String, "Email of user", required: true
		argument :password, String, "Password", required: true
	end
end