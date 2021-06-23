class Schema < GraphQL::Schema
	query(Types::QueryType)


	def self.unauthorized_object(error)
		raise GraphQL::ExecutionError, "An object of type #{error.type.graphql_name} was hidden due to permissions"
	end 
end
