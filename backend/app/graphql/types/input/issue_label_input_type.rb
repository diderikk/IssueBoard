module Types
	class Input::IssueLabelInputType < GraphQL::Schema::InputObject
		graphql_name "IssueLabelInputType"
		
		description "Input object for IssueLabel"
		argument :name, String, "IssueLabel name", required: true
		argument :color, String, "Color of IssueLabel", required: false
		argument :issue_board_id, ID, "Id of issue_board", required: false
	end
end