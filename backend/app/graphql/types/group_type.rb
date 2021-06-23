module Types
	class GroupType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :logo, String, null: true
		field :users, [Types::UserType], null: false
		field :issue_boards, [Types::IssueBoardType], null: false

		def self.authorized?(object, context)
			super && (object.users.include? context[:current_user])
		end
	end
end