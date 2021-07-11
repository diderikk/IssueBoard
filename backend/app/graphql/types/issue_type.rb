module Types
	class IssueType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :issue_id, ID, null: false
		field :title, String, null: false
		field :description, String, null: true
		field :due_date, String, null: true
		field :order, Int, null: false
		field :issue_label, Types::IssueLabelType, null: false

	end
end