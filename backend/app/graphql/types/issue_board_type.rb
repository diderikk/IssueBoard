module Types
	class IssueBoardType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :users, [Types::UserType], null: true
		field :group, Types::GroupType, null: true
		field :issue_labels, [Types::IssueLabelType], null: false
		field :is_owner, Boolean, null: false

		def is_owner
			object.owner == context[:current_user]
		end

	end
end