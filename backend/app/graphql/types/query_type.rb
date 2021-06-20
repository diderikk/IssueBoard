module Types
	class QueryType < GraphQL::Schema::Object
		field :users, [Types::UserType], null:true


		def users
			User.all
		end
	end
end