module Types
	class IssueType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :issue_id, ID, null: false
		field :title, String, null: false
		field :description, String, null: true
		field :due_date, String, null: true
		field :issue_label, Types::IssueLabelType, null: false

		def self.authorized?(object, context)
			issue_board = IssueBoard.joins(issue_labels: :issues).where(issues: {id: object.id}).take
			super && Types::IssueBoardType.authorized?(issue_board, context)
		end
	end
end