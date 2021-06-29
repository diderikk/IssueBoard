module Types
	class IssueLabelType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :color, String, null: true
		field :issue_board, Types::IssueBoardType, null: false
		field :issues, [Types::IssueType], null: false

	end
end