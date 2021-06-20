module Types
	class UserType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :email, String, null: false
	end
end