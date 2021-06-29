module Types
	class GroupType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :logo, String, null: true
		field :users, [Types::UserType], null: false
		field :issue_boards, [Types::IssueBoardType], null: false

		def self.scope_items(items, context)
			items.select { |item| item.users.where(members: {accepted: true}).include? context[:current_user]}
		end
	end
end