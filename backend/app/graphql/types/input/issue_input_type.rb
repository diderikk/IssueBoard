module Types
	class Input::IssueInputType < GraphQL::Schema::InputObject
		graphql_name "IssueInputType"
		
		description "Input object for Issue"
		argument :title, String, "Title", required: true
		argument :description, String, required: false
		argument :due_date, String, required: false
		argument :issue_label_id, ID, required: false
	end
end