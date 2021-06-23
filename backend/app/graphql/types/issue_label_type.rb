module Types
	class IssueLabelType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :color, String, null: false
		field :issue_board, Types::IssueBoardType, null: false
		field :issues, [Types::IssueType], null: false


		def self.authorized?(object, context)
			super && Types::IssueBoardType.authorized?(object.issue_board, context)
		end
	end
end