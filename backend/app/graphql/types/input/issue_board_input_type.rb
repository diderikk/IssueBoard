module Types
	class Input::IssueBoardInputType < GraphQL::Schema::InputObject
		graphql_name "IssueBoardInputType"
		
		description "Input object for IssueBoard"
		argument :name, String, "IssueBoard name", required: true
		argument :group_id, ID, "Group ID", required: false
	end
end