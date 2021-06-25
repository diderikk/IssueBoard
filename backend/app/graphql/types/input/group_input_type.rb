module Types
	class Input::GroupInputType < GraphQL::Schema::InputObject
		graphql_name "GroupInputType"
		description "Input object for Group"
		argument :name, String, "Group name", required: true
	end
end